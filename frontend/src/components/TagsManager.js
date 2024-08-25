import React, { useState, useEffect } from 'react';
import '../styles/TagsManager.css';

const tagCategories = [
    {
        "name": "Paid",
        "color": "green",
        "alphabetize": true,
        "tags": [
            { "name": "Paid", "icon": "💲" }
        ]
    },
    {
        "name": "Magic Level",
        "color": "#8A2BE2", // BlueViolet
        "alphabetize": false,
        "tags": [
            { "name": "Low Magic", "icon": "🔮" },
            { "name": "High Magic", "icon": "✨" }
        ]
    },
    {
        "name": "Fantasy Level",
        "color": "#4682B4", // SteelBlue
        "alphabetize": false,
        "tags": [
            { "name": "Low Fantasy", "icon": "🗡️" },
            { "name": "High Fantasy", "icon": "🏰" },
            { "name": "Epic Fantasy", "icon": "🐉" }
        ]
    },
    {
        "name": "Time Frame",
        "color": "#FFA500", // Orange
        "alphabetize": true,
        "tags": [
            { "name": "Medieval", "icon": "⚔️" },
            { "name": "Post-Apocalyptic", "icon": "☢️" },
            { "name": "Alternate History", "icon": "🌍" },
            { "name": "Ancient Rome", "icon": "🏛️" },
            { "name": "Ancient Egypt", "icon": "🛕" },
            { "name": "Feudal Japan", "icon": "🗡️" },
            { "name": "Modern Day", "icon": "🏙️" }
        ]
    },
    {
        "name": "Tone",
        "color": "#FFD700", // Gold
        "alphabetize": true,
        "tags": [
            { "name": "Gritty", "icon": "💀" },
            { "name": "Light-hearted", "icon": "😊" },
            { "name": "Horror", "icon": "👻" },
            { "name": "Comedy", "icon": "😂" },
            { "name": "Mystery", "icon": "🕵️" },
            { "name": "Tragic", "icon": "😢" },
            { "name": "Epic", "icon": "⚔️" },
            { "name": "Heroic", "icon": "🦸" },
            { "name": "Survival", "icon": "🌲" },
            { "name": "Lovecraftian", "icon": "🐙" },
            { "name": "Gothic", "icon": "🦇" },
            { "name": "Romantic", "icon": "💘" },
            { "name": "Satirical", "icon": "🎭" }
        ]
    },
    {
        "name": "Setting",
        "color": "#4682B4", // SteelBlue
        "alphabetize": true,
        "tags": [
            { "name": "Urban Fantasy", "icon": "🏙" },
            { "name": "Steampunk", "icon": "⚙️" },
            { "name": "Cyberpunk", "icon": "🤖" },
            { "name": "Underwater", "icon": "🌊" },
            { "name": "Skybound", "icon": "☁️" },
            { "name": "Desert", "icon": "🏜️" },
            { "name": "Jungle", "icon": "🌴" },
            { "name": "Arctic", "icon": "❄️" },
            { "name": "Pirate", "icon": "🏴‍☠️" },
            { "name": "Underground", "icon": "🕳️" },
            { "name": "Space", "icon": "🌌" },
            { "name": "Ancient Ruins", "icon": "🏛️" },
            { "name": "Time Travel", "icon": "⏳" }
        ]
    },
    {
        "name": "Supernatural Elements",
        "color": "#800080", // Purple
        "alphabetize": true,
        "tags": [
            { "name": "Supernatural", "icon": "🧿" },
            { "name": "Vampires", "icon": "🧛" },
            { "name": "Werewolves", "icon": "🐺" },
            { "name": "Zombies", "icon": "🧟" },
            { "name": "Aliens", "icon": "👽" },
            { "name": "Ghosts", "icon": "👻" },
            { "name": "Demons", "icon": "👹" }
        ]
    },
    {
        "name": "Conflict Type",
        "color": "#DC143C", // Crimson
        "alphabetize": true,
        "tags": [
            { "name": "Political Intrigue", "icon": "🎩" },
            { "name": "Military Campaign", "icon": "🔫" },
            { "name": "Dungeon Crawl", "icon": "🗝️" },
            { "name": "Exploration", "icon": "🧭" },
            { "name": "Survival", "icon": "🪓" }
        ]
    },
    {
        "name": "Genre",
        "color": "#FFA500", // Orange
        "alphabetize": true,
        "tags": [
            { "name": "SCI-FI", "icon": "🚀" },
            { "name": "Fantasy", "icon": "🧙‍♂️" },
            { "name": "Sword and Sorcery", "icon": "🗡️" },
            { "name": "Mythological", "icon": "🏺" },
            { "name": "Planar Travel", "icon": "🌌" },
            { "name": "Historical Fiction", "icon": "📜" }
        ]
    },
    {
        "name": "Difficulty Level",
        "color": "#FFD700", // Gold
        "alphabetize": false,
        "tags": [
            { "name": "Easy", "icon": "😌" },
            { "name": "Hard", "icon": "😠" },
            { "name": "Very Hard", "icon": "😤" }
        ]
    },
    {
        "name": "Meta",
        "color": "#2E8B57", // SeaGreen
        "alphabetize": true,
        "tags": [
            { "name": "LGBT Friendly", "icon": "🏳️‍🌈" },
            { "name": "Disability Inclusiveness", "icon": "♿" },
            { "name": "Beginner DM", "icon": "🧙‍♂️" },
            { "name": "Noob Friendly", "icon": "🎮" },
            { "name": "Rules-Light", "icon": "📖" },
            { "name": "Rules-Heavy", "icon": "📚" }
        ]
    },
    {
        "name": "Homebrew",
        "color": "#37dfc2",
        "tags": [
            { "name": "Homebrew Subclasses", "icon": "📜" },
            { "name": "Homebrew Classes", "icon": "📜" },
            { "name": "Homebrew Items", "icon": "🧰" },
            { "name": "Homebrew Races", "icon": "🧝" },
            { "name": "Homebrew Feats", "icon": "📜" },
            { "name": "Homebrew Rules", "icon": "📜" },
            { "name": "Laserllama Homebrew", "icon": "🦙" },
            { "name": "KibbleTasty Homebrew", "icon": "🍖" }
        ]


    },
    {
        "name": "Triggers",
        "color": "#DC143C", // Crimson
        "alphabetize": true,
        "tags": [
            { "name": "Blood", "icon": "🩸" },
            { "name": "Needles", "icon": "💉" },
            { "name": "Medical Procedures", "icon": "🏥" },
            { "name": "Body Horror", "icon": "👁️" },
            { "name": "Animal Harm", "icon": "🐾" },
            { "name": "Child Harm", "icon": "🚸" },
            
        ]
    },
    {
        "name": "Age-Restricted",
        "color": "#8B0000", // DarkRed
        "alphabetize": true,
        "tags": [
            { "name": "NSFW", "icon": "🔞" },
            { "name": "Drug Use", "icon": "💊" },
            { "name": "Suicide", "icon": "💀" },
            { "name": "Mental Illness", "icon": "🧠" },
            { "name": "Self-Harm", "icon": "🔪" },
            { "name": "Torture", "icon": "🔨" },
            { "name": "Gore", "icon": "🩸" },
            { "name": "Extreme Violence", "icon": "🔪" },
            { "name": "Body Mutilation", "icon": "🩸" },
            { "name": "Human Trafficking", "icon": "🚷" },
            { "name": "Sexual Content", "icon": "🍑" },
            { "name": "Sexual Assault", "icon": "🚫" }
        ]
    }
];

