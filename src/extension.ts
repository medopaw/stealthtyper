import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let isStealthMode = false;
    const stealthModeDecoration = vscode.window.createTextEditorDecorationType({
        // 使文本颜色与背景颜色相同
        color: new vscode.ThemeColor('editor.background'),
    });

    const toggleStealthMode = vscode.commands.registerCommand('stealth-typer.toggleStealthTyping', () => {
        isStealthMode = !isStealthMode;
        updateDecoration();
    });

    context.subscriptions.push(toggleStealthMode);

    function updateDecoration() {
        for (const editor of vscode.window.visibleTextEditors) {
            const ranges = editor.document.getText()
                .split('\n')
                .map((line, i) => editor.document.lineAt(i).range);

            editor.setDecorations(stealthModeDecoration, isStealthMode ? ranges : []);
        }
    }

    // 当编辑器内容或活动编辑器发生变化时，更新装饰
    vscode.workspace.onDidChangeTextDocument(event => {
        if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
            updateDecoration();
        }
    });
    vscode.window.onDidChangeActiveTextEditor(updateDecoration);
}

export function deactivate() {}
