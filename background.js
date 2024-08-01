let dataUsage = 0; // initial data usage
console.log('background script started for data usage extension');

chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    const contentLength = details.responseHeaders.find(
      (header) => header.name.toLowerCase() === 'content-length'
    );

    if (contentLength) {
      const bytesReceived = parseInt(contentLength.value, 10); // gets value of each website visited
      dataUsage += bytesReceived; // adds it to data usage
      chrome.storage.local.set({ dataUsage: dataUsage }); // then stores it for later
      console.log(`added ${bytesReceived} bytes. total bytes: ${dataUsage} bytes`); // debug
    } else {
      console.log('No content-length header found for this request');
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "getDataUsage") { //method for popup.js to fetch data
    chrome.storage.local.get(["dataUsage"], (result) => { // gets data usage num
      const usage = result.dataUsage || 0; 
      console.log(`data usage fetched: ${usage} bytes`);
      sendResponse({ dataUsage: usage }); // sends the response back 
    });
    return true; 
  } else {
    console.error('Unknown message type:', request.type);
  }
});
