const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

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
    if (field.instance === 'ObjectId' && field.options.ref) {
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
fs.writeFileSync('erd.puml', plantUmlCode);

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, '..', 'public', 'diagrams');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate a text file with instructions for using online PlantUML services
const instructionsPath = path.join(outputDir, 'erd-instructions.txt');
const instructions = `
PlantUML ERD Generation Instructions
=================================

The PlantUML code has been generated and saved as 'erd.puml' in the backend directory.

To generate the ERD diagram image, please use one of the following online PlantUML services:

1. PlantText: https://www.planttext.com/
2. PlantUML Online Server: https://www.plantuml.com/plantuml/

Instructions:
1. Copy the contents of the 'erd.puml' file
2. Paste it into the online editor of your chosen service
3. The diagram will be generated automatically
4. Download the generated image
5. Save it to the 'backend/public/diagrams' directory as 'erd.png'

Alternatively, if you want to use PlantUML locally:
1. Ensure Java is installed on your system
2. Download the PlantUML jar from https://plantuml.com/download
3. Run: java -jar plantuml.jar erd.puml

Note: The error you encountered was likely due to Java not being properly installed or configured.
The PlantUML library requires Java to generate diagrams.
`;

fs.writeFileSync(instructionsPath, instructions);

// Generate a URL for online PlantUML service with the encoded diagram
const plantUmlOnlineUrl = 'https://www.plantuml.com/plantuml/uml/';

// Simple encoding function (not the full PlantUML encoding, just for demonstration)
function encodeForUrl(text) {
  return Buffer.from(text).toString('base64');
}

const encodedDiagram = encodeForUrl(plantUmlCode);
const onlineUrl = `${plantUmlOnlineUrl}${encodedDiagram}`;

const urlFilePath = path.join(outputDir, 'erd-online-url.txt');
fs.writeFileSync(urlFilePath, `You can view your diagram online at:\n${onlineUrl}\n\nNote: This URL might not work directly due to simplified encoding. Please use the manual method described in the instructions file.`);

console.log('ERD PlantUML code generation completed successfully!');
console.log(`PlantUML code saved as: ${path.resolve('erd.puml')}`);
console.log(`Instructions saved as: ${path.resolve(instructionsPath)}`);
console.log(`\nTo generate the ERD diagram image:`);
console.log('1. Use an online PlantUML service:');
console.log('   - Visit https://www.planttext.com/ or https://plantuml.com/plantuml/');
console.log('   - Copy the contents of erd.puml and paste it into the online editor');
console.log('   - Download the generated image');
console.log('\nAlternatively, if you have Java installed:');
console.log('1. Download the PlantUML jar from https://plantuml.com/download');
console.log('2. Run: java -jar plantuml.jar erd.puml');