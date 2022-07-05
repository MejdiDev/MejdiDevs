import { Link } from 'react-router-dom';
import '../styles/reuseable/navbar.css';

const showMobileNav = () => {
    document.getElementById('overlay').style.display = "block";
    document.getElementById('mobileNavbar').style.display = "flex";
    
    setTimeout(() => {
        document.getElementById('overlay').style.opacity = "0.7";
        document.getElementById('mobileNavbar').classList.add('active');
    }, 1);
    document.querySelector('body').classList.add('hidden');
}

export const NavBar = props => {
    return (
        <nav>
            <Link to="/">
                <div className="logo">
                    <h1>Mejdi</h1>
                    <h1>DEVS</h1>
                </div>
            </Link>

            <ul>
                <a onClick={() => props.isHome ? console.log("") : sessionStorage.setItem('navTo', "skills")} href="/#skills">
                    <li>Skills</li>
                </a>

                <a onClick={() => props.isHome ? console.log("") : sessionStorage.setItem('navTo', "Experience")} href="/#Experience">
                    <li>Experience</li>
                </a>

                <a onClick={() => props.isHome ? console.log("") : sessionStorage.setItem('navTo', "Projects")} href="/#Projects">
                    <li>Projects</li>
                </a>

                <a onClick={() => props.isHome ? console.log("") : sessionStorage.setItem('navTo', "Feedback")} href="/#Feedback">
                    <li>Feedback</li>
                </a>
            </ul>

            <div id="mobileNav" onClick={showMobileNav}>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </nav>
    )
}