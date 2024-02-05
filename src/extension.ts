// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context: vscode.ExtensionContext) {

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

    //                 console.log('extension.extensionPath: ' + extension.extensionPath);
    //                 console.log('language.configuration: ' + language.configuration);

    //                 let uri = vscode.Uri.file(extension.extensionPath);
    //                 let configUri = vscode.Uri.joinPath(uri, language.configuration);
    //                 readFile(configUri).then((content: any) => {
    //                     let config = JSON.parse(content);
    //                     console.log('language.id: ' + language.id);
    //                     console.log('language.aliases: ' + language.aliases[0]);
    //                     console.log('lineComment: ' + config['comments']['lineComment']);
    //                     console.log('blockComment: ' + config['comments']['blockComment']);
    //                 });
    //             }
    //         }
    //     }
    // }
}

async function readFile(fileUri: vscode.Uri) {
    const fileData = await vscode.workspace.fs.readFile(fileUri);
    return fileData;
}

function initQuoteWithMarker(context: vscode.ExtensionContext) {

    const quoteWithMarkerId = 'quoteWithMarker';
    context.subscriptions.push(vscode.commands.registerCommand(quoteWithMarkerId, async() => {

        let activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {return;} // No open text editor.

        // Get current selection.
        let selection = activeEditor.selection;

        // Select current line if nothing is selected.
        if (selection.isEmpty === true) {
            activeEditor.selection = new vscode.Selection(selection.active.line, 0 ,selection.active.line, 99);
            selection = activeEditor.selection;
        }

        let text = activeEditor.document.getText(selection) || '';
        let config = vscode.workspace.getConfiguration('quoteWithMarker');

        let quoteCharStart: string = '',
            quoteCharEnd: string = '',
            quoteCharStartOrigin: string = '',
            quoteCharBlockStart: string = '',
            isBlockComment: number = 0,
            codeMarkerReplace: string = '', // Explicitly declare the type of codeMarkerReplace as string
            codeMarker: string = config.codeMarker || 'MyMarker',
            lineComment: string = config.lineComment || {},
            languageId: string = activeEditor.document.languageId;

        let currentTime = new Date();

        // Returns the month (from 0 to 11).
        let month: string = (currentTime.getMonth() + 1).toString();

        // Returns the day of the month (from 1 to 31).
        let day: string  = currentTime.getDate().toString();

        // Returns the year (four digits).
        let year: string  = currentTime.getFullYear().toString();

        if (month.length <= 1){
            month = month.padStart(2, '0');
        }
        if (day.length <= 1){
            day = day.padStart(2, '0');
        }

        codeMarker = codeMarker.replace(/\${year}/g, year);
        codeMarker = codeMarker.replace(/\${month}/g, month);
        codeMarker = codeMarker.replace(/\${day}/g, day);

        // Get quoteCharStart from config.
        if (typeof lineComment === 'object' && typeof lineComment[languageId as keyof typeof lineComment] === 'string') {
            quoteCharStart = lineComment[languageId as keyof typeof lineComment];
        }

        if (vscode.env.uiKind === vscode.UIKind.Web && quoteCharStart.length === 0) {
            vscode.window.showErrorMessage(`QuoteWithMarker: I could not find any comment characters for the Language ID '${languageId}' in the browser editor. However, you can manually add a comment character for the Language ID '${languageId}' in the settings: quoteWithMarker.lineComment`);
        }

        // If no quoteCharStart is set, try to use the default value of lineComment of the current language config.
        if (quoteCharStart.length === 0 && languageId || quoteCharStart === 'undefined'){
            let extensions    = vscode.extensions.all;
            let languagesData = extensions.filter((extension) => extension.packageJSON.name === languageId);

            if (languagesData.length === 0) {return;}

            let languageExtensionPath = languagesData[0].extensionPath;
            let languageConfiguration = languagesData[0].packageJSON.contributes.languages[0].configuration;

            let uri = vscode.Uri.file(languageExtensionPath);

            let configUri = vscode.Uri.joinPath(uri, languageConfiguration);
            const content = await vscode.workspace.fs.readFile(configUri);

            try {
                const config = JSON.parse(content.toString());
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

        if (!quoteCharStart) {return;}

        let lineLength = 0;
        text.split(/\r?\n/).forEach(line => {
            if (line.toString().length > lineLength){
                lineLength = line.toString().length;
            }
        });

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
        });

        if (isBlockComment) {
            codeMarkerReplace += `${quoteCharEnd}\n`;
            quoteCharStart = quoteCharStartOrigin;
        }

        codeMarkerReplace += `\n${text}`;
        codeMarkerReplace += `\n\n${quoteCharStart} ---${quoteCharEnd}\n`;
        text.replace(text, codeMarkerReplace);

        if (activeEditor) {

            // Replace the selection in the editor with CodeMarker.
            if (selection.isEmpty === false) {
                activeEditor.edit(editBuilder => {
                    editBuilder.replace(selection, codeMarkerReplace);
                });
            } else {
                activeEditor.edit(editBuilder => {
                    if (activeEditor) {
                        editBuilder.insert(activeEditor.selection.active, codeMarkerReplace);
                    }
                });
            }
        }
    }));
}

// This method is called when your extension is deactivated.
export function deactivate() { }


