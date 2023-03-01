import './FormField.css';

function FormField({ name, label_txt, label_des, placeholder_txt, reference }) {
  return <div className='form-field'>
    <div>
      <label
        className="form-field-lbl"
        htmlFor={name}>{label_txt}</label>
      <span
        className="des-span">{label_des}</span>
    </div>
    <input
      type="text"
      className="txt-inp"
      name={name}
      placeholder={placeholder_txt}
      ref={reference} />
  </div>
}

export default FormField;
