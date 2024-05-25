import React, { useState, useEffect } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { getPrograms } from '../services/api.program'; // Assurez-vous d'importer correctement vos services


const Programmes = () => {
    const [programs, setPrograms] = useState([]);
    const [filteredPrograms, setFilteredPrograms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const response = await getPrograms();
            const visiblePrograms = response.data;
            setPrograms(visiblePrograms);
            setFilteredPrograms(visiblePrograms);
            console.log(visiblePrograms)
        } catch (error) {
            console.error("Error fetching programs", error);
        }
    };

    const handleSearch = () => {
        const filtered = programs.filter(program =>
            program.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPrograms(filtered);
    };

    const handleEditProgram = (programId) => {
        console.log("Edit program with ID:", programId);
        // Logic to edit program goes here
    };

    const handleDeleteProgram = (programId) => {
        console.log("Delete program with ID:", programId);
        // Logic to delete program goes here
    };

    return (
        <div className="container mx-auto px-4 pt-32 flex">
            {/* Programs Section */}
            <div className="w-2/3 pr-4">
                <div className="mt-4 space-y-4">
                    {filteredPrograms.map(program => (
                        <div key={program.id} className="p-4 border border-gray-300 rounded shadow-lg bg-white relative">
                            <h2 className="text-xl font-bold">{program.title}</h2>
                            <p className="text-gray-700">{program.description}</p>
                            {program.file && (
                                <div className="mt-4">
                                    <div className="border rounded p-2 text-gray-500">
                                        <p>File Preview:</p>
                                        <a href={program.file} target="_blank" rel="noopener noreferrer">View File</a>
                                    </div>
                                </div>
                            )}
                            <div className="absolute top-2 right-2">
                                <Menu programId={program.id} onEdit={handleEditProgram} onDelete={handleDeleteProgram} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Menu = ({ programId, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <FaEllipsisV className="cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
            {isOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded shadow-lg">
                    <button
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                        onClick={() => {
                            onEdit(programId);
                            setIsOpen(false);
                        }}
                    >
                        Modifier
                    </button>
                    <button
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                        onClick={() => {
                            onDelete(programId);
                            setIsOpen(false);
                        }}
                    >
                        Supprimer
                    </button>
                </div>
            )}
        </div>
    );
};

export default Programmes;
