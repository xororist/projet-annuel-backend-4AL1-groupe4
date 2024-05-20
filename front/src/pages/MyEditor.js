import React, { useState } from 'react';
import { FaFileAlt, FaCog, FaFileExport, FaPlay, FaExpand, FaCompress } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
import { Editor } from '@monaco-editor/react';
import { createProgram } from '../services/api.program';


const MyEditor = () => {
    const [code, setCode] = useState('// Place your code here');
    const [language, setLanguage] = useState('javascript');
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [result, setResult] = useState('');


    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
        setCode('// Place your code here');
    };

    const handleExport = () => {
        Swal.fire({
            title: 'Enter file name',
            input: 'text',
            inputLabel: 'File name',
            inputPlaceholder: 'Enter file name',
            showCancelButton: true,
            confirmButtonText: 'Download',
            customClass: {
                popup: 'small-swal-popup'
            },
            preConfirm: (fileName) => {
                if (!fileName) {
                    Swal.showValidationMessage('File name is required');
                }
                return fileName;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                let extension = '';
                switch (language) {
                    case 'javascript':
                        extension = 'js';
                        break;
                    case 'python':
                        extension = 'py';
                        break;
                    case 'java':
                        extension = 'java';
                        break;
                    default:
                        extension = 'txt';
                }
                const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
                saveAs(blob, `${result.value}.${extension}`);
            }
        });
    };

    const handleFullScreenToggle = () => {
        setIsFullScreen(!isFullScreen);
    };

    const handleRun = async () => {
        const formData = new FormData();
        const file = new Blob([code], { type: 'text/plain' });
        let extension = '';
        switch (language) {
            case 'javascript':
                extension = 'js';
                break;
            case 'python':
                extension = 'py';
                break;
            case 'java':
                extension = 'java';
                break;
            default:
                extension = 'txt';
        }
        formData.append('file', file, `program.${extension}`);
        formData.append('title', 'Program');
        formData.append('description', 'Program description');

        try {
            const response = await createProgram(formData);
            setResult(response.data.result); // Assuming the API returns the result in this format
        } catch (error) {
            console.error('Error running program:', error);
            setResult('Error running program.');
        }
    };
    return (
        <div
            className={`pt-24 flex flex-col items-center justify-center ${isFullScreen ? 'p-0' : 'px-4'} transition-all duration-300`}>
            {/* Navbar */}
            <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-2 w-full"
                 style={{height: '40px'}}>
                <select
                    value={language}
                    onChange={handleLanguageChange}
                    className="bg-gray-700 text-white px-2 py-1 rounded focus:outline-none"
                >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                </select>
                <button onClick={handleRun}
                        className="bg-green-500 px-4 py-1 rounded hover:bg-green-700 flex items-center">
                    <FaPlay className="mr-2"/> Run
                </button>
                <div className="flex items-center">
                    <FaFileExport
                        onClick={handleExport}
                        className="text-2xl cursor-pointer hover:text-gray-400 ml-4"
                    />
                    {isFullScreen ? (
                        <FaCompress
                            onClick={handleFullScreenToggle}
                            className="text-2xl cursor-pointer hover:text-gray-400 ml-4"
                        />
                    ) : (
                        <FaExpand
                            onClick={handleFullScreenToggle}
                            className="text-2xl cursor-pointer hover:text-gray-400 ml-4"
                        />
                    )}
                </div>
            </div>
            <div className="flex flex-row items-start justify-center w-full">

                <Editor
                    width="100%"
                    height="75vh"
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={(newCode) => setCode(newCode)}
                />
            </div>
            <div className=" w-full bg-gray-800 text-white px-8 py-8 mb-2 ">
                <h2 className="text-lg font-bold">Result:</h2>
                <pre>{result}</pre>
            </div>
        </div>
    );
};

export default MyEditor;
