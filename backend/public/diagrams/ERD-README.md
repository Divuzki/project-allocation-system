
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
