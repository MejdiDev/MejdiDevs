import '../styles/reuseable/mobileNavbar.css';

export const hideMobileNav = () => {
    document.getElementById('mobileNavbar').classList.remove('active');
    document.getElementById('overlay').style.opacity = "0";

    setTimeout(() => {
        document.getElementById('mobileNavbar').style.display = "none";
        document.getElementById('overlay').style.display = "none";
    }, 400);
    document.querySelector('body').classList.remove('hidden');
}

export const MobileNavbar = props => {
    return (
        <div id="mobileNavbar">

            <div className="logo" onClick={() => window.location.href = '/'}>
                <h1>Mejdi</h1>
                <h1>DEVS</h1>
            </div>

            <ul>
                <a onClick={() => props.isHome ? hideMobileNav() : sessionStorage.setItem('navTo', "skills")} href="/#skills">
                    <li>Skills</li>
                </a>

                <a onClick={() => props.isHome ? hideMobileNav() : sessionStorage.setItem('navTo', "Experience")} href="/#Experience">
                    <li>Experience</li>
                </a>

                <a onClick={() => props.isHome ? hideMobileNav() : sessionStorage.setItem('navTo', "Projects")} href="/#Projects">
                    <li>Projects</li>
                </a>

                <a onClick={() => props.isHome ? hideMobileNav() : sessionStorage.setItem('navTo', "Feedback")} href="/#Feedback">
                    <li>Feedback</li>
                </a>

                <a onClick={() => props.isHome ? hideMobileNav() : sessionStorage.setItem('navTo', "Contact")} href="/#Contact">
                    <li>Contact</li>
                </a>
            </ul>
        </div>
    );
}