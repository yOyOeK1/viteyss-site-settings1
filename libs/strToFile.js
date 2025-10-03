function downloadStringAsFile(content, filename, mimeType = 'text/plain') {
  // Create a Blob object from the string content
  const blob = new Blob([content], { type: mimeType });

  // Create an object URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create a temporary <a> element
  const a = document.createElement('a');

  // Set the download attribute with the desired filename
  a.setAttribute('download', filename);

  // Set the href attribute to the object URL
  a.setAttribute('href', url);

  // Append the <a> element to the document body (optional, but ensures it's in the DOM)
  document.body.appendChild(a);

  // Programmatically click the <a> element to trigger the download
  a.click();

  // Clean up: remove the <a> element and revoke the object URL
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export { downloadStringAsFile }