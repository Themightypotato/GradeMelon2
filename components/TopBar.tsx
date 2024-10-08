import React, { useState, useEffect } from "react";
import { DarkThemeToggle } from "flowbite-react";
import Link from "next/link";
import { FiLogOut } from "react-icons/fi";
import { BsQuestionLg } from "react-icons/bs";
import { RiCloseCircleLine } from "react-icons/ri";
import { MdOutlinePrivacyTip } from "react-icons/md";
import dynamic from "next/dynamic";

interface TopBarProps {
	studentInfo: any;
	client: any;
	logout: () => void;
}

const DarkModeToggle = dynamic(() => import('../components/Toggle'), {
	ssr: false,
  });

export default function TopBar({ studentInfo, logout, client }: TopBarProps) {
	const [dropdown, setDropdown] = useState(false);
	const [advertisePWA, setAdvertisePWA] = useState(false);
	const [advertiseDiscord, setAdvertiseDiscord] = useState(false);
	const [advertiseBrowser,setAdvertiseBrowser]=useState(false);
	const [closed,setClosed]=useState(false);

	useEffect(() => {
		if (!window.matchMedia("(display-mode: standalone)").matches) {
			if (localStorage.getItem("advertisePWA") === null) {
				setAdvertisePWA(true);
				//localStorage.setItem("advertisePWA", "true");
			}
			console.log("This is not running as standalone.");
		}
	}, []);

	useEffect(() => {
			if (localStorage.getItem("advertiseDiscord") === null) {
				setAdvertiseDiscord(true);
				//localStorage.setItem("advertisePWA", "true");
			}
		
	}, []);



	useEffect(() => {
		if (navigator.userAgent.includes('Instagram') === true) {
			setAdvertiseBrowser(true);
			
		}
	
}, []);

	const closeAdvertisePWA = () => {
		setAdvertisePWA(false);
		localStorage.setItem("advertisePWA", "false");
	};

	const closeAdvertiseDiscord = () => {
		setAdvertiseDiscord(false);
		localStorage.setItem("advertiseDiscord", "false");
	};


	
	return (
		<div>

			<div className="fixed top-0 w-full z-10">

				{!advertiseBrowser && advertisePWA && client && (
			<div>
					<div className="align-top w-full bg-primary-600 px-4 py-3 text-white">
						<p className="text-center text-sm font-medium flex gap-2 justify-center">
							<span>
								Want to use Grade Melon as an app?  
								<Link
									onClick={() => setAdvertisePWA(false)}
									className="underline pl-1"
									href="/faq?refer=app"
								>
									Check out how &rarr;
								</Link>
							
								

								
							</span>
							<button className="" onClick={closeAdvertisePWA}>
								<RiCloseCircleLine className="inline-block" size="1.1rem" />
							</button>
						</p>
					</div>
		
			
				</div>
				)}
							{!advertiseBrowser&& !advertisePWA && advertiseDiscord && client &&(
			<div className="w-full bg-primary-600 px-4 py-3 text-white relative y-0">
						<p className="text-center text-sm font-medium flex gap-2 justify-center">
							<span>
								Want to contribute?
								<Link
									onClick={() => setAdvertiseDiscord(false)}
									className="underline pl-1"
									href="https://discord.gg/nwRs8WcQGc"
								>
									Join the Discord! &rarr;
								</Link> 
						
							
					

								
							</span>
							<button className="" onClick={closeAdvertiseDiscord}>
								<RiCloseCircleLine className="inline-block" size="1.1rem" />
							</button>
						</p>
					</div>)}
					
					{advertiseBrowser && !closed && (
			<div className="w-full bg-primary-600 px-4 py-3 text-white relative y-0">
						<p className="text-center text-sm font-medium flex gap-2 justify-center">
							<span>
								You&apos;re viewing in Instagram!
								<p
									className="underline pl-1"
								>
									Try it in your browser!
								</p> 
						
							
					

								
							</span>
							<button className="" onClick={()=>setClosed(true)}>
								<RiCloseCircleLine className="inline-block" size="1.1rem" />
							</button>
						</p>
					</div>)}

				<nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-800">
					<div className=" flex flex-wrap justify-between items-center">
						<Link href="/" className="flex items-center">
							<img
								src="/assets/logo.png"
								className="mr-3 h-6 sm:h-9"
								alt="Grade Melon Logo"
							/>
							<span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
								Grade Melon--Beta
							</span>
						</Link>
						<div className="flex items-center md:order-2 gap-2">
							<div>
								<DarkModeToggle />
							</div>
							{studentInfo && (
								<div
									tabIndex={100}
									onBlur={(e) => {
										const target = e.currentTarget;

										requestAnimationFrame(() => {
											if (!target.contains(document.activeElement)) {
												setDropdown(false);
											}
										});
									}}
								>
									<button
										type="button"
										className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
										onClick={() => setDropdown(!dropdown)}
									>
										<span className="sr-only">Open user menu</span>
										<img
											className="w-10 h-10 object-cover rounded-full"
											src={
												studentInfo?.photo
													? `data:image/png;base64,${studentInfo.photo}`
													: "/assets/default-avatar.svg"
											}
											alt="User Icon"
										/>
									</button>

									{dropdown && (
										<div className="top-10 right-4 absolute z-50 my-4 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
											<div className="py-3 px-4">
												<span className="block text-sm text-gray-900 truncate dark:text-white">
													{studentInfo?.StudentName}
												</span>
												<span className="block text-sm font-medium text-gray-500 truncate dark:text-gray-400">
													{studentInfo?.SchoolName}
												</span>
											</div>
											<ul className="py-1" aria-labelledby="user-menu-button">
												<li>
													<Link
														href="/faq"
														onClick={() => setDropdown(false)}
														className="flex gap-2 items-center cursor-pointer py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
													>
														<BsQuestionLg /> FAQ & Info
													</Link>
												</li>
											</ul>
											<ul className="py-1" aria-labelledby="user-menu-button">
												<li>
													<Link
														href="/privacy"
														onClick={() => setDropdown(false)}
														className="flex gap-2 items-center cursor-pointer py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
													>
														<MdOutlinePrivacyTip /> Privacy Policy
													</Link>
												</li>
											</ul>
											<ul className="py-1" aria-labelledby="user-menu-button">
												<li>
													<a
														onClick={() => {
															setDropdown(false);
															logout();
														}}
														className="flex gap-2 items-center cursor-pointer py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
													>
														<FiLogOut /> Log out
													</a>
												</li>
											</ul>
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</nav>
			</div>
		</div>
	);
}
