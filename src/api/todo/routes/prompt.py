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

    user_prompt = f"Please provide key concepts related to the following prompt:\n\n{query.userTxt}"

    if query.material:
        user_prompt = f"""
        Please analyze the following source material:

        {query.material}

        Now, focusing on the following specific prompt, provide relevant key concepts:

        {query.userTxt}
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
    print("material: ", browse.material)
    system_prompt = """
    You are an AI assistant tasked with analyzing and summarizing key concepts from given texts. Please follow these instructions:

    1. Read the source material which could be a video transcript or an article carefully.
    2. Divide the material into continuous sections such as chapters or sets of paragraphs
    3. For each section come up with a concise title for that section, based upon the content of the article or transcript
    add the source of the material such as an author, book title, or interviewer and interviewee, 
    and finally a summary of the content in a few sentences, and then return verbatim that section of the material.

    Title: [Section Title]
    Source: [Source]
    Content: [Summary of the section]
    Material: [Section Content]

    You should aim for roughly 3-10 sections and all material should be included in one or more sections. 
    Avoid having introduction, conclusion, or other non-content sections. If you took all the sections and put them together, 
    you should have the entire source material. Make sure not to include any hashtags or other markdown formatting.
    """

    user_prompt = f"Please analyze the following source material:\n\n{browse.material}"

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

    # Create BrowseResponseBlock list
    browse_response_blocks = []
    for block in response_blocks:
        lines = block.split("\n")
        title = source = content = section_material = ""
        for line in lines:
            if line.startswith("Title: "):
                title = line.replace("Title: ", "")
            elif line.startswith("Source: "):
                source = line.replace("Source: ", "")
            elif line.startswith("Content: "):
                content = line.replace("Content: ", "")
            elif line.startswith("Material: "):
                section_material = line.replace("Material: ", "")
            else:
                section_material += "\n" + line
        if title:  # Only add block if at least a title is present
            browse_response_blocks.append(BrowseResponseBlock(title=title, source=source, content=content, material=section_material))
    formatted_blocks = [f"Title: {block.title}\nSource: {block.source}\nContent: {block.content}\nMaterial: {block.material}" for block in browse_response_blocks]
    print("browse response blocks:\n" + '\n\n'.join(formatted_blocks))    
    return browse_response_blocks