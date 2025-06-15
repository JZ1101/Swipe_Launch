import requests
from datetime import datetime
import json

def get_flash_news():
    url = "https://api.theblockbeats.news/v1/open-api/open-flash"
    params = {
        "size": 450,
        "page": 1,
        "type": "push",
        "lang": "en"
    }
    response = requests.get(url, params=params)
    data = response.json()

    print("Original data:")
    print(data)
    
    # Filter news headlines containing "sol" (case insensitive)
    filtered_data = filter_sol_news(data)
    
    # Save original data
    filename = f"flash_news_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    # Save filtered data in the required format
    filtered_filename = f"sol_news_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    save_as_json_format(filtered_data, filtered_filename)
    
    print(f"Original data saved to {filename}")
    print(f"SOL-related news saved to {filtered_filename}")
    
    return filtered_data

def save_as_json_format(data, filename):
    """Save filtered news in JSON format with id, title, create_time fields only"""
    if 'data' not in data or 'data' not in data['data']:
        print("No data to save")
        return
    
    news_list = data['data']['data']
    
    # Format data according to the required structure
    formatted_news = []
    for news in news_list:
        formatted_item = {
            "id": news.get('id', 0),
            "title": news.get('title', ''),
            "create_time": str(news.get('create_time', ''))
        }
        formatted_news.append(formatted_item)
    
    # Save to JSON file
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(formatted_news, f, ensure_ascii=False, indent=2)
    
    print(f"JSON format saved with {len(formatted_news)} SOL-related news items")

def filter_sol_news(data):
    """Filter news containing SOL"""
    if 'data' not in data or 'data' not in data['data']:
        print("Data format is not as expected")
        return data
    
    original_news = data['data']['data']
    filtered_news = []
    
    for news in original_news:
        # Check if title or content contains "sol" (case insensitive)
        title = news.get('title', '').lower()
        content = news.get('content', '').lower()  # Also check content
        
        if 'sol' in title or 'sol' in content:
            filtered_news.append(news)
            print(f"Found SOL-related news: {news.get('title', 'No title')}")
    
    # Construct filtered data structure
    filtered_data = data.copy()
    filtered_data['data']['data'] = filtered_news
    filtered_data['data']['total'] = len(filtered_news)
    
    print(f"Original news count: {len(original_news)}")
    print(f"SOL-related news count: {len(filtered_news)}")
    
    return filtered_data

# Execute function
if __name__ == "__main__":
    output = get_flash_news()
    
    # Print filtered results in console
    print("\n=== SOL-related News ===")
    if 'data' in output and 'data' in output['data']:
        for news in output['data']['data']:
            print(f"ID: {news.get('id', 'No ID')}")
            print(f"Title: {news.get('title', 'No title')}")
            print(f"Create Time: {news.get('create_time', 'No time')}")
            print("-" * 50)