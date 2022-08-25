import { useEffect, useState } from 'react';
import "./Add.scss";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { fr } from "react-date-range/src/locale";
import { Calendar } from 'react-date-range'; 
import { FaLeaf, FaFootballBall, FaHandsHelping, FaTools} from "react-icons/fa"
import {GiCook, GiPalette, } from "react-icons/gi"
import { useDispatch, useSelector } from 'react-redux';
import { createActivity, reset } from '../../features/activity/activitySlice';
import SuggestionBox from './SeuggestionBox';
import { activePanel, handleHideSuggestionBox, handleShowSuggestionBox } from '../../features/global/globalSlice';
import OutsideWrapper from '../../hooks/ClickOutsideHook'

const Add = () => {
  const {showSuggestionBox} = useSelector(state => state.global)

  const {isSuccess, isError, message} = useSelector(state => state.activity)

  const [form, setForm] = useState({
    name: "",
    address: "",
    description: ""
})

const today = new Date()

const [date, setDate] = useState(today)
const [label, setLabel] = useState("Bénévolat")
const dispatch = useDispatch()

const handleChange = (e) => {
    setForm((prev) => ({...prev, [e.target.name]: e.target.value}))
}

const [address, setAddress] = useState("")

const handleSubmit = (e) => {
  e.preventDefault()
  console.log({...form, label, date})
  if (form.name  && form.description && address && label && date){
    console.log({...form, label, date, address})
    dispatch(createActivity({...form, label, date, address}))
    if(isSuccess){
      dispatch(activePanel(""))
    }
  } else {
    return;
  }
}
  useEffect(() => {
    if(message){
      setTimeout(() => {
        dispatch(reset())
      }, 3000)
    }
    
  }, [message, dispatch])

  const  [inputAddress, setInputAddress] = useState("");


  const handleChangeAddress = (e) => {
    setInputAddress(e.target.value)
    if(e.target.value.length > 0 ){
      dispatch(handleShowSuggestionBox())
    } else {
      dispatch(handleHideSuggestionBox())
    }
  }

  const handleAddress = (value) => {
    setInputAddress(value)
    setAddress(value)
  }



  return (
    <div className='add'>
    {isError && message &&   <p className='server-error'>{message}</p> }
      <form className='editForm' onSubmit={handleSubmit}>
      <div className={form.name.length > 0 ? "field field--has-content" : "field"}>
            <input className='field-input' name="name" type="text" id="name" value={form.nickname} placeholder="Nom de l'activité" onChange={handleChange} />
            <label className='field-label' htmlFor="firstname">Nom de l'activité</label>
        </div>
         <div className={form.address.length > 0 ? "field field--has-content field-address" : "field field-address"}>
            <input value={inputAddress}  className='field-input' type="text" id="address" placeholder='Adresse'  onChange={handleChangeAddress} />
            {showSuggestionBox &&    <SuggestionBox inputAddress={inputAddress} handleAddress={handleAddress}/>}
            <label htmlFor="lastname" className="field-label">Adresse</label>
        </div>
        <div className='areaContainer'>
              <textarea onChange={handleChange} value={form.description} name="description" id="description" placeholder='Description'></textarea>
        </div>
        <div className='dateContainer'> 
            <Calendar
              locale={fr}
              editableDateInputs={true}
              onChange={(item) =>
                setDate(item)
              }
              moveRangeOnFirstSelection={false}
              date={date}
              className="date"
              minDate={new Date()}
            />
        </div>
        <div className='typeContainer'> 
            <span>Type d'activité</span>
            <div className="activityList">
                <div onClick={() => setLabel("Bénévolat")}>
                <FaHandsHelping  className={label === "Bénévolat" ? "icon active": "icon"}/>
                </div>
                <div onClick={() => setLabel("Arts")}>
                  <GiPalette className={label === "Arts" ? "icon active": "icon"}/>
                </div>
                <div onClick={() => setLabel("Cuisine")}>
                  <GiCook className={label === "Cuisine" ? "icon active": "icon"}/>
                </div>
                <div onClick={() => setLabel("Jardinage")}><FaLeaf className={label === "Jardinage" ? "icon active": "icon"}/></div>
                <div onClick={() => setLabel("Bricolage")}>
                  <FaTools className={label === "Bricolage" ? "icon active": "icon"} />
                </div>
                <div onClick={() => setLabel("Danse")}>
                  <FaFootballBall className={label === "Danse" ? "icon active": "icon"}/>
                </div>
            </div>
        </div>
        <div className='buttonContainer'>
          <button type="submit" className="btn">Enregistrer</button>
        </div>
      </form>
    </div>
  )
}
export default Add