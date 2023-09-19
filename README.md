# Folder parser `LITSER`

`Clear file dist\db\db.json — Write an empty array in it: []`

Presets have the following format
```json5
[
    {
        "ID_PRESET": {       // Generated when added from an application
            "name": "PRESET_NAME", 
            "pathFrom": "",  // Folder with files for operations on them
            "pathTo": "",    // Folder where files will be transferred and copied to
            "typeFiles": "", // File types that must be present in the list
            "sizeFiles": "", // File size in kilobytes
            "wordLeft": "",  // Search for a word in the file name on the left
            "wordRight": "", // Search for a word in the file name on the right
            "changed": "",
            "remember": []   // The name of the files that should be mandatory in the list, 
                             // this is "favorites"
        }
    },
    { "IP_PRESET": {...} }
    ...
]
```

Clone the repository in a suitable folder
```bash
git clone https://github.com/TheWitcher1991/litser.git
```
Then download the nodejs packages
```bash
npm i
````

Run the application in development mode
```bash
npm run watch
npm run start 
```

Build for window
```bash
npm run package:win
```

Build for linux
```bash
npm run package:linux
```