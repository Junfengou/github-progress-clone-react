import React, { useState, useEffect, createContext } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = createContext();

const GithubProvider = ({ children }) => {
	const [githubUser, setGithubUser] = useState(mockUser);
	const [repos, setRepos] = useState(mockRepos);
	const [followers, setFollowers] = useState(mockFollowers);

	const [request, setRequest] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState({ show: false, msg: "" });

	const searchGithubUser = async (user) => {
		// console.log("user: ", user);

		toggleError();
		setIsLoading(true);

		const getProfile = await axios(`${rootUrl}/users/${user}`).catch((err) =>
			console.log(err)
		);
		const getRepos = await axios(
			`${rootUrl}/users/${user}/repos?per_page=100`
		).catch((err) => {
			console.log(err);
		});

		const getFollowers = await axios(
			`${rootUrl}/users/${user}/followers`
		).catch((err) => {
			console.log(err);
		});

		// console.log("response: ", response);
		console.log("getRepos: ", getRepos);
		console.log("getFollowers: ", getFollowers.data);
		if (getProfile && getRepos && getFollowers) {
			//3:40:00 [https://www.youtube.com/watch?v=dR_Fol8nAzo] rewatch this part if run into error
			setGithubUser(getProfile.data);
			setRepos(getRepos.data);
			setFollowers(getFollowers.data);
			//This line of code will make sure every information is loaded before display them on the site
			//	instead of having each item load one at a time
			await Promise.allSettled([getProfile, getRepos, getFollowers]).then(
				(results) => {
					console.log("results: ", results);
				}
			);
		} else {
			toggleError(true, "there is no user with that username");
		}
		checkRequest();
		setIsLoading(false);
	};

	//check rate
	const checkRequest = () => {
		//axios by default is a get request
		axios(`${rootUrl}/rate_limit`)
			.then(({ data }) => {
				// console.log("result:", data);
				let {
					rate: { remaining },
				} = data;
				setRequest(remaining);
				if (remaining === 0) {
					// if the remaining request is 0
					//throw an error
					toggleError(true, "Sorry, you have exceeded your hourly rate limit");
				}
			})
			.catch((err) => console.log(err));
	};

	function toggleError(show = false, msg = "") {
		setError({ show, msg });
	}
	useEffect(checkRequest, []);

	return (
		<GithubContext.Provider
			value={{
				githubUser,
				repos,
				followers,
				request,
				error,
				searchGithubUser,
				isLoading,
			}}
		>
			{children}
		</GithubContext.Provider>
	);
};

export { GithubProvider, GithubContext };
