import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { Panel, PanelHeader, PanelHeaderBack, Header, Div, Group, Tabs, TabsItem, HorizontalScroll, List, Cell, Avatar, SimpleCell, InfoRow, CellButton, Separator } from '@vkontakte/vkui';
import { Icon28ShareOutline } from '@vkontakte/icons';
import { fireEvent } from '../../utils/fireEvent';
import './index.scss';

import RateChart from '../../components/RateChart';

const Package = ({ id, openPanel, selectedPackage }) => {
    const [ label, setLabel ] = useState();
    const [ tab, setTab ] = useState('info');

    const [ readme, setReadme ] = useState('');
    const [ developers, setDevelopers ] = useState([]);
    const [ downloads, setDownloads ] = useState([]);

    useEffect(() => {
        setReadme(selectedPackage.readme.data);
        setDevelopers(selectedPackage.packageVersion.maintainers);
        setDownloads(selectedPackage.downloads.reduce((a, x) => {
            return [
                ...a,
                {
                    date: (new Date(x.label.split(" ")[2])).getTime(),
                    rate: x.downloads,
                }
            ]
        }, []));
    }, [selectedPackage]);

    return (
        <Panel id={id}>
            <PanelHeader
                left={
                    <PanelHeaderBack onClick={() => openPanel('home')} />
                }
            >
                {selectedPackage.package}
            </PanelHeader>
            <Group>
                <Tabs>
                    <HorizontalScroll>
                        <TabsItem
                            onClick={() => setTab('info')}
                            selected={tab === 'info'}
                        >
                            Информация
                        </TabsItem>
                        <TabsItem
                            onClick={() => setTab('readme')}
                            selected={tab === 'readme'}
                        >
                            Readme
                        </TabsItem>
                        <TabsItem
                            onClick={() => setTab('developers')}
                            selected={tab === 'developers'}
                        >
                            Разработчики
                        </TabsItem>
                        <TabsItem
                            onClick={() => setTab('deps')}
                            selected={tab === 'deps'}
                        >
                            Зависимости
                        </TabsItem>
                        <TabsItem
                            onClick={() => setTab('versions')}
                            selected={tab === 'versions'}
                        >
                            Версии
                        </TabsItem>
                    </HorizontalScroll>
                </Tabs>
            </Group>
            {{
                'info': (
                    <div>
                        <Group>
                            <Header>Основная информация</Header>
                            <SimpleCell multiline>
                                <InfoRow header="Название">
                                    {selectedPackage.package}
                                </InfoRow>
                            </SimpleCell>
                            <SimpleCell multiline>
                                <InfoRow header="Последняя версия">
                                    {selectedPackage.packageVersion.version}
                                </InfoRow>
                            </SimpleCell>
                            {selectedPackage.packageVersion.homepage && (
                                <SimpleCell
                                    multiline
                                    onClick={() => fireEvent(selectedPackage.packageVersion.homepage)}
                                >
                                    <InfoRow header="Сайт">
                                        <span style={{ color: 'var(--accent)' }}>{selectedPackage.packageVersion.homepage}</span>
                                    </InfoRow>
                                </SimpleCell>
                            )}
                            <Separator />
                            <CellButton
                                before={<Icon28ShareOutline />}
                                onClick={() => bridge.send('VKWebAppShare', {
                                    link: `https://vk.com/app7727957#${selectedPackage.package}`
                                })}
                            >
                                Поделиться
                            </CellButton>
                        </Group>
                        <Header>Статистика скачиваний</Header>
                        <Div style={{ overflow: 'hidden', paddingBottom: 0 }}>
                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    position: 'relative',
                                }}
                            >
                                <div
                                    style={{
                                        width: '100%',
                                        position: 'absolute',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        top: `25px`
                                    }}
                                >
                                    <div ref={(elem) => setLabel(elem)} />
                                </div>
                                {downloads.length > 0 && (
                                    <RateChart
                                        currentPointRootEl={label}
                                        points={downloads}
                                    />
                                )}
                            </div>
                        </Div>
                    </div>
                ),
                'readme': (
                    <Div>
                        <div dangerouslySetInnerHTML={{ __html: readme }}/>
                    </Div>
                ),
                'developers': (
                    <List>
                        {developers.map((x) => (
                            <Cell
                                key={x.name}
                                before={<Avatar src={x.avatars.medium} />}
                            >
                                {x.name}
                            </Cell>
                        ))}
                    </List>
                ),
            }[tab]}

        </Panel>
    );
};

export default Package;