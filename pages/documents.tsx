import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Spinner } from "flowbite-react";


function createBlobAndOpen(arrayBuffer1) {
    const arrayBuffer = new Uint8Array(arrayBuffer1.data);
    // Log the array buffer length for debugging purposes
    console.log('Creating blob with array buffer length:', arrayBuffer.byteLength);

    // Create a typed array (Uint8Array) from the array buffer
    const typedArray = new Uint8Array(arrayBuffer);

    // Create a Blob from the typed array
    const blob = new Blob([typedArray], { type: 'application/pdf' });
    console.log('Blob size:', blob.size);

    // Function to check if the device is an iPhone
    function isiPhone() {
        return /iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    // Check if the window and navigator are available
    if (typeof window !== "undefined") {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // For IE and Edge
            window.navigator.msSaveOrOpenBlob(blob, "document.pdf");
        } else {
            const blobUrl = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = blobUrl;

            if (isiPhone()) {
                anchor.target = '_self';  // Open in the current tab for iPhone
            } else {
                anchor.target = '_blank';  // Open in a new tab for other devices
            }

            // Add the anchor to the document body
            document.body.appendChild(anchor);

            // Trigger a click event on the anchor
            anchor.click();

            // Remove the anchor from the document body
            document.body.removeChild(anchor);

            // Clean up the object URL after some time
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        }
    }
}






const parseName = (name: string): string => {
	return new DOMParser().parseFromString(name, "text/html").documentElement
		.textContent;
};

interface DocumentsProps {
	client: any;
}

export default function Documents({ client, login }: DocumentsProps) {
	const router = useRouter();
	const [documents, setDocuments] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		try {
			client.getDocuments().then(res=>{
                setDocuments(res);
			setLoading(false)})
		} catch(error) {
		    console.log(error);
			if (localStorage.getItem("username")!==null&&error instanceof TypeError) {
                login(localStorage.getItem("username"),localStorage.getItem("password"),true);
			}
            else{
                router.push("/login");
                }
		}
	}, [client]);
    console.log("does this look empty to you?");
    console.log(documents);
	return (
		<div className="p-5 md:p-10 h-full flex-1">
			<Head>
				<title>Documents - Grade Melon</title>
			</Head>
			{loading ? (
				<div className="flex justify-center">
					<Spinner size="xl" color="pink" />
				</div>
			) : (
				<div className="overflow-x-auto max-w-max shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
					<table className="text-sm text-left text-gray-500 dark:text-gray-400">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
							<tr>
								<th scope="col" className="py-3 pl-6">
									Date
								</th>
								<th scope="col" className="py-3 px-6">
									Document
								</th>
								<th scope="col" className="py-3 px-6">
									Category
								</th>
							</tr>
						</thead>
						<tbody>
							{documents &&
								documents.map((document, i) => (
									<tr
										className={`bg-${
											i % 2 == 0 ? "white" : "gray-50"
										} border-b dark:bg-gray-${
											i % 2 == 0 ? 900 : 800
										} dark:border-gray-700`}
										key={i}
									>
										<th
											scope="row"
											className="py-4 pl-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
										>
											{document.file.date}
										</th>
										<td className="py-4 px-6">
											<a
												onClick={async () => {
												    if(typeof(document.base64)=="undefined"){
													let download = await client.getDocument(document.index);
													document.base64=download;
													console.log(download);
													}
													createBlobAndOpen(document.base64);
												}}
												href="#"
											>
												{document.file.name}
											</a>
										</td>
										<td className="py-4 px-6">{document.category}</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
