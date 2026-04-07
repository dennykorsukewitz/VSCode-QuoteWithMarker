import * as assert from 'assert';
import * as vscode from 'vscode';

function normalizeEol(text: string): string {
    return text.replace(/\r\n/g, '\n');
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

suite('Extension Test Suite', function() {

    vscode.window.showInformationMessage('Start all tests.');

    test('Extension is installed for this test run', () => {
        const ext = vscode.extensions.all.find(
            (e) => e.packageJSON.name === 'QuoteWithMarker',
        );
        assert.ok(ext, 'Expected QuoteWithMarker in development host');
    });

    test('Extension activates without throwing', async () => {
        const ext = vscode.extensions.all.find(
            (e) => e.packageJSON.name === 'QuoteWithMarker',
        );
        assert.ok(ext);
        await ext.activate();
    });

    test('Commands are registered after activation', async () => {
        const ext = vscode.extensions.all.find(
            (e) => e.packageJSON.name === 'QuoteWithMarker',
        );
        assert.ok(ext);
        await ext.activate();

        const commands = await vscode.commands.getCommands(true);
        assert.ok(
            commands.includes('quoteWithMarker'),
            'quoteWithMarker should be registered',
        );
        assert.ok(
            commands.includes('quoteWithMarkerFrame'),
            'quoteWithMarkerFrame should be registered',
        );
        assert.ok(
            commands.includes('quoteWithMarker.setCodeMarker'),
            'quoteWithMarker.setCodeMarker should be registered',
        );
    });

    test('quoteWithMarker configuration is readable', async () => {
        const ext = vscode.extensions.all.find(
            (e) => e.packageJSON.name === 'QuoteWithMarker',
        );
        assert.ok(ext);
        await ext.activate();

        const cfg = vscode.workspace.getConfiguration('quoteWithMarker');
        const codeMarker = cfg.get<string>('codeMarker');
        assert.ok(
            typeof codeMarker === 'string' && codeMarker.length > 0,
            'codeMarker should be a non-empty string',
        );

        const lineComment = cfg.get<Record<string, string>>('lineComment');
        assert.ok(
            lineComment && typeof lineComment === 'object',
            'lineComment should be an object',
        );
    });

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
        await delay(1000);

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

        assert.strictEqual(normalizeEol(entireText), expectedText);

    });

    test('Command: quoteWithMarkerFrame - without text (same layout as quote, no duplicate body)', async () => {
        const document = await vscode.workspace.openTextDocument({ content: '', language: 'plaintext' });
        const editor = await vscode.window.showTextDocument(document);
        const line = editor.document.lineAt(0);
        editor.selection = new vscode.Selection(line.range.start, line.range.end);

        await vscode.commands.executeCommand('quoteWithMarkerFrame');
        await delay(1000);

        let entireText = editor.document.getText();

        let codeMarker : string | undefined = vscode.workspace.getConfiguration().get('quoteWithMarker.codeMarker') || 'MyMarker';

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

        const expectedText = `# ---\n# ${codeMarker}\n# ---\n# \n\n\n\n# ---\n`;

        assert.strictEqual(normalizeEol(entireText), expectedText);
    });

    test('Command: quoteWithMarkerFrame - with text replaces selection with frame only', async () => {
        const document = await vscode.workspace.openTextDocument({ content: 'Hello World!', language: 'plaintext' });
        const editor = await vscode.window.showTextDocument(document);
        const line = editor.document.lineAt(0);
        editor.selection = new vscode.Selection(line.range.start, line.range.end);

        await vscode.commands.executeCommand('quoteWithMarkerFrame');
        await delay(1000);

        let entireText = editor.document.getText();

        let codeMarker : string | undefined = vscode.workspace.getConfiguration().get('quoteWithMarker.codeMarker') || 'MyMarker';

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

        const expectedText = `# ---\n# ${codeMarker}\n# ---\n# \n\n\n\n# ---\n`;

        assert.strictEqual(normalizeEol(entireText), expectedText);
        assert.ok(!entireText.includes('Hello World!'));
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
        await delay(1000);

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

        assert.strictEqual(normalizeEol(entireText), expectedText);
    });

});