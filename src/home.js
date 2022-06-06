import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import './styles/pages/index.css';
import { NavBar } from './components/navbar';
import { MobileNavbar, hideMobileNav } from './components/mobileNavbar';
import { Loader } from './components/loader';
import { Footer } from './components/footer';

import emailjs from '@emailjs/browser';
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
        console.log(document.querySelector('[entrynum="' + props.entryNum + '"].jobEntry'));
        document.querySelector('[entrynum="' + props.entryNum + '"].jobEntry').classList.toggle('open');
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

            <div id="description">{props.description}</div>
        </div>
    )
}

const FeedbackSlide = props => {
    return (
        <div className="feedbackWrapper">

            <img id="quote" src="./quote.svg" alt="Quote" />
            <h3 id="quoteText">{props.text}</h3>

            <div id="author">
                <img src={props.author.img} alt={props.author.name} />

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
    const [feedbacks, setFeedbacks] = useState();

    const [ techsShown, setTechsShown ] = useState();
    const [ feedsShown, setFeedsShown ] = useState();

    const changeThumbPos = (isVisible, endPos) => {
        if(isVisible && document.querySelector('#scroll #track #thumb').style.top !== String(endPos) + "px") document.querySelector('#scroll #track #thumb').style.marginTop = String(endPos) + "px"
    }

    const updateSkills = (entry, buttonNum) => {
        setTechsShown(entry);

        document.querySelectorAll('#skillsWrapper #cellWrapper div').forEach(cell => cell.style.transitionDelay = "0s")

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

        emailjs.send('service_ii4knd2', 'template_9mw8xoo', {
            name: (firstName + " " + lastName),
            from_email: email,
            msg,
        }, 'user_umz4PoLI7NcoxEC2FAxIC')
    }

    const [ chartRef, chartInView ] = useInView({ threshold: 0.8 });
    const [ skillsRef, skillsInView ] = useInView({ threshold: 0.95 });

    useEffect(() => {
        const pieChart = document.getElementById('pieChart');

        if(chartInView && !pieChart.classList.contains('active')) pieChart.classList.add('active');
    }, [chartInView]);

    useEffect(() => {
        const skillsWrapper = document.getElementById('skillsWrapper');

        if(skillsInView && !skillsWrapper.classList.contains('active')) skillsWrapper.classList.add('active');
    }, [skillsInView]);

    useEffect(() => {
        const skillsCollection = collection(db, 'Skills');
        const jobsCollection = collection(db, 'Technologies');
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

        getDocs(feedbacksCollection)
        .then(
            data => {
                const cleanData = data.docs.map(doc => doc.data())[0];
                
                setTimeout(() => {
                    setFeedbacks(cleanData);
                    setFeedsShown(cleanData.Clients);
                }, 800);
            }
        );
    }, []);

    if(typeof(jobs) === 'undefined' || typeof(feedbacks) === 'undefined' || typeof(skills) === 'undefined') return (
        <Loader />
    )

    return (
        <div id="appWrapper">
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
            <MobileNavbar />

            <section id="home">

                <NavBar />

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

                        <div id="sayHi">
                            Say Hi 👋
                        </div>
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
                            <div className="restCell">
                                <BsAward className="icon" />
                                <h3>05</h3>
                                <h3>Awards</h3>
                            </div>

                            <div className="restCell">
                                <BsFillPersonFill className="icon" />
                                <h3>15 Satisfied <br/> Clients</h3>
                            </div>

                            <div className="restCell">
                                <FaReact className="icon" />
                                <h3>+2 Years <br/> Experience</h3>
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
                                <h1>Communication</h1>
                                <h1>Teaching</h1>
                                <h1>Internet Of Things</h1>
                                <h1>UI Design</h1>
                                <h1>Web Development</h1>

                                <svg id="pieChart" ref={chartRef} width="509" height="509" viewBox="0 0 509 533" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path className="pieSection" fillRule="evenodd" clipRule="evenodd" d="M106.444 190.845C90.9286 216.519 82 246.62 82 278.807C82 309.505 90.1223 338.307 104.335 363.18L254.579 276.536L106.444 190.845Z" fill="#7B61FF" fillOpacity="0.55"/>
                                    <path className="pieSection" fillRule="evenodd" clipRule="evenodd" d="M399.762 364.752C415.147 339.295 424 309.447 424 277.532C424 247.091 415.946 218.532 401.853 193.869L252.874 279.783L399.762 364.752Z" fill="#4C43CD" fillOpacity="0.5"/>
                                    <path className="pieSection" fillRule="evenodd" clipRule="evenodd" d="M79.935 379.022C97.2714 409.99 123.012 436.771 156.118 455.588C187.693 473.535 222.066 482.019 255.958 481.942L254.676 276.753L79.935 379.022Z" fill="#43A5E3" fillOpacity="0.8"/>
                                    <path className="pieSection" fillRule="evenodd" clipRule="evenodd" d="M257.677 77.4895C222.656 76.5507 186.941 84.8542 154.261 103.427C123.092 121.141 98.535 146.007 81.4818 174.79L256.15 277.343L257.677 77.4895Z" fill="#FF7070" fillOpacity="0.7"/>
                                    <path className="pieSection" fillRule="evenodd" clipRule="evenodd" d="M255.271 426.106C281.648 426.633 308.501 420.197 333.016 406.044C356.397 392.544 374.763 373.693 387.457 351.93L255.396 275.597L255.271 426.106Z" fill="#FF7070" fillOpacity="0.5"/>
                                    <path className="pieSection" fillRule="evenodd" clipRule="evenodd" d="M470.095 154.037C449.334 116.357 418.351 83.6832 378.376 60.6035C340.248 38.5903 298.652 28.0255 257.568 27.8424L257.444 276.574L470.095 154.037Z" fill="#C4C4C4" fillOpacity="0.8"/>
                                    
                                    <line x1="256.08" y1="28.8043" x2="256.08" y2="527.471" stroke="#C5C5D0" strokeWidth="3"/>
                                    <line x1="38.4963" y1="401.505" x2="470.354" y2="152.172" stroke="#C5C5D0" strokeWidth="3"/>
                                    <line x1="39.9963" y1="152.172" x2="471.854" y2="401.505" stroke="#C5C5D0" strokeWidth="3"/>

                                    <circle cx="254.58" cy="278.138" r="200" stroke="#C5C5D0" strokeWidth="3"/>
                                    <circle cx="254.58" cy="278.138" r="50" stroke="#C5C5D0" strokeWidth="3"/>
                                    <circle cx="254.58" cy="278.138" r="100" stroke="#C5C5D0" strokeWidth="3"/>
                                    <circle cx="254.58" cy="278.138" r="150" stroke="#C5C5D0" strokeWidth="3"/>
                                    <circle cx="254.58" cy="278.138" r="250" stroke="#393939" strokeWidth="8"/>
                                </svg>

                                <div id="keys">
                                    <ul>
                                        <li>
                                            <div></div>
                                            <p> Web Development </p>
                                        </li>

                                        <li>
                                            <div></div>
                                            <p> Graphic Design </p>
                                        </li>

                                        <li>
                                            <div></div>
                                            <p> UI Design </p>
                                        </li>

                                        <li>
                                            <div></div>
                                            <p> Communication </p>
                                        </li>

                                        <li>
                                            <div></div>
                                            <p> Teaching </p>
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
                                <div onClick={() => window.location.href = '/project/?id=someId'}></div>
                                <div onClick={() => window.location.href = '/project/?id=devfinder'}></div>
                                <div onClick={() => window.location.href = '/project/?id=someId'}></div>
                                <div onClick={() => window.location.href = '/project/?id=someId'}></div>
                                <div onClick={() => window.location.href = '/project/?id=someId'}></div>
                                <div onClick={() => window.location.href = '/project/?id=someId'}></div>
                                <div onClick={() => window.location.href = '/project/?id=someId'}></div>
                            </div>
                        </div>

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

                                    src="./input-icons/User.svg"
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

            <Footer
                instagram="./footer-icons/instagram.svg"
                twitter="./footer-icons/twitter.svg"
                linkedin="./footer-icons/linkedin.svg"
            />
        </div>
    )
}