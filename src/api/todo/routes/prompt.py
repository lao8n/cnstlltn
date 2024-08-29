# typing imports
from typing import List
# local imports
from todo.app import app, openai_client
from todo.models import (Query, Browse, QueryAiResponseBlock, BrowseResponseBlock)

@app.post("/query-ai", response_model=List[QueryAiResponseBlock], response_model_by_alias=False, status_code=201)
async def query_ai(query: Query) -> List[QueryAiResponseBlock]:
    print("query-ai")
    print("user text: ", query.userTxt)
    print("material: ", query.material)

    system_prompt = """
    You are an AI assistant tasked with analyzing and summarizing key concepts from given texts. Please follow these instructions:

    1. If source material is provided, read it carefully.
    2. Identify key concepts, ideas, or frameworks mentioned in the text or related to the prompt.
    3. For each key concept, provide a response in the following format:

    Title: [Concept Title]
    Source: [Source of the concept, or "General Knowledge" if no specific source]
    Content: [Detailed explanation of the concept]

    Provide multiple concepts related to the given prompt or source material. Do not include any introduction or conclusion.
    """
    if query.material:
        system_prompt += f"""
        Please analyze the following source material:

        {query.material}
        """

    user_prompt = f"Please provide key concepts related to the following prompt:\n\n{query.userTxt}"

    response = openai_client.chat.completions.create(
        model='gpt-4o', # best model
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            }
        ]
    )

    # Split response into blocks
    response_blocks = response.choices[0].message.content.strip().split("\n\n")

    # Create QueryAiResponseBlock list
    query_ai_response_blocks = []
    for block in response_blocks:
        lines = block.split("\n")
        title = source = content = ""
        content_started = False
        for line in lines:
            if line.startswith("Title:"):
                title = line.replace("Title:", "").strip()
            elif line.startswith("Source:"):
                source = line.replace("Source:", "").strip()
            elif line.startswith("Content:"):
                content = line.replace("Content:", "").strip()
                content_started = True
            elif content_started:
                content += "\n" + line.strip()
        if title:  # Only add block if at least a title is present
            query_ai_response_blocks.append(QueryAiResponseBlock(title=title, source=source, content=content))
    formatted_blocks = [f"Title: {block.title}\nSource: {block.source}\nContent: {block.content}" for block in query_ai_response_blocks]
    print("query_ai response blocks:\n" + '\n\n'.join(formatted_blocks))    
    return query_ai_response_blocks

@app.post("/browse", response_model=List[BrowseResponseBlock], response_model_by_alias=False, status_code=201)
async def browse(browse: Browse) -> List[BrowseResponseBlock]:
    print("browse")
    print("attachment: ", browse.attachment, "material: ", browse.material)
    # prepare prompts
    if browse.attachment:
        system_prompt = """
        You are an AI assistant tasked with analyzing and summarizing key concepts from given texts. Please follow these instructions:

        1. Read the source material which could be a video transcript or an article carefully.
        2. Divide the material into 3 to 8 continuous sections of text.
        3. For each section come up with a concise title for that section, the source of the material based upon the content of the article or transcript
        or perhaps the name of the interviewer and interviewee, a flag of true or false to indicate if you think there is more material, such as 3 to 8 
        new continuous sections, to explore within that section specifically and finally a summary of the content in a few sentences
        """
    else:
        system_prompt = """
        You are an AI assistant tasked with analyzing and summarizing key concepts from a book. Please follow these instructions:

        1. Consider the book as a whole.
        2. Divide the material into 3 to 8 continuous sections of text. 
        3. For each section come up with a concise title for that section, based upon the content of that section, add the source of the material such as the author and book title,
        a flag of true or false to indicate if you think there is more material, such as 3 to 8 new continuous sections within that section specifically, to explore and finally,
        a summary of the content in a few sentences
        """

    system_prompt += """Each section should have the following format, with double newlines between sections:

        Title: [Section Title]
        Source: [Source]
        Flag: [More material to explore]
        Content: [Summary of the section]

        Avoid having introduction, conclusion, or other non-content sections. 
        Make sure not to include any hashtags or other markdown formatting.
        You will be provided a series of messages between the user and the assistant, which will indicate how the user wants to recurse into the material, 
        in this recursion you should treat each section as relatively independent. For example if you initially have 5 sections and the user chooses the 2nd section,
        and then of the 8 sections provided for the second section they choose the 4th section you should only consider material in that 4th section (of the second section)
        To understand the flag better, if you imagine the material as a tree, the flag indicates whether there are more sections to explore within that section specifically, 
        for example if the material is 10,000 words, and a section is 2,000 words the flag would probably be true because the content summary is only a few sentences and
        so there is much more material te explore. But if you have a section which is just 500 words then maybe the content summary covers the material completely and so the 
        flag should be false.
        """
    if browse.attachment:
        system_prompt = f"Please analyze the following source material:\n\n{browse.material}"
    else:
        system_prompt = f"Please analyze the following book:\n\n{browse.material}"

    messages = [{ "role": "system", "content": system_prompt }]
    for (chosen, content) in browse.messages:
        messages.append({"role": "assistant", "content": content})
        messages.append({"role": "user", "content": f"Focus just on this section: {chosen}"})

    # make openai call
    response = openai_client.chat.completions.create(
        model='gpt-4o', # best model
        messages=messages
    )

    # process response
    response_blocks = response.choices[0].message.content.strip().split("\n\n")
    browse_response_blocks = []
    for block in response_blocks:
        print("block:", block)
        lines = block.split("\n")
        title = source = content = ""
        flag = "false"
        content_started = False
        for line in lines:
            if line.startswith("Title: "):
                title = line.replace("Title: ", "")
            elif line.startswith("Source: "):
                source = line.replace("Source: ", "")
            elif line.startswith("Flag: "):
                flag = line.replace("Flag: ", "")
            elif line.startswith("Content: "):
                content = line.replace("Content: ", "")
                content_started = True
            elif content_started:
                content += "\n" + line
        if title and content:  # Only add block if at least a title and content is present
            flag = flag.lower() == "true"
            browse_response_blocks.append(BrowseResponseBlock(title=title, source=source, flag=flag, content=content))
    formatted_blocks = [f"Title: {block.title}\nSource: {block.source}\nFlag: {block.flag}\nContent: {block.content}" for block in browse_response_blocks]
    print("browse response blocks:\n" + '\n\n'.join(formatted_blocks))    
    return browse_response_blocks