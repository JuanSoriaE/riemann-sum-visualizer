import "./FormField.css";

function FormField({ name, label_txt, label_des, placeholder_txt, reference, dark_mode }) {
  return <div className="form-field">
    <div>
      <label
        className="form-field-lbl"
        htmlFor={ name }>{ label_txt }</label>
      <span
        className="des-span">{ label_des }</span>
    </div>
    <input
      type="text"
      className={ "txt-inp" + (dark_mode ? " dark" : "")}
      name={ name }
      placeholder={ placeholder_txt }
      ref={ reference } />
  </div>
}

export default FormField;
