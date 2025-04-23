function loadSvgFile(filePath) {
    fetch("svg/" + filePath)
        .then(response => response.text())
        .then(svgContent => {
            document.getElementById('svgContainer').innerHTML = svgContent;
            applyColors(); // Apply the colors to the new image
        })
        .catch(error => {
            console.error('Error fetching SVG file:', error);
        });
}

// Function to download the selected SVG
function downloadSelectedSvg() {
    var svg = document.getElementById('svgContainer').innerHTML;
    var blob = new Blob([svg], {
        type: 'image/svg+xml'
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    
    // Get the selected SVG name from localStorage for the download filename
    var selectedName = localStorage.getItem('selectedSvgName') || 'Power BI Background';
    // Convert the name to a file-friendly format
    var fileName = selectedName.replace(/\s+/g, '-').toLowerCase();
    
    a.download = fileName + '.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up the URL object
}

fetch('images.txt')
    .then(response => response.text())
    .then(text => {
        const images = text.split('\n').filter(image => image.trim() !== '');
        const fetchPromises = images.map(image =>
            fetch(`svg/${image}`).then(response => response.text())
        );

        Promise.all(fetchPromises)
            .then(svgContents => {
                var imageGrid = document.getElementById('image-grid');
                var row = document.createElement('div');
                row.className = 'row';
                imageGrid.appendChild(row);

                svgContents.forEach((svgContent, index) => {
                    var imgContainer = document.createElement('div');
                    imgContainer.className = 'svg-preview col-sm-6 col-md-6 col-lg-4';
                    
                    // Create a title wrapper for flexible layout
                    var titleWrapper = document.createElement('div');
                    titleWrapper.className = 'title-wrapper';
                    
                    // Create a title element for the SVG
                    var titleElement = document.createElement('div');
                    titleElement.className = 'svg-title';
                    
                    // Format the filename for display
                    var fileName = images[index];
                    var displayName = fileName.replace('.svg', '').replace(/-/g, ' ').replace(/_/g, ' ');
                    // Capitalize the first letter of each word
                    displayName = displayName.split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ');
                    
                    titleElement.textContent = displayName;
                    
                    // Create download button (initially hidden)
                    var downloadButton = document.createElement('button');
                    downloadButton.className = 'download-button';
                    downloadButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>';
                    downloadButton.title = "Download this background";
                    downloadButton.style.display = 'none'; // Initially hidden
                    
                    downloadButton.addEventListener('click', function(event) {
                        event.stopPropagation(); // Prevent triggering SVG selection
                        downloadSelectedSvg();
                    });
                    
                    // Add the title and download button to the wrapper
                    titleWrapper.appendChild(titleElement);
                    titleWrapper.appendChild(downloadButton);
                    
                    // Add the title wrapper to the container
                    imgContainer.appendChild(titleWrapper);
                    
                    // Now add the SVG content
                    var svgWrapper = document.createElement('div');
                    svgWrapper.className = 'svg-wrapper';
                    svgWrapper.innerHTML = svgContent;
                    imgContainer.appendChild(svgWrapper);

                    var svgElement = svgWrapper.querySelector('svg');
                    if (svgElement) {
                        svgElement.classList.add('img-fluid', 'pointer');
                        svgElement.onclick = () => {
                            // Remove selection and hide all download buttons
                            let svgs = document.querySelectorAll('.svg-preview svg');
                            svgs.forEach(svg => {
                                svg.classList.remove('selected');
                                // Find the associated download button and hide it
                                let container = svg.closest('.svg-preview');
                                if (container) {
                                    let btn = container.querySelector('.download-button');
                                    if (btn) btn.style.display = 'none';
                                }
                            });
                            
                            // Add selection to current SVG
                            svgElement.classList.add('selected');
                            
                            // Show download button for this SVG
                            downloadButton.style.display = 'inline-flex';
                            
                            let svgContainer = document.getElementById('svgContainer');
                            svgContainer.innerHTML = svgContent;

                            let svg = svgContainer.querySelector('svg');
                            if (!svg.querySelector('style')) {
                                var styleTag = document.createElement('style');
                                styleTag.innerHTML = ``; // Add necessary CSS here
                                svg.insertBefore(styleTag, svg.firstChild);
                            }

                            applyColors(); // Call a function to reapply colors or perform other tasks
                            
                            // Store the selected SVG name for download
                            localStorage.setItem('selectedSvgName', displayName);
                        };
                    }

                    row.appendChild(imgContainer);

                    if (index === 0) {
                        // Trigger click on the first SVG to select it
                        setTimeout(() => {
                            if (svgElement) {
                                svgElement.click();
                            }
                        }, 100);
                        
                        loadSvgFile(images[index]); // Load the first SVG file
                        // Store the first SVG name as default selected
                        localStorage.setItem('selectedSvgName', displayName);
                    }
                });
            })
            .catch(error => {
                console.error('Error processing SVGs:', error);
            });
    })
    .catch(error => {
        console.error('Error fetching images list:', error);
    });


let applyColors = () => {
    var primaryColor = document.getElementById('primary-color').value;
    var secondaryColor = document.getElementById('secondary-color').value;
    var backgroundColor = document.getElementById('background-color').value;
    var frameColor = document.getElementById('frame-color').value;

    // Define a global style for SVG color customization
    var svgStyleContent = `
            svg .primary { fill: ${primaryColor}; }
            svg .secondary { fill: ${secondaryColor}; }
            svg .primary-stroke { stroke: ${primaryColor}; }
            svg .secondary-stroke { stroke: ${secondaryColor}; }
            svg .background { fill: ${backgroundColor}; }
            svg .frame { fill: ${frameColor}; }
        `;

    // Get all the <style> tags on the page
    var styleTags = document.getElementsByTagName('style');

    // Apply the svgStyleContent to each <style> tag
    for (var i = 0; i < styleTags.length; i++) {
        styleTags[i].innerHTML = svgStyleContent;
    }
};


applyColors();

document.getElementById('primary-color').addEventListener('input', applyColors);
document.getElementById('secondary-color').addEventListener('input', applyColors);
document.getElementById('background-color').addEventListener('input', applyColors);
document.getElementById('frame-color').addEventListener('input', applyColors);