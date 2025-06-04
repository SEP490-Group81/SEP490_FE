import React from 'react';
import "./CardItem.css"

function CardItem(props) {
    const { title } = props;
    return (
        <>
            <div className="card-item">
                {title && <h4> {title}</h4>}
            </div>

        </>
    )
}

export default CardItem;