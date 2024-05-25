import React, { useState, useEffect } from 'react';
import { getPrograms, executeProgram } from '../services/api.program';
import { FaEllipsisV } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner'; // Utilisation de ThreeDots pour le loader
import Swal from 'sweetalert2';

const Pipeline = () => {
    const [programs, setPrograms] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resultFile, setResultFile] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await getPrograms();
                const visiblePrograms = response.data;
                setPrograms(visiblePrograms);
            } catch (error) {
                console.error("Error fetching programs", error);
            }
        };

        fetchPrograms();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleExecute = async () => {
        if (!file || !selectedProgram) {
            alert("Please select a file and a program first");
            return;
        }
    
        setLoading(true);
        const formData = new FormData();
        const urlParts = selectedProgram.file.split('/');
        const fileId = urlParts[urlParts.length - 1].split('.')[0]; // Extracting the UUID from the file URL
        formData.append('program', fileId); // Sending the extracted UUID as program ID
        formData.append('file', file);
        console.log(formData)

        // Debugging: Logging formData keys and values
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1].name || pair[1]}`); // Log the name if it's a file
        }

        try {
            const response = await executeProgram(formData);
            setResultFile(response.data); // Adjust based on actual response structure
        } catch (error) {
            console.error("Error executing program", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMenuToggle = (programId) => {
        setActiveMenu(activeMenu === programId ? null : programId);
    };

    const handleClickOutside = () => {
        setActiveMenu(null);
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className="container mx-auto px-4 pt-32 flex">
            {/* Programs Section */}
            <div className="w-1/3 pr-4">
                <h2 className="text-xl font-bold mb-4">Program List</h2>
                <div className="mt-4 space-y-4">
                    {programs.map(program => (
                        <div key={program.id} className="p-4 border border-gray-300 rounded shadow-lg bg-white flex justify-between relative">
                            <div onClick={() => setSelectedProgram(program)}>
                                <h3 className="text-lg font-bold">{program.title}</h3>
                                <p className="text-gray-700">{program.description}</p>
                                <FilePreview fileUrl={program.file} />
                            </div>
                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <div className="cursor-pointer" onClick={() => handleMenuToggle(program.id)}>
                                    <FaEllipsisV />
                                </div>
                                {activeMenu === program.id && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                                        <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Edit</button>
                                        <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Delete</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pipeline Section */}
            <div className="w-2/3 pl-4">
                <h2 className="text-xl font-bold mb-4">Pipeline</h2>
                {selectedProgram ? (
                    <div>
                        <h3 className="text-lg font-bold">{selectedProgram.title}</h3>
                        <p className="text-gray-700">{selectedProgram.description}</p>
                        <FilePreview fileUrl={selectedProgram.file} />
                        <div className="mt-4">
                            <input type="file" onChange={handleFileChange} />
                            <button
                                onClick={handleExecute}
                                className="bg-green-500 text-white px-4 py-2 rounded ml-4"
                                disabled={loading}
                            >
                                {loading ? <ThreeDots color="#fff" height={10} /> : 'Execute'}
                            </button>
                        </div>
                        {resultFile && (
                            <div className="mt-4">
                                <h4 className="text-lg font-bold">Result:</h4>
                                <a href={resultFile} download className="text-blue-500 underline">Download Result File</a>
                            </div>
                        )}
                    </div>
                ) : (
                    <p>Select a program to view details</p>
                )}
            </div>
        </div>
    );
};

const FilePreview = ({ fileUrl }) => {
    const [content, setContent] = useState('');

    const fetchFileContent = async (fileUrl) => {
        try {
            const response = await fetch(fileUrl);
            const text = await response.text();
            return text;
        } catch (error) {
            console.error("Error fetching file content", error);
            return "Unable to load file content.";
        }
    };

    useEffect(() => {
        const loadFileContent = async () => {
            const fileContent = await fetchFileContent(fileUrl);
            setContent(fileContent);
        };
        loadFileContent();
    }, [fileUrl]);

    return (
        <pre className="bg-gray-100 p-2 rounded max-h-48 overflow-auto">
            {content}
        </pre>
    );
};

export default Pipeline;
