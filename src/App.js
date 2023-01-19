import axios from "axios";
import "./App.css";
import "./componenet/Registration/Registration.css";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./componenet/Sidebar";
import Trades from "./componenet/Trades";
import NavBar from "./componenet/NavBar"
import Registration from "./componenet/Registration/Registration";
import AddItem from "./componenet/AddItem";
import { Component, useEffect } from "react";
import LoginForm from "./componenet/User/LoginForm";
import SignupForm from "./componenet/User/SignupForm";
import MyPage from "./componenet/MyPage";
import Layout from "./componenet/context/Layout";
import RequireAuth from "./componenet/User/RequireAuth";
import UserSingleItem from "./componenet/UserSingleItem"
import AddListingForm from "./componenet/ListingForm";


function App() {

	// const [user, setUser] = useState({name:"", email:""});
	// const [error, setError] = useState("");

	// const Login = details => {
	//   console.log(details);

	//   off(details.email == adminUser.email )
	// }

	// const Logout =() => {
	//   console.log("Logout")
	// }

	return (
		<>
			<NavBar />
			<Routes>
				<Route path="/" element={<Layout />} exact>
					<Route path="/" element={<Sidebar />} exact />
					<Route path="/" element={<Trades />} />
					<Route path="/Login" element={<LoginForm />} />
					<Route path="/Signup" element={<SignupForm />} />

					<Route path="/listingform" element={<AddListingForm />} />
					<Route path="/addItem" element={<AddItem />} />
					{/* <Route element={<RequireAuth />}>
						<Route path="/MyPage" element={<MyPage />} />
					</Route> */}
				</Route>

			</Routes>
		</>
	);
}

export default App;
