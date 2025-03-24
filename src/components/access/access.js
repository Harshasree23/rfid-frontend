import { useState } from 'react';
import './access.css';

const Access = () => {

    const [scanned, setScanned] = useState(false);
    
        const handleEnter = () => {
            setScanned( !scanned );
        }
    
        return(
        <>
            <div className='access-page' >
                {
                    scanned ?
                    <>  
                        <div className='access-info'>
                            <div className='user-name'> Hello XYZ </div>
                            <div className='go-back' onClick={ handleEnter } > Back </div>
                            <form >
                                <div className='left'>
                                    <input type='text' placeholder='Access to ? ' required/>
                                    <input type='text' placeholder='Why you need ?' required/>
                                </div>
                                <button type='submit'> Get Access </button>
                            </form>
                        </div>
                    </> 
                    :
                    <>
                        <div className="msg">
                            Scan card & press next
                        </div>
                        <div className='card' >
                            <img className='scan' src='/assets/sensors.png' alt="scan"/>
                            <div className='card-enter'> 
                                <img src='/assets/next.png' onClick={ handleEnter } alt='next'/>
                                <div className='img-desc'> Next </div>
                            </div>
                        </div>
                    </>
                }
            </div>
        </>
        );
}

export default Access;