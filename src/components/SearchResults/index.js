import React from 'react';
import { Cell, List } from '@vkontakte/vkui';

const SearchResults = ({ items = [], onSelect }) => {
    return (
        <div>
            <List>
                {items.map((x) => (
                    <Cell
                        key={x.package.name}
                        description={x.package.version}
                        onClick={() => onSelect(x.package.name)}
                    >
                        {x.package.name}
                    </Cell>
                ))}
            </List>
        </div>
    );
};

export default SearchResults;