# Google Search Scraper

This project contains a function to scrape Google search results for a given keyword and then visit each result to scrape additional details such as the article title, meta keywords, and article content. The code is designed to be used in a Next.js API route.

## Installation

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Usage
   The main function scrapeGoogleSearchResults can be used to scrape Google search results. It takes a single parameter userInput which is the keyword to search for.

Example:

```
import { scrapeGoogleSearchResults } from './path/to/your/file';

async function main() {
  const results = await scrapeGoogleSearchResults('example keyword');
  console.log(results);
}

main();
```

3. API
   scrapeGoogleSearchResults(userInput)
   Scrapes Google search results for the given keyword.

`userInput:` The keyword to search for.

`Returns:` An array of objects containing the URL, article title, meta keywords, and article content for each search result.

4. Next.js API Route
   The POST function can be used as a Next.js API route handler. It expects a JSON request body with a userInput property containing the keyword to search for.

Example request:

```
{
  "userInput": "example keyword"
}
```

License
This project is open source and available under the MIT License.
