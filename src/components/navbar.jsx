import '../styles/reuseable/navbar.css';

export const NavBar = () => {
    const showMobileNav = () => {
        document.getElementById('mobileNavbar').classList.add('active');
        document.getElementById('overlay').style.display = "block";
        document.querySelector('body').style.overflowY = "hidden";
    }

    return (
        <nav>
            <div className="logo" onClick={() => window.location.href = '/'}>
                <h1>Mejdi</h1>
                <h1>DEVS</h1>
            </div>

            <ul>
                <a href="/#skills">
                    <li>Skills</li>
                </a>

                <a href="/#Experience">
                    <li>Experience</li>
                </a>

                <a href="/#Projects">
                    <li>Projects</li>
                </a>

                <a href="/#Feedback">
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