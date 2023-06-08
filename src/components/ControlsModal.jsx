import "./ControlsModal.css";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";

function ControlsModal({ zoom, setZoom }) {
  const ZOOM_RATIO = 1.2;

  return <div id="controls-modal">
    <button
      className="controls-button"
      onClick={ () => setZoom(zoom * ZOOM_RATIO) }>
      <AiOutlineZoomIn className="controls-icon" />
    </button>
    <button
      className="controls-button"
      onClick={ () => setZoom(Math.max(zoom / ZOOM_RATIO, 1)) }>
      <AiOutlineZoomOut className="controls-icon" />
    </button>
  </div>
}

export default ControlsModal;
