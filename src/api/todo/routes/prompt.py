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
    Source: [Source of the concept -use your knowledge of the material to infer this]
    Content: [Detailed explanation of the concept]

    Provide multiple concepts related to the given prompt or source material. Do not include any introduction or conclusion.
    """
    if query.material:
        system_prompt += f"""
        Please analyze the following source material:

        {query.material}
        """

    user_prompt = f"""
        Please provide key concepts related to the following prompt:\n\n{query.userTxt}
        Return your response in the following format:

        Title: [Concept Title]
        Source: [Source of the concept - use your knowledge of the material to infer this]
        Content: [Detailed explanation of the concept]

        Make sure not to include any markdown formatting such as # or * in the content, do not number the sections.
        """

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

        1. Read the source material carefully. This could be a video transcript or an article.
        2. Divide the material into 3 to 8 continuous sections.
        3. For each section, provide the following information:

        Title: [Concise title for the section]
        Source: [Source of the material, such as author and book title - use your knowledge of the material to infer this]
        Content: [Detailed explanation of the section's content]
        Flag: [true or false, set to true if there is still more detail in this section not covered in your response, 
        set to false if your response covers all the details from this section of the source material]

        Ensure each section is separated by two newlines. Do not include any introduction, conclusion, or other non-content sections.
        Do not include any markdown formatting such as # or * in the content, do not number the sections.

        For example, a section might look like this:

        Title: Role of agriculture
        Source: BBC interview with Jared Diamond
        Content: Agriculture is a central theme in "Guns, Germs, and Steel," emphasizing how the development of farming practices
        allowed certain societies to produce surplus food, enabling population growth, job specialization, and technological advancements.
        This agricultural revolution created the foundation for powerful, organized states.
        Flag: false

        """
    else:
        system_prompt = """
        You are an AI assistant tasked with analyzing and summarizing key concepts from a book. Please follow these instructions:

        1. Consider the book as a whole.
        2. Divide the material into 3 to 8 continuous sections.
        3. For each section, provide the following information:

        Title: [Concise title for the section]
        Source: [Source of the material, such as author and book title - use your knowledge of the material to infer this]
        Content: [Detailed explanation of the section's content]
        Flag: [true or false, set to true if there is still more detail in this section not covered in your response, 
        set to false if your response covers all the details from this section of the source material]

        Ensure each section is separated by two newlines. Do not include any introduction, conclusion, or other non-content sections.
        Do not include any markdown formatting such as # or * in the content, do not number the sections.

        For example, a section might look like this:

        Title: Role of agriculture
        Source: Guns, Germs, and Steel by Jared Diamond
        Flag: true
        Content: Agriculture is a central theme in "Guns, Germs, and Steel," emphasizing how the development of farming practices
        allowed certain societies to produce surplus food, enabling population growth, job specialization, and technological advancements.
        This agricultural revolution created the foundation for powerful, organized states.
        Flag: true
        """

    if browse.attachment:
        system_prompt = f"Here is the material to analyze:\n\n{browse.material}"
    else:
        system_prompt = f"Here is the name of the book to analyse:\n\n{browse.material}"

    messages = [
        { "role": "system", "content": system_prompt }, 
        {"role": "user", "content": """
        Summarise the key concepts in 3-8 sections where each section of your response is in the following format:
         
        Title: [Concise title for the section]
        Source: [Source of the material, such as author and book title - use your knowledge of the material to infer this]
        Content: [Detailed explanation of the section's content]
        Flag: [true or false, set to true if there is still more detail in this section not covered in your response, 
        set to false if your response covers all the details from this section of the source material]
         
        Make sure not to include any markdown formatting such as # or * in the content, do not number the sections.
        """}]
    for message in browse.messages:
        responses_content = "\n\n".join([
            f"Title: {block.title}\nSource: {block.source}\nFlag: {block.flag}\nContent: {block.content}"
            for block in message.responses
        ])
        messages.append({"role": "assistant", "content": responses_content})
        messages.append({"role": "user", "content": f"""
                         1. Focus just on this section: {message.chosen}
                         2. Divide the material into 3 to 8 continuous sub-sections.
                         3. For each sub-section, provide the following information:
                        
                        Return your response in the following format for each sub-section:

                        Title: [Concise title for the section]
                        Source: [Source of the material, such as author and book title - use your knowledge of the material to infer this]
                        Content: [Detailed explanation of the section's content]
                        Flag: [true or false, set to true if there is still more detail in this section not covered in your response, 
                        set to false if your response covers all the details from this section of the source material]

                        Make sure not to include any markdown formatting such as # or * in the content, do not number the sub-sections.
                        """})

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
        for line in lines:
            if line.startswith("Title: "):
                title = line.replace("Title: ", "")
            elif line.startswith("Source: "):
                source = line.replace("Source: ", "")
            elif line.startswith("Content: "):
                content = line.replace("Content: ", "")
            elif line.startswith("Flag: "):
                flag = line.replace("Flag: ", "")
            else:
                content += "\n" + line
        if title and content:  # Only add block if at least a title and content is present
            flag = flag.lower() == "true"
            browse_response_blocks.append(BrowseResponseBlock(title=title, source=source, flag=flag, content=content))
    formatted_blocks = [f"Title: {block.title}\nSource: {block.source}\nFlag: {block.flag}\nContent: {block.content}" for block in browse_response_blocks]
    print("browse response blocks:\n" + '\n\n'.join(formatted_blocks))    
    return browse_response_blocks