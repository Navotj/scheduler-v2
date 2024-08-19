import React, { useState, useEffect } from 'react';
import './styles.css';

const tagCategories = [
    {
        "name": "Phobias",
        "tags": [
            "Arachnophobia", 
            "Thalassophobia", 
            "Entomophobia", 
        ],
        "color": "#FF6347", // Tomato
        "icon": "⚠" // Icon for Phobias
    },
    {
        "name": "Triggers",
        "tags": [
            "Blood", 
            "Needles", 
            "Medical Procedures", 
            "Body Horror", 
            "Animal Harm", 
            "Child Harm", 
            "Sexual Assault", 
        ],
        "color": "#DC143C", // Crimson
        "icon": "⚠" // Icon for Triggers
    },
    {
        "name": "Magic Level",
        "tags": [
            "Low Magic", 
            "High Magic", 
        ],
        "color": "#8A2BE2", // BlueViolet
        "icon": "★" // Icon for Magic Level
    },
    {
        "name": "Fantasy Level",
        "tags": [
            "Low Fantasy", 
            "High Fantasy", 
            "Epic Fantasy"
        ],
        "color": "#4682B4", // SteelBlue
        "icon": "✧" // Icon for Fantasy Level
    },
    {
        "name": "Time Frame",
        "tags": [
            "Medieval", 
            "Steampunk", 
            "Cyberpunk", 
            "Post-Apocalyptic", 
            "Time Travel", 
            "Alternate History", 
            "Ancient Rome", 
            "Ancient Egypt", 
            "Feudal Japan", 
            "Modern Day"
        ],
        "color": "#FFA500", // Orange
        "icon": "⏳" // Icon for Time Frame
    },
    {
        "name": "Tone",
        "tags": [
            "Gritty", 
            "Light-hearted", 
            "Horror", 
            "Comedy", 
            "Mystery", 
            "Tragic", 
            "Epic", 
            "Heroic", 
            "Survival", 
            "Lovecraftian", 
            "Gothic", 
            "Romantic", 
            "Satirical"
        ],
        "color": "#FFD700", // Gold
        "icon": "🎭" // Icon for Tone
    },
    {
        "name": "Setting",
        "tags": [
            "Urban Fantasy", 
            "Underwater", 
            "Skybound", 
            "Desert", 
            "Jungle", 
            "Arctic", 
            "Pirate", 
            "Underground", 
            "Space", 
            "Ancient Ruins"
        ],
        "color": "#4682B4", // SteelBlue
        "icon": "🏙" // Icon for Setting
    },
    {
        "name": "Supernatural Elements",
        "tags": [
            "Supernatural", 
            "Vampires", 
            "Werewolves", 
            "Zombies", 
            "Alien Invasion", 
            "Psionics", 
            "Technomancy", 
            "Ghosts", 
            "Demons"
        ],
        "color": "#800080", // Purple
        "icon": "🧛" // Vampire Icon for Supernatural Elements
    },
    {
        "name": "Conflict Type",
        "tags": [
            "Political Intrigue", 
            "Military Campaign", 
            "Dungeon Crawl", 
            "Exploration", 
            "Survival", 
        ],
        "color": "#DC143C", // Crimson
        "icon": "⚔️" // Crossed Swords Icon for Conflict Type
    },
    {
        "name": "Genre",
        "tags": [
            "SCI-FI", 
            "Fantasy", 
            "Sword and Sorcery", 
            "Mythological", 
            "Planar Travel", 
            "Historical Fiction", 
        ],
        "color": "#FFA500", // Orange
        "icon": "🎬" // Icon for Genre
    },
    {
        "name": "Difficulty Level",
        "tags": [
            "Easy", 
            "Hard", 
            "Very Hard", 
        ],
        "color": "#FFD700", // Gold
        "icon": "⚔" // Icon for Difficulty Level
    },
    {
        "name": "Paid",
        "tags": [
            "Paid", 
        ],
        "color": "green",
        "icon": "💲" // Icon for Miscellaneous
    },
    {
        "name": "Meta",
        "tags": [
            "LGBT Friendly", 
            "Disability Inclusiveness", 
            "Beginner DM", 
            "Noob Friendly", 
            "Rules-Light", 
            "Rules-Heavy"
        ],
        "color": "#2E8B57", // SeaGreen
        "icon": "🔧" // Icon for Meta
    },
    {
        "name": "Age-Restricted",
        "tags": [
            "NSFW", 
            "Drug Use", 
            "Suicide", 
            "Mental Illness", 
            "Self-Harm", 
            "Torture", 
            "Gore", 
            "Extreme Violence", 
            "Body Mutilation", 
            "Human Trafficking", 
            "Sexual Content"
        ],
        "color": "#8B0000", // DarkRed
        "icon": "🔞" // Icon for Age-Restricted
    }
];

const TagsManager = ({ enabledTags, setEnabledTags }) => {
    const [availableTags, setAvailableTags] = useState([]);

    useEffect(() => {
        const combinedTags = tagCategories.flatMap(category => category.tags);
        setAvailableTags(combinedTags.sort());
    }, []);

    const handleTagClick = (tag) => {
        if (!enabledTags.some(t => t.name === tag)) {
            const newEnabledTags = [...enabledTags, { name: tag }].sort((a, b) => a.name.localeCompare(b.name));
            setEnabledTags(newEnabledTags);
        }
    };

    const handleTagRemove = (tag) => {
        setEnabledTags(enabledTags.filter(t => t.name !== tag.name));
    };

    const renderTag = (tag, category) => (
        <div
            key={tag}
            className={`tag ${category.name === "LGBT Friendly" ? "lgbt-friendly" : ""}`}
            style={{ borderColor: category.color }}
            onClick={() => handleTagClick(tag)}
        >
            {tag} <span>{category.icon}</span>
        </div>
    );
    
    const renderEnabledTag = (tag) => {
        const category = tagCategories.find(category => category.tags.includes(tag.name));
        return (
            <div
                key={tag.name}
                className="enabled-tag"
                style={{ borderColor: category.color }}
                >
                {tag.name} <span className="remove-tag" onClick={() => handleTagRemove(tag)}>X</span>
            </div>
        );
    };

    return (
        <div>
            <label className="small-label">Available Tags:</label>
            <div className="tags-container">
                {tagCategories.map(category =>
                    category.tags.map(tag => renderTag(tag, category))
                )}
            </div>
            <label className="small-label">Enabled Tags:</label>
            <div className="enabled-tags-container">
                {enabledTags.map(({ name }) => {
                    // Find the category for this tag to apply the correct border color
                    const category = tagCategories.find(category => category.tags.includes(name));
                    return (
                        <div 
                            key={name} 
                            className="enabled-tag" 
                            style={{ borderColor: category.color }}
                        >
                            {name} 
                            <span className="remove-tag" onClick={() => handleTagRemove({ name })}>X</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TagsManager;
