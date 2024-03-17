import puppeteer from "puppeteer";
import { NextRequest, NextResponse } from 'next/server';
interface ScrapeGoogleSearchResultsRequest {
    userInput: string;
    }

interface ScrapeGoogleSearchResultsResponse {
    url: string;
    articleTitle: string;
    metaKeywords: string;
    articleContent: string;
    }

interface ScrapeGoogleSearchResultsError {
    message: string;
    }

interface userInput{
    userInput:string;
}



export async function scrapeGoogleSearchResults(userInput) {
  const browser = await puppeteer.launch({ headless: true }); // Set headless: true for no GUI
  const page = await browser.newPage();
  await page.goto("https://www.google.com/");
  await page.type("textarea[name=q]", userInput); // Correct the selector to 'input[name=q]'
  await page.keyboard.press("Enter");
  await page.waitForNavigation();

  const searchResults = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll("h3")).map((anchor) => ({
      title: anchor.innerText,
      url: anchor.parentElement.href,
    }));
    return links.slice(0, 2);
  });

  const resultsData = [];
  for (const result of searchResults) {
    console.log(`Visiting: ${result.url}`);
    try {
      const newPage = await browser.newPage();
      await newPage.goto(result.url, { waitUntil: "networkidle0" });
      const data = await newPage.evaluate(() => {
        const articleTitle = document.title;
        const metaKeywords = document.querySelector('meta[name="keywords"]')
          ? document.querySelector('meta[name="keywords"]').content
          : null;
        const articleContent = document.body.innerText;
        return { articleTitle, metaKeywords, articleContent };
      });
      console.log(data); // or push to resultsData
      resultsData.push({ url: result.url, ...data });
      await newPage.close();
    } catch (error) {
      console.error(`Error visiting ${result.url}: ${error.message}`);
    }
  }

  await browser.close();
  return resultsData;
}



export async function POST(req: NextRequest, res: NextResponse) {
    // Assuming the input is in the request body and the property name is 'userInput'
    const userInput = await req.json();

    // Check if userInput is valid
    if (!userInput || typeof userInput.userInput !== 'string') {
        return new NextResponse('Invalid request body', { status: 400 });
    }

    // Call the function with the input
    const result = await scrapeGoogleSearchResults(userInput.userInput);

    // Return the result
    return new NextResponse(JSON.stringify(result));
}
