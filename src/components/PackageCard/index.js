import React from 'react';
import { Card } from '@vkontakte/vkui';
import './index.scss';

import * as Icons from '@vkontakte/icons';

const PackageCard = ({ name, text, icon = null, background = 'var(--accent)', color = 'white', onClick }) => {
    const Icon = icon !== null ? Icons[icon] : null;
    return (
        <Card onClick={() => onClick(name)}>
            <div
                className="package-card"
                style={{
                    background,
                }}
            >
                <div className="package-card__icon"><Icon fill={color} /></div>
                <div className="package-card__name" style={{ color }}>{name}</div>
                <div className="package-card__text" style={{ color }}>{text}</div>
            </div>
        </Card>
    );
};

export default PackageCard;