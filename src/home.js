import React, { useState, useEffect } from 'react';
import './styles/pages/index.css';

import { NavBar } from './components/navbar';
import { MobileNavbar, hideMobileNav } from './components/mobileNavbar';
import { Loader } from './components/loader';
import { Footer } from './components/footer';

import emailjs from '@emailjs/browser';
import { Link } from 'react-router-dom';

import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase.config';

import { BsAward, BsFillPersonFill } from 'react-icons/bs';
import { FaReact } from 'react-icons/fa';
import { MdOutlineHourglassEmpty } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";

import VisibilitySensor from 'react-visibility-sensor';
import { useInView } from 'react-intersection-observer';

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";

const Label = props => {
    return (
        <div className="label">
            <div id="labelWrapper"></div>

            <img src="./sphere.png" alt="sphere" />
            <h3>{props.text}</h3>
        </div>
    )
}

const JobEntry = props => {
    const openEntry = () => {
        const jobEntry = document.querySelector('[entrynum="' + props.entryNum + '"].jobEntry');

        const topHeight = document.querySelector('[entrynum="' + props.entryNum + '"].jobEntry #collData').scrollHeight ;
        const descHeight = document.querySelector('[entrynum="' + props.entryNum + '"].jobEntry #description p').scrollHeight + 25;
        const wrapHeight = topHeight + descHeight;

        if(!jobEntry.classList.contains("open")) jobEntry.style.height = String(wrapHeight) + "px";
        else jobEntry.removeAttribute("style");
        
        jobEntry.classList.toggle('open');
    }

    return (
        <div entrynum={props.entryNum} className="jobEntry" onClick={openEntry}>
            <div id="collData">
                <div id="rightSection">
                    <img src={props.src} alt="Employer" />

                    <div id="text">
                        <p>{props.position}</p>
                        <h3>{props.employer}</h3>
                    </div>
                </div>

                <div id="leftSection">
                    <div className="jobData">
                        <MdOutlineHourglassEmpty id="icon" />
                        <p>{props.date}</p>
                    </div>

                    <div className="jobData">
                        <HiOutlineLocationMarker id="icon" />
                        <p>{props.location}</p>
                    </div>
                </div>
            </div>

            <div id="description">
                <p>{props.description}</p>
            </div>
        </div>
    )
}

const FeedbackSlide = props => {
    return (
        <div className="feedbackWrapper">
           <img id="quote" src="./quote.svg" alt="Quote" />
            <h3 id="quoteText">{props.text}</h3>

            <div id="author">
                <div
                    id="img"
                    style={{backgroundImage: `url(${props.author.img})`}}
                ></div>

                <div id="text">
                    <h3>{props.author.name}</h3>
                    <h4>{props.author.position}</h4>
                </div>
            </div>
        </div>
    );
}

const CustomInput = props => {
    return (
        <div className="inputWrapper">
            <img src={props.src} alt={props.type} />

            <input
                value={props.value}
                onChange={props.onChange}
                
                type={props.type}
                placeholder={props.placeholder}
            />
        </div>
    );
}

