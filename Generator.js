const inquirer = require('inquirer');
const qr = require('qr-image');
const fs = require('fs');
const path = require('path')
const os = require('os');
const { exec } = require('child_process');

const downloadsDirectory = path.join(os.homedir(), 'Downloads');

inquirer.prompt([
    {
        message: "Type in the data of the information you want QR'ed",
        name: "URL"
    },
    {
        message: "Enter the name of the output file (without extension)",
        name: "fileName"
    }
]).then(answers => {
    const { URL, fileName } = answers;
    const qr_svg = qr.imageSync(URL, { type: 'png' }); // Generate QR code as PNG buffer

    const qrDataURL = 'data:image/png;base64,' + qr_svg.toString('base64'); // Convert PNG buffer to data URI

    // Run curl command to download the QR code image
    const command = `curl --output "${path.join(downloadsDirectory, fileName)}.png" ${qrDataURL}`;

    console.log('Executing command:', command);
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('Error:', error);
            return;
        }
        console.log('QR code downloaded successfully!');
        console.log('stdout:', stdout);
        console.error('stderr:', stderr);
    });

    // Optionally, you can save the URL to a text file
    fs.writeFile("URL.txt", URL, err => {
        if (err) throw err;
        console.log("The file has been saved!");
    });
}).catch(error => {
    if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
    } else {
        // Something else went wrong
    }
});
