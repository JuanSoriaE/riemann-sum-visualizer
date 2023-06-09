import "./Plane.css";
import { useState, useEffect, useRef } from "react";

function Plane({ eq, left_bound, right_bound, N, sum_type, cnv_width, cnv_height, zoom, cnv_container, setCnvWidth, setCnvHeight, setArea, dark_mode }) {
  // CONSTANTS
  const COLORS = !dark_mode ? {
    "rect": "rgba(31, 52, 161, 0.2)",
    "interval": "rgba(58, 171, 32, 0.2)",
    "rect-border": "rgba(31, 52, 161, 0.6)",
    "black": "#222",
    "grey": "#666",
    "light-grey": "#aaa"
  } : {
    "rect": "rgba(31, 52, 161, 0.4)",
    "interval": "rgba(58, 171, 32, 0.15)",
    "rect-border": "rgba(31, 52, 161, 1)",
    "black": "#ccc",
    "grey": "#999",
    "light-grey": "#777"
  };

  // HTML ELEMENTS REFERENCES
  const cnv = useRef(null);

  // STATES
  const [center_x, setCenterX] = useState(cnv_width / 2);
  const [center_y, setCenterY] = useState(cnv_height / 2);
  const [mouseDownPos, setMouseDownPos] = useState([]);
  const [dragOn, setDragOn] = useState(false);

  let ctx;

  // EVENTS HANDLERS
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

  // CUSTOM MATHEMATICAL FUNCTION
  const F = new Function("x", `return ${eq}`);

  // PLANE RENDERING
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
    for (let i = - center_x; i <= cnv_width - center_x; i++) {
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

  function renderTrapezoids() {
    // TRAPEZOIDS RIEMANN SUM
    ctx.fillStyle = COLORS["rect"];
    ctx.strokeStyle = COLORS["rect-border"];
    const delta_x = (right_bound - left_bound) / N;
    let sum = 0, prev_x, prev_y;
    prev_x = left_bound;
    prev_y = F(left_bound);

    for (let i = 1; i < N + 1; i++) {
      const x = left_bound + i * delta_x;
      const y = F(x);
      sum += (y + prev_y) / 2 * delta_x;
      
      ctx.beginPath();
      ctx.moveTo(prev_x * zoom + center_x, prev_y * zoom + center_y);

      ctx.lineTo(x * zoom + center_x, y * zoom + center_y);
      ctx.lineTo(x * zoom + center_x, center_y);
      ctx.lineTo(prev_x * zoom + center_x, center_y)
      ctx.lineTo(prev_x * zoom + center_x, prev_y * zoom + center_y);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();

      prev_x = x; prev_y = y;
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
    
    if (sum_type == "trap") renderTrapezoids();
    else renderRectangles();
  }

  // USEEFFECT HOOKS
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
  }, [left_bound, right_bound, N, eq, sum_type, zoom, center_x, center_y, cnv_width, cnv_height, dark_mode]);

  return <canvas
    id="cnv"
    width={ cnv_width }
    height={ cnv_height }
    ref={ cnv }
    onMouseDown={ handleMouseDown }
    onMouseMove={ handleMouseMove }
    onMouseUp={ handleMouseUp }></canvas>
}

export default Plane;
