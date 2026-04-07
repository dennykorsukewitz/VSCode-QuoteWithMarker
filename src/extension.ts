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

type QuoteContext = {
    quoteCharStart: string;
    quoteCharEnd: string;
    quoteCharStartOrigin: string;
    quoteCharBlockStart: string;
    isBlockComment: number;
};

async function resolveQuoteCharacters(
    languageId: string,
    lineComment: Record<string, string>,
): Promise<QuoteContext | undefined> {
    let quoteCharStart = '';
    let quoteCharEnd = '';
    let quoteCharStartOrigin = '';
    let quoteCharBlockStart = '';
    let isBlockComment = 0;

    if (typeof lineComment[languageId] === 'string') {
        quoteCharStart = lineComment[languageId];
    }

    if (vscode.env.uiKind === vscode.UIKind.Web && quoteCharStart.length === 0) {
        vscode.window.showErrorMessage(`QuoteWithMarker: I could not find any comment characters for the Language ID '${languageId}' in the browser editor. However, you can manually add a comment character for the Language ID '${languageId}' in the settings: quoteWithMarker.lineComment`);
    }

    if (quoteCharStart.length === 0 && languageId || quoteCharStart === 'undefined') {
        let extensions    = vscode.extensions.all;
        let languagesData = extensions.filter((extension) => extension.packageJSON.name === languageId);

        if (languagesData.length === 0) {return undefined;}

        let languageExtensionPath = languagesData[0].extensionPath;
        let languageConfiguration = languagesData[0].packageJSON.contributes.languages[0].configuration;

        let uri = vscode.Uri.file(languageExtensionPath);

        let configUri = vscode.Uri.joinPath(uri, languageConfiguration);
        const content = await vscode.workspace.fs.readFile(configUri);

        try {
            const langConfig = JSON.parse(content.toString());
            if (langConfig.comments.lineComment){
                quoteCharStart = langConfig.comments.lineComment;
            }
            else if (langConfig.comments.blockComment){
                isBlockComment = 1;
                quoteCharStart      = langConfig.comments.blockComment[0];
                quoteCharEnd        = ' ' + langConfig.comments.blockComment[1];
                quoteCharBlockStart = ' ' + langConfig.comments.blockComment[0].substring(1);
            }

        } catch (error) {
            console.log(error);
        }
    }

    if (!quoteCharStart) {return undefined;}

    return {
        quoteCharStart,
        quoteCharEnd,
        quoteCharStartOrigin,
        quoteCharBlockStart,
        isBlockComment,
    };
}

function buildReplacement(
    codeMarker: string,
    text: string,
    q: QuoteContext,
    frameOnly: boolean,
): string {
    let quoteCharStart = q.quoteCharStart;
    let quoteCharEnd = q.quoteCharEnd;
    let quoteCharStartOrigin = q.quoteCharStartOrigin;
    let quoteCharBlockStart = q.quoteCharBlockStart;
    let isBlockComment = q.isBlockComment;

    let codeMarkerReplace = `${quoteCharStart} ---${quoteCharEnd}\n`;
    codeMarkerReplace += `${quoteCharStart} ${codeMarker}${quoteCharEnd}\n`;
    codeMarkerReplace += `${quoteCharStart} ---${quoteCharEnd}\n`;

    if (isBlockComment) {
        codeMarkerReplace += `${quoteCharStart}\n`;
        quoteCharStartOrigin = quoteCharStart;
        quoteCharStart = quoteCharBlockStart;
    }

    if (!frameOnly) {
        text.split(/\r?\n/).forEach(line => {
            codeMarkerReplace += `${quoteCharStart} ${line}\n`;
        });
    } else {
        codeMarkerReplace += `${quoteCharStart} \n`;
        codeMarkerReplace += `\n`;
    }

    if (isBlockComment) {
        codeMarkerReplace += `${quoteCharEnd}\n`;
        quoteCharStart = quoteCharStartOrigin;
    }

    if (!frameOnly) {
        codeMarkerReplace += `\n${text}`;
    }
    codeMarkerReplace += `\n\n${quoteCharStart} ---${quoteCharEnd}\n`;
    return codeMarkerReplace;
}

async function runQuoteWithMarker(activeEditor: vscode.TextEditor, frameOnly: boolean) {
    let selection = activeEditor.selection;

    if (selection.isEmpty === true) {
        activeEditor.selection = new vscode.Selection(selection.active.line, 0 ,selection.active.line, 99);
        selection = activeEditor.selection;
    }

    let text = activeEditor.document.getText(selection) || '';
    let config = vscode.workspace.getConfiguration('quoteWithMarker');

    let codeMarker: string = config.get('codeMarker') || 'MyMarker';
    let lineComment = config.get<Record<string, string>>('lineComment') || {};
    let languageId: string = activeEditor.document.languageId;

    let currentTime = new Date();

    let month: string = (currentTime.getMonth() + 1).toString();

    let day: string  = currentTime.getDate().toString();

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

    const q = await resolveQuoteCharacters(languageId, lineComment);
    if (!q) {return;}

    const codeMarkerReplace = buildReplacement(codeMarker, text, q, frameOnly);

    if (selection.isEmpty === false) {
        await activeEditor.edit(editBuilder => {
            editBuilder.replace(selection, codeMarkerReplace);
        });
    } else {
        await activeEditor.edit(editBuilder => {
            editBuilder.insert(activeEditor.selection.active, codeMarkerReplace);
        });
    }
}

function initQuoteWithMarker(context: vscode.ExtensionContext) {

    context.subscriptions.push(vscode.commands.registerCommand('quoteWithMarker', async () => {
        let activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {return;}
        await runQuoteWithMarker(activeEditor, false);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('quoteWithMarkerFrame', async () => {
        let activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {return;}
        await runQuoteWithMarker(activeEditor, true);
    }));
}

// This method is called when your extension is deactivated.
export function deactivate() { }
