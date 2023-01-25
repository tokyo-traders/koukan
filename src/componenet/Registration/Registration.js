import { useRef, useState, useEffect } from "react";
import axios from "axios";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/api/user/register";

const Registration = () => {
	const firstNameRef = useRef();
	const lastNameRef = useRef();
	const emailRef = useRef();
	const addressRef = useRef();
	const phoneRef = useRef();
	const userRef = useRef();
	const errRef = useRef();

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [address, setAddress] = useState("");
	const [phone, setPhone] = useState("");

	const [user, setUser] = useState("");
	const [validName, setValidName] = useState(false);
	const [userFocus, setUserFocus] = useState(false);

	const [pwd, setPwd] = useState("");
	const [validPwd, setValidPwd] = useState(false);
	const [pwdFocus, setPwdFocus] = useState(false);

	const [matchPwd, setMatchPwd] = useState("");
	const [validMatch, setValidMatch] = useState(false);
	const [matchFocus, setMatchFocus] = useState(false);

	const [errMsg, setErrMsg] = useState("");
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		userRef.current.focus();
	}, []);

	useEffect(() => {
		const result = USER_REGEX.test(user);
		console.log(result);
		setValidName(result);
	}, [user]);

	useEffect(() => {
		const result = PWD_REGEX.test(pwd);
		console.log(result);
		setValidPwd(result);
		setValidMatch(pwd === matchPwd);
	}, [pwd, matchPwd]);

	useEffect(() => {
		setErrMsg("");
	}, [user, pwd, matchPwd]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		// if button enabled with JS hack
		const v1 = USER_REGEX.test(user);
		const v2 = PWD_REGEX.test(pwd);
		if (!v1 || !v2) {
			setErrMsg("Invalid Entry");
			return;
		}
		console.log({
			username: user,
			password: pwd,
			first_name: firstName,
			last_name: lastName,
			email,
			address,
			phone_detail: phone,
		});
		try {
			const response = await axios.post(
				REGISTER_URL,
				JSON.stringify({
					username: user,
					password: pwd,
					first_name: firstName,
					last_name: lastName,
					email,
					address,
					phone_detail: phone,
				}),
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			);
			console.log(JSON.stringify(response.data));
			setSuccess(true);
			setUser("");
			setPwd("");
			setMatchPwd("");
		} catch (err) {
			if (!err?.response) {
				setErrMsg("No Server Response");
			} else if (err.response?.status === 409) {
				setErrMsg("Username Taken");
			} else {
				setErrMsg("Registration Failed");
			}
			errRef.current.focus();
		}
	};

	return (
		<>
			{success ? (
				<section>
					<h1>Success!</h1>
					<p>
						<a href="#">Sign In</a>
					</p>
				</section>
			) : (
				<div class="registration">
					<p
						ref={errRef}
						className={errMsg ? "errmsg" : "offscreen"}
						aria-live="assertive"
					>
						{errMsg}
					</p>
					<h1>Register</h1>
					<form onSubmit={handleSubmit}>
						<label htmlFor="firstName">First Name:</label>
						<input
							type="text"
							id="firstname"
							ref={firstNameRef}
							autoComplete="off"
							onChange={(e) => setFirstName(e.target.value)}
							value={firstName}
						/>
						<label htmlFor="lastName">Last Name:</label>
						<input
							type="text"
							id="lastname"
							ref={lastNameRef}
							autoComplete="off"
							onChange={(e) => setLastName(e.target.value)}
							value={lastName}
						/>
						<label htmlFor="email">email:</label>
						<input
							type="text"
							id="email"
							ref={emailRef}
							autoComplete="off"
							onChange={(e) => setEmail(e.target.value)}
							value={email}
						/>
						<label htmlFor="address">Address:</label>
						<input
							type="text"
							id="address"
							ref={addressRef}
							autoComplete="off"
							onChange={(e) => setAddress(e.target.value)}
							value={address}
						/>
						<label htmlFor="phone">Phone number:</label>
						<input
							type="text"
							id="phone"
							ref={phoneRef}
							autoComplete="off"
							onChange={(e) => setPhone(e.target.value)}
							value={phone}
						/>
						<label htmlFor="username">
							Username:
							{/* <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} /> */}
						</label>
						<input
							type="text"
							id="username"
							ref={userRef}
							autoComplete="off"
							onChange={(e) => setUser(e.target.value)}
							value={user}
							required
							aria-invalid={validName ? "false" : "true"}
							aria-describedby="uidnote"
							onFocus={() => setUserFocus(true)}
							onBlur={() => setUserFocus(false)}
						/>
						<p
							id="uidnote"
							className={
								userFocus && user && !validName ? "instructions" : "offscreen"
							}
						>
							{/* <FontAwesomeIcon icon={faInfoCircle} /> */}
							4 to 24 characters.
							<br />
							Must begin with a letter.
							<br />
							Letters, numbers, underscores, hyphens allowed.
						</p>

						<label htmlFor="password">
							Password:
							{/* <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} /> */}
						</label>
						<input
							type="password"
							id="password"
							onChange={(e) => setPwd(e.target.value)}
							value={pwd}
							required
							aria-invalid={validPwd ? "false" : "true"}
							aria-describedby="pwdnote"
							onFocus={() => setPwdFocus(true)}
							onBlur={() => setPwdFocus(false)}
						/>
						<p
							id="pwdnote"
							className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
						>
							{/* <FontAwesomeIcon icon={faInfoCircle} /> */}
							8 to 24 characters.
							<br />
							Must include uppercase and lowercase letters, a number and a
							special character.
							<br />
							Allowed special characters:{" "}
							<span aria-label="exclamation mark">!</span>{" "}
							<span aria-label="at symbol">@</span>{" "}
							<span aria-label="hashtag">#</span>{" "}
							<span aria-label="dollar sign">$</span>{" "}
							<span aria-label="percent">%</span>
						</p>

						<label htmlFor="confirm_pwd">
							Confirm Password:
							{/* <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} /> */}
						</label>
						<input
							type="password"
							id="confirm_pwd"
							onChange={(e) => setMatchPwd(e.target.value)}
							value={matchPwd}
							required
							aria-invalid={validMatch ? "false" : "true"}
							aria-describedby="confirmnote"
							onFocus={() => setMatchFocus(true)}
							onBlur={() => setMatchFocus(false)}
						/>
						<p
							id="confirmnote"
							className={
								matchFocus && !validMatch ? "instructions" : "offscreen"
							}
						>
							{/* <FontAwesomeIcon icon={faInfoCircle} /> */}
							Must match the first password input field.
						</p>

						<button
							disabled={!validName || !validPwd || !validMatch ? true : false}
						>
							Sign Up
						</button>
					</form>
					<p>
						Already registered?
						<br />
						<span className="line">
							{/*put router link here*/}
							<a href="#">Sign In</a>
						</span>
					</p>
				</div>
			)}
		</>
	);
};

export default Registration;
