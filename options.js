const defaultDownloadFormatEl = document.querySelector(
  ".default-download-format"
);

defaultDownloadFormatEl.addEventListener("change", (event) => {
  chrome.storage.sync.set({ defaultDownloadFormat: event.target.value });
});

chrome.storage.sync.get(["defaultDownloadFormat"], (result) => {
  document.querySelector(
    `#option-default-format-${result.defaultDownloadFormat}`
  ).selected = "selected";
});
