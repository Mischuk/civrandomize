import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import "./Checkbox.styles.scss";

export default function Checkbox({ value = false, onUpdate = () => {} }) {
    const [checkboxValue, setCheckboxValue] = useState(value);

    const handleChange = () => {
        const upd = !checkboxValue;
        setCheckboxValue(upd);
        onUpdate(upd);
    };

    return (
        <div className="Checkbox">
            <label>
                <input value={checkboxValue} onChange={handleChange} type="checkbox" />
                <FaCheck />
            </label>
        </div>
    );
}
