from azure.cosmos import CosmosClient, exceptions

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

# Fields to drop
fields_to_drop = ['unwantedField1', 'unwantedField2']

# Update data in the container
for item in items:
    # Remove the fields from the document
    for field in fields_to_drop:
        item.pop(field, None)  # Use pop to remove the field, no error if field doesn't exist

    # Replace the updated document in the container
    try:
        container.replace_item(item=item["id"], body=item)
        print(f"Updated item with ID: {item['id']} - dropped fields: {fields_to_drop}")
    except exceptions.CosmosHttpResponseError as e:
        print(f"Failed to update item {item['id']}: {str(e)}")

print("Fields removal completed.")