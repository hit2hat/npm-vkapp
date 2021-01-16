import React, { useState, useEffect } from 'react';
import { View, ScreenSpinner } from '@vkontakte/vkui';

import { getPackageByName, search as searchPackages } from '../../network/api';

import Home from '../Home';
import Package from '../Package';

const App = () => {
	const [ activePanel, setActivePanel ] = useState('home');
	const [ selectedPackage, setSelectedPackage ] = useState({});
	const [ showLoader, setShowLoader ] = useState(false);

	const [ searchMode, setSearchMode ] = useState(false);
	const [ searchResults, setSearchResults ] = useState([]);
	const [ searchLoading, setSearchLoading ] = useState(false);

	const openPackage = (name) => {
		setShowLoader(true);
		getPackageByName(name)
			.then((data) => {
				setSelectedPackage(data);
				setActivePanel('package');
			})
			.finally(() => {
				setShowLoader(false);
			});
	};

	const search = (text) => {
		setSearchLoading(true);
		return setTimeout(() => {
			searchPackages(text, 0, 20)
				.then((response) => {
					setSearchResults(response?.objects || [])
				})
				.finally(() => {
					setSearchLoading(false);
				})
		}, 250);
	};

	useEffect(() => {
		setSearchResults([]);
		setSearchLoading(false);
	}, [ searchMode ]);

	return (
		<View
			id="main"
			activePanel={activePanel}
			popout={showLoader ? <ScreenSpinner /> : null}
		>
			<Home
				id="home"
				openPanel={setActivePanel}
				openPackage={openPackage}
				search={search}
				searchMode={searchMode}
				searchResults={searchResults}
				searchLoading={searchLoading}
				setSearchMode={setSearchMode}
			/>
			<Package
				id="package"
				openPanel={setActivePanel}
				selectedPackage={selectedPackage}
			/>
		</View>
	);
};

export default App;