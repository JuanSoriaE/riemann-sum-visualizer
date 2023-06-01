import './ControlsModal.css';
import { AiOutlineZoomIn, AiOutlineZoomOut } from 'react-icons/ai';

function ControlsModal({ zoom, setZoom }) {
  return <div id='controls-modal'>
    <button
      className='zoom-button'
      onClick={ () => setZoom(zoom + 10) }>
      <AiOutlineZoomIn className='zoom-icon' />
    </button>
    <button
      className='zoom-button'
      onClick={ () => setZoom(Math.max(zoom - 10, 1)) }>
      <AiOutlineZoomOut className='zoom-icon' />
    </button>
  </div>
}

export default ControlsModal;
