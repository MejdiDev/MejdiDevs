import React, { useState, useEffect } from 'react';

import { NavBar } from './components/navbar';
import { MobileNavbar, hideMobileNav } from './components/mobileNavbar';
import { Loader } from './components/loader';
import { Footer } from './components/footer';

import { db } from './firebase.config.js';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { useNavigate } from "react-router-dom";

import './styles/pages/project.css';

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";

export default function Project() {
    const navigate = useNavigate();
    const [project, setProject] = useState();

    const fetchData = async(id) => {
        const ProjectCollection = collection(db, 'Projects');

        getDocs(
            query(
                ProjectCollection,
                where("id", "==", id.toLowerCase())
            )
        ).then(data => {
            const projectData = data.docs.map(doc => doc.data());
            if(projectData.length === 0) navigate(-1);

            setTimeout(() => setProject(projectData[0]) , 700);
            document.title = `MejdiDevs | ${projectData[0].title}`;
        });
    }

    useEffect(() => {
        document.title = `MejdiDevs | Loading...`;
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('id');
        if(id === null) navigate(-1);

        fetchData(id);
    }, []);

    if(typeof(project) === 'undefined') return (
        <Loader />
    )

    return(
        <div id="appWrapper">
            <NavBar isHome={false} />

            <div id="overlay" onClick={hideMobileNav}></div>
            <MobileNavbar isHome={false} />

            <Swiper
                slidesPerView={1}
                centeredSlides={true}

                breakpoints={{
                    1270: { spaceBetween: 60 },
                    0: { spaceBetween: 30 }
                }}

                loop={true}
                navigation={true}
                autoplay={true}
                grabCursor={true}
                modules={[Pagination, Navigation, Autoplay]}
            >

                {
                    project.carrImages.map((link, index) => 
                        <SwiperSlide key={"slide-" + index}>
                            <div
                            style={{
                                backgroundImage: "url('" + link + "')",
                                backgroundSize: project.backgroundFit,
                                backgroundPosition: (project.backgroundFit === "contain") ? "center" : "top",
                                borderRadius: (project.backgroundFit === "contain") ? "10px" : "0"
                            }}
                            ></div>
                        </SwiperSlide>
                    )
                }
                
            </Swiper>

            <div id="detailsWrapper">
            <div id="tagsWrapper">
                        {
                            project.tags.map((tag, index) =>
                                <div key={`tag-${index}`} className="tag">{ tag }</div>
                            )
                        }
                    </div>
                <div id="details">
                    <h1 id="title">{project.title}</h1>

                    <p>{project.description1}</p>

                    <h2>About The Project</h2>

                    <p>{project.about}</p>

                    <div id="smImgWrapper">
                        <div
                            style={{
                                backgroundImage: "url(" + project.smollImages[0] + ")",
                                backgroundPosition: (project.backgroundFit === "contain") ? "center" : "top",
                                backgroundSize: project.backgroundFit
                            }}
                        ></div>
                        <div
                            style={{
                                backgroundImage: "url(" + project.smollImages[1] + ")",
                                backgroundPosition: (project.backgroundFit === "contain") ? "center" : "top",
                                backgroundSize: project.backgroundFit,
                            }}
                        ></div>
                    </div>

                    <p>{project.description2}</p>

                    <div id="buttonsWrapper">
                        <a href="../resume.pdf">
                            <button className="radialButton active">Download CV</button>
                        </a>

                        <a href="/#Contact" onClick={() => sessionStorage.setItem('navTo', "Contact")}>
                            <button className="radialButton active">Contact</button>
                        </a>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}