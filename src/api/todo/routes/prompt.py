# typing imports
from typing import List
# local imports
from todo.app import app, openai_client
from todo.models import (QueryRequest, BrowseRequest, QueryResponses, BrowseResponses)

@app.post("/query-ai", response_model=QueryResponses, response_model_by_alias=False, status_code=201)
async def query_ai(query: QueryRequest) -> QueryResponses:
    print("query-ai")
    print("user text: ", query.userTxt)
    print("material: ", query.material)

    # prepare request
    system_prompt = """
    You are an AI assistant tasked with analyzing and summarizing key concepts from given texts. Please follow these instructions:

    1. If source material is provided, read it carefully.
    2. Identify key concepts, ideas, or frameworks mentioned in the text or related to the prompt.
    3. For each key concept return the following information:

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
        """

    # make openai call
    completion = openai_client.beta.chat.completions.parse(
        model='gpt-4o-2024-08-06', # best model
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            }
        ],
        response_format=QueryResponses,
    )

    # process response
    response = completion.choices[0].message
    print("query structured output:", response)
    if response.parsed:
        return response.parsed
    else:
        print(response.refusal)
        return []

@app.post("/browse", response_model=BrowseResponses, response_model_by_alias=False, status_code=201)
async def browse(browse: BrowseRequest) -> BrowseResponses:
    print("browse")
    print("attachment: ", browse.attachment, "material: ", browse.material)

    # prepare request
    if browse.attachment:
        system_prompt = """
        You are an AI assistant tasked with analyzing and summarizing key concepts from given texts. Please follow these instructions:

        1. Read the source material carefully. This could be a video transcript or an article.
        2. Divide the material into 3 to 8 continuous sections.
        3. For each section, provide the following information:

        Title: [Concise title for the section]
        Source: [Source of the material, such as author and book title - use your knowledge of the material to infer this]
        Content: [Detailed explanation of the section's content]
        Flag: [true or false, set to true if there could still be more detail in this section not covered in your response, 
        set to false if your response covers absolutely all the details from this section of the source material]

        Do not include any introduction, conclusion, or other non-content sections.
        Do not include any markdown formatting such as # or * in the content, do not number the sections.
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
        Flag: [true or false, set to true if there could still be more detail in this section not covered in your response, 
        set to false if your response covers absolutely all the details from this section of the source material]

        Do not include any introduction, conclusion, or other non-content sections.
        Do not include any markdown formatting such as # or * in the content, do not number the sections.
        """

    if browse.attachment:
        system_prompt = f"Here is the material to analyze:\n\n{browse.material}"
    else:
        system_prompt = f"Here is the name of the book, article or concept to analyse:\n\n{browse.material}"

    messages = [
        {"role": "system", "content": system_prompt }, 
        {"role": "user", "content": "Summarise the key concepts in 3-8 sections"}
    ]
    for message in browse.messages:
        responses_content = "\n\n".join([
            f"Title: {block.title}\nSource: {block.source}\nFlag: {block.flag}\nContent: {block.content}"
            for block in message.responses
        ])
        messages.append({"role": "assistant", "content": responses_content})
        messages.append({"role": "user", "content": f"""
                         1. Focus just on this section: {message.chosen}
                         2. Divide the material into 3 to 8 continuous sub-sections.
                         3. For each sub-section, provide, Title, Source, Content and Flag where Flag is true if there 
                         could still be more detail in this section not covered in your response, set to false if your 
                         response covers absolutely all the details from this section of the source material

                        Make sure not to include any markdown formatting such as # or * in the content, do not number the sub-sections.
                        When relevant, add interesting statistics, quotes or other interesting tidbits to the content rather than just a bland summary.
                        """})

    # make openai call
    response = openai_client.beta.chat.completions.parse(
        model='gpt-4o-2024-08-06', # best model
        messages=messages,
        response_format=BrowseResponses,
    )

    # process response
    response = response.choices[0].message
    print("browse structured output:", response)
    if response.parsed:
        return response.parsed
    else:
        print(response.refusal)
        return []