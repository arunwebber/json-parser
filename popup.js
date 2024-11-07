let rawJsonData = null;  // Variable to store the raw JSON data

// Format Button Click Event
document.getElementById("formatButton").addEventListener("click", () => {
    console.log("Format Button Clicked");

    const input = document.getElementById("jsonInput").value;
    const output = document.getElementById("jsonOutput");

    try {
        console.log("Parsing input JSON...");

        // Parse the input JSON and store the raw data
        const parsedJson = JSON.parse(input);
        rawJsonData = parsedJson; // Store the parsed data

        console.log("Parsed JSON successfully:", parsedJson);

        // Generate and display the formatted JSON markup
        output.innerHTML = generateJsonMarkup(parsedJson); 
        output.style.color = "black"; 

        // Event delegation for expand/collapse buttons
        output.addEventListener('click', function(event) {
            if (event.target.classList.contains('expand-collapse-btn')) {
                toggleCollapse(event);
            }
        });

    } catch (error) {
        console.error("Error parsing JSON:", error);
        output.textContent = "Invalid JSON! Please check your input.";
        output.style.color = "red"; // Display error message in red
    }
});

// Generate HTML structure for JSON with expand/collapse functionality
function generateJsonMarkup(obj, indent = 0) {
    console.log("Generating JSON markup...");

    let markup = '';
    const padding = ' '.repeat(indent);

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            markup += `<div style="margin-left:${indent}px;" class="json-node">`;

            if (typeof value === 'object' && value !== null) {
                // If object, create collapsible node
                markup += `<span class="expand-collapse-btn">+</span>`;
                markup += `"${key}": {</div>`;
                markup += `<div class="collapsed" style="margin-left:${indent + 20}px;">`;
                markup += generateJsonMarkup(value, indent + 20);
                markup += `</div>`;
            } else {
                // If primitive, show the key and value
                markup += `"${key}": "${value}",</div>`;
            }
        }
    }

    console.log("Generated markup:", markup);
    return markup;
}

// Toggle collapse/expand functionality
function toggleCollapse(event) {
    console.log("Toggle Collapse Clicked");

    const button = event.target;
    console.log("Button clicked:", button);

    // Get the next sibling element (the container for the nested object)
    const nextElement = button.parentNode.nextElementSibling;
    console.log("Next element to toggle:", nextElement);

    // Check if nextElement exists and if it has the 'collapsed' class
    if (nextElement && nextElement.classList.contains('collapsed')) {
        console.log("Toggling collapse/expand for:", nextElement);
        
        // Toggle the visibility of the next sibling
        nextElement.classList.remove('collapsed'); // Remove the 'collapsed' class to expand
        button.textContent = '-'; // Change button to '-' when expanded
    } else if (nextElement) {
        console.log("Collapsing:", nextElement);
        
        // If already expanded, collapse it
        nextElement.classList.add('collapsed'); // Add the 'collapsed' class to collapse
        button.textContent = '+'; // Change button to '+' when collapsed
    }
}


// Copy JSON to clipboard
document.getElementById("copyJsonButton").addEventListener("click", () => {
    if (rawJsonData) {
        // Convert the raw JSON data back to a string
        const jsonString = JSON.stringify(rawJsonData, null, 2); // Prettify with 2-space indentation

        // Use the Clipboard API to copy the stringified JSON
        navigator.clipboard.writeText(jsonString)
            .then(() => {
                console.log("JSON copied to clipboard!");
                alert("JSON copied to clipboard!"); // Optional: show a success message
            })
            .catch(err => {
                console.error("Error copying JSON to clipboard:", err);
                alert("Failed to copy JSON.");
            });
    } else {
        alert("No JSON to copy.");
    }
});

// Character count and cursor position tracking
const textArea = document.getElementById('jsonInput');
const statusBar = document.getElementById('statusBar');

textArea.addEventListener('input', updateStatus);
textArea.addEventListener('keyup', updateStatus);
textArea.addEventListener('click', updateStatus);

function updateStatus() {
    const text = textArea.value;
    const charCount = text.length;

    const { line, col } = getCursorPosition(textArea);

    console.log("Updating status: Characters:", charCount, "Line:", line, "Column:", col);

    // Update the status bar with character count and cursor position
    statusBar.textContent = `Characters: ${charCount} | Position: Line ${line}, Col ${col}`;
}

function getCursorPosition(textarea) {
    const text = textarea.value;
    const cursorIndex = textarea.selectionStart;

    const lines = text.substr(0, cursorIndex).split("\n");
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1; // +1 because columns are 1-indexed

    console.log("Cursor Position - Line:", line, "Column:", col);
    return { line, col };
}

// Initial status update
updateStatus();
