import * as vscode from 'vscode';

let isStealthMode = false;
let timeoutHandle: NodeJS.Timeout | undefined = undefined;

const stealthModeDecoration = vscode.window.createTextEditorDecorationType({
    // 使文本颜色与背景颜色相同
    color: new vscode.ThemeColor('editor.background'),
});

export function activate(context: vscode.ExtensionContext) {
    setupIdleTimer();

    context.subscriptions.push(
        vscode.commands.registerCommand('stealth-typer.toggleStealthTyping', () => {
            isStealthMode = !isStealthMode;
            updateDecoration();
            setupIdleTimer();
        }),
        vscode.workspace.onDidChangeConfiguration(event => { // 监听设置项变化
            if (event.affectsConfiguration('stealth-typer.autoStealthIdleSeconds')) {
                setupIdleTimer(); // 重新设置定时器
            }
        }),
        vscode.workspace.onDidChangeTextDocument(event => { // 当编辑器内容或活动编辑器发生变化时，更新装饰
            if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
                updateDecoration();
                setupIdleTimer();
            }
        }),
        vscode.window.onDidChangeActiveTextEditor(updateDecoration), // 编辑器切换时，要更新装饰
        vscode.window.onDidChangeTextEditorSelection(setupIdleTimer) // 光标移动时，要重置 timer，否则移动光标不会被视为活动
    );
}

export function deactivate() {
    clearIdleTimer();
    disableStealthMode();
}

function setupIdleTimer() {
    clearIdleTimer();

    const config = vscode.workspace.getConfiguration('stealth-typer');
    const idleSeconds = config.get('autoStealthIdleSeconds', 0);

    if (idleSeconds > 0) {
        timeoutHandle = setTimeout(() => {
            if (isStealthMode) {
                clearIdleTimer();
            } else {
                enableStealthMode();
            }
        }, idleSeconds * 1000);
    }
}

function clearIdleTimer() {
    if (timeoutHandle) {
        clearTimeout(timeoutHandle);
        timeoutHandle = undefined;
    }
}

function enableStealthMode() {
    isStealthMode = true;
    updateDecoration();
}

function disableStealthMode() {
    isStealthMode = false;
    updateDecoration();
}

function updateDecoration() {
    for (const editor of vscode.window.visibleTextEditors) {
        const range = new vscode.Range(
            editor.document.positionAt(0),
            editor.document.positionAt(editor.document.getText().length)
        );
        editor.setDecorations(stealthModeDecoration, isStealthMode ? [range] : []);
    }
}
