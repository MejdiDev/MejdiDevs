import React, { useState, useEffect } from 'react';

import { NavBar } from './components/navbar';
import { MobileNavbar, hideMobileNav } from './components/mobileNavbar';
import { Loader } from './components/loader';
import { Footer } from './components/footer';

import "./styles/pages/projectList.css";

import { Link } from 'react-router-dom';

import { db } from './firebase.config.js';
import { collection, getDocs } from 'firebase/firestore';

const shuffleArray = array => {
    let currentIndex = array.length,  randomIndex;

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}

export default function ProjectList() {
    const [projects, setProjects] = useState();

    useEffect(() => {
        const projectsCollection = collection(db, 'HomeProjects');

        getDocs(projectsCollection)
        .then(
            data => setTimeout(() => {
                setProjects(
                    shuffleArray(data.docs.map(doc => doc.data())[0].projects));
                document.title = `MejdiDevs | Projects`;
            }, 800)
        );
    }, [])

    if(typeof(projects) === 'undefined')
    return <Loader />

    return (
        <div id="projectList">
            <NavBar isHome={false} />

            <div id="overlay" onClick={hideMobileNav}></div>

            <MobileNavbar isHome={false} />

            <div className="wrapper">
                {
                    projects.map((project, index) => 
                    <Link
                        className={project.class}
                        key={`project-${index}`}
                        style={{backgroundImage: `url(${project.image})`}}
                        to={`/project?id=${project.id}`}>
                    </Link>
                    )
                }
            </div>
        </div>
    );
}