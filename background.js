chrome.action.onClicked.addListener((tab) => {
  chrome.storage.sync
    .get(["defaultDownloadFormat"])
    .then((result) => downThisSheet(tab.url, result.defaultDownloadFormat));
});

/**
 * Check and disable the extension respectively when user change Tab
 */
chrome.tabs.onActivated.addListener(({ tabId, windowId }) => {
  chrome.tabs.get(tabId).then((tab) => {
    isGSheetDocumentURL(tab.url) ? enableExtension() : disableExtension();
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    isGSheetDocumentURL(changeInfo.url)
      ? enableExtension()
      : disableExtension();
  }
});

/**
 * Set default format
 */
chrome.storage.sync.set({ defaultDownloadFormat: "xlsx" }).then(() => {
  console.log("set default value done");
});

function isGSheetDocumentURL(url) {
  // Match if the url begin with https://docs.google.com/spreadsheets/d/
  const regex = /^https:\/\/docs.google.com\/spreadsheets\/d\//;
  return url.match(regex) !== null;
}

function downThisSheet(url, format = "xlsx") {
  const downloadUrl = url.replace(
    "/edit#gid=",
    `/export?format=${format}&gid=`
  );
  chrome.tabs.create({ url: downloadUrl, active: false });
}

function disableExtension() {
  chrome.action.disable().then(() => {
    // TODO Change the icon
    // chrome.action.setIcon({
    //  inactive icon
    // })
  });
}

function enableExtension() {
  chrome.action.enable().then(() => {
    // TODO Change the icon
    // chrome.action.setIcon({
    //  active icon
    // })
  });
}
