import React, { useState, useEffect, useCallback } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import { Stack } from "@mui/system";
import Button from "@mui/material/Button";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@mui/material';


const Img = styled("img")({
	margin: "auto",
	display: "block",
	maxWidth: "100%",
	maxHeight: "100%",
});

const modalStyle = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

const BrownButton = styled(Button)(() => ({
	backgroundColor: "#4d3e38",
	borderRadius: "8px",
	color: "#def4f6",
	"&:hover": {
		background: "#332925",
	},
	// padding: "15px 36px",
	fontSize: "16px",
}));

const BASE_URL = "http://127.0.0.1:8000/api";

export default function UserSingleItem(props) {
	const { itemId } = useParams();
	const { user } = props;
	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || "/MyPage";
	const makeListing = useCallback(
		() => navigate(`/MyPage/makeListing/${itemId}`, { replace: true }),
		[navigate]
	);
	const goBack = useCallback(() => {
		navigate(from, { replace: true });
	}, [navigate]);

	const [itemData, setItemData] = useState({
		itemName: "",
		image: [],
		details: "",
		user_id: 0,
	});
	const [images, setImages] = useState([]);
	const [currentItemName, setCurrentItemName] = useState("");
	const [item_name, setItemName] = React.useState("");
	const [details, setDetails] = React.useState("");
	const [openEdit, setOpenEdit] = React.useState(false);
	const handleOpenEdit = () => setOpenEdit(true);
	const handleCloseEdit = () => setOpenEdit(false);
	const inputItemName = (e) => {
		setItemName(e.target.value);
	};
	const inputDetail = (e) => {
		setDetails(e.target.value);
	};
	const display = () => {
		if (user && itemId) {
			makeListing();
		}
	};

	const deleteItem = (itemId) => {
		axios
			.delete(`/api/item-edit/${itemId}`)
			.then((res) => console.log(res));
	};

	const editData = new FormData();
	const data = { item_name: item_name, details: details };
	const submitEditItemDetail = (obj) => {
		(async () => {
			// PUT request using axios with async/await
			const rawResponse = await axios
				.patch(
					`http://localhost:8000/api/item-edit/${itemId}`,
					JSON.stringify(obj),
					{
						headers: { "Content-Type": "application/json" },
						withCredentials: true,
					}
				)
				.then((res) => console.log(res.data));
		})();
	};

	useEffect(() => {
		if (itemId) {
			axios.get(`/api/all-item/${itemId}`).then((response) => {
				console.log(response.data[0]);
				return (
					setItemData(response.data[0]),
					setImages(response.data[0].image),
					setItemName(response.data[0].itemName),
					setDetails(response.data[0].details),
					setCurrentItemName(response.data[0].itemName)
				);
			});
		}
	}, []);
	return (
		<>
			<Box
				sx={{
					width: "70%",
					margin: "auto",
					marginTop: 2,
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Grid
					container
					spacing={2}
					sx={{ backgroundColor: "none", marginTop: 2 }}
				>
					<Grid item xs={5} sx={{ margin: "10px" }}>
						<Container sx={{ height: 350 }}>
							{images && (
								<Carousel autoPlay={true} infiniteLoop={true}>
									{images.map((x) => (
										<div>
											<img alt="image1" src={BASE_URL + `${x}`} />
										</div>
									))}
								</Carousel>
							)}
						</Container>
					</Grid>
					<Grid item xs={5} container>
						<Grid item xs container direction="column" spacing={2}>
							<Grid item xs>
								<Box
									sx={{
										backgroundColor: "none",
										paddingBottom:2,
										borderBottom: 1,
										borderColor: 'grey.500'
									}}
								>
									<div>
									{itemData && (
										<Typography variant="h5">{itemData?.itemName}</Typography>
									)}
									
									<Tooltip title="Edit item">
										<IconButton onClick={handleOpenEdit}>
											<EditIcon sx={{ fontSize: "30px", color:'#4d3e38' }}/>
										</IconButton>
									</Tooltip>

									<Tooltip title="Delete item">
										<IconButton onClick={() => deleteItem(Number(itemId))}>
											<DeleteIcon sx={{ fontSize: "30px", color:'#4d3e38' }}/>
										</IconButton>
									</Tooltip>

									<Modal
											open={openEdit}
											onClose={handleCloseEdit}
											aria-labelledby="modal-modal-title"
											aria-describedby="modal-modal-description"
										>
											<Box sx={modalStyle}>
												<Typography
													id="modal-modal-title"
													variant="h6"
													component="h2"
												>
													Edit Item Details
												</Typography>
												<Stack
													direction="column"
													justifyContent="center"
													alignItems="center"
													spacing={0.5}
												>
													<TextField
														required
														id="itemName"
														label="Item Name"
														value={item_name}
														onChange={inputItemName}
													/>
													<TextField
														required
														id="itemDetails"
														label="Description"
														value={details}
														onChange={inputDetail}
													/>
													<Button
														onClick={() => {
															submitEditItemDetail(data);
														}}
														variant="outlined"
													>
														Submit
													</Button>
													<Button
														onClick={() => {
															handleCloseEdit();
														}}
														variant="outlined"
													>
														Close
													</Button>
												</Stack>
											</Box>
										</Modal>
									</div>

									<BrownButton
										fullWidth
										variant="contained"
										sx={{ mt: 3, mb: 2 }}
										onClick={display}
									>
										MAKE POST
									</BrownButton>
								</Box>

								<Box
									sx={{
										backgroundColor: "none",
										marginTop: 4,
									}}
								>
									<Typography gutterBottom variant="h6" component="div">
										Description
									</Typography>
									{itemData && (
										<Typography gutterBottom variant="body">
											{itemData?.details}
										</Typography>
									)}
								</Box>

								<Box
									sx={{
										backgroundColor: "white",
										marginTop: 4,
									}}
								></Box>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Box>
		</>
	);
}
