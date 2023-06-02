import "./App.css";
import { useEffect, useRef, useState } from "react";
import { IoCloseOutline, IoInformation } from "react-icons/io5";
import { IoIosMenu, IoMdInformation } from "react-icons/io";
import { motion } from "framer-motion";
import FormField from "./components/FormField";
import InfoModal from "./components/InfoModal";
import ControlsModal from "./components/ControlsModal";

function App() {
  // CONSTANTS
  const N_LIMIT = 100;
  const COLORS = {
    "rect": "rgba(31, 52, 161, 0.2)",
    "interval": "rgba(58, 171, 32, 0.2)",
    "rect-border": "rgba(31, 52, 161, 0.6)",
    "black": "#222",
    "grey": "#666",
    "light-grey": "#aaa"
  };

  const cnv = useRef(null);
  const eq_input = useRef(null);
  const left_bound_input = useRef(null);
  const right_bound_input = useRef(null);
  const N_input = useRef(null);
  const N_txt_input = useRef(null);
  const form_btn = useRef(null);
  const cnv_container = useRef(null);

  const [eq, setEq] = useState("Math.sin(x)");
  const [left_bound, setLeftBound] = useState(0);
  const [right_bound, setRightBound] = useState(3.1416);
  const [N, setN] = useState(10);
  const [sum_type, setSumType] = useState("left");
  const [area, setArea] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [cnv_width, setCnvWidth] = useState(500);
  const [cnv_height, setCnvHeight] = useState(500);
  const [center_x, setCenterX] = useState(cnv_width / 2);
  const [center_y, setCenterY] = useState(cnv_height / 2);
  const [mouseDownPos, setMouseDownPos] = useState([]);
  const [dragOn, setDragOn] = useState(false);

  const LEFT_BOUND = 0, RIGHT_BOUND = cnv_width;
  let ctx;

  // UX
  const sidebar_variants = {
    open: {opacity: 1, x: 0},
    closed: {opacity: 0, x: "-100%", display: "none"}
  };

  const [show_sidebar, setShowbar] = useState(true);
  const [show_info_modal, setShowInfoModal] = useState(true);
  
  function handleMouseDown(e) {
    setMouseDownPos([e.clientX, e.clientY]);
    setDragOn(true);
  }

  function handleMouseMove(e) {
    if (!dragOn) return;
    
    setMouseDownPos([e.clientX, e.clientY]);
    setCenterX(center_x + (e.clientX - mouseDownPos[0]));
    setCenterY(center_y + (mouseDownPos[1] - e.clientY));
  }

  function handleMouseUp(e) {
    setDragOn(false);
  }

  function handleCloseOpenMenu(e) {
    setShowbar(show_sidebar => !show_sidebar)
    setCnvWidth(cnv_container.current.offsetWidth);
    setCnvHeight(cnv_container.current.offsetHeight);
  }
  
  useEffect(() => {
    setCnvWidth(cnv_container.current.offsetWidth - 5);
    setCnvHeight(cnv_container.current.offsetHeight - 5);
    setCenterX(cnv_width / 2);
    setCenterY(cnv_height / 2);

    ctx = cnv.current.getContext("2d");
    ctx.transform(1, 0, 0, -1, 0, cnv_height);
  }, [cnv_width, cnv_height]);
  
  useEffect(() => {
    main();
  }, [left_bound, right_bound, N, eq, sum_type, zoom, center_x, center_y, cnv_width, cnv_height]);
  
  // Custom Mathematic Function
  const F = new Function("x", `return ${eq}`);

  // Plane rendering
  function renderAxis() {
    ctx.strokeStyle = COLORS["black"];
    ctx.beginPath();
    ctx.moveTo(center_x, 0);
    ctx.lineTo(center_x, cnv_height);
    ctx.moveTo(0, center_y);
    ctx.lineTo(cnv_width, center_y);
    ctx.stroke();
  }

  function renderAxisLabels() {
    // AXIS LABELS AND GRID
    ctx.transform(1, 0, 0, -1, 0, cnv_height);

    const char_width = 4;
    const font_size = 15;
    const margin = 4;
    const bound_margin = 15;

    ctx.beginPath();
    ctx.strokeStyle = COLORS["light-grey"];
    ctx.fillStyle = COLORS["grey"];
    ctx.lineWidth = 1;
    ctx.font = `${font_size}px Arial`;

    // X labels
    let x_step = 1;
    let x_n_lines = cnv_width / (x_step * zoom);
    if (x_n_lines < 8 || x_n_lines > 16) {
      x_step = cnv_width / (
        (x_n_lines < 8 ? 8 : 16) * zoom
      );
      x_n_lines = cnv_width / (x_step * zoom);
    }

    const x_px_gap = cnv_width / x_n_lines;
    const x_offset = center_x % x_px_gap;
    const x_first_val = (x_offset - center_x) / zoom;
    let i = 0;

    for (let x = 0; x <= cnv_width; x += x_px_gap) {
      // Grid line
      ctx.moveTo(x + x_offset, 0);
      ctx.lineTo(x + x_offset, cnv_height);

      // Label
      const val = (x_first_val + x_step * i) % 1 == 0
        ? x_first_val + x_step * i
        : (x_first_val + x_step * i).toFixed(1);
      const chars_width = String(val).length * char_width + (val < 0 ? 1 : 0);

      let y_coor = cnv_height - center_y + font_size + margin;
      y_coor = Math.max(y_coor, bound_margin);
      y_coor = Math.min(y_coor, cnv_height - margin);
      ctx.fillText(val, x + x_offset - chars_width, y_coor);
      i++;
    }

    const y_step = x_step;
    const y_n_lines = cnv_height / (y_step * zoom);
    const y_px_gap = cnv_height / y_n_lines;
    const y_offset = center_y % y_px_gap;
    const y_first_val = (y_offset - center_y) / zoom;
    const mod = cnv_height % y_px_gap;
    let j = Math.ceil(y_n_lines);

    for (let y = 0; y <= cnv_height + y_px_gap; y += y_px_gap) {
      // Grid line
      ctx.moveTo(0, y - y_offset + mod);
      ctx.lineTo(cnv_width, y - y_offset + mod);

      // Label
      const val = (y_first_val + y_step * j) % 1 == 0
        ? y_first_val + y_step * j
        : (y_first_val + y_step * j).toFixed(1);
      if (val == 0) {j--; continue;}

      const chars_width = String(val).length * char_width + 3 - (val < 0 ? 1 : 0);

      let x_coor = Math.max(center_x, 2 * chars_width + margin);
      x_coor = Math.min(x_coor, cnv_width);
      ctx.fillText(val, x_coor - chars_width * 2, y - y_offset + margin - (x_px_gap - mod));
      j--;
    }

    ctx.stroke();
    ctx.transform(1, 0, 0, -1, 0, cnv_height);
  }

  function renderGraph() {
    // FUNCTION GRAPHIC
    ctx.strokeStyle = COLORS["black"];

    ctx.beginPath();
    ctx.moveTo(0, zoom * F(-center_x / zoom) + center_y);
    for (let i = LEFT_BOUND - center_x; i <= RIGHT_BOUND - center_x; i++) {
      const y = zoom * F(i / zoom);
      ctx.lineTo(i + center_x, y + center_y);
    }
    ctx.stroke();
  }

  function renderInterval() {
    // INTERVAL DRAW
    ctx.fillStyle = COLORS["interval"];
    ctx.fillRect(left_bound * zoom + center_x, 0, (right_bound - left_bound) * zoom, cnv_height);
  }

  function renderRectangles() {
    // RIEMANN RECTANGLES
    ctx.fillStyle = COLORS["rect"];
    const delta_x = (right_bound - left_bound) / N;
    let start, sum = 0;

    if (sum_type == "left") start = 0;
    else if (sum_type == "right") start = 1;
    else start = 0.5;

    for (let i = start; i < N + start; i++) {
      const x = left_bound + i * delta_x;
      const height = F(x);
      sum += height * delta_x;
      
      ctx.fillRect(x * zoom + center_x - start * delta_x * zoom, center_y, delta_x * zoom, height * zoom);
      ctx.strokeStyle = COLORS["rect-border"];
      ctx.strokeRect(x * zoom + center_x - start * delta_x * zoom, center_y, delta_x * zoom, height * zoom);
    }

    setArea(sum % 1 == 0 ? sum : sum.toFixed(3));
  }

  function main() {
    ctx = cnv.current.getContext("2d");
    ctx.clearRect(0, 0, cnv_width, cnv_height);

    renderAxisLabels();
    renderAxis();
    renderGraph();
    renderInterval();
    renderRectangles();
  }

  function setValues(e) {
    e.preventDefault();
    const new_eq = eq_input.current.value || eq;
    const new_lft_bound = left_bound_input.current.value || left_bound;
    const new_rgt_bound = right_bound_input.current.value || right_bound;
    const new_N = N_input.current.value;
    const new_sum_type = document.querySelector("input[name='sum-type']:checked");

    setEq(new_eq);
    setLeftBound(Number(new_lft_bound));
    setRightBound(Number(new_rgt_bound));
    setN(Number(new_N));
    setSumType(new_sum_type.value);
  }

  return <main>
    <div id="side-bar-menu">
      <div onClick={handleCloseOpenMenu}>
        { show_sidebar 
          ? <IoCloseOutline className="icon mouse-ptr" /> 
          : <IoIosMenu className="icon mouse-ptr" /> }
      </div>
    </div>
    <motion.div
      id="side-bar"
      animate={show_sidebar ? "open" : "closed"}
      transition={{type: "just", duration: 0.25}}
      variants={sidebar_variants}>
      <form onSubmit={setValues} id="params-form">
        <FormField
          label_txt="Equation f(x)"
          label_des="(JavaScript Syntax)"
          name="equation"
          placeholder_txt={eq}
          reference={eq_input} />

        <h2 className="section-name">Range</h2>
        <FormField
          label_txt="Left endpoint"
          name="lft-endpoint"
          placeholder_txt={left_bound}
          reference={left_bound_input} />

        <FormField
          label_txt="Right endpoint"
          name="rgt-endpoint"
          placeholder_txt={right_bound}
          reference={right_bound_input} />

        <h2 className="section-name">Sum Parameters</h2>
        <div className="form-field">
          <label className="form-field-lbl">N</label>
          <div className="range-inp-container">
            <input
              type="range"
              id="N-input"
              min="2"
              max={N_LIMIT}
              ref={N_input}
              onChange={setValues}
              value={N} />
            <input
              className="txt-inp range-txt-inp"
              type="text"
              placeholder={N}
              ref={N_txt_input}
              htmlFor="N-input" />
          </div>
        </div>
        <div className="form-field">
          <label className="form-field-lbl">Sum type</label>
          <div className="radio-container">
            <input
              type="radio"
              id="left-sum-radio"
              name="sum-type"
              value="left"
              onChange={setValues}
              checked={sum_type == "left"} />
            <label className="form-field-lbl" htmlFor="left-sum-radio">Left Sum</label>
          </div>
          <div className="radio-container">
            <input
              type="radio"
              id="right-sum-radio"
              name="sum-type"
              value="right"
              onChange={setValues}
              checked={sum_type == "right"} />
            <label className="form-field-lbl" htmlFor="right-sum-radio">Right Sum</label>
          </div>
          <div className="radio-container">
            <input
              type="radio"
              id="mid-sum-radio"
              name="sum-type"
              value="mid"
              onChange={setValues}
              checked={sum_type == "mid"} />
            <label className="form-field-lbl" htmlFor="mid-sum-radio">Mid Sum</label>
          </div>
        </div>
        <div className="form-field">
          <input
            className="primary-button"
            type="submit"
            value="APPLY"
            ref={form_btn}
            onClick={setValues} />
        </div>
      </form>
    </motion.div>
    <div id="cnv-container" ref={cnv_container}>
      <canvas
        id="cnv"
        width={cnv_width}
        height={cnv_height}
        ref={cnv}
        onMouseDown={ handleMouseDown }
        onMouseMove={ handleMouseMove }
        onMouseUp={ handleMouseUp }></canvas>
      {
      show_info_modal
      ? <InfoModal
        eq={eq}
        area={area}
        interval={[left_bound, right_bound]}
        N={N}
        setShownfoModal={setShowInfoModal} />
      : <div id="show-info">
        <IoInformation
          onClick={() => setShowInfoModal(true)} />
      </div>
      }
      <ControlsModal 
        zoom={zoom}
        setZoom={setZoom}
        />
    </div>
  </main>
}

export default App;
