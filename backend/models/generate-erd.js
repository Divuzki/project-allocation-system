const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const plantuml = require('node-plantuml');

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

// Generate PNG from PlantUML code
const outputPath = path.join(outputDir, 'erd.png');

try {
  // Generate the diagram using node-plantuml
  const gen = plantuml.generate(plantUmlCode, { format: 'png' });
  
  // Create write stream to save the diagram
  const outputStream = fs.createWriteStream(outputPath);
  
  // Pipe the generated diagram to the output file
  gen.out.pipe(outputStream);
  
  // Handle completion
  outputStream.on('finish', () => {
    console.log('ERD generation completed successfully!');
    console.log(`PlantUML code saved as: ${path.resolve('erd.puml')}`);
    console.log(`PNG diagram saved as: ${path.resolve(outputPath)}`);
    console.log('\nNote: If you encounter any errors related to Java, please ensure:');
    console.log('1. Java is installed on your system');
    console.log('2. JAVA_HOME environment variable is properly set');
  });
  
  // Handle errors
  gen.out.on('error', (err) => {
    console.error('Error generating diagram:', err.message);
    console.log('\nAlternative options to generate the ERD image:');
    console.log('1. Use an online PlantUML service:');
    console.log('   - Visit https://www.planttext.com/ or https://plantuml.com/plantuml/');
    console.log('   - Copy the contents of erd.puml and paste it into the online editor');
    console.log('   - Download the generated image');
  });
} catch (error) {
  console.error('Failed to generate diagram:', error.message);
  console.log('\nPlantUML code generated as erd.puml');
  console.log('To generate the ERD image manually, you can:');
  console.log('1. Ensure Java is installed on your system');
  console.log('2. Use an online PlantUML service:');
  console.log('   - Visit https://www.planttext.com/ or https://plantuml.com/plantuml/');
  console.log('   - Copy the contents of erd.puml and paste it into the online editor');
  console.log('   - Download the generated image');
}