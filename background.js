let dataUsage = 0; // initial data usage

chrome.webRequest.onHeadersReceived.addListener( // when a website loads and headers are recieved
  (details) => {
    const contentLength = details.responseHeaders.find( // it finds the content length
      (header) => header.name.toLowerCase() === 'content-length' 
    );

    if (contentLength) {
      const bytesReceived = parseInt(contentLength.value, 10); // gets number value of website to calculate bytes
      dataUsage += bytesReceived; // adds it to data usage
      chrome.storage.local.set({ dataUsage: dataUsage }); // then stores it for later
    } else {
      console.log('No content-length header found for this request'); // this is there for null websites that are saved and not from internet
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "getDataUsage") { //method for popup.js to fetch data
    chrome.storage.local.get(["dataUsage"], (result) => { // gets data usage num
      const usage = result.dataUsage || 0; 
      sendResponse({ dataUsage: usage }); // sends the response back 
    });
    return true; 
  } else {
    console.error('Unknown message type:', request.type);
  }
});
