import React, { useContext } from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";

function Repos() {
	const { repos } = useContext(GithubContext);

	//refer back to the video at 2:10:00 [https://www.youtube.com/watch?v=dR_Fol8nAzo]
	const languages = repos.reduce((total, item) => {
		// console.log("item: ", item);
		const { language, stargazers_count } = item;
		if (!language) return total; // check if the language is null

		//If it doesn't exist yet, create the initial object
		if (!total[language]) {
			total[language] = {
				label: language,
				value: 1,
				stars: stargazers_count,
			};
		} else {
			total[language] = {
				...total[language],
				value: total[language].value + 1,
				stars: total[language].stars + stargazers_count,
			};
		}
		return total;
	}, {});

	console.log("objects: ", languages);
	// turning the object back into an array so we can sort it. The goal is to display only the first 5 most popular language on the user's profile

	// ----------------------------------------------------------->
	const mostUsed = Object.values(languages)
		.sort((lowest, highest) => {
			return highest.value - lowest.value; // Always return the highest value language first
		})
		.slice(0, 5); //start at index 0 and end at index 5
	console.log("array: ", mostUsed);

	// ----------------------------------------------------------->

	const mostPopular = Object.values(languages)
		.sort((lowest, highest) => {
			return highest.stars - lowest.stars;
		})
		.map((item) => {
			//swapp the stars to value
			return { ...item, value: item.stars };
		})
		.slice(0, 5);
	console.log("stars: ", mostPopular); //pay attention to the value count and star count

	// ----------------------------------------------------------->

	let { stars, forks } = repos.reduce(
		(total, item) => {
			const { stargazers_count, name, forks } = item;
			total.stars[stargazers_count] = { label: name, value: stargazers_count };
			total.forks[forks] = { label: name, value: forks };
			return total;
		},
		{
			stars: {},
			forks: {},
		}
	);

	stars = Object.values(stars).slice(-5).reverse();
	forks = Object.values(forks).slice(-5).reverse();

	console.log("all repos: ", stars);

	// ----------------------------------------------------------->

	const chartData = [
		{
			label: "Html",
			value: "29",
		},
		{
			label: "Css",
			value: "26",
		},
		{
			label: "Js",
			value: "18",
		},
	];

	return (
		<section className="section">
			<Wrapper className="section-center">
				{/* <ExampleChart data={chartData} /> */}
				<Pie3D data={mostUsed} />
				<Column3D data={stars} />
				<Doughnut2D data={mostPopular} />
				<Bar3D data={forks} />
			</Wrapper>
		</section>
	);
}

const Wrapper = styled.div`
	display: grid;
	justify-items: center;
	gap: 2rem;
	@media (min-width: 800px) {
		grid-template-columns: 1fr 1fr;
	}

	@media (min-width: 1200px) {
		grid-template-columns: 2fr 3fr;
	}

	div {
		width: 100% !important;
	}
	.fusioncharts-container {
		width: 100% !important;
	}
	svg {
		width: 100% !important;
		border-radius: var(--radius) !important;
	}
`;

export default Repos;
