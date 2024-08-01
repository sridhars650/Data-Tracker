document.addEventListener("DOMContentLoaded", () => {
    chrome.runtime.sendMessage({ type: "getDataUsage" }, (response) => { // method: getDataUsage
      if (chrome.runtime.lastError) { // error connecting to background worker
        console.error('Runtime error:', chrome.runtime.lastError.message);
        return;
      }
      if (response && response.dataUsage !== undefined) {
        const usage = response.dataUsage;
        document.getElementById("usage").textContent = usage;// sets usage to html
        console.log(`Data usage displayed: ${usage} bytes`); // debug
      } else { // for if response is undefined when SW is not active
        console.error('Failed to retrieve data usage.'); 
        document.getElementById("usage").textContent = 'Error';
      }
    });
  });
  