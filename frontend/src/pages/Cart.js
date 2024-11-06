import React, { useContext, useEffect, useState } from 'react';
import SummaryApi from '../common';
import Context from '../context';
import displayINRCurrency from '../helpers/displayCurrency';
import { MdDelete } from 'react-icons/md';
import { loadStripe } from '@stripe/stripe-js';
import UploadAddress from '../components/UploadAddress';

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openUploadAddress, setOpenUploadAddress] = useState(false);
  const [uploadedAddress, setUploadedAddress] = useState(null);
  const context = useContext(Context);
  const loadingCart = new Array(4).fill(null);

  const fetchData = async () => {
    const response = await fetch(SummaryApi.addToCartProductView.url, {
      method: SummaryApi.addToCartProductView.method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();
    if (responseData.success) {
      setData(responseData.data);
    }
  };

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, []);

  const updateQuantity = async (id, qty) => {
    const response = await fetch(SummaryApi.updateCartProduct.url, {
      method: SummaryApi.updateCartProduct.method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id: id, quantity: qty }),
    });

    const responseData = await response.json();
    if (responseData.success) {
      fetchData();
    }
  };

  const deleteCartProduct = async (id) => {
    const response = await fetch(SummaryApi.deleteCartProduct.url, {
      method: SummaryApi.deleteCartProduct.method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id: id }),
    });

    const responseData = await response.json();
    if (responseData.success) {
      fetchData();
      context.fetchUserAddToCart();
    }
  };

  const handlePayment = async () => {
    const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
    const response = await fetch(SummaryApi.payment.url, {
      method: SummaryApi.payment.method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cartItems: data }),
    });

    const responseData = await response.json();
    if (responseData?.id) {
      stripe.redirectToCheckout({ sessionId: responseData.id });
    }

    console.log('payment response', responseData);
  };

  const handleAddressUpload = (addressData) => {
    setUploadedAddress(addressData);
    console.log(addressData);
  };

  const totalQty = data.reduce((prev, curr) => prev + curr.quantity, 0);
  const totalPrice = data.reduce((prev, curr) => prev + (curr.quantity * curr?.productId?.sellingPrice), 0);

  return (
    <div className='container mx-auto'>
      <div className='text-center text-lg my-3'>
        {data.length === 0 && !loading && (
          <p className='bg-white py-5'>No Data</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10 p-4">
        <div className="relative group ml-5 mt-5">
          <button
            className="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 border-2 border-transparent"
            onClick={() => setOpenUploadAddress(true)}
          >
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
            <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
              <div className="relative z-10 flex items-center space-x-2">
                <span className="transition-all duration-500 group-hover:translate-x-1">Add Address</span>
                <svg className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" fillRule="evenodd"></path>
                </svg>
              </div>
            </span>
          </button>
        </div>
      </div>

      {openUploadAddress && (
        <UploadAddress 
          onClose={() => setOpenUploadAddress(false)} 
          onUpload={handleAddressUpload} 
        />
      )}

      {uploadedAddress && (
        <div className='form-container bg-white mx-3 w-[300px] rounded-[15px] text-center shadow-lg'>
          <h2 className='font-bold text-lg text-yellow-700'>Address</h2>
          <div className='form-group ml-3 flex'>
            <div className='font-bold mr-2'>Name: </div> 
            <p>{uploadedAddress.orderName}</p>
          </div>
          <div className='form-group  ml-3 flex'>
          <div className='font-bold mr-2'>Phone: </div> 
            <p>{uploadedAddress.number}</p>
          </div>
          <div className='form-group ml-3 flex'>
          <div className='font-bold mr-2'>Address: </div> 
            <p>{uploadedAddress.address}</p>
          </div>
          <div className='form-group  ml-3 flex'>
          <div className='font-bold mr-2'>ZIP: </div> 
            <p>{uploadedAddress.zipcode}</p>
          </div>
          <div className='form-group ml-3 flex'>
          <div className='font-bold mr-2'>City: </div> 
            <p>{uploadedAddress.city}</p>
          </div>
          <div className='form-group ml-3 flex'>
          <div className='font-bold mr-2'>Country:  </div> 
            <p>{uploadedAddress.country}</p>
          </div>
          <button 
              className="bg-blue-600 text-white rounded-md mt-3 mb-3 px-4 py-1 "
              onClick={() => setOpenUploadAddress(true)}
            >
            Change Address
          </button>
        </div>
      )}

          {openUploadAddress && (
            <UploadAddress 
              onClose={() => setOpenUploadAddress(false)} 
              onUpload={handleAddressUpload} 
              addressData={uploadedAddress}
            />
          )}

      <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>
        <div className='w-full max-w-3xl'>
          {loading ? (
            loadingCart.map((_, index) => (
              <div key={index} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'></div>
            ))
          ) : (
            data.map((product) => (
              <div key={product?._id} className='w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]'>
                <div className='w-32 h-32 bg-slate-200'>
                  <img src={product?.productId?.productImage[0]} className='w-full h-full object-scale-down' alt={product?.productId?.productName} />
                </div>
                <div className='px-4 py-2 relative'>
                  <div className='absolute right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer' onClick={() => deleteCartProduct(product?._id)}>
                    <MdDelete />
                  </div>

                  <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1'>{product?.productId?.productName}</h2>
                  <p className='capitalize text-slate-500'>{product?.productId.category}</p>
                  <div className='flex items-center justify-between'>
                    <p className='text-red-600 font-medium text-lg'>{displayINRCurrency(product?.productId?.sellingPrice)}</p>
                    <p className='text-slate-600 font-semibold text-lg'>{displayINRCurrency(product?.productId?.sellingPrice * product?.quantity)}</p>
                  </div>
                  <div className='flex items-center gap-3 mt-1'>
                    <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded' onClick={() => updateQuantity(product?._id, product?.quantity - 1)}>-</button>
                    <span>{product?.quantity}</span>
                    <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded' onClick={() => updateQuantity(product?._id, product?.quantity + 1)}>+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {data[0] && (
          <div className='mt-5 lg:mt-0 w-full max-w-sm'>
            {loading ? (
              <div className='h-36 bg-slate-200 border border-slate-300 animate-pulse'></div>
            ) : (
              <div className='h-36 bg-white'>
                <h2 className='text-white bg-red-600 px-4 py-1'>Summary</h2>
                <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                  <p>Quantity</p>
                  <p>{totalQty}</p>
                </div>
                <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                  <p>Total Price</p>
                  <p>{displayINRCurrency(totalPrice)}</p>
                </div>
                <button className='bg-blue-600 p-2 text-white w-full mt-2' onClick={handlePayment}>Payment</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
