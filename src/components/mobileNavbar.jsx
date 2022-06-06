import '../styles/reuseable/mobileNavbar.css';

export const hideMobileNav = () => {
    document.querySelector('#mobileNavbar').classList.remove('active');
    document.getElementById('overlay').style.display = "none";
    document.querySelector('body').style.overflowY = "visible";
}

export const MobileNavbar = () => {
    return (
        <div id="mobileNavbar">

            <div className="logo" onClick={() => window.location.href = '/'}>
                <h1>Mejdi</h1>
                <h1>DEVS</h1>
            </div>

            <ul>
                <a onClick={hideMobileNav} href="/#skills">
                    <li>Skills</li>
                </a>

                <a onClick={hideMobileNav} href="/#Experience">
                    <li>Experience</li>
                </a>

                <a onClick={hideMobileNav} href="/#Projects">
                    <li>Projects</li>
                </a>

                <a onClick={hideMobileNav} href="/#Feedback">
                    <li>Feedback</li>
                </a>
            </ul>
        </div>
    );
}