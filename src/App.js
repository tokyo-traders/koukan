import "./App.css";
// import "./componenet/Registration/Registration.css";

import { Route, Routes } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Sidebar from "./componenet/Sidebar";
import NavBar from "./componenet/NavBar";
import AllListings from "./componenet/AllListings";
import AddItem from "./componenet/AddItem";
import LoginForm from "./componenet/User/LoginForm";
import SignupForm from "./componenet/User/SignupForm";
import PendingTrade from "./componenet/PendingTrade";
import MyPage from "./componenet/MyPage";
import UserPostList from "./componenet/UserPostList";
import RequireAuth from "./componenet/User/RequireAuth";
import UserSingleItem from "./componenet/UserSingleItem";
import UserItemsList from "./componenet/UserItemList";
import AddListingForm from "./componenet/ListingForm";
import ListingSingleItem from "./componenet/ListingSingleItem";
import OfferForm from "./componenet/OfferForm";
import UserOfferList from "./componenet/UserOffersList";
import UserSingleOffer from "./componenet/UserSingleOffer";
import useAuth from "./componenet/hooks/useAuth";
import { Category } from "@mui/icons-material";
import PersistLogin from "./componenet/User/PersistLogin";

function App() {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [categories, setCategories] = useState([]);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleCategoryFilter = (event) => {
    event.target.innerHTML !== "All Categories"
      ? setCategoryFilter(event.target.innerHTML)
      : setCategoryFilter("");
  };

  return (
    <>
      <div className='App'>
        <Routes>
          <Route
            path='/'
            element={
              <NavBar
                handleSearchChange={handleSearchChange}
                searchValue={searchValue}
              />
            }
            exact
          >
            <Route
              path='/'
              element={[
                <Sidebar
                  handleCategoryFilter={handleCategoryFilter}
                  categoryFilter={categoryFilter}
                  categories={categories}
                  setCategories={setCategories}
                />,
                <AllListings
                  searchValue={searchValue}
                  categoryFilter={categoryFilter}
                  categories={categories}
                />,
              ]}
            />
            <Route
              path='/Login'
              element={<LoginForm />}
            />
            <Route
              path='/Signup'
              element={<SignupForm />}
            />
            <Route
              path='/listing/:listingId'
              element={[<ListingSingleItem categories={categories} />]}
            />

            <Route element={<PersistLogin />}>
              <Route element={<RequireAuth />}>
                <Route
                  path='/listing/:listingId/offer'
                  element={<OfferForm categories={categories} />}
                />
                <Route
                  path='/MyPage'
                  element={<MyPage />}
                >
                  <Route
                    path='/MyPage'
                    element={<UserItemsList />}
                  />
                  <Route
                    path='/MyPage/addItem'
                    element={<AddItem />}
                  />
                  <Route
                    path='/MyPage/postList'
                    element={<UserPostList />}
                  />
                  <Route
                    path='/MyPage/offered-items'
                    element={<UserOfferList />}
                  />
                  <Route
                    path='/MyPage/singleOffer/:offerId'
                    element={<UserSingleOffer />}
                  />

                  <Route
                    path='/MyPage/pendingTrade'
                    element={<PendingTrade />}
                  />
                  <Route
                    path='/MyPage/Items/:itemId'
                    element={<UserSingleItem />}
                  />
                  <Route
                    path='/MyPage/makeListing/:itemId'
                    element={<AddListingForm categories={categories} />}
                  />
                </Route>
              </Route>
            </Route>
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
