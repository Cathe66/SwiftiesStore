import React, { useContext, useState } from 'react';
import Logo from './Logo';
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';

const Header = () => {
  const user = useSelector(state => state?.user?.user);
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search);
  const searchQuery = URLSearch.get("q") || ""; // Get single query as string
  const [search, setSearch] = useState(searchQuery);

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: 'include'
    });

    const data = await fetchData.json();

    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      navigate("/");
    }

    if (data.error) {
      toast.error(data.message);
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);

    if (value) {
      navigate(`/search?q=${value}`);
    } else {
      navigate("/search");
    }
  };

  return (
    <header className='h-16 shadow-md bg-black fixed w-full z-40'>
      <div className='h-full container mx-auto flex items-center px-10 justify-between'>
        <div>
          <Link to={"/"}>
            <Logo w={90} h={50} />
          </Link>
        </div>

        <div className="flex items-center justify-center w-full max-w-sm">
          <button className="relative inline-flex h-12 active:scale-90 transition overflow-hidden rounded-full p-[2px] focus:outline-none ">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#e7029a_0%,#f472b6_50%,#bd5fff_100%)]"></span>
            <span className="relative z-10 flex w-full h-full items-center justify-between bg-gray-950 rounded-full px-6">
              <input
                type="text"
                placeholder="Search product here..."
                className="flex-1 bg-transparent outline-none text-white placeholder-gray-300"
                onChange={handleSearch}
                value={search}
              />
              <span className="flex items-center justify-center min-w-[50px] h-8 bg-gray-600 rounded-full text-white transition-all duration-500">
                <GrSearch />
              </span>
            </span>
          </button>
        </div>

        <div className='flex items-center gap-7'>
          <div className='relative flex justify-center'>
            {user?._id && (
              <div className='text-3xl cursor-pointer' onClick={() => setMenuDisplay(prev => !prev)}>
                {user?.profilePic ? (
                  <img src={user?.profilePic} className='w-10 h-10 rounded-full' alt={user?.name} />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 256 256"><path fill="#91d7e8" d="M169.57 46.11a12 12 0 0 1 15.12-7.7l3.31 1.07V36a12 12 0 0 1 24 0v3.48l3.31-1.07a12 12 0 1 1 7.42 22.82l-3.31 1.08l2 2.82a12 12 0 1 1-19.41 14.1L200 76.42l-2 2.81a12 12 0 1 1-19.41-14.1l2-2.82l-3.31-1.08a12 12 0 0 1-7.71-15.12M236 128A108 108 0 1 1 128 20a109 109 0 0 1 18 1.49a12 12 0 0 1-4 23.67A85 85 0 0 0 128 44a83.94 83.94 0 0 0-65.95 135.94a83.5 83.5 0 0 1 29-23.42a52 52 0 1 1 74 0a83.5 83.5 0 0 1 29 23.42A83.57 83.57 0 0 0 212 128a85 85 0 0 0-1.16-14a12 12 0 0 1 23.67-4a109 109 0 0 1 1.49 18m-108 20a28 28 0 1 0-28-28a28 28 0 0 0 28 28m0 64a83.53 83.53 0 0 0 48.43-15.43a60 60 0 0 0-96.86 0A83.53 83.53 0 0 0 128 212"/></svg>
                )}
              </div>
            )}
            {menuDisplay && (
              <div className='absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg rounded'>
                <nav>
                  {user?.role === ROLE.ADMIN && (
                    <Link to={"/admin-panel/all-products"} className='whitespace-nowrap hidden md:block hover:bg-slate-100 p-2' onClick={() => setMenuDisplay(preve => !preve)}>Admin Panel</Link>
                  )}
                  <Link to={'/order'} className='whitespace-nowrap hidden md:block hover:bg-slate-100 p-2' onClick={() => setMenuDisplay(preve => !preve)}>Order</Link>
                </nav>
              </div>
            )}
          </div>

          {user?._id && (
            <Link to={"/cart"} className='text-2xl relative'>
              <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="#fe2a89" d="M9 20c0 1.1-.9 2-2 2s-2-.9-2-2s.9-2 2-2s2 .9 2 2m8-2c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m-9.8-3.2v-.1l.9-1.7h7.4c.7 0 1.4-.4 1.7-1l3.9-7l-1.7-1l-3.9 7h-7L4.3 2H1v2h2l3.6 7.6L5.2 14c-.1.3-.2.6-.2 1c0 1.1.9 2 2 2h12v-2H7.4c-.1 0-.2-.1-.2-.2M12 9.3l-.6-.5C9.4 6.9 8 5.7 8 4.2C8 3 9 2 10.2 2c.7 0 1.4.3 1.8.8c.4-.5 1.1-.8 1.8-.8C15 2 16 2.9 16 4.2c0 1.5-1.4 2.7-3.4 4.6z"/></svg>
              </span>
              <div className='bg-red-500 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3'>
                <p className='text-sm'>{context?.cartProductCount}</p>
              </div>
            </Link>
          )}

          <div>
            {user?._id ? (
              <button onClick={handleLogout} className='px-3 py-1 rounded-full text-white bg-blue-400 hover:bg-blue-500'>Logout</button>
            ) : (
              <Link to={"/login"} className='px-4 py-1 rounded-full text-white bg-blue-300 hover:bg-blue-500'>Login</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
