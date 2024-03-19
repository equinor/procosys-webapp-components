This library exists to share visual components as well as entire modules between the Procosys MC webapp, commissioning webapp and other Equinor solutions, such as Echo Infield.

These are the existing and planned modules:
* Attachments 
* MCCR checklists
* Tag OCR (pending major upgrade)
* CPCL checklists (planned)
* Punch (planned)
* Commissioning Action log (planned)
* Commissioning Tasks (not planned, but expected)

Most modules require your app, represented by an Azure App Registration, to have access to the relevant Procosys API. Please contact the Procosys team to obtain this access.

How to use this library:
* Run "yarn" in the root of this repo
* Run "yarn link"

To link to this library
* Run "yarn start"
* Run "yarn link @equinor/procosys-webapp-components" in the app you want to test the code in.

To unlink
* Run "yarn unlink @equinor/procosys-webapp-components" in the app you tested the code in.

For info on how to contribute and publish changes to the package, please check out the guide in the Procosys Wiki Frontend section.