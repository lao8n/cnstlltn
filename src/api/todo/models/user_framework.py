from beanie import Document

class UserFramework(Document):
    userid: str
    constellation: str
    title: str
    content: str

    class Settings:
        collection = "user_frameworks"