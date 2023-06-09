import "./App.css";
import { useRef, useState } from "react";
import { IoCloseOutline, IoInformation } from "react-icons/io5";
import { IoIosMenu } from "react-icons/io";
import SideBar from "./components/SideBar";
import InfoModal from "./components/InfoModal";
import ControlsModal from "./components/ControlsModal";
import Plane from "./components/Plane";

function App() {
  // HTML ELEMENTS REFERENCES
  const cnv_container = useRef(null);

  // STATES
  const [eq, setEq] = useState("Math.sin(x)");
  const [left_bound, setLeftBound] = useState(0);
  const [right_bound, setRightBound] = useState(3.1416);
  const [N, setN] = useState(10);
  const [sum_type, setSumType] = useState("left");
  const [cnv_width, setCnvWidth] = useState(500);
  const [cnv_height, setCnvHeight] = useState(500);
  const [area, setArea] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [dark_mode, setDarkMode] = useState(false);

  // UX STATES
  const [show_sidebar, setShowSidebar] = useState(true);
  const [show_info_modal, setShowInfoModal] = useState(true);

  // EVENTS HANDLERS
  function handleCloseOpenMenu(e) {
    setShowSidebar(show_sidebar => !show_sidebar)
    setCnvWidth(cnv_container.current.offsetWidth);
    setCnvHeight(cnv_container.current.offsetHeight);
  }

  return <main className={ dark_mode ? " dark" : "" }>
    <div id="side-bar-menu" className={ dark_mode ? " dark" : "" }>
      <div onClick={ handleCloseOpenMenu }>
        { show_sidebar 
          ? <IoCloseOutline className="icon mouse-ptr" /> 
          : <IoIosMenu className="icon mouse-ptr" /> }
      </div>
    </div>
    <SideBar
      show_sidebar={ show_sidebar }
      left_bound={ left_bound }
      setLeftBound={ setLeftBound }
      right_bound={ right_bound }
      setRightBound={ setRightBound }
      N={ N }
      setN={ setN }
      sum_type={ sum_type }
      setSumType={ setSumType }
      eq={ eq }
      setEq={ setEq }
      dark_mode={ dark_mode } />
    <div id="cnv-container" ref={ cnv_container }>
      <Plane
        eq={ eq }
        left_bound={ left_bound }
        right_bound={ right_bound }
        N={ N }
        sum_type={ sum_type }
        cnv_width={ cnv_width }
        cnv_height={ cnv_height }
        zoom={ zoom }
        cnv_container={ cnv_container }
        setCnvWidth={ setCnvWidth }
        setCnvHeight={ setCnvHeight }
        setArea={ setArea }
        dark_mode={ dark_mode } />
      {
      show_info_modal
      ? <InfoModal
        eq={ eq }
        area={ area }
        interval={ [left_bound, right_bound] }
        N={ N }
        setShownfoModal={ setShowInfoModal }
        dark_mode={ dark_mode } />
      : <div id="show-info"
        className={ dark_mode ? " dark" : "" }
        onClick={ () => setShowInfoModal(true) }>
        <IoInformation />
      </div>
      }
      <ControlsModal 
        zoom={ zoom }
        setZoom={ setZoom }
        dark_mode={ dark_mode }
        setDarkMode={ setDarkMode }
        />
    </div>
  </main>
}

export default App;
