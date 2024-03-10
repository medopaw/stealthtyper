import * as vscode from 'vscode';

let isStealthMode = false;
let timeoutHandle: NodeJS.Timeout | undefined = undefined;

const stealthModeDecoration = vscode.window.createTextEditorDecorationType({
    // 使文本颜色与背景颜色相同
    color: new vscode.ThemeColor('editor.background'),
});

export function activate(context: vscode.ExtensionContext) {
    const toggleStealthTyping = vscode.commands.registerCommand('stealth-typer.toggleStealthTyping', () => {
        isStealthMode = !isStealthMode;
        updateDecoration();
        setupIdleTimer();
    });
    context.subscriptions.push(toggleStealthTyping);

    setupIdleTimer();
    // 监听设置项变化
    vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('stealth-typer.autoStealthIdleSeconds')) {
            setupIdleTimer(); // 重新设置定时器
        }
    }, null, context.subscriptions);

    // 当编辑器内容或活动编辑器发生变化时，更新装饰
    vscode.workspace.onDidChangeTextDocument(event => {
        if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
            updateDecoration();
            setupIdleTimer();
        }
    });
    vscode.window.onDidChangeActiveTextEditor(updateDecoration);
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
        console.log(`idleSeconds: ${idleSeconds}`);
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
