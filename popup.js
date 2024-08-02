function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes'; // if zero, it doesnt matter to divide so instant return
    const divideValue = 1024; // base for intervals of num, KB, MB so on..
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']; // array defined with sizes
    const newValue = Math.floor(Math.log(bytes) / Math.log(divideValue)); // log values for 1024 base. then they get rounded for sizes index to see what size it is
    return parseFloat((bytes / Math.pow(divideValue, newValue)).toFixed(2)) + ' ' + sizes[newValue]; 
  }
  
  document.addEventListener("DOMContentLoaded", () => {s
    chrome.runtime.sendMessage({ type: "getDataUsage" }, (response) => { // method: getDataUsage
      if (chrome.runtime.lastError) { // error connecting to background worker
        console.error('error:', chrome.runtime.lastError.message);
        return;
      }
      if (response && response.dataUsage !== undefined) { 
        const usage = response.dataUsage;
        document.getElementById("usage").textContent = formatBytes(usage);// sets usage to html
      } else { // for if response is undefined when SW is not active
        console.error('failed to get data usage.');
        document.getElementById("usage").textContent = 'Error';
      }
    });
  
    document.querySelector('.reset-btn').addEventListener('click', () => { // checks for btn click
      chrome.storage.local.set({ dataUsage: 0 }, () => { // then sets local storagedata to 0
        document.getElementById("usage").textContent = formatBytes(0);
      });
    });
  });
  