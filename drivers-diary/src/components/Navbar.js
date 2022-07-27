import React from 'react'
import {useNavigate} from 'react-router-dom';
import {FaUserAlt} from 'react-icons/fa'

export default function Navbar(props) {
      const navigate = useNavigate()


      //FUNCTIONS
      function navigateToPath(e){
            const path = e.target.innerText;
            navigate(`/${path}`)
      }
      function showProfile(){
        navigate('/profile')
      }
  return (
    <div>
      <div className='row'>
      <div className=' header'>
           <h3 className='company'> My Truck Diary</h3>
           <button onClick={showProfile} className='userFa'><FaUserAlt/></button>
      </div>
      <div className='nav-btn-div'>
      <button className='nav-btn' onClick={ navigateToPath}>Income</button> &nbsp;
      <button className='nav-btn' onClick={ navigateToPath}>Expenses</button> &nbsp;
      <button className='nav-btn' onClick={ navigateToPath}>Loads</button>&nbsp;
     
      </div>
      </div>
    </div>
  )
}
