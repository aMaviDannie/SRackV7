**My Electron Project**

This is a project built with Electron for managing stencil rack to be used for a production area: named as a 'slots' at the program.

**Installation**

**Prerequisites**

- Node.js & npm: Make sure you have Node.js and npm installed. You can download them from [here](https://nodejs.org/).

**Clone the Repository**

Clone this repository to your local machine:

git clone https://github.com/aMaviDannie/SRackV8

cd your-repository 

**Install the Dependencies**

npm install

**Usage**

**Starting the Application**

To start the application, run:
npm run build

**Adding a Project**
To add a new project to a slot, click on the "Add Project" button. Enter the project name in the prompt and click "OK". If you want to cancel, click "Cancel".

**Deleting the Last Project**
To delete the last project added to a slot, click on the "Delete Last Project" button.

**Clearing a Project Slot**
To clear a project slot completely (including the project name and status), click on the "Clear Project Slot" button.

**Toggling the Status of a Project**
To toggle the status of a project slot between "In use" and "Not in use", click on the "Toggle Use" button.

**Searching for Projects**
To search for a project by name, enter the project name in the search input field and click the "Search" button. The matching project slots will be highlighted.

**Viewing Slot Information**
Each project slot displays the project name, status, status change time, and slot number. The status change time is updated whenever the status of a project is toggled.

**Managing Project Status**
In use: Indicates that the project slot is currently in use.
Not in use: Indicates that the project slot is available for use.
Summary Display
The top-right corner of the application displays the following information:

Total slot count
Empty slot count
Full and in-use slot count
Full and not in-use slot count

**Building the Application**
To build the application for distribution, run:
npm run build
