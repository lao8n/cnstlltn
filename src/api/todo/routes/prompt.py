# typing imports
from typing import List
# local imports
from todo.app import app, openai_client
from todo.models import (Query, QueryAiResponseBlock, BrowseResponseBlock)

@app.post("/query-ai", response_model=List[QueryAiResponseBlock], response_model_by_alias=False, status_code=201)
async def query_ai(query: Query) -> List[QueryAiResponseBlock]:
    print("query-ai")
    print("user text: ", query.userTxt)
    print("source: ", query.source)

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

    if query.source:
        user_prompt = f"""
        Please analyze the following source material:

        {query.source}

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
        title = lines[0].replace("Title: ", "")
        source = lines[1].replace("Source: ", "")
        content = "\n".join(lines[2:]).replace("Content: ", "")
        query_ai_response_blocks.append(QueryAiResponseBlock(title=title, source=source, content=content))
    formatted_blocks = [f"Title: {block.title}\nSource: {block.source}\nContent: {block.content}" for block in query_ai_response_blocks]
    print("query_ai response blocks:\n" + '\n\n'.join(formatted_blocks))    
    return query_ai_response_blocks

@app.post("/browse", response_model=List[BrowseResponseBlock], response_model_by_alias=False, status_code=201)
async def browse(source: str) -> List[BrowseResponseBlock]:
    print("browse")
    print("source: ", source)

    system_prompt = """
    You are an AI assistant tasked with analyzing and summarizing key concepts from given texts. Please follow these instructions:

    1. Read the source material which could be a video transcript or an article carefully.
    2. Divide the material into continuous sections such as chapters or sets of paragraphs
    3. For each section come up with a concise title for that section, a summary of the section of a few sentences, and then return verbatim that section of the material.

    Title: [Section Title]
    Summary: [Summary of the section]
    Section: [Section Content]

    You should aim for roughly 3-10 sections and all material should be included in one or more sections. 
    Avoid having introduction, conclusion, or other non-content sections. If you took all the sections and put them together, 
    you should have the entire source material.
    """

    user_prompt = f"Please analyze the following source material:\n\n{source}"

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
        title = lines[0].replace("Title: ", "")
        summary = lines[1].replace("Summary: ", "")
        section = "\n".join(lines[2:]).replace("Section: ", "")
        browse_response_blocks.append(BrowseResponseBlock(title=title, summary=summary, section=section))
    formatted_blocks = [f"Title: {block.title}\nSummary: {block.summary}\nSection: {block.section}" for block in browse_response_blocks]
    print("browse response blocks:\n" + '\n\n'.join(formatted_blocks))    
    return browse_response_blocks