import React from 'react';
import { Group, Header, CardScroll } from '@vkontakte/vkui';
import './index.scss';

import PackageCard from '../PackageCard';

const PackagesCategory = ({ title, packages = [], openPackage }) => {
    return (
        <Group>
            <Header className="package-header">{title}</Header>
            <CardScroll>
                {packages.map((p) => (
                    <PackageCard
                        key={p.name}
                        {...p}
                        onClick={openPackage}
                    />
                ))}
            </CardScroll>
        </Group>
    );
};

export default PackagesCategory;