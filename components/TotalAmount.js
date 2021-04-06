import React, { useState, useEffect } from 'react';
import { Text } from 'react-native-elements';

const TotalAmount = ({ items, paramKey, color }) => {
    const [total, setTotal] = useState(0.00);

    useEffect(() => {
        calcTotalAmount()
    },[items]);

    const calcTotalAmount = () => {
        const sum = items && items.length ? items.reduce((a, b) => a + (b[paramKey] || 0), 0) : 0;
        setTotal(sum.toLocaleString("en-US",{style: "currency", currency: "USD"}) );
    }

    return (
        <>
            <Text h3 style={{ textAlign: "center", color: color }}>{ total }</Text>
        </>
    );
}

export default TotalAmount;




