# Google Sheets Conversion Methods

Converting view-only Google Sheets can be tricky depending on the permissions set by the owner.

## Method 1: Print to PDF

Often, even if "Download" is disabled, "Print" might still be available.

1.  Open the Google Sheet.
2.  Press `Ctrl + P` (Windows) or `Cmd + P` (Mac).
3.  In the print preview window, look for "Destination" or "Printer".
4.  Select **Save as PDF**.
5.  Click **Save**.

## Method 2: HTML View (The "htmlview" Trick)

If printing is disabled, you can try accessing the mobile/html version.

1.  Look at the URL of the spreadsheet. It usually ends with `/edit#gid=0`.
2.  Replace `/edit...` with `/htmlview`.
    *   Example: `https://docs.google.com/spreadsheets/d/KEY/htmlview`
3.  Press **Enter**.
4.  The sheet will load in a simplified HTML format.
5.  Select all content (`Ctrl + A`) and Copy (`Ctrl + C`).
6.  Paste into Microsoft Excel or a new Google Sheet that you own.
7.  Save/Download as PDF from there.

## Method 3: CSV Export Script

For complex sheets, you can try to export data using a script.

1.  Open the sheet.
2.  Open Developer Tools (`F12`) -> Console.
3.  Paste the following code:

```javascript
var sheets = document.querySelectorAll('.docs-sheet-tab');
sheets.forEach(function(sheet, index) {
    var sheetId = sheet.getAttribute('id');
    var url = window.location.href.split('/edit')[0] + '/export?format=csv&gid=' + sheetId;
    var a = document.createElement('a');
    a.href = url;
    a.download = 'sheet_' + index + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});
```

4.  Press **Enter**. This attempts to trigger a CSV download for each tab.
