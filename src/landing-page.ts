export const landingPageHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Domain MCP</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap');
        * { font-family: 'JetBrains Mono', monospace; }
        .gradient-text {
            background: linear-gradient(to right, #3b82f6, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        pre {
            margin: 0;
        }
        .shiki {
            padding: 1rem;
            border-radius: 0.375rem;
            overflow-x: auto;
            position: relative;
        }
        .copy-button {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            padding: 0.25rem 0.5rem;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 0.25rem;
            color: #aaa;
            font-size: 0.75rem;
            cursor: pointer;
            transition: all 0.2s;
        }
        .copy-button:hover {
            background: rgba(255, 255, 255, 0.2);
            color: #fff;
        }
        .copy-button.copied {
            background: rgba(34, 197, 94, 0.2);
            border-color: rgba(34, 197, 94, 0.4);
            color: #22c55e;
        }
    </style>
</head>
<body class="bg-gray-900 text-gray-100">
    <div class="min-h-screen p-8">
        <div class="max-w-4xl mx-auto">
            <header class="mb-12">
                <h1 class="text-4xl font-bold mb-4">
                    <span class="gradient-text">domainmcp.dev</span>
                </h1>
                <p class="text-gray-400 text-lg">Check domain availability from your AI assistant</p>
            </header>

            <section class="space-y-8">
                <div>
                    <h3 class="text-xl font-semibold mb-4 text-yellow-400">Claude Code</h3>
                    
                    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <p class="text-sm text-gray-400 mb-4">Add the MCP server with a single command:</p>
                        <pre class="code-block" data-lang="bash"><code>claude mcp add domainmcp https://domainmcp.dev -t sse</code></pre>
                    </div>
                </div>

                <div>
                    <h3 class="text-xl font-semibold mb-4 text-yellow-400">JSON Configuration</h3>
                    
                    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <p class="text-sm text-gray-400 mb-4">Add to claude_desktop_config.json:</p>
                        <pre class="code-block" data-lang="json"><code>{
  "mcpServers": {
    "domain-checker": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://domainmcp.dev/sse"
      ]
    }
  }
}</code></pre>
                    </div>
                </div>
            </section>

            <footer class="text-center text-gray-500 pt-12 mt-12 border-t border-gray-800">
                <a href="https://github.com/yourusername/domainmcp" class="text-blue-400 hover:underline">GitHub</a>
            </footer>
        </div>
    </div>
    
    <script type="module">
        import { codeToHtml } from 'https://esm.sh/shiki@1.0.0';
        
        async function highlightCode() {
            const blocks = document.querySelectorAll('.code-block');
            
            for (const block of blocks) {
                const code = block.querySelector('code').textContent;
                const lang = block.dataset.lang || 'text';
                
                try {
                    const html = await codeToHtml(code, {
                        lang: lang,
                        theme: 'github-dark-dimmed'
                    });
                    
                    // Create a wrapper div to hold both the highlighted code and copy button
                    const wrapper = document.createElement('div');
                    wrapper.style.position = 'relative';
                    wrapper.innerHTML = html;
                    
                    // Add copy button
                    const copyButton = document.createElement('button');
                    copyButton.className = 'copy-button';
                    copyButton.textContent = 'Copy';
                    copyButton.onclick = async () => {
                        try {
                            await navigator.clipboard.writeText(code);
                            copyButton.textContent = 'Copied!';
                            copyButton.classList.add('copied');
                            setTimeout(() => {
                                copyButton.textContent = 'Copy';
                                copyButton.classList.remove('copied');
                            }, 2000);
                        } catch (err) {
                            console.error('Failed to copy:', err);
                        }
                    };
                    
                    // Add the copy button to the highlighted code
                    const pre = wrapper.querySelector('pre');
                    if (pre) {
                        pre.appendChild(copyButton);
                    }
                    
                    block.parentNode.replaceChild(wrapper.firstChild, block);
                } catch (e) {
                    console.error('Failed to highlight code:', e);
                }
            }
        }
        
        highlightCode();
    </script>
</body>
</html>`;