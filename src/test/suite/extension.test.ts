import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', function() {

    vscode.window.showInformationMessage('Start all tests.');

    this.afterEach(async () => {
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    });

    test('Command: quoteWithMarker - without text', async () => {
        // Open a new text document
        const document = await vscode.workspace.openTextDocument({ content: '', language: 'plaintext' });

        // Show the document in a new editor
        const editor = await vscode.window.showTextDocument(document);

        // Select the line
        const line = editor.document.lineAt(0);
        editor.selection = new vscode.Selection(line.range.start, line.range.end);

        // Execute the command
        await vscode.commands.executeCommand('quoteWithMarker');

        // Get the entire text from the document
        let entireText = editor.document.getText();

         // Get the code marker from the settings
        let codeMarker : string | undefined = vscode.workspace.getConfiguration().get('quoteWithMarker.codeMarker') || 'MyMarker';

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

        // Expected text
        const expectedText = `# ---\n# ${codeMarker}\n# ---\n# \n\n\n\n# ---\n`;

        // Check the result
        assert.strictEqual(entireText, expectedText);

    });

    test('Command: quoteWithMarker - with text', async () => {
        // Open a new text document
        const document = await vscode.workspace.openTextDocument({ content: 'Hello World!', language: 'plaintext' });

        // Show the document in a new editor
        const editor = await vscode.window.showTextDocument(document);

        // Select the line
        const line = editor.document.lineAt(0);
        editor.selection = new vscode.Selection(line.range.start, line.range.end);

        // Execute the command
        await vscode.commands.executeCommand('quoteWithMarker');

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get the entire text from the document
        let entireText = editor.document.getText();

         // Get the code marker from the settings
        let codeMarker : string | undefined = vscode.workspace.getConfiguration().get('quoteWithMarker.codeMarker') || 'MyMarker';

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

        // Expected text
        const expectedText = `# ---
# ${codeMarker}
# ---
# Hello World!

Hello World!

# ---
`;

        // Check the result
        assert.strictEqual(entireText, expectedText);
    });

});