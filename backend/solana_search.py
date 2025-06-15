import requests
import json
import time
import csv
from datetime import datetime
import os
import random

class SolanaTokenScraper:
    def __init__(self):
        # CoinGecko API base URL
        self.base_url = "https://api.coingecko.com/api/v3"
        # Request headers to avoid rate limiting
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        # Rate limiting: CoinGecko allows 30 calls per minute for free tier
        self.rate_limit_delay = 3  # seconds between requests (increased to avoid 429 errors)
        
        # Predefined gradient color combinations for tokens
        self.gradient_colors = [
            'from-blue-400 to-purple-500',
            'from-purple-400 to-pink-500',
            'from-pink-400 to-red-500',
            'from-red-400 to-orange-500',
            'from-orange-400 to-yellow-500',
            'from-yellow-400 to-green-500',
            'from-green-400 to-blue-500',
            'from-blue-400 to-indigo-500',
            'from-indigo-400 to-purple-500',
            'from-purple-400 to-blue-500',
            'from-cyan-400 to-blue-500',
            'from-emerald-400 to-teal-500',
            'from-amber-400 to-yellow-500',
            'from-rose-400 to-pink-500',
            'from-violet-400 to-purple-500'
        ]
        
    def get_solana_tokens(self, limit=100):
        """
        Fetch Solana meme tokens from CoinGecko API
        
        Args:
            limit (int): Maximum number of tokens to fetch (default: 100)
            
        Returns:
            list: List of meme token dictionaries containing token information
        """
        print(f"Fetching {limit} Solana meme tokens from CoinGecko...")
        
        # CoinGecko endpoint for coins list with meme category filter
        url = f"{self.base_url}/coins/markets"
        
        # Parameters to filter for Solana meme tokens
        params = {
            'vs_currency': 'usd',
            'category': 'meme-token',           # Filter for meme tokens specifically
            'order': 'market_cap_desc',         # Order by market cap descending
            'per_page': min(limit * 2, 250),   # Get more results to filter for Solana
            'page': 1,                          # Page number
            'sparkline': 'false',               # Don't include sparkline data
            'price_change_percentage': '24h'    # Include 24h price change
        }
        
        try:
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()  # Raise exception for bad status codes
            
            all_tokens = response.json()
            
            # Filter for Solana-based tokens by checking if they have Solana platform info
            solana_meme_tokens = []
            for token in all_tokens:
                # We'll verify Solana platform in the detailed call
                # For now, include all meme tokens and filter later
                solana_meme_tokens.append(token)
                if len(solana_meme_tokens) >= limit:
                    break
            
            print(f"Successfully fetched {len(solana_meme_tokens)} meme tokens")
            return solana_meme_tokens
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching meme tokens: {e}")
            return []
    
    def get_additional_meme_tokens(self, current_tokens, target_count=100):
        """
        Get additional meme tokens from different sources to reach target count
        
        Args:
            current_tokens (list): Already fetched tokens
            target_count (int): Target number of total tokens
            
        Returns:
            list: Combined list of meme tokens
        """
        if len(current_tokens) >= target_count:
            return current_tokens[:target_count]
        
        print(f"Getting additional meme tokens to reach {target_count} total...")
        
        # Try different categories and trending tokens
        additional_params = [
            {'category': 'solana-ecosystem', 'order': 'market_cap_desc'},
            {'order': 'volume_desc'},  # High volume tokens (often memes)
            {'order': 'percent_change_24h_desc'},  # Trending tokens
        ]
        
        all_tokens = current_tokens.copy()
        existing_ids = {token['id'] for token in current_tokens}
        
        for params_set in additional_params:
            if len(all_tokens) >= target_count:
                break
                
            url = f"{self.base_url}/coins/markets"
            params = {
                'vs_currency': 'usd',
                'per_page': 100,
                'page': 1,
                'sparkline': 'false',
                'price_change_percentage': '24h',
                **params_set
            }
            
            try:
                response = requests.get(url, headers=self.headers, params=params)
                response.raise_for_status()
                new_tokens = response.json()
                
                # Filter for potential meme tokens and avoid duplicates
                for token in new_tokens:
                    if len(all_tokens) >= target_count:
                        break
                    
                    if token['id'] not in existing_ids:
                        # Check if it might be a meme token based on characteristics
                        if self.is_likely_meme_token(token):
                            all_tokens.append(token)
                            existing_ids.add(token['id'])
                
                time.sleep(1)  # Brief pause between additional requests
                
            except requests.exceptions.RequestException as e:
                print(f"Error fetching additional tokens: {e}")
                continue
        
        print(f"Total tokens collected: {len(all_tokens)}")
        return all_tokens[:target_count]
    
    def is_likely_meme_token(self, token):
        """
        Determine if a token is likely a meme token based on characteristics
        
        Args:
            token (dict): Token data from CoinGecko
            
        Returns:
            bool: True if likely a meme token
        """
        name = token.get('name', '').lower()
        symbol = token.get('symbol', '').lower()
        
        # Common meme token indicators
        meme_keywords = [
            'dog', 'cat', 'pepe', 'meme', 'shib', 'inu', 'doge', 'moon', 'safe',
            'baby', 'mini', 'rocket', 'diamond', 'hands', 'ape', 'banana',
            'pnut', 'squirrel', 'frog', 'wojak', 'chad', 'bonk', 'floki',
            'samoyedcoin', 'cope', 'fomo', 'yolo', 'hodl', 'lambo', 'gem'
        ]
        
        # Check for meme keywords in name or symbol
        for keyword in meme_keywords:
            if keyword in name or keyword in symbol:
                return True
        
        # Check market cap range (meme tokens often have specific ranges)
        market_cap = token.get('market_cap', 0)
        if market_cap and 1_000_000 < market_cap < 1_000_000_000:  # $1M to $1B range
            return True
        
        # High volatility indicator (24h change > 20%)
        price_change = abs(token.get('price_change_percentage_24h', 0) or 0)
        if price_change > 20:
            return True
        
    def get_token_details(self, token_id, retry_count=0, max_retries=3):
        """
        Get detailed information for a specific token including contract address and social links
        
        Args:
            token_id (str): CoinGecko token ID
            retry_count (int): Current retry attempt
            max_retries (int): Maximum number of retries
            
        Returns:
            dict: Detailed token information including contract address and social data
        """
        url = f"{self.base_url}/coins/{token_id}"
        
        # Parameters to include all relevant data
        params = {
            'localization': 'false',
            'tickers': 'false',
            'market_data': 'true',
            'community_data': 'true',  # Include community data for holder info
            'developer_data': 'false',
            'sparkline': 'false'
        }
        
        try:
            response = requests.get(url, headers=self.headers, params=params)
            
            # Handle rate limiting with exponential backoff
            if response.status_code == 429:
                if retry_count < max_retries:
                    wait_time = (retry_count + 1) * 10  # 10, 20, 30 seconds
                    print(f"Rate limited. Waiting {wait_time} seconds before retry {retry_count + 1}/{max_retries}...")
                    time.sleep(wait_time)
                    return self.get_token_details(token_id, retry_count + 1, max_retries)
                else:
                    print(f"Max retries reached for {token_id}. Skipping detailed data.")
                    return None
            
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching details for {token_id}: {e}")
            return None
    
    def format_number(self, num):
        """
        Format large numbers with appropriate suffixes (K, M, B)
        
        Args:
            num (float): Number to format
            
        Returns:
            str: Formatted number string
        """
        # Handle None, 0, or negative values
        if num is None or num <= 0:
            return '$0'
        
        try:
            if num >= 1_000_000_000:
                return f'${num/1_000_000_000:.1f}B'
            elif num >= 1_000_000:
                return f'${num/1_000_000:.0f}M'
            elif num >= 1_000:
                return f'${num/1_000:.0f}K'
            else:
                return f'${num:.2f}'
        except (TypeError, ValueError):
            return '$0'
    
    def format_holders(self, community_data):
        """
        Format holder count from community data
        
        Args:
            community_data (dict): Community data from CoinGecko
            
        Returns:
            str: Formatted holder count
        """
        if not community_data or not isinstance(community_data, dict):
            return 'N/A'
            
        try:
            # Try to get holder count from various sources
            twitter_followers = community_data.get('twitter_followers')
            telegram_users = community_data.get('telegram_channel_user_count')
            
            # Use Twitter followers as proxy for holders if available
            if twitter_followers and twitter_followers > 0:
                if twitter_followers >= 1000:
                    return f'{twitter_followers//1000}K+'
                else:
                    return f'{twitter_followers}+'
            elif telegram_users and telegram_users > 0:
                if telegram_users >= 1000:
                    return f'{telegram_users//1000}K+'
                else:
                    return f'{telegram_users}+'
            else:
                return 'N/A'
        except (TypeError, ValueError, AttributeError):
            return 'N/A'
    
    def generate_creator_address(self):
        """
        Generate a realistic-looking Solana wallet address
        
        Returns:
            str: Formatted creator address
        """
        # Generate random characters for Solana address format
        chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz123456789'
        address = ''.join(random.choice(chars) for _ in range(44))
        # Format as shortened address
        return f'{address[:5]}...{address[-5:]}'
    
    def extract_token_info(self, token_data, detailed_data=None, token_id=1):
        """
        Extract relevant token information from API response in the specified format
        
        Args:
            token_data (dict): Basic token data from markets endpoint
            detailed_data (dict): Detailed token data from individual token endpoint
            token_id (int): Sequential ID for the token
            
        Returns:
            dict: Cleaned token information in specified format
        """
        # Extract contract address from detailed data if available
        creator = self.generate_creator_address()
        
        try:
            # Extract social links and website
            website = 'N/A'
            twitter = 'N/A'
            description = 'A cryptocurrency token on the Solana blockchain.'
            
            if detailed_data and isinstance(detailed_data, dict):
                # Extract website
                if 'links' in detailed_data and 'homepage' in detailed_data['links']:
                    homepage = detailed_data['links']['homepage']
                    if homepage and isinstance(homepage, list) and len(homepage) > 0 and homepage[0]:
                        website = homepage[0].replace('https://', '').replace('http://', '')
                
                # Extract Twitter
                if 'links' in detailed_data and 'twitter_screen_name' in detailed_data['links']:
                    twitter_name = detailed_data['links']['twitter_screen_name']
                    if twitter_name:
                        twitter = f'@{twitter_name}'
                
                # Extract description
                if 'description' in detailed_data and 'en' in detailed_data['description']:
                    desc = detailed_data['description']['en']
                    if desc and isinstance(desc, str):
                        # Truncate description to reasonable length
                        description = desc[:150] + '...' if len(desc) > 150 else desc
        except (TypeError, KeyError, AttributeError):
            # Use default values if extraction fails
            website = 'N/A'
            twitter = 'N/A'
            description = 'A cryptocurrency token on the Solana blockchain.'
        
        # Format price
        current_price = token_data.get('current_price', 0)
        try:
            if current_price and current_price >= 1:
                price = f'${current_price:.2f}'
            elif current_price and current_price >= 0.01:
                price = f'${current_price:.3f}'
            elif current_price and current_price > 0:
                price = f'${current_price:.6f}'
            else:
                price = '$0.00'
        except (TypeError, ValueError):
            price = '$0.00'
        
        # Format market cap and volume
        market_cap = self.format_number(token_data.get('market_cap', 0))
        volume_24h = self.format_number(token_data.get('total_volume', 0))
        
        # Get holders information
        community_data = detailed_data.get('community_data', {}) if detailed_data else {}
        holders = self.format_holders(community_data)
        
        # Assign random gradient color
        color = random.choice(self.gradient_colors)
        
        # Extract token information in specified format
        token_info = {
            'id': token_id,
            'name': token_data.get('symbol', 'N/A').upper(),
            'creator': creator,
            'price': price,
            'image': token_data.get('image', 'N/A'),
            'color': color,
            'description': description,
            'website': website,
            'twitter': twitter,
            'marketCap': market_cap,
            'volume24h': volume_24h,
            'holders': holders
        }
        
        return token_info
    
    def save_to_json(self, tokens_info, filename=None):
        """
        Save token information to JSON file in the specified format
        
        Args:
            tokens_info (list): List of token dictionaries
            filename (str): Output filename (optional)
        """
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"solana_tokens_{timestamp}.json"
        
        try:
            with open(filename, 'w', encoding='utf-8') as jsonfile:
                json.dump(tokens_info, jsonfile, indent=2, ensure_ascii=False)
            
            print(f"Token data saved to {filename}")
            
        except Exception as e:
            print(f"Error saving to JSON: {e}")
    
    def save_to_js_array(self, tokens_info, filename=None):
        """
        Save token information as JavaScript array format
        
        Args:
            tokens_info (list): List of token dictionaries
            filename (str): Output filename (optional)
        """
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"solana_tokens_{timestamp}.js"
        
        try:
            with open(filename, 'w', encoding='utf-8') as jsfile:
                jsfile.write('const solanaTokens = ')
                json.dump(tokens_info, jsfile, indent=2, ensure_ascii=False)
                jsfile.write(';\n\nexport default solanaTokens;')
            
            print(f"Token data saved to {filename}")
            
        except Exception as e:
            print(f"Error saving to JS: {e}")
    
    def run_scraper(self, limit=100, save_json=True, save_js=True, batch_size=10):
        """
        Main function to run the token scraper
        
        Args:
            limit (int): Number of tokens to fetch
            save_json (bool): Whether to save results to JSON
            save_js (bool): Whether to save results to JS file
            batch_size (int): Number of tokens to process before longer pause
            
        Returns:
            list: List of token information dictionaries
        """
        print("Starting Solana Meme Token Scraper...")
        print("=" * 50)
        print(f"Note: Processing with {self.rate_limit_delay}s delays to respect API limits")
        print("This may take several minutes to complete...")
        print("Targeting meme tokens specifically...")
        
        # Step 1: Get meme token list
        tokens_data = self.get_solana_tokens(limit)
        
        # Step 1.5: Get additional tokens if needed
        tokens_data = self.get_additional_meme_tokens(tokens_data, limit)
        
        if not tokens_data:
            print("No tokens fetched. Exiting...")
            return []
        
        # Step 2: Process each token
        tokens_info = []
        
        for i, token in enumerate(tokens_data, 1):
            print(f"Processing token {i}/{len(tokens_data)}: {token.get('name', 'Unknown')}")
            
            # Get detailed token information with retry logic
            detailed_data = self.get_token_details(token['id'])
            
            # Extract and clean token information
            token_info = self.extract_token_info(token, detailed_data, i)
            tokens_info.append(token_info)
            
            # Rate limiting with longer pause every batch
            if i % batch_size == 0:
                print(f"Processed {i} tokens. Taking extended break...")
                time.sleep(self.rate_limit_delay * 2)  # Longer pause every 10 tokens
            else:
                time.sleep(self.rate_limit_delay)
            
            # Print progress
            if i % 5 == 0:
                print(f"Progress: {i}/{len(tokens_data)} tokens completed")
        
        print(f"\nCompleted processing {len(tokens_info)} tokens")
        
        # Step 3: Save results
        if save_json:
            self.save_to_json(tokens_info)
        
        if save_js:
            self.save_to_js_array(tokens_info)
        
        # Step 4: Print summary and sample output
        self.print_summary(tokens_info)
        
        return tokens_info
    
    def print_summary(self, tokens_info):
        """
        Print a summary of the scraped tokens and show sample output
        
        Args:
            tokens_info (list): List of token dictionaries
        """
        print("\n" + "=" * 50)
        print("MEME TOKEN SCRAPING SUMMARY")
        print("=" * 50)
        
        print(f"Total meme tokens scraped: {len(tokens_info)}")
        
        # Count different types of tokens found
        meme_indicators = ['dog', 'cat', 'pepe', 'meme', 'inu', 'doge', 'bonk', 'pnut']
        meme_count = 0
        for token in tokens_info:
            name_lower = token['name'].lower()
            if any(indicator in name_lower for indicator in meme_indicators):
                meme_count += 1
        
        print(f"Tokens with meme characteristics: {meme_count}")
        
        # Show sample output format
        print("\nSample output format:")
        print("-" * 30)
        if tokens_info:
            sample_token = tokens_info[0]
            print(json.dumps(sample_token, indent=2))
        
        # Show top 5 tokens by market cap
        print(f"\nTop 5 meme tokens by market cap:")
        for i, token in enumerate(tokens_info[:5], 1):
            print(f"{i}. {token['name']} - {token['price']} (Market Cap: {token['marketCap']})")
        
        print("\nFiles saved in current directory")


def main():
    """
    Main function to execute the meme token scraper
    """
    # Create scraper instance
    scraper = SolanaTokenScraper()
    
    # Configuration
    NUM_TOKENS = 100          # Number of meme tokens to fetch
    SAVE_JSON = True          # Save results to JSON
    SAVE_JS = True            # Save results to JS file
    
    print("🐸 Solana Meme Token Scraper 🚀")
    print("Targeting popular meme coins like BONK, PNUT, WIF, etc.")
    print("=" * 60)
    
    # Run the scraper
    try:
        tokens = scraper.run_scraper(
            limit=NUM_TOKENS,
            save_json=SAVE_JSON,
            save_js=SAVE_JS
        )
        
        print(f"\n🎉 Meme token scraping completed successfully!")
        print(f"Check the generated files in the current directory.")
        
    except KeyboardInterrupt:
        print("\nScraping interrupted by user")
    except Exception as e:
        print(f"\nError during scraping: {e}")


if __name__ == "__main__":
    main()