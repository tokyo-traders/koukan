import axios from "axios";

import "./App.css";
// import "./componenet/Registration/Registration.css";

import { Route, Routes } from "react-router-dom";
import { useState, useEffect, useRef, useCallback, Component } from "react";
import Sidebar from "./componenet/Sidebar";
import NavBar from "./componenet/NavBar";
import AllListings from "./componenet/AllListings";
import useAxiosPrivate from "./componenet/hooks/axiosPrivate";

// import Registration from "./componenet/Registration/Registration";

import AddItem from "./componenet/AddItem";
import LoginForm from "./componenet/User/LoginForm";
import PendingTrade from "./componenet/PendingTrade";
import SignupForm from "./componenet/User/SignupForm";
import MyPage from "./componenet/MyPage";
import Layout from "./componenet/context/Layout";
import UserPostList from "./componenet/UserPostList";
import RequireAuth from "./componenet/User/RequireAuth";
import UserSingleItem from "./componenet/UserSingleItem";
import UserItemsList from "./componenet/UserItemList";
import AddListingForm from "./componenet/ListingForm";
import ListingSingleItem from "./componenet/ListingSingleItem";
import OfferForm from "./componenet/OfferForm";
import { Category } from "@mui/icons-material";

function App() {

	const [userState, setUserState] = useState(false)
	const [user, setUser] = useState(undefined)
	const [categoryFilter, setCategoryFilter] = useState('');
	const [searchValue, setSearchValue] = useState('');
	const [categories, setCategories] = useState([])

	const categoryRef = useRef(null)

	const axiosPrivate = useAxiosPrivate();

	const handleSearchChange = (event) => {
		setSearchValue(event.target.value);
	}

	const handleCategoryFilter = (event) => {
		setCategoryFilter(event.target.innerHTML)
	}

	useEffect(() => {
		if (userState) {
			let isMounted = true;
			const controller = new AbortController();

			const getUsers = async () => {
				try {
					const response = await axiosPrivate.get("/api/user/login", {
						signal: controller.signal,
					});
					isMounted && setUser(response.data);
				} catch (err) {
					console.error("FUckYOU FROM APP", err);
				}
			};

			getUsers();

			return () => {
				isMounted = false;
				controller.abort();
			};
		}
	}, [userState]);

	return (
		<>
			<div className="App">
				<Routes>
					<Route path="/" element={<NavBar user={user} setUser={setUser} handleSearchChange={handleSearchChange} searchValue={searchValue} />} exact>
						<Route path="/" element={[
							<Sidebar handleCategoryFilter={handleCategoryFilter} categoryFilter={categoryFilter} categories={categories} setCategories={setCategories} />,
							<AllListings searchValue={searchValue} categoryFilter={categoryFilter} categories={categories} />
						]} />
						<Route path="/Login" element={<LoginForm userState={userState} setUserState={setUserState} />} />
						<Route path="/Signup" element={<SignupForm />} />
						<Route path="/listing/:listingId" element={[<Sidebar />, <ListingSingleItem user={user} />]} />



						<Route element={<RequireAuth />}>
							<Route path="/listing/:listingId/offer" element={<OfferForm user={user} />} />
							<Route path="/MyPage" element={<MyPage user={user} />} >
								<Route path="/MyPage" element={<UserItemsList user={user} />} />
								<Route path="/MyPage/addItem" element={<AddItem user={user} />} />

								<Route path="/MyPage/postList" element={<UserPostList user={user} />} />
								<Route path="/MyPage/PendingTrade" element={<PendingTrade user={user} />} />
								<Route path="/MyPage/Items/:itemId" element={<UserSingleItem user={user} />} />
								<Route path="/MyPage/makeListing/:itemId" element={<AddListingForm user={user} />} />
							</Route>
						</Route>
					</Route>
				</Routes>
			</div>
		</>
	);
}

export default App;
