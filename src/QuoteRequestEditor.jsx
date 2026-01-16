import Editor from '@monaco-editor/react';

function QuoteRequestEditor({ value, onChange, theme = 'vs-dark' }) {
    return (
        <div style={{
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            overflow: 'hidden',
            height: '300px'
        }}>
            <Editor
                height="300px"
                defaultLanguage="json"
                value={value}
                onChange={onChange}
                theme={theme}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    formatOnPaste: true,
                    formatOnType: true,
                    wordWrap: 'on'
                }}
            />
        </div>
    );
}

export default QuoteRequestEditor;
