let dataset = []; // This will hold the character data from the file
let svg; // Define svg globally

// Function to fetch the content of the graphics.txt file
async function fetchGraphicsData() {
    try {
        const response = await fetch('graphics.txt');
        const data = await response.text();
        return data.split('\n');
    } catch (error) {
        console.error('Error fetching graphics data:', error);
        return [];
    }
}

// Load the graphics data when the page loads
window.onload = async function () {
    try {
        const rawDataset = await fetchGraphicsData();

        // Convert each line of data into a JSON object and store it in the dataset array
        dataset = rawDataset.map((line, index) => {
            try {
                return JSON.parse(line);
            } catch (error) {
                console.error(`Error parsing JSON at line ${index + 1}:`, error);
                return null; // or handle the error as needed
            }
        }).filter(item => item !== null); // Remove any null entries caused by parsing errors

        console.log('Dataset:', dataset); // Log the parsed dataset
    } catch (error) {
        console.error('Error fetching or parsing graphics data:', error);
    }
};

function findCharacter() {
    const input = document.getElementById('characterInput').value.trim();
    const characterDisplay = document.getElementById('characterDisplay');
    const svgDisplay = document.getElementById('svgDisplay');

    console.log('Input:', input); // Log the input value

    // Find character in the dataset
    const foundCharacter = dataset.find(item => item.character === input);

    if (foundCharacter) {
        // Display the character
        characterDisplay.innerText = `Character: ${foundCharacter.character}`;

        const svg = d3.select('#characterCanvas');
        const strokes = foundCharacter.strokes;
        const colors = ['red', 'green', 'blue']; // Different colors for each stroke

// Function to flip the strokes vertically
function flipStrokesVertically() {
    svg.attr("transform", `scale(1, -1)`);
}

// Function to flip the SVG vertically
function flipVertically() {
    const height = document.getElementById("characterCanvas").getBoundingClientRect().height;
    svg.transition().attr("transform", `scale(1, -1) translate(0, -${height})`);
}

// Draw the strokes with fill
strokes.forEach(function (path, index) {
    console.log(`Drawing stroke ${index}`); // Log to check the stroke drawing sequence
    svg.append('path')
        .attr('d', path)
        .attr('fill', colors[index % colors.length]) // No fill for strokes
        .attr('stroke', 'black')
        .attr('stroke-width', '10')
        .attr('opacity', 0)
        .attr('stroke-dasharray', function () {
            return this.getTotalLength();
        })
        .attr('stroke-dashoffset', function () {
            return this.getTotalLength();
        })
        .transition()
        .attr('opacity', 1)
        .delay(index * 1000) // Delay for each stroke
        .duration(1000) // Duration for the stroke to appear
        .attr('stroke-dashoffset', 0) // Show the stroke by reducing the dash offset
        .on('start', function () {
            if (index === 0) {
                // Flip strokes at the beginning
                flipStrokesVertically();
            }
        })
        .on('end', function () {
            // For the last stroke, flip the SVG vertically
            if (index === strokes.length - 1) {
                flipVertically();
            }
        });
});
    } else {
        console.log('Character not found.');
        characterDisplay.innerText = 'Character not found.';
        svgDisplay.innerHTML = '';
    }
}
