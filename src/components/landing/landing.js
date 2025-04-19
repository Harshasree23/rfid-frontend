import { useState } from 'react';
import Contact from '../contact/contact';
import Tagflow from '../tagflow/Tagflow';
import './landing.css';
import Login from '../login/login';

const Landing = (props) => {

    const [login , setLogin] = useState(false);

    const handleLogin = () => {
        setLogin( !login );
    };

    return(
        <>
        
            { login ? <Login setLogin={setLogin} setLogged={props.setLogged} login={login} /> : <> </> }

{/* First Page */}
            <div className="first-page" >
                <header>
                    <Tagflow />
                    <div className='login' onClick={ handleLogin } > Login </div>
                </header>
                <img className='header-img' src='/assets/scan-hand.png' alt="scan card" />
                <div className='about' > One scan, endless possibilities. 
                    <div className='about-sub'> One scan to enter, pay, track, and access—effortlessly. </div>
                </div>  
                <div className='down'>
                    <img src='/assets/arrow-down.png' alt="down" />
                </div>
            </div>

{/* Features */}
            <div className='features' >

                <div className='feature' >
                    <div className='feature-img'><img src='/assets/badge.png' alt='sensors' /></div>
                    <div className='feature-desc'> Uses RFID sensors in ID cards to simplify things </div>
                </div>

                <div className='feature' >
                    <div className='feature-img'><img src='/assets/speed.png' alt='speed' /></div>
                    <div className='feature-desc'> 10 to 20 times faster than traditional bar codes and more accurate. </div>
                </div>

                <div className='feature' >
                    <div className='feature-img'><img src='/assets/wifi_off.png' alt='no connection' /></div>
                    <div className='feature-desc'> No internet connection is required for the users </div>
                </div>

            </div>

{/* Steps */}

            <div className='steps-container' >
                <div className='steps-heading'> How it works ? </div>
                <div className='steps'>

                    <div className='step'>
                        <div className="step-heading"> 
                            <div className='number'> 1 </div> 
                            Get Started 
                        </div>
                        <div className="step-desc"> 
                            Reach out to us and explore how our advanced RFID system can simplify your workflow.  
                            Whether you're looking for secure access, automated tracking, or cashless payments, we've got you covered.  
                        </div>
                    </div>

                    <div className='step'>
                        <div className="step-heading">
                            <div className='number'> 2 </div>
                            Seamless Integration 
                        </div>
                        <div className="step-desc">  
                            Our team will handle the setup with minimal effort on your end.  
                            From installation to configuration, we ensure a smooth transition so you can start benefiting immediately.  
                            No complex processes—just effortless automation.  
                        </div>
                    </div>

                    <div className='step'>
                        <div className="step-heading">
                            <div className='number'> 3 </div>
                            Experience the Joy  
                        </div>
                        <div className="step-desc">  
                            Say goodbye to manual entries and outdated systems!  
                            With just a wave of your card, enjoy real-time tracking, hassle-free access, and seamless payments—saving you time and effort every day.  
                        </div>
                    </div>

                </div>

            </div>

{/* Conatct */}
            <div className="" >
                <Contact />
            </div>

            {/* <footer>

                <div className='company-logo'>
                    <Tagflow />
                </div>

                <div className='company-details'>
                    <div className='footer-heading'> Details </div>
                    <div className='detail'>
                        <img src='/assets/mail.png' alt='mail'/>
                        <div> marvelavengersharsha@gmail.com </div>
                    </div>
                    <div className='detail'>
                        <img src='/assets/home_pin.png' alt='home' />
                        <div> Kurnool , Andhra Pradesh , India </div>
                    </div>
                </div>

                <div className='company-connect'>
                    <div className='footer-heading'> Connect </div>
                    <div className='company-connect'>
                        <a href='https://github.com/Harshasree23' target='_blank' rel="noreferrer"> <img src="/assets/code.png" alt="git"/> Harshasree23 </a>
                        <a href='https://www.linkedin.com/in/sreeharsha23/' target='_blank' rel="noreferrer"> <img src="/assets/linkedin-logo.png" alt="git"/> sreeharsha23 </a>
                    </div>
                </div>

            </footer> */}
        </>
    );
}

export default Landing;