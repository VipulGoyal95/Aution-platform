import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/slices/userSlice";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiAuctionFill } from "react-icons/ri";
import { MdLeaderboard } from "react-icons/md";
import { BiUser } from "react-icons/bi";
import { BiLogOut } from "react-icons/bi";
import { BiLogIn } from "react-icons/bi";
import { BiUserPlus } from "react-icons/bi";
import { BiHomeAlt } from "react-icons/bi";
import { BiInfoCircle } from "react-icons/bi";
import { BiEnvelope } from "react-icons/bi";
import { BiHelpCircle } from "react-icons/bi";
import { BiPlusCircle } from "react-icons/bi";
import { BiReceipt } from "react-icons/bi";
import { BiCog } from "react-icons/bi";

const SideDrawer = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <div
        onClick={() => setShow(!show)}
        className="fixed right-5 top-5 bg-indigo-600 text-white text-3xl p-2 rounded-md hover:bg-indigo-700 lg:hidden"
      >
        <GiHamburgerMenu />
      </div>
      <div
        className={`w-[100%] sm:w-[300px] bg-gradient-to-b from-purple-50 to-blue-50 h-full fixed top-0 ${
          show ? "left-0" : "left-[-100%]"
        } transition-all duration-100 p-4 flex flex-col justify-between lg:left-0 border-r-[1px] border-r-purple-200`}
      >
        <div className="relative">
          <Link to={"/"}>
            <h4 className="text-2xl font-semibold mb-4">
              Prime<span className="text-indigo-600">Bid</span>
            </h4>
          </Link>
          <ul className="flex flex-col gap-3">
            <li>
              <Link
                to={"/auctions"}
                className="flex text-xl font-semibold gap-2 items-center hover:text-indigo-600 hover:transition-all hover:duration-150"
              >
                <RiAuctionFill /> Auctions
              </Link>
            </li>
            <li>
              <Link
                to={"/leaderboard"}
                className="flex text-xl font-semibold gap-2 items-center hover:text-indigo-600 hover:transition-all hover:duration-150"
              >
                <MdLeaderboard /> Leaderboard
              </Link>
            </li>
            <li>
              {/* <Link
                to={"/how-it-works"}
                className="flex text-xl font-semibold gap-2 items-center hover:text-indigo-600 hover:transition-all hover:duration-150"
              >
                <BiHelpCircle /> How It Works
              </Link> */}
            </li>
            <li>
              <Link
                to={"/about"}
                className="flex text-xl font-semibold gap-2 items-center hover:text-indigo-600 hover:transition-all hover:duration-150"
              >
                <BiInfoCircle /> About
              </Link>
            </li>
            <li>
              <Link
                to={"/contact"}
                className="flex text-xl font-semibold gap-2 items-center hover:text-indigo-600 hover:transition-all hover:duration-150"
              >
                <BiEnvelope /> Contact
              </Link>
            </li>
            <li>
              <Link
                to={"/"}
                className="flex text-xl font-semibold gap-2 items-center hover:text-indigo-600 hover:transition-all hover:duration-150"
              >
                <BiHomeAlt /> Home
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          {isAuthenticated ? (
            <>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <BiUser className="text-2xl" />
                  <span className="text-lg font-semibold">{user?.name}</span>
                </div>
                <Link
                  to={"/dashboard"}
                  className="bg-indigo-600 font-semibold hover:bg-indigo-700 text-xl py-1 px-4 rounded-md text-white"
                >
                  Dashboard
                </Link>
                <Link
                  to={"/create-auction"}
                  className="bg-indigo-600 font-semibold hover:bg-indigo-700 text-xl py-1 px-4 rounded-md text-white"
                >
                  Create Auction
                </Link>
                <Link
                  to={"/view-my-auctions"}
                  className="bg-indigo-600 font-semibold hover:bg-indigo-700 text-xl py-1 px-4 rounded-md text-white"
                >
                  My Auctions
                </Link>
                <Link to={"/submit-commission"} 
                className="bg-indigo-600 font-semibold hover:bg-indigo-700 text-xl py-1 px-4 rounded-md text-white">
                  <BiReceipt className="inline mr-2" />
                  Submit Commission
                </Link>
                <hr className="mb-4 border-t-indigo-600" />
                <Link
                  to={"/profile"}
                  className="flex text-xl font-semibold gap-2 items-center hover:text-indigo-600 hover:transition-all hover:duration-150"
                >
                  <BiCog /> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex text-xl font-semibold gap-2 items-center hover:text-indigo-600 hover:transition-all hover:duration-150"
                >
                  <BiLogOut /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to={"/login"}
                className="flex text-xl font-semibold gap-2 items-center hover:text-indigo-600 hover:transition-all hover:duration-150"
              >
                <BiLogIn /> Login
              </Link>
              <Link
                to={"/sign-up"}
                className="flex text-xl font-semibold gap-2 items-center hover:text-indigo-600 hover:transition-all hover:duration-150"
              >
                <BiUserPlus /> Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
