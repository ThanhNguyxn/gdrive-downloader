# Google Slides Conversion Methods

## Method 1: Print to PDF (Best Quality)

1.  Open the presentation.
2.  Press `Ctrl + P` (Windows) or `Cmd + P` (Mac).
3.  In the print dialog, choose **Save as PDF**.
4.  **Layout Options**:
    *   Choose **Landscape** for full-screen slides.
    *   You can also choose to print multiple slides per page if you want handouts.

## Method 2: Image Extraction Script

If printing is disabled, you can extract slides as images.

1.  Open the presentation.
2.  Wait for all slides to load (scroll through them).
3.  Open Developer Tools (`F12`) -> Console.
4.  Paste the code from `image_extractor.js` (or the snippet below specifically for slides):

```javascript
(function() {
    var slides = document.querySelectorAll('.punch-viewer-slide-img');
    slides.forEach(function(slide, index) {
        var img = slide.src;
        var a = document.createElement('a');
        a.href = img;
        a.download = 'slide_' + (index + 1) + '.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
})();
```

5.  Press **Enter**.
6.  Slides will download as individual PNG images.
7.  You can combine these images into a PDF using any online tool or software (like Adobe Acrobat or Preview on Mac).
