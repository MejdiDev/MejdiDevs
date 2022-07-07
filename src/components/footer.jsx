import '../styles/reuseable/footer.css';

export const Footer = props => {
    return (
        <footer>
            <div id="text">
                    <div className="logo" onClick={() => window.location.href = '/'}>
                        <h1>Mejdi</h1>
                        <h1>DEVS</h1>
                    </div>

                    <h2>2022 copyright all rights reserved</h2>
            </div>

            <div id="icons">
                <a target="blank" href="https://www.instagram.com/mejdichennoufi/">
                    <img src="./footer-icons/instagram.svg" alt="Instagram" />
                </a>

                <a target="blank" href="https://twitter.com/mejdiDevs">
                    <img src="./footer-icons/twitter.svg" alt="Twitter" />
                </a>

                <a target="blank" href="https://www.linkedin.com/in/mejdi-chennoufi-505092212/">
                    <img src="./footer-icons/linkedin.svg" alt="LinkedIn" />
                </a>
            </div>
        </footer>
    );
}