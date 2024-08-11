from azure.cosmos import CosmosClient, exceptions
import json

# Cosmos DB credentials
url = "YOUR_COSMOS_DB_ACCOUNT_URL"
key = "YOUR_COSMOS_DB_ACCOUNT_KEY"
database_name = 'YOUR_DATABASE_NAME'
container_name = 'YOUR_CONTAINER_NAME'

# Initialize the Cosmos client
client = CosmosClient(url, credential=key)

# Connect to the database and container
database = client.get_database_client(database_name)
container = database.get_container_client(container_name)

# Query the existing data
query = "SELECT * FROM c"
items = list(container.query_items(query=query, enable_cross_partition_query=True))

# Function to add new fields to existing items
def update_item(item):
    # Add new fields
    item["islatest"] = False
    item["frameworks"] = {}

    # Optional: Update 'coordinate' if it exists, converting it to a tuple
    if "coordinate" in item and isinstance(item["coordinate"], list):
        item["coordinate"] = tuple(item["coordinate"])

    return item

# Update data in the container
for item in items:
    updated_item = update_item(item)
    try:
        container.replace_item(item=item["id"], body=updated_item)
        print(f"Updated item with ID: {item['_id']} with new fields.")
    except exceptions.CosmosHttpResponseError as e:
        print(f"Failed to update item {item['id']}: {str(e)}")

print("Data migration completed.")