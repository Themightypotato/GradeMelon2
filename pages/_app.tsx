import React, { useState, useEffect } from "react";
import "../styles/globals.css";
import Client from "../utils/client";
import { useRouter } from "next/router";
import { Flowbite, Toast, useTheme } from "flowbite-react";
import Topbar from "../components/TopBar";
import SideBar from "../components/SideBar";
import MobileBar from "../components/MobileBar";
import { Grades } from "../utils/grades";
import Head from "next/head";
import Script from "next/script";
import { HiX } from "react-icons/hi";
import BackgroundColor from "../components/BackgroundColor";
import { AnimateSharedLayout } from "framer-motion";
import App, {Container} from 'next/app'
import '../styles/globals.css';

//BUG LIST: the fucking stupid ass solution I have for the thing on mobile where sometimes u need to double click the documents tab | the equivalent issue on DESKTOP. | SOMETIMES WHEN THE REQUEst FOR THE LOGIN HANGS IT DOESNT EVER DO A TIMEOUT SO UR STUCK NEED TO MAKE IT DO A TIMEOUT | on ANDRIOD IT DOES NOT OPEN PDF IN NEW TAB IT DOWNLOADS, FIX | ADD IN SOME COOKIE UTILZIATION SO YOU DONT NEED TO LOGIN EVERY SINGLE TIME

interface Toast {
	title: string;
	type: "success" | "error" | "warning" | "info";
}

const noShowNav = ["/login", "/", "/privacy", "/letter"];



function MyApp({ Component, pageProps }) {
    console.log(Component);
    console.log("now props");
    console.log(pageProps);
	const router = useRouter();
	const [districtURL, setDistrictURL] = useState(
		"https://md-mcps-psv.edupoint.com"
	);
	const [client, setClient] = useState(undefined);
	const [studentInfo, setStudentInfo] = useState(undefined);
	const [toasts, setToasts] = useState<Toast[]>([]);
	const [grades, setGrades] = useState<Grades>();
	const [period, setPeriod] = useState<number>();
	const [loading, setLoading] = useState(false);
    console.log(districtURL);
	const login = async (
		username: string,
		password: string,
		save: boolean,
		url?: string
	) => {
		await setLoading(true);
		const student = new Client({username:username,password:password});
		console.log(student);
		return(await student.refresh()
		    .then(async ()=>{
				console.log(student);
				await setClient(student);
				if (save) {
					localStorage.setItem("remember", "true");
					localStorage.setItem("username", username);
					localStorage.setItem("password", password);
					localStorage.setItem("districtURL", districtURL);
				} else {
					localStorage.setItem("remember", "false");
					localStorage.removeItem("username");
					localStorage.removeItem("password");
				}
				await setLoading(false);
				return true;})
		.catch((err)=>{
				console.log(err);
				setToasts((toasts) => [
					...toasts,
					{
						title: "Login Error: Incorrect Username or Password",
						type: "error",
					},
				]);
				setTimeout(() => {
					setToasts((toasts) => toasts.slice(1));
				}, 5000);
				setLoading(false);
			    return false;
			}));

	};

	const logout = async () => {
		await setClient(undefined);
		await router.push("/login");
		await setStudentInfo(undefined);
		await setGrades(undefined);
		await localStorage.removeItem("password");
	};

    const getDocuments = async () =>{
        if (client!== undefined){
            await client.getDocuments()
                .then(docs=>{return(docs)})
                .catch(()=>{return("undefined")})
        }
    };

    	useEffect(() => {
		if (router.pathname === "/") {
				router.push("/login");
			}
 	}, []);



	// useEffect(() => {
	// 	let username = localStorage.getItem("username");
	// 	let password = localStorage.getItem("password");
	// 	let remember = localStorage.getItem("remember");
	// 	let storedDistrictURL = localStorage.getItem("districtURL");
	// 	storedDistrictURL && setDistrictURL(storedDistrictURL);
	// 	if (remember === "true" && username && password && storedDistrictURL) {
	// 		login(username, password, true, districtURL);
	// 	}
	// }, []);

    // this shit could keep the cleint refreshed I guess, not practical in my implementation
	// useEffect(() => {
	// 	if (client !== undefined) {
	// 		try {
	// 			client.studentInfo().then((res) => {
	// 				console.log(res);
	// 				setStudentInfo(res);
	// 			});
	// 		} catch {
	// 			console.log("waiting");
	// 		}
	// 		if (router.pathname === "/login") {
	// 			router.push("/grades");
	// 		}
	// 	}
	// }, [client]);

	return (

		<Flowbite>
			<Head>
				<title>Grade Melon</title>
				<script
					defer
					data-domain="grademelon.com"
					src="https://stats.tinu.tech/js/plausible.js"
				></script>
				<script
					defer
					src="https://static.cloudflareinsights.com/beacon.min.js"
					data-cf-beacon='{"token": "c01b4332f8c346bdbf9df1938384019b"}'
				></script>
			</Head>
			<Script
				async
				src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5925944145079992"
				crossOrigin="anonymous"
				strategy="beforeInteractive"
			/>
			<div className="absolute p-5 z-20">
				{toasts.map(({ title, type }, i) => (
					<div className="mb-5 z-50" key={i}>
						<Toast>
							<div
								onClick={() =>
									setToasts((prev) => {
										prev.splice(i, 1);
										return prev;
									})
								}
								className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200"
							>
								<HiX className="h-5 w-5" />
							</div>
							<div className="ml-3 text-sm font-normal">{title}</div>
							<Toast.Toggle />
						</Toast>
					</div>
				))}
			</div>
			<BackgroundColor />
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
				<Topbar studentInfo={studentInfo} logout={logout} client={client} />
				<div>
					{noShowNav.includes(router.pathname) && (
						<AnimateSharedLayout>
							<Component
								{...pageProps}
								districtURL={districtURL}
								setDistrictURL={setDistrictURL}
								login={login}
								getDocuments={getDocuments}
								client={client}
								grades={grades}
								setGrades={setGrades}
								setToasts={setToasts}
								loading={loading}
								period={period}
								setPeriod={setPeriod}
							/>
						</AnimateSharedLayout>
					)}

					{!noShowNav.includes(router.pathname) && (
						<div className="pb-16 md:pb-0">
							<div className="hidden md:flex">
								<SideBar studentInfo={studentInfo} logout={logout} />
								<AnimateSharedLayout>
									<Component
										{...pageProps}
										districtURL={districtURL}
										setDistrictURL={setDistrictURL}
										client={client}
										login={login}
										getDocuments={getDocuments}
										grades={grades}
										setGrades={setGrades}
										setToasts={setToasts}
										loading={loading}
										period={period}
										setPeriod={setPeriod}
									/>
								</AnimateSharedLayout>
							</div>
							<div className="md:hidden">
								<AnimateSharedLayout>
									<Component
										{...pageProps}
										districtURL={districtURL}
										client={client}
										login={login}
										getDocuments={getDocuments}
										setClient={setClient}
										grades={grades}
										setGrades={setGrades}
										setToasts={setToasts}
										loading={loading}
										period={period}
										setPeriod={setPeriod}
									/>
								</AnimateSharedLayout>
								<div className="px-4 fixed bottom-5 w-full">
									<MobileBar />
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</Flowbite>
	);
}

export default MyApp;
