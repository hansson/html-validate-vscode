# html-validate

## Features

Run [html-validate](https://html-validate.org/) on your open html-files. Will read rules from `.htmlvalidate.json` if it is present in the root of your workspace. If `.htmlvalidate.json` is missing then the default rules for html-validate will be used.

## Extension Settings

This extension contributes the following settings:

* `html-validate.runOnEdit`: Run html-valide while you are editing a document. If set to false html-validate will only when a document is opened or saved.
* `html-validate.rulesPath`: Path to rules file, relative to workspace or absolute. The name of the file needs to be .htmlvalidate.json. If not set the plugin will search form the current file to the root to find a .htmlvalidate.json file.

## Known Issues
https://github.com/hansson/html-validate-vscode/issues