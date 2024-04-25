import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { FaFileAlt, FaCog } from 'react-icons/fa';

const MyEditor = () => {
    const code = '// Place your code here';

    return (
        <div className="pt-24 flex flex-row items-start  justify-center">
            {/* Menu */}
            <div className=" flex flex-col items-start pt-4  bg-gray-300 h-98"  style={{ height: '600px' }}>
                {/* Fichier */}
                <div className="flex items-center gap-2 mb-3 px-8">
                    <FaFileAlt />
                    <span>Fichier</span>
                </div>
                {/* Configuration */}
                <div className="flex items-center gap-2 px-8">
                    <FaCog />
                    <span>Configuration</span>
                </div>
            </div>
            {/* Editeur Monaco */}
            <MonacoEditor
                width="800"
                height="600"
                language="javascript"
                theme="vs-dark"
                value={code}
            />
            <buttonon className="bg-blue-400 flex float rigth  px-6 py-2 ml-2 rounded ">Execute</buttonon>
        </div>
    );
};

export default MyEditor;
