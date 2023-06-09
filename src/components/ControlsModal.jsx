import "./ControlsModal.css";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import { CgDarkMode } from "react-icons/cg";

function ControlsModal({ zoom, setZoom, dark_mode, setDarkMode }) {
  const ZOOM_RATIO = 1.2;

  return <div id="controls-modal">
    <button
      className={ "controls-button" + (dark_mode ? " dark" : "") }
      onClick={ () => setDarkMode(!dark_mode) }>
        <CgDarkMode className="controls-icon" />
    </button>
    <button
      className={ "controls-button" + (dark_mode ? " dark" : "") }
      onClick={ () => setZoom(zoom * ZOOM_RATIO) }>
      <AiOutlineZoomIn className="controls-icon" />
    </button>
    <button
      className={ "controls-button" + (dark_mode ? " dark" : "") }
      onClick={ () => setZoom(Math.max(zoom / ZOOM_RATIO, 1)) }>
      <AiOutlineZoomOut className="controls-icon" />
    </button>
  </div>
}

export default ControlsModal;
