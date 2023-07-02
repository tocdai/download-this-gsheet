// Init firebase
try {
  self.importScripts(
    "firebase/9.23.0/firebase-app-compat.js",
    "firebase/9.23.0/firebase-firestore-compat.js"
  );

  const firebaseConfig = {
    apiKey: "AIzaSyCupkWGc0WWo28ObTKHEqFhyxRD7qCQcGY",
    authDomain: "download-this-gsheet.firebaseapp.com",
    databaseURL:
      "https://download-this-gsheet-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "download-this-gsheet",
    storageBucket: "download-this-gsheet.appspot.com",
    messagingSenderId: "745828235096",
    appId: "1:745828235096:web:2d8d90145c10b035b2172d",
    measurementId: "G-K8QBZWLLRH",
  };

  // Initialize Firebase
  var app = firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore(app);
} catch (e) {
  console.log(e);
}

chrome.action.onClicked.addListener((tab) => {
  chrome.storage.sync.get(["defaultDownloadFormat"]).then((result) => {
    const downloadFormat = result.defaultDownloadFormat
      ? result.defaultDownloadFormat
      : "xlsx";
    downThisSheet(tab.url, downloadFormat);
  });
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

function isGSheetDocumentURL(url) {
  // Match if the url begin with https://docs.google.com/spreadsheets/d/
  const regex = /^https:\/\/docs.google.com\/spreadsheets\/d\//;
  return url.match(regex) !== null;
}

function recordDownload() {
  db.collection("downloads")
    .add({
      lang: navigator.language,
      userAgent: navigator.userAgent,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      error: false,
    })
    .catch((error) => {
      db.collection("downloads").add({
        error: error,
      });
    });
}

function downThisSheet(url, format = "xlsx") {
  const downloadUrl = url.replace(
    "/edit#gid=",
    `/export?format=${format}&gid=`
  );
  chrome.tabs.create({ url: downloadUrl, active: false });
  recordDownload();
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
