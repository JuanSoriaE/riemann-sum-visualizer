import "./App.css";
import { useEffect, useRef, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { IoIosMenu } from "react-icons/io";
import { motion } from "framer-motion";
import FormField from "./components/FormField";
import InfoModal from "./components/InfoModal";
import ControlsModal from "./components/ControlsModal";

function App() {
  // CONSTANTS
  const CNV_WIDTH = 500;
  const CNV_HEIGHT = 500;
  const LEFT_BOUND = 0, RIGHT_BOUND = CNV_WIDTH;
  const N_LIMIT = 100;
  const COLORS = {
    "light-blue": "rgba(31, 52, 161, 0.2)",
    "blue": "rgba(0, 110, 255, 0.3)",
    "dark-blue": "rgba(31, 52, 161, 0.6)",
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
  const [zoom, setZoom] = useState(50);
  const [center_x, setCenterX] = useState(CNV_WIDTH / 2);
  const [center_y, setCenterY] = useState(CNV_HEIGHT / 2);
  const [mouseDownPos, setMouseDownPos] = useState([]);
  const [dragOn, setDragOn] = useState(false);

  // UX
  const sidebar_variants = {
    open: {opacity: 1, x: 0},
    closed: {opacity: 0, x: "-100%"}
  };
  const [show_sidebar, setShowbar] = useState(true);
  
  useEffect(() => {
    const ctx = cnv.current.getContext("2d");
    ctx.transform(1, 0, 0, -1, 0, CNV_HEIGHT);
  }, []);

  useEffect(() => {
    main();
  }, [left_bound, right_bound, N, eq, sum_type, zoom, center_x, center_y]);

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

  // Custom Mathematic Function
  const F = new Function("x", `return ${eq}`);

  function main() {
    const ctx = cnv.current.getContext("2d");
    ctx.clearRect(0, 0, CNV_WIDTH, CNV_HEIGHT);

    // X and Y axis
    ctx.strokeStyle = COLORS["black"];
    ctx.beginPath();
    ctx.moveTo(0, center_y);
    ctx.lineTo(CNV_WIDTH, center_y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(center_x, 0);
    ctx.lineTo(center_x, CNV_HEIGHT);
    ctx.stroke();
    
    // AXIS LABELS AND GRID
    ctx.transform(1, 0, 0, -1, 0, CNV_HEIGHT);
    ctx.beginPath();
    ctx.strokeStyle = COLORS["grey"];
    ctx.fillStyle = COLORS["grey"];
    ctx.lineWidth = 1;
    ctx.font = "15px Arial";

    const step = CNV_WIDTH / (10 * zoom);
    const x_px_gap = CNV_WIDTH / 10;
    const x_offset = center_x % x_px_gap;
    const x_first_val = (x_offset - center_x) / zoom;
    let i = 0;

    for (let x = 0; x <= CNV_WIDTH; x += x_px_gap) {
      ctx.strokeStyle = COLORS["light-grey"];
      ctx.moveTo(x + x_offset, 0);
      ctx.lineTo(x + x_offset, CNV_HEIGHT);

      const val = (x_first_val + step * i) % 1 == 0 ? x_first_val + step * i : (x_first_val + step * i).toFixed(1);
      let y_coor = CNV_HEIGHT - center_y + 20;
      y_coor = Math.max(y_coor, 15);
      y_coor = Math.min(y_coor, 495);
      ctx.fillText(val, x + x_offset - 4, y_coor);
      i++;
    }

    const y_px_gap = CNV_HEIGHT / 10;
    const y_offset = center_y % y_px_gap;
    const y_first_val = (y_offset - center_y) / zoom;
    let j = 10;

    for (let y = 0; y <= CNV_HEIGHT; y += y_px_gap) {
      ctx.moveTo(0, y - y_offset);
      ctx.lineTo(CNV_WIDTH, y - y_offset);

      let val = (y_first_val + step * j) % 1 == 0 ? y_first_val + step * j : (y_first_val + step * j).toFixed(1);
      if (val == 0) {
        j--;
        continue;
      }
      let x_coor = center_x + 4;
      x_coor = Math.max(x_coor, 5);
      x_coor = Math.min(x_coor, 485);
      ctx.fillText(val, x_coor , y - y_offset + 6);
      j--;
    }

    ctx.stroke();
    ctx.transform(1, 0, 0, -1, 0, CNV_HEIGHT);

    // FUNCTION GRAPHIC
    ctx.strokeStyle = COLORS["black"];

    ctx.beginPath();
    ctx.moveTo(LEFT_BOUND, F(LEFT_BOUND - center_x), 2, 2);
    for (let i = LEFT_BOUND - center_x; i <= RIGHT_BOUND - center_x; i++) {
      const y = zoom * F(i / zoom);
      ctx.lineTo(i + center_x, y + center_y);
    }
    ctx.stroke();

    // INTERVAL DRAW
    ctx.fillStyle = COLORS["blue"];
    ctx.fillRect(left_bound * zoom + center_x, 0, (right_bound - left_bound) * zoom, CNV_HEIGHT);

    // RIEMANN RECTANGLES
    ctx.fillStyle = COLORS["light-blue"];
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
      ctx.strokeStyle = COLORS["dark-blue"];
      ctx.strokeRect(x * zoom + center_x - start * delta_x * zoom, center_y, delta_x * zoom, height * zoom);
    }

    setArea(sum % 1 == 0 ? sum : sum.toFixed(3));
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
      <div onClick={() => setShowbar(show_sidebar => !show_sidebar)}>
        { show_sidebar 
          ? <IoCloseOutline className="icon mouse-ptr" /> 
          : <IoIosMenu className="icon mouse-ptr" /> }
      </div>
    </div>
    <motion.div id="side-bar" animate={show_sidebar ? "open" : "closed"} transition={{type: "just", duration: 0.25}} variants={sidebar_variants}>
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
      <InfoModal
        eq={eq}
        area={area}
        interval={[left_bound, right_bound]}
        N={N} />
      <canvas
        id="cnv"
        width={CNV_WIDTH}
        height={CNV_HEIGHT}
        ref={cnv}
        onMouseDown={ handleMouseDown }
        onMouseMove={ handleMouseMove }
        onMouseUp={ handleMouseUp }></canvas>
      <ControlsModal 
        zoom={zoom}
        setZoom={setZoom}/>
    </div>
  </main>
}

export default App;