import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { dataSelector } from "../../selectors/app.selectors";
import "./RandomSpinner.scss";


const RandomSpinner = ({ data }) => {
  const images = data.nations.filter(item => !item.banned ).map(el => el.image);
  const [flagLeft, setFlagLeft] = useState(images[0]);
  const [flagRight, setFlagRight] = useState(images[1]);
  const [flagCenter, setFlagCenter] = useState(images[2]);

  useEffect(() => {
    const min = 0;
    const max = images.length - 1;

    let interval = setInterval(() => {
      const randomLeft = Math.floor(Math.random() * (max - min + 1)) + min;
      const randomRight = Math.floor(Math.random() * (max - min + 1)) + min;
      const randomCenter = Math.floor(Math.random() * (max - min + 1)) + min;
      setFlagLeft(images[randomLeft]);
      setFlagRight(images[randomRight]);
      setFlagCenter(images[randomCenter]);
    }, 150);

    return () => {
      clearInterval(interval);
    };
  }, [images]);

  return (
    <div className="random-spinner">
      <img className="random-spinner__image" src={flagLeft} alt="" />
      <img className="random-spinner__image" src={flagRight} alt="" />
      <img className="random-spinner__image" src={flagCenter} alt="" />
    </div>
  );
};

const mapStateToProps = state => {
  return {
      data: dataSelector(state),
  };
};

export default React.memo(connect(mapStateToProps, null)(RandomSpinner));