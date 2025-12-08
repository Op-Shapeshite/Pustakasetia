'use client';

import { DefaultEditor, BtnBold, BtnItalic, BtnBulletList, BtnNumberedList, Toolbar, Editor } from 'react-simple-wysiwyg';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    return (
        <div className="bg-white border border-[#d9d9d9] rounded-lg overflow-hidden">
            <DefaultEditor
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                style={{ minHeight: '150px' }}
            >
                <Toolbar>
                    <BtnBold />
                    <BtnItalic />
                    <BtnBulletList />
                    <BtnNumberedList />
                </Toolbar>
            </DefaultEditor>
        </div>
    );
}