const ageRestrictedTags = ["NSFW", "Drug Use", "Suicide", "Mental Illness", "Self-Harm", "Torture", "Gore", "Extreme Violence", "Body Mutilation", "Human Trafficking", "Sexual Content", "Sexual Assault"];

const TagsManager = ({ enabledTags, setEnabledTags, minAge }) => {
    const [availableTags, setAvailableTags] = useState([]);

    useEffect(() => {
        const combinedTags = tagCategories.flatMap(category => {
            if (category.alphabetize) {
                return category.tags.sort((a, b) => a.name.localeCompare(b.name));
            }
            return category.tags;
        });
    
        const filteredTags = combinedTags
            .filter(tag => !(minAge < 18 && ageRestrictedTags.includes(tag.name)))
            .map(tag => tag.name);
    
        setAvailableTags(filteredTags);
    
        // Automatically remove age-restricted tags if minAge is below 18
        if (minAge < 18) {
            const updatedEnabledTags = enabledTags.filter(tag => !ageRestrictedTags.includes(tag.name));
            if (updatedEnabledTags.length !== enabledTags.length) {
                setEnabledTags(updatedEnabledTags);
            }
        }
    }, [minAge, enabledTags, setEnabledTags]);
    

    const handleTagClick = (tag) => {
        if (!enabledTags.some(t => t.name === tag.name)) {
            const newEnabledTags = [...enabledTags, tag].sort((a, b) => a.name.localeCompare(b.name));
            setEnabledTags(newEnabledTags);
        }
    };

    const handleTagRemove = (tag) => {
        setEnabledTags(enabledTags.filter(t => t.name !== tag.name));
    };

    const renderTag = (tag, category) => (
        <div
            key={tag.name}
            className={`tag ${tag.name === "LGBT Friendly" ? "lgbt-friendly" : ""}`}
            style={{ borderColor: category.color }}
            onClick={() => handleTagClick(tag)}
            data-icon={tag.icon}
        >
            {tag.name}
        </div>
    );

    return (
        <div className="tags-wrapper">
            <div className="tags-half">
                <label className="small-label">Available Tags:</label>
                <div className="tags-container">
                    {tagCategories.map(category =>
                        category.tags
                            .filter(tag => availableTags.includes(tag.name))
                            .map(tag => renderTag(tag, category))
                    )}
                </div>
            </div>
            <div className="tags-half">
                <label className="small-label">Enabled Tags:</label>
                <div className="enabled-tags-container">
                    {enabledTags.map(tag => {
                        const category = tagCategories.find(category => category.tags.some(t => t.name === tag.name));
                        return (
                            <div
                                key={tag.name}
                                className="enabled-tag"
                                style={{ borderColor: category.color }}
                                data-icon={tag.icon}
                            >
                                {tag.name} 
                                <span className="remove-tag" onClick={() => handleTagRemove(tag)}>X</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TagsManager;
