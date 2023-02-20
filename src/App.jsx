import './App.css';
import { useEffect, useRef, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { IoIosMenu } from 'react-icons/io';
import { motion } from 'framer-motion';
import FormField from './components/FormField';

function App() {
  const cnv = useRef(null);
  const eq_input = useRef(null);
  const left_bound_input = useRef(null);
  const right_bound_input = useRef(null);
  const N_input = useRef(null);
  const N_txt_input = useRef(null);
  const form_btn = useRef(null);
  const cnv_container = useRef(null);

  const [eq, setEq] = useState("Math.pow(x, 2)");
  const [left_bound, setLeftBound] = useState(0);
  const [right_bound, setRightBound] = useState(100);
  const [N, setN] = useState(10);
  const [sum_type, setSumType] = useState("left");

  // UX
  const sidebar_variants = {
    open: {opacity: 1, x: 0},
    closed: {opacity: 0, x: "-100%"}
  };
  const [show_sidebar, setShowbar] = useState(true);

  // CONSTANT VARIABLES
  const CNV_WIDTH = 500;
  const CNV_HEIGHT = 500;
  const CENTER_X = CNV_WIDTH / 2;
  const CENTER_Y = CNV_HEIGHT / 2;
  const LEFT_BOUND = 0, RIGHT_BOUND = CNV_WIDTH;

  useEffect(() => {
    const ctx = cnv.current.getContext("2d");
    ctx.transform(1, 0, 0, -1, 0, CNV_HEIGHT);
  }, []);

  useEffect(() => {
    main();
  }, [left_bound, right_bound, N, eq, sum_type]);

  // Custom Mathematic Function
  const F = new Function("x", `return ${eq}`);

  function main() {
    const ctx = cnv.current.getContext("2d");
    ctx.clearRect(0, 0, CNV_WIDTH, CNV_HEIGHT);

    // X and Y axis
    ctx.beginPath();
    ctx.moveTo(0, CENTER_Y);
    ctx.lineTo(CNV_WIDTH, CENTER_Y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(CENTER_X, 0);
    ctx.lineTo(CENTER_X, CNV_HEIGHT);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(LEFT_BOUND, F(LEFT_BOUND - CENTER_X), 2, 2);
    for (let i = LEFT_BOUND - CENTER_X; i <= RIGHT_BOUND - CENTER_X; i++) {
      let y = F(i);
      ctx.lineTo(i + CENTER_X, y + CENTER_Y);
    }
    ctx.stroke();

    // INTERVAL
    ctx.fillStyle = "rgba(0, 110, 255, 0.3)";
    ctx.fillRect(left_bound + CENTER_X, 0, right_bound - left_bound, CNV_HEIGHT);

    // RIEMANN RECTANGLES
    // LEFT SUM
    ctx.fillStyle = "rgba(31, 52, 161, 0.2)";
    let delta_x = (right_bound - left_bound) / N;
    let area = 0, start = sum_type == "left" ? 0 : 1;
    for (let i = start; i < N + start; i++) {
      let x = left_bound + i * delta_x;
      let height = F(x);
      area += height * delta_x;
      
      ctx.fillRect(x + CENTER_X - start * delta_x, CENTER_Y, delta_x, height);
      ctx.strokeStyle = "#444";
      ctx.strokeRect(x + CENTER_X - start * delta_x, CENTER_Y, delta_x, height);
    }
    console.log(area.toFixed(5));
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
    setSumType(new_sum_type ? new_sum_type.value : "left");
  }

  return <main>
    <div id="side-bar-menu">
      <div onClick={() => setShowbar(show_sidebar => !show_sidebar)}>
        { show_sidebar 
          ? <IoCloseOutline className='icon mouse-ptr' /> 
          : <IoIosMenu className='icon mouse-ptr' /> }
      </div>
    </div>
    <motion.div id="side-bar" animate={show_sidebar ? "open" : "closed"} transition={{type: "just", duration: 0.25}} variants={sidebar_variants}>
      <form onSubmit={setValues} id="params-form">
        {/* <input type="text" ref={eq_input} placeholder={eq} /> */}
        <FormField label_txt="Equation f(x)" label_des="(JavaScript Syntax)" name="equation" placeholder_txt={eq} reference={eq_input} />

        <h2 className='section-name'>Range</h2>
        {/* <input type="number" ref={left_bound_input} placeholder={left_bound} /> */}
        <FormField label_txt="Left endpoint" name="lft-endpoint" placeholder_txt={left_bound} reference={left_bound_input} />
        {/* <input type="number" ref={right_bound_input} placeholder={right_bound} /> */}
        <FormField label_txt="Right endpoint" name="rgt-endpoint" placeholder_txt={right_bound} reference={right_bound_input} />

        <h2 className='section-name'>Sum Parameters</h2>
        <div className='form-field'>
          <label className="form-field-lbl">N</label>
          <div className="range-inp-container">
            {/* <input type="range" min="2" max="40" ref={N_input} onChange={setValues} /> */}
            <input type="range" id='N-input' min="2" max="50" ref={N_input} onChange={setValues} value={N} />
            <input className='txt-inp range-txt-inp' type="text" placeholder={N} ref={N_txt_input} htmlFor="N-input" />
          </div>
        </div>
        <div className='form-field'>
          <label className="form-field-lbl">Sum type</label>
          <div className='radio-container'>
            {/* <input type="radio" name="sum-type" value="left" checked={sum_type == "left"} onChange={setValues} /> */}
            <input type="radio" id='left-sum-radio' name="sum-type" value="left" onChange={setValues} />
            <label className='form-field-lbl' htmlFor='left-sum-radio'>Left sum</label>
          </div>
          <div className='radio-container'>
            {/* <input type="radio" name="sum-type" value="right" onChange={setValues}/> */}
            <input type="radio" id='right-sum-radio' name="sum-type" value="right" onChange={setValues}/>
            <label className='form-field-lbl' htmlFor='right-sum-radio'>Right sum</label>
          </div>
        </div>
        <div className="form-field">
          <input className="primary-button" type="submit" value="APPLY" ref={form_btn} onClick={setValues} />
        </div>
      </form>
    </motion.div>
    <div id="cnv-container" ref={cnv_container}>
      <canvas id="cnv" width={CNV_WIDTH} height={CNV_HEIGHT} ref={cnv}></canvas>
    </div>
  </main>
}

export default App;