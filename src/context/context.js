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
	const [loading, setIsLoading] = useState(false);
	const [error, setError] = useState({ show: false, msg: "" });

	const searchGithubUser = async (user) => {
		// console.log("user: ", user);

		toggleError();
		//loading: true

		const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
			console.log(err)
		);
		console.log("response: ", response);
		if (response) {
			setGithubUser(response.data);
		} else {
			toggleError(true, "there is no user with that username");
		}
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
			value={{ githubUser, repos, followers, request, error, searchGithubUser }}
		>
			{children}
		</GithubContext.Provider>
	);
};

export { GithubProvider, GithubContext };
