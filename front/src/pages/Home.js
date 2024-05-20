import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from "../contexts/UserContext";
import { getPrograms } from "../services/api.program";
import { FaHeart, FaRegHeart, FaShareSquare, FaUserPlus } from 'react-icons/fa';
import loginicon from "../assets/photos/user.png";

function Home() {
    const { user } = useContext(UserContext);
    const [programs, setPrograms] = useState([]);
    const [filteredPrograms, setFilteredPrograms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    //@TODO change  friends by get all users and manage friends system
    const [friends, setFriends] = useState([
        { id: 1, first_name: "John", last_name: "Doe" },
        { id: 2, first_name: "Jane", last_name: "Smith" },
        { id: 3, first_name: "Mark", last_name: "Johnson" },
        { id: 3, first_name: "Mark", last_name: "Johnson" },
        { id: 3, first_name: "Mark", last_name: "Johnson" },
        { id: 3, first_name: "Mark", last_name: "Johnson" },
        { id: 3, first_name: "Mark", last_name: "Johnson" },
        { id: 3, first_name: "Mark", last_name: "Johnson" },
        { id: 3, first_name: "Mark", last_name: "Johnson" },
        { id: 3, first_name: "Mark", last_name: "Johnson" },
        { id: 3, first_name: "Mark", last_name: "Johnson" },
        { id: 3, first_name: "Mark", last_name: "Johnson" },
        { id: 3, first_name: "Mark", last_name: "Johnson" },
        { id: 3, first_name: "Mark", last_name: "Johnson" },
        { id: 3, first_name: "Mark", last_name: "Johnson" },
    ]);

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const response = await getPrograms();
            setPrograms(response.data);
            setFilteredPrograms(response.data);
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

    const handleAddFriend = (friendId) => {
        console.log("Add friend with ID:", friendId);
        // Logic to add friend goes here
    };

    return (
        <div className="container mx-auto px-4 pt-32 flex">
            {/* Programs Section */}
            <div className="w-2/3 pr-4">
                <div className="mt-4 space-y-4">
                    {filteredPrograms.map(program => (
                        <div key={program.id} className="p-4 border border-gray-300 rounded shadow-lg bg-white">
                            <h2 className="text-xl font-bold">{program.title}</h2>
                            <p className="text-gray-700">{program.description}</p>
                            {program.file && (
                                <div className="mt-4">
                                    <div className="border rounded p-2 text-gray-500">
                                        <p>File Preview:</p>
                                        <FilePreview fileUrl={program.file} />
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center mt-2">
                                <FaHeart className="mr-2 text-red-500 cursor-pointer" />
                                <FaRegHeart className="mr-2 text-gray-500 cursor-pointer" />
                                <FaShareSquare className="mr-2 text-gray-500 cursor-pointer" />
                            </div>
                            <div className="mt-4">
                                <input
                                    type="text"
                                    placeholder="Commentaire..."
                                    className="w-full p-2 border rounded border-gray-300"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Friends Section */}
            <div className="w-1/3 pl-4">
                <div className="bg-white p-4 rounded shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Ajouter des amis</h2>
                    {friends.map(friend => (
                        <div key={friend.id}
                             className="flex items-center mb-4 p-2 border rounded bg-gray-100">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white">
                                <img src={friend.profile_picture || loginicon} alt="Profile"
                                     className="w-full h-full object-cover"/>
                            </div>
                            <div className="ml-4">
                                <p className="font-bold">{friend.first_name} {friend.last_name}</p>
                                <p className="text-sm text-gray-600">{friend.first_name}</p>
                            </div>
                            <button
                                onClick={() => handleAddFriend(friend.id)}
                                className="flex items-center bg-blue-500 text-white px-3 py-1 ml-auto rounded hover:bg-blue-700"
                            >
                                <FaUserPlus className="mr-2"/> Ajouter
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const FilePreview = ({fileUrl}) => {
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

export default Home;
