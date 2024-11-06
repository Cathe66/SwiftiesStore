import React, { useState, useEffect } from 'react';
import { CgClose } from 'react-icons/cg';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const UploadAddress = ({ onClose, onUpload, addressData = null }) => {
  const [data, setData] = useState({
    orderName: '',
    number: '',
    address: '',
    zipcode: '',
    city: '',
    country: '',
  });

  useEffect(() => {
    if (addressData) setData(addressData);
  }, [addressData]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = addressData ? SummaryApi.updateAddress.url : SummaryApi.uploadAddress.url;
    const method = addressData ? SummaryApi.updateAddress.method : SummaryApi.uploadAddress.method;

    try {
      const response = await fetch(apiUrl, {
        method,
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit address");
      const responseData = await response.json();
      toast.success(`${addressData ? "Updated" : "Uploaded"} successfully!`);
      onUpload(responseData.data);
      onClose();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form className="bg-gray-900 rounded-lg p-4 w-[500px] max-w-2xl relative shadow-sm" onSubmit={handleSubmit}>
        <div className='flex justify-between items-center'>
          <h2 className='text-white font-bold text-lg'>{addressData ? 'Update' : 'Upload'} Address</h2>
          <button type="button" className='w-fit ml-auto' onClick={onClose}>
            <CgClose className="text-white" />
          </button>
        </div>

        {['orderName', 'number', 'address', 'city', 'zipcode', 'country'].map((field, index) => (
          <div className="mt-4" key={index}>
            <label className="text-white" htmlFor={field}>{field === 'orderName' ? 'Name' : field.charAt(0).toUpperCase() + field.slice(1)}</label>
            {field === 'address' ? (
              <textarea
                placeholder={`Enter ${field}`}
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                id={field}
                name={field}
                value={data[field]}
                onChange={handleOnChange}
              ></textarea>
            ) : (
              <input
                placeholder={`Enter ${field}`}
                className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                type="text"
                id={field}
                name={field}
                value={data[field]}
                onChange={handleOnChange}
              />
            )}
          </div>
        ))}
        <div className="mt-4 flex justify-end">
          <button className="bg-white text-black rounded-md px-4 py-1 hover:bg-blue-500 hover:text-white transition-all duration-200" type="submit">
            {addressData ? 'Update' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadAddress;
