import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import Styled from "styled-components";
import GithubIcon from "mdi-react/GithubIcon";
import { useDispatch, useSelector } from "react-redux";
import { authenticate } from "../../features/userSlice";

export const Login = () => {
  const [data, setData] = useState({ errorMessage: "", isLoading: false });
  const dispatch = useDispatch();

  const userState = useSelector((state) => state.user);

  const { gitClientId, gitRedirectUri } = userState;

  useEffect(() => {

    // After requesting Github access, Github redirects back to your app with a code parameter
    const url = window.location.href;
    const hasCode = url.includes("?code=");
    console.log(url)
    // If Github API returns the code parameter
    if (hasCode) {
      const newUrl = url.split("?code=");
      console.log(newUrl[1])
      window.history.pushState({}, null, newUrl[0]);
      dispatch(authenticate(newUrl[1]));
    }
  }, [dispatch, data]);

  if (userState.user) {
    return <Redirect to="/projects" />;
  }

  return (
    <Wrapper>
      <section className="container">
        <div>
          <div className="login-container">
            {data.isLoading ? (
              <div className="loader-container">
                <div className="loader"></div>
              </div>
            ) : (
              <>
                {
                  // Link to request GitHub access
                }
                <a
                  className="login-link"
                  href={`https://github.com/login/oauth/authorize?scope=user&client_id=${gitClientId}&redirect_uri=${gitRedirectUri}`}
                  onClick={() => {
                    setData({ ...data, errorMessage: "" });
                  }}
                >
                  <GithubIcon style={{marginRight: '10px'}} />
                  <h5 style={{margin: 'auto'}}>Login with GitHub</h5>
                </a>
              </>
            )}
          </div>
        </div>
      </section>
    </Wrapper>
  );
};

const Wrapper = Styled.section`
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
    font-family: Arial;
    
    > div:nth-child(1) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
      transition: 0.3s;
      width: 50%;
      height: 45%;

      .login-container {
        background-color: #000;
        width: 70%;
        border-radius: 3px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        > .login-link {
          text-decoration: none;
          color: #fff;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;          
          height: 40px;
        }
        .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;          
          height: 40px;
        }
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 12px;
          height: 12px;
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      }
    }
  }
`;
