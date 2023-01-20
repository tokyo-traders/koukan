import axios from "axios";
import "./App.css";
import "./componenet/Registration/Registration.css";
import { Route, Routes } from "react-router-dom";
import { useState, useEffect, useCallback, Component } from 'react'
import Sidebar from "./componenet/Sidebar";
import NavBar from "./componenet/NavBar";
import AllListings from "./componenet/AllListings";
import useAxiosPrivate from "./componenet/hooks/axiosPrivate";
import Registration from "./componenet/Registration/Registration";
import AddItem from "./componenet/AddItem";
import LoginForm from "./componenet/User/LoginForm";
import SignupForm from "./componenet/User/SignupForm";
import MyPage from "./componenet/MyPage";
import Layout from "./componenet/context/Layout";
import RequireAuth from "./componenet/User/RequireAuth";
import UserSingleItem from "./componenet/UserSingleItem"
import UserItemsList from "./componenet/UserItemList";
import AddListingForm from "./componenet/ListingForm";



function App() {

	const [userState, setUserState] = useState(false)
	const [user, setUser] = useState(undefined)
	const axiosPrivate = useAxiosPrivate();


	useEffect(() => {
		if (userState) {
			let isMounted = true;
			const controller = new AbortController();

			const getUsers = async () => {
				try {
					const response = await axiosPrivate.get('/api/user/login', {
						signal: controller.signal
					});
					isMounted && setUser(response.data)
				} catch (err) {
					console.error("FUckYOU FROM APP", err)
				}
			}

			getUsers();

			return () => {
				isMounted = false;
				controller.abort();
			}
		}
	}, [userState]);

	return (
		<>

			<Routes>
				<Route path="/" element={<NavBar user={user} setUser={setUser} setUserState={setUserState} />} exact>
					<Route path="/" element={[<Sidebar />, <AllListings />]} />
					<Route path="/Login" element={<LoginForm userState={userState} setUserState={setUserState} />} />
					<Route path="/Signup" element={<SignupForm />} />


					<Route element={<RequireAuth />}>
						<Route path="/MyPage" element={<MyPage user={user} />} >
							<Route path="/MyPage" element={<UserItemsList user={user} />} />
							<Route path="/MyPage/addItem" element={<AddItem user={user} />} />
							<Route path="/MyPage/Items/:itemId" element={<UserSingleItem user={user} />} />
							<Route path="/MyPage/makeListing/:itemId" element={<AddListingForm user={user} />} />
						</Route>
					</Route>
				</Route>

			</Routes>
		</>
	);
}

export default App;
