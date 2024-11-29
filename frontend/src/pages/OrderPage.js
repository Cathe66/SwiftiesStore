import React, { useState, useEffect } from 'react';
import SummaryApi from '../common';
import moment from 'moment';
import displayUSCurrency from '../helpers/displayCurrency';

const OrderPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(SummaryApi.getOrder.url, {
        method: SummaryApi.getOrder.method,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const responseData = await response.json();
      setData(responseData.data || []);
      console.log('order list', responseData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className='p-4'>
      {data.length === 0 ? <p>No Order Available</p> : (
        data.map((item, index) => (
          <div key={item.userId + index}  >
            <p className="font-medium text-lg">{moment(item.createdAt).format('LL')}</p>
            <div className="border rounded p-3 mb-5 bg-slate-200 shadow-[2px_2px_4px_rgba(128,128,128,0.5)]" >
              <div className = 'flex flex-colj justify-between'>
                <div className='grid gap-1 '>
                  {item.productDetails?.map((product, productIndex) => (
                    <div key={product.productId + index} className="flex items-center  bg-slate-200 mb-2">
                      <img 
                        src={product.image[0]} 
                        className='w-28 h-28 bg-white object-scale-down p-2' 
                        alt={product.name}
                      />
                      <div className="ml-3">
                        <div className='text-lg font-bold'>{product.name}</div>
                        <div className="flex items-center gap-5 mt-1">
                          <div className='text-lg text-rose-500'>{displayUSCurrency(product.price)}</div>
                          <p>Quantity: {product.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='flex flex-col lg:flex-row gap-10 mr-5  p-2'>
             
                {/* <div>
                  <div className="text-lg font-medium">Address Details:</div>
                  <p className='ml-1'>Payment method: {item.paymentDetails?.payment_method_type[0]}</p>
                </div> */}

                <div>
                  <div className="text-lg font-medium">Payment Details:</div>
                  <p className='ml-1'>Payment method: {item.paymentDetails?.payment_method_type[0]}</p>
                  <p className='ml-1'>Payment Status: {item.paymentDetails?.payment_status}</p>
                </div>

                <div>
                  <div className="text-lg font-medium">Shipping Details:</div>
                  {item.shipping_options?.map((shipping, shippingIndex) => (
                    <div key={shipping.shipping_rate} className='flex gap-3'>
                      Shipping Amount: {displayUSCurrency(shipping.shipping_amount)}
                    </div>
                  ))}
                </div>
             </div>
            </div>   

            <div className="font-bold ml-auto w-fit lg:text-lg">
              Total Amount: {displayUSCurrency(item.totalAmount)}
            </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderPage;