export default function Home() {
    const [skills, setSkills] = useState();
    const [jobs, setJobs] = useState();
    const [projects, setProjects] = useState();
    const [feedbacks, setFeedbacks] = useState();

    const [ techsShown, setTechsShown ] = useState();
    const [ feedsShown, setFeedsShown ] = useState();

    const changeThumbPos = (isVisible, endPos) => {
        if(isVisible && document.querySelector('#scroll #track #thumb').style.top !== String(endPos) + "px") document.querySelector('#scroll #track #thumb').style.marginTop = String(endPos) + "px"
    }

    const updateSkills = (entry, buttonNum) => {
        setTechsShown(entry);

        document.querySelectorAll('#skillsWrapper #cellWrapper div').forEach(cell => cell.style.transitionDelay = "0s");

        document.querySelectorAll('#details button').forEach((button, index) => {
            if(index !== buttonNum) {
                button.classList.remove('active');
                return
            }
            button.classList.add('active');
        })
    }

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");

    const handleSubmit = e => {
        e.preventDefault();

        document.getElementById("success").style.display = "none";

        if(firstName.trim() === "" || lastName.trim() === "" || email.trim() === "" || msg.trim() === "") {
            document.getElementById("error").innerText = "All areas must be filled !"
            document.getElementById("error").style.display = "flex";

            setTimeout(() => {
                document.getElementById("error").style.display = "none";
            }, 2600);
            return
        }

        document.getElementById("error").style.display = "none";
        document.getElementById("loaderOverlay").style.display = "flex";

        emailjs.send(
            process.env.REACT_APP_EMAIL_SERVICE,
            process.env.REACT_APP_EMAIL_TEMP, {
            name: (firstName + " " + lastName),
            from_email: email,
            msg,
        }, process.env.REACT_APP_EMAIL_USER).then(data => {
            document.getElementById("loaderOverlay").style.display = "none";
            
            if(data.status !== 200) {
                document.getElementById("error").innerText = "An error occured, try later !"
                document.getElementById("error").style.display = "flex";

                setTimeout(() => {
                    document.getElementById("error").style.display = "none";
                }, 2600);
                return
            }
            
            setFirstName("")
            setLastName("")
            setEmail("")
            setMsg("")
            document.getElementById("success").style.display = "flex";
            setTimeout(() => {
                document.getElementById("success").style.display = "none";
            }, 2600);
        })
    }

    const countUp = (countTo, cellElement, numPosition, delay) => {
        const text = cellElement.innerText;
        const beforeText = text.substring(0, numPosition);
        const afterText = text.substring(numPosition + 1, text.length + 1);

        let i = 2;
        cellElement.innerText = beforeText + 1 + afterText;

        const increment = () => setTimeout(() => {
            cellElement.innerText = beforeText + i + afterText;

            i++;
            if(i <= countTo) increment()
        }, delay);

        increment();
    }

    const [cell1Ref, cell1InView] = useInView({ threshold: 1 });
    const [cell1Counted, setCell1Counted] = useState(false);

    const [cell2Ref, cell2InView] = useInView({ threshold: 1 });
    const [cell2Counted, setCell2Counted] = useState(false);

    const [cell3Ref, cell3InView] = useInView({ threshold: 1 });
    const [cell3Counted, setCell3Counted] = useState(false);

    useEffect(() => {
        if(cell1InView && !cell1Counted) {
            setCell1Counted(true);
            countUp(
                42,
                document.querySelector('.restCell:first-child h3'),
                0,
                70
            );
        }
    }, [cell1InView]);

    useEffect(() => {
        if(cell2InView && !cell2Counted) {
            setCell2Counted(true);
            countUp(
                30,
                document.querySelector('.restCell:nth-child(2) h3'),
                0,
                70
            );
        }
    }, [cell2InView]);

    useEffect(() => {
        if(cell3InView && !cell3Counted) {
            setCell3Counted(true);
            countUp(
                3,
                document.querySelector('.restCell:nth-child(3) h3'),
                1,
                300
            );
        }
    }, [cell3InView]);

    const [ chartRef, chartInView ] = useInView({ threshold: 0.8 });
    const [ skillsRef, skillsInView ] = useInView({ threshold: 0.7 });

    useEffect(() => {
        const pieChart = document.getElementById('pieChart');

        if(chartInView && !pieChart.classList.contains('active')) pieChart.classList.add('active');
    }, [chartInView]);

    useEffect(() => {
        const skillsWrapper = document.getElementById('skillsWrapper');

        if(skillsInView && !skillsWrapper.classList.contains('active')) skillsWrapper.classList.add('active');
    }, [skillsInView]);

    useEffect(() => {
        document.title = `MejdiDevs | Loading...`;
        const skillsCollection = collection(db, 'Skills');
        const jobsCollection = collection(db, 'Technologies');
        const projectsCollection = collection(db, 'HomeProjects');
        const feedbacksCollection = collection(db, 'Feedbacks');

        getDocs(skillsCollection)
        .then(
            data => {
                const cleanData = data.docs.map(doc => doc.data())[0];
                setSkills(cleanData);
                setTechsShown(cleanData.web);
            }
        );

        getDocs(jobsCollection)
        .then(
            data => setJobs(data.docs.map(doc => doc.data()))
        );

        getDocs(projectsCollection)
        .then(data => {
            let localProj = data.docs.map(doc => doc.data())[0].projects;
            localProj.length = 7;

            setProjects(localProj)
        });

        getDocs(feedbacksCollection)
        .then(
            data => {
                const cleanData = data.docs.map(doc => doc.data())[0];
                
                setTimeout(() => {
                    setFeedbacks(cleanData);
                    setFeedsShown(cleanData.Clients);
                    document.title = `MejdiDevs | Portfollio`;
                }, 700);
            }
        );
    }, []);

    let loaded = false;

    const scrollOnLoad = () => {
        if(loaded) return;
        const section = sessionStorage.getItem('navTo');

        if(!section) return;
        if(!document.getElementById(section)) return;

        document.getElementById(section).scrollIntoView();
        sessionStorage.clear();

        loaded = true;
    }

    if(typeof(jobs) === 'undefined' || typeof(feedbacks) === 'undefined' || typeof(skills) === 'undefined' || typeof(projects) === 'undefined')
    return <Loader />

    return (
        <div id="homeAppWrapper" onLoad={scrollOnLoad}>
            <div id="scroll">
                <div id="track">
                    <div id="thumb"></div>
                </div>

                <ul>
                    <a href="#home">
                        <li>Start</li>
                    </a>

                    <a href="#skills">
                        <li>01</li>
                    </a>

                    <a href="#Experience">
                        <li>02</li>
                    </a>

                    <a href="#Projects">
                        <li>03</li>
                    </a>

                    <a href="#Feedback">
                        <li>04</li>
                    </a>

                    <a href="#Contact">
                        <li>05</li>
                    </a>
                </ul>
            </div>

            <div id="overlay" onClick={hideMobileNav}></div>
            <MobileNavbar isHome={true} />

            <section id="home">

                <NavBar isHome={true} />

                <div id="body">
                    <div id="face">
                        <div id="imgWrapper">
                            <div id="img"></div>

                            <div className="circle"></div>
                            <div className="circle"></div>
                            <div className="circle"></div>
                            <div className="circle"></div>
                            <div className="circle"></div>
                            <div className="circle"></div>
                        </div>

                        <a href="/#Contact">
                            <div id="sayHi">
                                Say Hi 👋
                            </div>
                        </a>
                    </div>

                    <div id="text">
                        <h3>Introduction</h3>

                        <div id="Iam">
                            <div id="name">
                                <h1>I am </h1>

                                <VisibilitySensor partialVisibility={true} minTopValue={200} onChange={isVisible => changeThumbPos(isVisible, 0)} >
                                    <h1>&nbsp; Mejdi Chennoufi</h1>
                                </VisibilitySensor>

                            </div>

                            <h1 id="title">Full-Stack Web Dev</h1>
                        </div>

                        <p>Iot Trainer - Mobile Developer - Graphic Designer</p>

                        <a href="./resume.pdf">
                            <button className='radialButton active'>Download CV</button>
                        </a>
                    </div>

                    <VisibilitySensor partialVisibility='top' minTopValue={200} onChange={isVisible => changeThumbPos(isVisible, 24.5)} >
                        <div id="rest">
                            <div ref={cell1Ref} className="restCell">
                                <BsAward className="icon" />
                                <h3>0 Projects <br/> Completed</h3>
                            </div>

                            <div ref={cell2Ref} className="restCell">
                                <BsFillPersonFill className="icon" />
                                <h3>0 Satisfied <br/> Clients</h3>
                            </div>

                            <div ref={cell3Ref} className="restCell">
                                <FaReact className="icon" />
                                <h3>+0 Years <br/> Experience</h3>
                            </div>
                        </div>
                    </VisibilitySensor>
                </div>
            </section>

            <div id="skills"></div>

                <section id="skillsSection">

                    <VisibilitySensor partialVisibility='top' minTopValue={300} onChange={isVisible => changeThumbPos(isVisible, 49)} >

                        <div id="main">

                            <Label text="Skills" />

                            <div id="chartWrapper">
                                <h1>Graphic Design</h1>
                                <h1>Soft Skills</h1>
                                <h1>Back-End Dev</h1>
                                <h1>Internet Of Things</h1>
                                <h1>Mobile Development</h1>
                                <h1>Web Development</h1>

                                <svg id="pieChart" ref={chartRef} width="509" height="509" viewBox="0 0 509 533" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path className="pieSection" fillRule="evenodd" clipRule="evenodd" d="M105.864 166.743C90.349 192.417 81.4204 222.518 81.4204 254.705C81.4204 285.403 89.5427 314.205 103.755 339.078L254 252.434L105.864 166.743Z" fill="#7B61FF" fillOpacity="0.55"/>
                                    <path className="pieSection" fillRule="evenodd" clipRule="evenodd" d="M409.52 344.052C425.081 317.469 434 286.526 434 253.5C434 220.672 425.187 189.902 409.799 163.427L253.294 253.681L409.52 344.052Z" fill="#308021"/>
                                    <path className="pieSection" fillRule="evenodd" clipRule="evenodd" d="M71.3035 359.633C89.2966 391.422 115.851 418.906 149.916 438.269C183.275 457.229 219.64 466.017 255.427 465.618L254.096 252.651L71.3035 359.633Z" fill="#43A5E3" fillOpacity="0.8"/>
                                    <path className="pieSection" fillRule="evenodd" clipRule="evenodd" d="M257.021 63.2741C224.365 62.8836 191.175 70.8871 160.733 88.1878C130.854 105.168 107.315 129.007 90.9703 156.6L255.57 253.241L257.021 63.2741Z" fill="#FF7070" fillOpacity="0.7"/>
                                    <path className="pieSection" fillRule="evenodd" clipRule="evenodd" d="M254.666 432.025C284.387 431.785 314.455 424.084 342.033 408.162C371.039 391.415 393.546 367.736 408.67 340.424L254.816 251.495L254.666 432.025Z" fill="#FF7070" fillOpacity="0.5"/>
                                    <path className="pieSection" fillRule="evenodd" clipRule="evenodd" d="M394.878 172.69C381.095 148.296 360.81 127.155 334.79 112.132C310.138 97.8996 283.304 90.8706 256.725 90.3921L256.645 252.345L394.878 172.69Z" fill="#C4C4C4" fillOpacity="0.8"/>
                                    
                                    <line x1="255.5" y1="4.70227" x2="255.5" y2="503.369" stroke="#C5C5D0" strokeWidth="3"/>
                                    <line x1="37.917" y1="377.403" x2="469.775" y2="128.07" stroke="#C5C5D0" strokeWidth="3"/>
                                    <line x1="39.417" y1="128.07" x2="471.275" y2="377.403" stroke="#C5C5D0" strokeWidth="3"/>

                                    <circle cx="254" cy="254.036" r="200" stroke="#C5C5D0" strokeWidth="3"/>
                                    <circle cx="254" cy="254.036" r="50" stroke="#C5C5D0" strokeWidth="3"/>
                                    <circle cx="254" cy="254.036" r="100" stroke="#C5C5D0" strokeWidth="3"/>
                                    <circle cx="254" cy="254.036" r="150" stroke="#C5C5D0" strokeWidth="3"/>
                                    <circle cx="254" cy="254.036" r="250" stroke="#393939" strokeWidth="8"/>
                                </svg>

                                <div id="keys">
                                    <ul>
                                        <li>
                                            <div></div>
                                            <p> Mobile Developement </p>
                                        </li>

                                        <li>
                                            <div></div>
                                            <p> Soft Skills </p>
                                        </li>

                                        <li>
                                            <div></div>
                                            <p> Back-end Dev </p>
                                        </li>

                                        <li>
                                            <div></div>
                                            <p> Web Developement </p>
                                        </li>

                                        <li>
                                            <div></div>
                                            <p> Graphic Design </p>
                                        </li>

                                        <li>
                                            <div></div>
                                            <p> Internet Of Things </p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </VisibilitySensor>

                    <VisibilitySensor partialVisibility='top' minTopValue={300} onChange={isVisible => changeThumbPos(isVisible, 79.5)} >
                        <div id="detailsWrapper">
                            <Label text="Technologies" />

                            <div id="details">
                                <div id="selector">
                                    <button className='radialButton active' onClick={() => updateSkills(skills.web, 0)}>Web Development</button>

                                    <button className='radialButton' onClick={() => updateSkills(skills.graphic, 1)}>Graphic Design</button>

                                    <button className='radialButton' onClick={() => updateSkills(skills.mobile, 2)}>Mobile Development</button>
                                </div>

                                <div ref={skillsRef} id="skillsWrapper">
                                    {
                                        techsShown.map((skill, index) => (
                                            <div key={"techSkill-" + index} className="techSkillWrapper">
                                                <h1>{skill.lang}</h1>

                                                <div id="cellWrapper">
                                                    <div className={(skill.lvl >= 1) ? "active" : ""}></div>
                                                    <div className={(skill.lvl >= 2) ? "active" : ""}></div>
                                                    <div className={(skill.lvl >= 3) ? "active" : ""}></div>
                                                    <div className={(skill.lvl >= 4) ? "active" : ""}></div>
                                                    <div className={(skill.lvl >= 5) ? "active" : ""}></div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>

                    </VisibilitySensor>

                </section>

                <div id="Experience"></div>

                <VisibilitySensor partialVisibility='top' minTopValue={400} onChange={isVisible => changeThumbPos(isVisible, 110)} >
                    <section id="experienceSection">

                        <Label text="Experience" />

                        <div id="jobsWrapper">
                            {
                                jobs.map((job, index) =>
                                    <JobEntry
                                        key={'job-' + index}
                                        entryNum={index}
                                        src={job.src}
                                        employer={job.employer}
                                        position={job.position}
                                        date={job.date}
                                        location={job.location}
                                        description={job.description}
                                    />
                                )
                            }
                        </div>
                    </section>
                </VisibilitySensor>

                <div id="Projects"></div>

                <VisibilitySensor partialVisibility='top' minTopValue={400} onChange={isVisible => changeThumbPos(isVisible, 178)} >
                    <section id="ProjectsSection">

                        <Label text="Projects" />

                        <div id="presWrapper">
                            <div id="presentation">
                            
                                {
                                    projects.map((project, index) =>
                                        <Link
                                            key={`project-${index}`}
                                            style={{backgroundImage: `url(${project.image})`}}
                                            to={`/project?id=${project.id}`}>
                                        </Link>
                                    )
                                }

                            </div>
                        </div>

                        <center>
                            <Link to='/projects'>
                                <h1>See More Projects ...</h1>
                            </Link>
                        </center>

                    </section>
                </VisibilitySensor>

                <div id="Feedback"></div>

                <VisibilitySensor partialVisibility='top' minTopValue={450} onChange={isVisible => changeThumbPos(isVisible, 233)} >
                    <section id="FeedbackSection">

                        <div className="topRow">
                            <Label text="Feedback" />

                            <div id="selector">
                                <button className="radialButton active" onClick={() => setFeedsShown(feedbacks.Clients)}>Clients</button>

                                <button className="radialButton active" onClick={() => setFeedsShown(feedbacks.Colleagues)}>Colleagues</button>
                            </div>
                        </div>

                        <h1>What people I've worked with had to say about my services:</h1>

                        <div id="circle1"></div>
                        <div id="circle2"></div>

                        <div id="CarrWrapper">
                            <Swiper
                                className='home'

                                breakpoints={{
                                    1260: {
                                        slidesPerView: 3,
                                        spaceBetween: 60,
                                    },

                                    800: {
                                        slidesPerView: 2,
                                        spaceBetween: 60,
                                    },

                                    0: {
                                        slidesPerView: 1,
                                        spaceBetween: 10,
                                    }
                                }}
                                
                                loop={true}
                                navigation={true}
                                autoplay={true}
                                modules={[Pagination, Navigation, Autoplay]}
                            >

                                {
                                    feedsShown.map((feedback, index) =>
                                        <SwiperSlide key={"feedback-" + index}>
                                            <FeedbackSlide
                                                text={feedback.text}
                                                author={feedback.author}
                                            />
                                        </SwiperSlide>
                                    )
                                }
                                
                            </Swiper>

                            <img id="navigation" src="./arrowLeft.svg" alt="Arrow" onClick={() => document.querySelector('.swiper-button-next').click()} />
                        </div>

                    </section>
                </VisibilitySensor>

                <div id="Contact"></div>

                <VisibilitySensor partialVisibility='top' minTopValue={400} onChange={isVisible => changeThumbPos(isVisible, 257)} >
                    <section id="ContactSection">
                        <Label text="Contact" />

                        <h1>Get in Touch With Me!</h1>

                        <form onSubmit={handleSubmit}>
                            <div id="nameWrapper">
                                <CustomInput
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}

                                    src="./input-icons/user.svg"
                                    type="text"
                                    placeholder="First Name"
                                />

                                <CustomInput
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}

                                    src="./input-icons/user.svg"
                                    type="text"
                                    placeholder="Last Name"
                                />
                            </div>

                            <CustomInput
                                value={email}
                                onChange={e => setEmail(e.target.value)}

                                src="./input-icons/envelope.svg"
                                type="email"
                                placeholder="Email"
                            />

                            <div className="inputWrapper">
                                <img src="./input-icons/chat.svg" alt="textarea" />

                                <textarea
                                    value={msg}
                                    onChange={e => setMsg(e.target.value)}

                                    placeholder="Send us your feedback/ suggestion etc.."
                                    cols="30"
                                    rows="10">
                                </textarea>
                            </div>

                            <div id="loaderOverlay">
                                <Loader />
                            </div>

                            <div id="success">Message Sent, Thank you !</div>
                            <div id="error"></div>

                            <div id="bottomRow">
                                <input type="submit" value="Send" className="radialButton active" />

                                <div id="links">
                                    <a target="blank" href="https://www.facebook.com/mejdy.chennoufy">
                                        <img src="./socials-icons/facebook.png" alt="Facebook" />
                                    </a>

                                    <a target="blank" href="https://www.instagram.com/mejdichennoufi/">
                                        <img src="./socials-icons/instagram.png" alt="Instagram" />
                                    </a>

                                    <a target="blank" href="https://twitter.com/mejdiDevs">
                                        <img src="./socials-icons/twitter.png" alt="Twitter" />
                                    </a>
                                </div>
                            </div>
                        </form>
                    </section>
                </VisibilitySensor>

            <Footer />
        </div>
    )
}
