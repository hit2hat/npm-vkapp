import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, PanelHeaderBack, Search, PanelSpinner } from '@vkontakte/vkui';
import charts from '../../data/charts.json';

import SearchResults from '../../components/SearchResults';
import PackagesCategory from '../../components/PackagesCategory';

const Home = ({ id, openPackage, search, searchResults, searchLoading, searchMode, setSearchMode }) => {
    const [ text, setText ] = useState('');

    useEffect(() => {
        if (!!text) {
            const timerId = search(text);
            return () => clearTimeout(timerId);
        }
    }, [ text ]);

    useEffect(() => {
        setText('');
    }, [ searchMode ]);

    return (
        <Panel id={id}>
            <PanelHeader
                separator={false}
                left={searchMode ? <PanelHeaderBack onClick={() => setSearchMode(false)} /> : null}
            >
                {searchMode ? 'Поиск' : 'NPM'}
            </PanelHeader>
            <Search
                value={text}
                onChange={(e) => setText(e.currentTarget.value)}
                onClick={() => setSearchMode(true)}
                after={null}
            />
            {!searchMode ? (
                <div style={{ marginTop: 8 }}>
                    {charts.map((category) => (
                        <PackagesCategory
                            key={category.title}
                            title={category.title}
                            packages={category.packages}
                            openPackage={openPackage}
                        />
                    ))}
                </div>
            ) : (
                searchLoading ? (
                    <PanelSpinner />
                ) : (
                    <SearchResults items={searchResults} onSelect={openPackage} />
                )
            )}
        </Panel>
    );
};

export default Home;