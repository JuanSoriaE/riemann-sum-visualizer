import "./SideBar.css";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import FormField from "./FormField";

function SideBar({ show_sidebar, left_bound, right_bound, N, sum_type, eq, setLeftBound, setRightBound, setN, setSumType, setEq, dark_mode }) {
  // CONSTANTS
  const N_LIMIT = 100;

  // HTML ELEMENTS REFERENCES
  const eq_input = useRef(null);
  const left_bound_input = useRef(null);
  const right_bound_input = useRef(null);
  const N_input = useRef(null);
  const N_txt_input = useRef(null);
  const form_btn = useRef(null);

  // UX
  const sidebar_variants = {
    open: {opacity: 1, x: 0},
    closed: {opacity: 0, x: "-100%", display: "none"}
  };

  // EVENTS HANDLERS
  function setValues(e) {
    e.preventDefault();
    const new_eq = eq_input.current.value || eq;
    const new_lft_bound = left_bound_input.current.value || left_bound;
    const new_rgt_bound = right_bound_input.current.value || right_bound;
    const new_N = N_input.current.value;

    setEq(new_eq);
    setLeftBound(Number(new_lft_bound));
    setRightBound(Number(new_rgt_bound));
    setN(Number(new_N));
  }

  function setRadioSumType(e) {
    setSumType(e.target.value);
  }

  return <motion.div
      id="side-bar"
      className={ dark_mode ? "dark" : "" }
      animate={ show_sidebar ? "open" : "closed" }
      transition={ {type: "just", duration: 0.25} }
      variants={ sidebar_variants }>
      <form onSubmit={ setValues } id="params-form">
        <FormField
          label_txt="Equation f(x)"
          name="equation"
          placeholder_txt={ eq }
          reference={ eq_input }
          dark_mode={ dark_mode } />

        <h2 className="section-name">Range</h2>
        <FormField
          label_txt="Left endpoint"
          name="lft-endpoint"
          placeholder_txt={ left_bound }
          reference={ left_bound_input }
          dark_mode={ dark_mode } />

        <FormField
          label_txt="Right endpoint"
          name="rgt-endpoint"
          placeholder_txt={ right_bound }
          reference={ right_bound_input }
          dark_mode={ dark_mode } />

        <h2 className="section-name">Sum Parameters</h2>
        <div className="form-field">
          <label className="form-field-lbl">N</label>
          <div className="range-inp-container">
            <input
              type="range"
              id="N-input"
              className={ dark_mode ? " dark" : "" }
              min="2"
              max={ N_LIMIT }
              ref={ N_input }
              onChange={ setValues }
              value={ N } />
            <input
              className={ "txt-inp range-txt-inp" + (dark_mode ? " dark" : "")}
              type="text"
              placeholder={ N }
              ref={ N_txt_input }
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
              onChange={ setRadioSumType }
              checked={ sum_type == "left" } />
            <label className={ "form-field-lbl" + (dark_mode ? " dark" : "") } htmlFor="left-sum-radio">Left Sum</label>
          </div>
          <div className="radio-container">
            <input
              type="radio"
              id="right-sum-radio"
              name="sum-type"
              value="right"
              onChange={ setRadioSumType }
              checked={ sum_type == "right" } />
            <label className={ "form-field-lbl" + (dark_mode ? " dark" : "") } htmlFor="right-sum-radio">Right Sum</label>
          </div>
          <div className="radio-container">
            <input
              type="radio"
              id="mid-sum-radio"
              name="sum-type"
              value="mid"
              onChange={ setRadioSumType }
              checked={ sum_type == "mid" } />
            <label className={ "form-field-lbl" + (dark_mode ? " dark" : "") } htmlFor="mid-sum-radio">Mid Sum</label>
          </div>
          <div className="radio-container">
            <input
              type="radio"
              id="trap-sum-radio"
              name="sum-type"
              value="trap"
              onChange={ setRadioSumType }
              checked={ sum_type == "trap" } />
            <label className={ "form-field-lbl" + (dark_mode ? " dark" : "") } htmlFor="trap-sum-radio">Trapezoidal Sum</label>
          </div>
        </div>
        <div className="form-field">
          <input
            className="primary-button"
            type="submit"
            value="APPLY"
            ref={ form_btn }
            onClick={ setValues } />
        </div>
      </form>
    </motion.div>
}

export default SideBar;
