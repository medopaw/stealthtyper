Stealth Typer is a VSCode Extension designed to hide your text in the editor by setting the text color to match the background color. This makes the text invisible, allowing you to type comfortably in public places without worrying about someone peeking at your screen.

To use Stealth Typer, press `Cmd+Shift+P` to open the Command Palette, then type and run the "Toggle Stealth Typing" command. You can also bind this function to a custom keyboard shortcut for convenience.

If you want to view the content you've typed, simply select all in the editor.

![Demo](demo.gif)

To optimize your Stealth Typing experience, we recommend turning on the 'Highlight Current Line' feature and turning off 'Spell Check' when Stealth Typing is active.

## Auto Stealth Mode

A new feature has been added to enhance security when you forget to enable stealth typing or lock your screen. The `autoStealthIdleSeconds` configuration option allows the extension to automatically enable stealth mode after a certain period of inactivity.

If `autoStealthIdleSeconds` is set to a positive number, the extension will automatically enable stealth mode after that many seconds of inactivity. This inactivity timer is reset whenever you change the content of the editor, switch the active editor, move the cursor, or change the text selection. For example, if `autoStealthIdleSeconds` is set to 60, the extension will enable stealth mode if no such activity is detected for 60 seconds.

By default, `autoStealthIdleSeconds` is set to 0, which means the extension will not automatically enable stealth mode. You must manually toggle stealth mode using the `stealth-typer.toggleStealthTyping` command.

This feature provides an additional layer of security, ensuring that your typing remains hidden even if you forget to enable stealth mode or lock your screen.
