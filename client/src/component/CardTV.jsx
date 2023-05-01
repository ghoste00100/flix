import { useContext, useState } from "react";
import { Container } from "react-bootstrap";
import { useQuery } from "react-query";
import { NavLink } from "react-router-dom";

import { useEffect } from "react";
import { API, setAuthToken } from "../config/api";

import { UserContext } from "../context/userContext";

export default function Card() {
  const [state, dispatch] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  const [categoryId, setCategoryId] = useState(1);
  
  const [ascFilms, setAscFilms] = useState([]);
  const [filteredFilms, setFilteredFilms] = useState([]);

  let { data: films } = useQuery("filmCache", async () => {
    const response = await API.get("/films");
    return response.data.data;
  });

  // let { data: categories } = useQuery("categoryCache", async () => {
  //   const response = await API.get("/categories");
  //   return response.data.data;
  // });

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      checkUser();
      console.log("User")
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");
      // Get user data
      let payload = response.data.data;
      // Get token from local storage
      payload.token = localStorage.token;
      // Send data to useContext
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
      setIsLoading(false);
    } catch (error) {
      dispatch({
        type: "AUTH_ERROR",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (films) {
      const sortedFilms = [...films].sort((a, b) => b.id - a.id);
      setAscFilms(sortedFilms);
      setFilteredFilms(categoryId ? sortedFilms.filter((film) => film.category_id === categoryId) : sortedFilms);
    }
  }, [categoryId, films]);

  useEffect(() => {
    // Redirect Auth but just when isLoading is false
    if (!isLoading) {
      console.log("apa")
      if (state.isLogin === false) {
        console.log("s")
        // navigate("/");
      }
    }
  }, [isLoading]);

  





  return (
    <>
      <Container className="">
        <>
      
          <div className={!state.isLogin || state.user.is_admin? "mt-5 pt-5" : "mt-5"}>
            <h3 className="fw-bold text-light">TV Show</h3>
          </div>
          <div className="d-flex justify-content-start mt-4 " id="wrap">
            {filteredFilms?.map((item) => {
              return (
                <>
                  <NavLink to={`/detail/${item.id}`} className="text-decoration-none d-flex" key={item.id}>
                    <div className="" style={{ width: "200px"}}>
                      <div>
                        <img
                          className="rounded"
                          src={`${item.thumbnailfilm}`}
                          width="200px"
                          height="300px"
                          style={{ objectFit: "cover" }}
                          alt="Card"
                        />
                      </div>
                      <h5 className="fw-bold text-light mt-3">{item.title}</h5>
                      <p className="text-light">{item.year}</p>
                    </div>   
                  </NavLink>
                </>
              );
            })}
          </div>
        </>
      </Container>
      </>
  );
}