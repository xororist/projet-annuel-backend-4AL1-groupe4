// Home.js
import React, {useContext, useState} from 'react';
import {UserContext} from "../contexts/UserContext";

function Home() {
    let { user,  setUser } = useContext(UserContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [posts, setPosts] = useState([
        { id: 1, content: "Voici un exemple de publication." },
        { id: 2, content: "Une autre publication intéressante." },
        { id: 3, content: "Et encore une autre !" }
    ]);

    function handleSearchChange(event) {
        setSearchTerm(event.target.value);
    }

    function handleSearch() {
        console.log('Recherche pour:', searchTerm);
        alert(user)
        console.log(user)
        // Implémentez votre logique de recherche ou filtrage ici.
    }

    return (
        <div className="container mx-auto px-4 pt-32">
            <div className="bg-white p-4 shadow-md rounded">
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Recherche..."
                        className="flex-grow p-2 border rounded border-gray-300"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Valider
                    </button>
                </div>
            </div>
            <div className="mt-4 space-y-4">
                {posts.map(post => (
                    <div key={post.id} className="p-4 border border-gray-300 rounded shadow">
                        {post.content}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
