# Pencil MCP Setup

This workspace is configured to run the MCP server bundled inside Pencil.app through VS Code MCP.

Configuration file:
- `.vscode/mcp.json`

Configured server:
- `pencil`

How it is started:
- VS Code runs the native binary from Pencil.app:
	`/Applications/Pencil.app/Contents/Resources/app.asar.unpacked/out/mcp-server-darwin-arm64`
- The server is started with arguments:
	`--app desktop`

What to do in VS Code:
1. Open the Command Palette.
2. Run `MCP: List Servers`.
3. Find `pencil`.
4. Start the server and trust it when prompted.
5. Open Chat and enable the server tools if they are not enabled automatically.

Notes:
- This workspace now uses the MCP server bundled with the installed macOS Pencil application.
- If Pencil.app is moved to a different location, update `.vscode/mcp.json`.
- If the server configuration changes, restart it from `MCP: List Servers`.