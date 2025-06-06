import { Editor } from 'grapesjs';

export const initializeEditorStyles = (editor: Editor) => {
  editor.on('canvas:frame:load', () => {
    const frame = editor.Canvas.getFrame();
    if (!frame?.contentDocument) return;
    
    // Add base styles to iframe head
    const styleEl = frame.contentDocument.createElement('style');
    styleEl.innerHTML = `
      :root {
        --color-primary: #3B82F6;
        --color-secondary: #60A5FA;
        --color-background: #000000;
        --color-text: #FFFFFF;
        --color-accent: #2563EB;
        --font-heading: 'Playfair Display';
        --font-body: 'Playfair Display';
      }

      body {
        margin: 0;
        font-family: var(--font-body), serif !important;
        background-color: var(--color-background) !important;
        color: var(--color-text) !important;
        min-height: 100vh;
      }

      h1, h2, h3, h4, h5, h6 {
        font-family: var(--font-heading), serif !important;
      }

      .gjs-selected {
        outline: 2px solid var(--color-primary) !important;
      }

      .gjs-hovered {
        outline: 1px solid var(--color-secondary) !important;
      }
    `;
    frame.contentDocument.head.appendChild(styleEl);

    // Add Google Fonts
    const fontLink = frame.contentDocument.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&display=swap';
    frame.contentDocument.head.appendChild(fontLink);

    // Add Tailwind output CSS
    const tailwindLink = frame.contentDocument.createElement('link');
    tailwindLink.rel = 'stylesheet';
    tailwindLink.href = '/tailwind.output.css';
    frame.contentDocument.head.appendChild(tailwindLink);
  });

  // Customize editor UI
  const style = document.createElement('style');
  style.innerHTML = `
    .gjs-one-bg { background-color: #1a1a1a !important; }
    .gjs-two-color { color: #60A5FA !important; }
    .gjs-three-bg { background-color: #2563EB !important; }
    .gjs-four-color, .gjs-four-color-h:hover { color: #FFFFFF !important; }
    .gjs-pn-btn.gjs-pn-active { background-color: #2563EB !important; }
    .gjs-pn-panel { border-color: rgba(96, 165, 250, 0.3) !important; }
    .gjs-cv-canvas { background-color: #000000 !important; }
    .gjs-frame-wrapper { padding: 1rem !important; }
  `;
  document.head.appendChild(style);
};