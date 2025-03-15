const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Step 1: Require all model files to register them with Mongoose
// Adjust paths based on your project structure
require('./User');  // Example model file
require('./Project');  // Example model file
// Add other model files as needed

// Step 2: Get all registered Mongoose models
const models = mongoose.models;

// Step 3: Extract entities and relationships
const entities = {};
const relationships = [];

for (const modelName in models) {
  const schema = models[modelName].schema;

  // Extract fields (attributes) for the entity
  const fields = [];
  for (const path in schema.paths) {
    const field = schema.paths[path];
    let fieldType = field.instance;

    // Handle references (relationships)
    if (field.instance === 'ObjectID' && field.options.ref) {
      relationships.push({
        from: modelName,
        to: field.options.ref,
        field: path,
      });
    } else {
      fields.push({
        name: path === '_id' ? '* _id' : path, // Mark _id as primary key
        type: fieldType,
      });
    }
  }
  entities[modelName] = fields;
}

// Step 4: Generate PlantUML code
let plantUmlCode = '@startuml\n\n';

// Define entities
for (const entity in entities) {
  plantUmlCode += `entity "${entity}" {\n`;
  for (const field of entities[entity]) {
    plantUmlCode += `  ${field.name}: ${field.type}\n`;
  }
  plantUmlCode += '}\n\n';
}

// Define relationships
for (const rel of relationships) {
  plantUmlCode += `"${rel.from}" --> "${rel.to}" : ${rel.field}\n`;
}

plantUmlCode += '@enduml';

// Save PlantUML code to a file
fs.writeFileSync(path.join(__dirname, '..', 'erd.puml'), plantUmlCode);

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, '..', 'public', 'diagrams');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate a proper PlantUML encoded URL
function encodePlantUML(text) {
  // This is a simplified version of the PlantUML encoding algorithm
  // For production use, consider using a proper PlantUML encoding library
  return Buffer.from(text).toString('base64');
}

const encodedDiagram = encodePlantUML(plantUmlCode);
const plantUmlOnlineUrl = `https://www.plantuml.com/plantuml/png/${encodedDiagram}`;

// Create an HTML file that embeds the diagram
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Database ERD Diagram</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      line-height: 1.6;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
    }
    h1 {
      color: #333;
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
    }
    .diagram-container {
      margin: 20px 0;
      text-align: center;
    }
    .diagram-container img {
      max-width: 100%;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .code-container {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      margin: 20px 0;
    }
    pre {
      margin: 0;
      white-space: pre-wrap;
    }
    .instructions {
      background-color: #f9f9f9;
      padding: 15px;
      border-left: 4px solid #4CAF50;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Database ERD Diagram</h1>
    
    <div class="diagram-container">
      <h2>Entity Relationship Diagram</h2>
      <img src="${plantUmlOnlineUrl}" alt="ERD Diagram">
    </div>
    
    <div class="instructions">
      <h2>Viewing Instructions</h2>
      <p>This diagram is generated using PlantUML. If the image above doesn't load, you can:</p>
      <ol>
        <li>Visit <a href="${plantUmlOnlineUrl}" target="_blank">this direct link</a> to view the diagram</li>
        <li>Or visit <a href="https://www.planttext.com/" target="_blank">PlantText</a> and paste the PlantUML code below</li>
      </ol>
    </div>
    
    <div class="code-container">
      <h2>PlantUML Code</h2>
      <pre>${plantUmlCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
    </div>
  </div>
</body>
</html>
`;

// Save the HTML file
fs.writeFileSync(path.join(outputDir, 'erd-viewer.html'), htmlContent);

// Save the URL to a text file
fs.writeFileSync(
  path.join(outputDir, 'erd-online-url.txt'),
  `You can view your diagram online at:\n${plantUmlOnlineUrl}\n\nOr open the erd-viewer.html file in your browser for a better viewing experience.`
);

// Create a README file with instructions
const readmeContent = `
# ERD Diagram Generation

## Viewing the ERD Diagram

There are several ways to view the generated ERD diagram:

1. **Open the HTML viewer**: Navigate to the 'backend/public/diagrams/erd-viewer.html' file and open it in your web browser.

2. **Direct PlantUML URL**: Use the URL in the 'erd-online-url.txt' file to view the diagram online.

3. **Manual generation**: 
   - Visit https://www.planttext.com/ or https://www.plantuml.com/plantuml/
   - Copy the contents of the 'erd.puml' file from the backend directory
   - Paste it into the online editor
   - The diagram will be generated automatically
   - Download the generated image if needed

## Troubleshooting

If you're seeing Java errors instead of the diagram:

1. This script creates an HTML viewer that doesn't require Java to be installed on your system.
2. Open the 'erd-viewer.html' file in your browser to see the diagram.
3. If the image doesn't load in the HTML file, use one of the online PlantUML services mentioned above.

## Note

The PlantUML encoding used in this script is simplified. For more reliable results, consider using the manual method described above.
`;

fs.writeFileSync(path.join(outputDir, 'ERD-README.md'), readmeContent);

console.log('ERD generation completed successfully!');
console.log(`PlantUML code saved as: ${path.resolve(path.join(__dirname, '..', 'erd.puml'))}`);
console.log(`HTML viewer saved as: ${path.resolve(path.join(outputDir, 'erd-viewer.html'))}`);
console.log(`\nTo view the ERD diagram:`);
console.log('1. Open the HTML file in your browser: backend/public/diagrams/erd-viewer.html');
console.log(`2. Or use the online URL in: ${path.resolve(path.join(outputDir, 'erd-online-url.txt'))}`);