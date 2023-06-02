import './InfoModal.css';
import { IoIosClose } from 'react-icons/io';

function InfoModal({ eq, area, interval, N, setShownfoModal }) {
  return <div id='info-modal'>
    <IoIosClose
      className='small-icon close-info-icon mouse-ptr'
      onClick={() => setShownfoModal(false)} />
    <div className="aprox-area-container">
      <span
        className='form-field-lbl'
        style={{marginLeft: 0}}>Approximate Area:</span>
      <span
        className='info-span'>{area}</span>
    </div>
    <div className='sum-info-container'>
      <span className='info-span'>{eq}</span>
      <span className='info-span'>{`[${interval[0]}, ${interval[1]}]`}</span>
      <span className='info-span'>{`N = ${N}`}</span>
    </div>
  </div>
}

export default InfoModal;
