import { useEffect, useRef } from 'react';

const PayPalButton = ({ amount, onSuccess }) => {
    const paypalRef = useRef();

    useEffect(() => {
        window.paypal.Buttons({
            style: {
                color: 'white'
            },
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [
                        {
                            amount: { value: amount },
                        },
                    ],
                });
            },
            onApprove: async (data, actions) => {
                const order = await actions.order.capture();
                onSuccess(order);
            },
            onError: (err) => {
                console.error('PayPal Checkout Error', err);
            },
        }).render(paypalRef.current);
    }, [amount, onSuccess]);

    return (
        <div ref={paypalRef}
            style={{
                width: '75%',
                margin: '0 auto'
            }}>
        </div>
    )
};

export default PayPalButton;
