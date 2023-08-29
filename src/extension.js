// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // console.log('Congratulations, your extension "QuoteWithMarker" is now active!');

    // This function quotes the selected area and adds a custom marker to it.
    initQuoteWithMarker(context);

    // // This is to get all LanguageIDs and their lineComment characters.
    // for (const extension of vscode.extensions.all) {
    //     const packageJSON = extension.packageJSON;
    //     if (packageJSON.contributes && packageJSON.contributes.languages) {
    //         for (const language of packageJSON.contributes.languages) {
    //             if (language.configuration) {
    //                 const configPath = path.join(extension.extensionPath, language.configuration);
    //                 const content = fs.readFileSync(configPath, { encoding: 'utf8' });
    //                 const config = JSON.parse(content);
    //                 console.log('language.id: ' + language.id);
    //                 console.log('language.aliases: ' + language.aliases[0]);
    //                 console.log('lineComment: ' + config.comments.lineComment);
    //                 console.log('blockComment: ' + config.comments.blockComment);
    //             }
    //         }
    //     }
    // }
}

function initQuoteWithMarker(context) {

    const quoteWithMarkerId = 'quoteWithMarker';
    context.subscriptions.push(vscode.commands.registerCommand(quoteWithMarkerId, () => {

        let activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) return; // No open text editor.

        // Get current selection.
        let selection = activeEditor.selection;

        // Select current line if nothing is selected.
        if (selection.isEmpty == true) {
            activeEditor.selection = new vscode.Selection(selection.active.line, 0 ,selection.active.line, 99)
            selection = activeEditor.selection;
        }

        let text = activeEditor.document.getText(selection) || '';
        let config = vscode.workspace.getConfiguration('quoteWithMarker');

        let quoteCharStart = '',
            quoteCharEnd = '',
            quoteCharStartOrigin = '',
            quoteCharBlockStart = '',
            isBlockComment = 0,
            codeMarkerReplace,
            codeMarker = config.codeMarker || 'MyMarker',
            lineComment = config.lineComment || {},
            languageId = activeEditor.document.languageId;

        let currentTime = new Date();

        // Returns the month (from 0 to 11).
        let month = currentTime.getMonth() + 1;

        // Returns the day of the month (from 1 to 31).
        let day = currentTime.getDate();

        // Returns the year (four digits).
        let year = currentTime.getFullYear();

        if (month.toString().length <= 1){
            month = month.toString().padStart(2, '0')
        }
        if (day.toString().length <= 1){
            day = day.toString().padStart(2, '0')
        }

        codeMarker = codeMarker.replace(/\${year}/g, year);
        codeMarker = codeMarker.replace(/\${month}/g, month);
        codeMarker = codeMarker.replace(/\${day}/g, day);

        // Get quoteCharStart from config.
        if (lineComment[languageId] && lineComment[languageId].length){
            quoteCharStart = lineComment[languageId];
        }

        // If no quoteCharStart is set, try to use the default value of lineComment of the current language config.
        if (quoteCharStart.length === 0 && languageId || quoteCharStart === 'undefined'){
            let extensions    = vscode.extensions.all;
            let languagesData = extensions.filter((extension) => extension.packageJSON.name === languageId);

            let languageExtensionPath = languagesData[0].extensionPath;
            let languageConfiguration = languagesData[0].packageJSON.contributes.languages[0].configuration;

            const configPath = path.join(languageExtensionPath, languageConfiguration);
            const content = fs.readFileSync(configPath, { encoding: 'utf8' });

            try {
                const config = JSON.parse(content);
                if (config.comments.lineComment){
                    quoteCharStart = config.comments.lineComment;
                }
                else if (config.comments.blockComment){
                    isBlockComment = 1;
                    quoteCharStart      = config.comments.blockComment[0];
                    quoteCharEnd        = ' ' + config.comments.blockComment[1];
                    quoteCharBlockStart = ' ' + config.comments.blockComment[0].substring(1);
                }

            } catch (error) {
                console.log(error);
            }
        }

        if (!quoteCharStart) return;

        let lineLength = 0;
        text.split(/\r?\n/).forEach(line => {
            if (line.toString().length > lineLength){
                lineLength = line.toString().length;
            }
        })

        codeMarkerReplace = `${quoteCharStart} ---${quoteCharEnd}\n`;
        codeMarkerReplace += `${quoteCharStart} ${codeMarker}${quoteCharEnd}\n`;
        codeMarkerReplace += `${quoteCharStart} ---${quoteCharEnd}\n`;

        if (isBlockComment) {
            codeMarkerReplace += `${quoteCharStart}\n`;
            quoteCharStartOrigin = quoteCharStart;
            quoteCharStart = quoteCharBlockStart;
        }

        // Add QuoteCharStart to every single line.
        text.split(/\r?\n/).forEach(line => {
            codeMarkerReplace += `${quoteCharStart} ${line}\n`;
        })

        if (isBlockComment) {
            codeMarkerReplace += `${quoteCharEnd}\n`;
            quoteCharStart = quoteCharStartOrigin;
        }

        codeMarkerReplace += `\n${text}`;
        codeMarkerReplace += `\n\n${quoteCharStart} ---${quoteCharEnd}\n`;
        text.replace(text, codeMarkerReplace);

        // Replace the selection in the editor with CodeMarker.
        if (selection.isEmpty == false) {
            activeEditor.edit(editBuilder => {
                editBuilder.replace(selection, codeMarkerReplace);
            });
        }

        // Add CodeMarker to current position if nothing is selected and could also not be selected.
        else {
            activeEditor.edit(editBuilder => {
                editBuilder.insert(activeEditor.selection.active, codeMarkerReplace);
            });
        }
    }))
}

// This method is called when your extension is deactivated.
function deactivate() { }

module.exports = {
    activate,
    deactivate
}
