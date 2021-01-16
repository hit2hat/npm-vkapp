import bridge from '@vkontakte/vk-bridge';

export const schemeChanger = ({ detail: { type, data } }) => {
    if (type === 'VKWebAppUpdateConfig') {
        const schemeAttribute = document.createAttribute('scheme');
        schemeAttribute.value = data.scheme ? data.scheme : 'bright_light';
        document.body.attributes.setNamedItem(schemeAttribute);

        switch (data.scheme) {
            case 'bright_light': {
                return bridge.send('VKWebAppSetViewSettings', {
                    status_bar_style: 'dark',
                });
            }

            case 'client_light': {
                return bridge.send('VKWebAppSetViewSettings', {
                    status_bar_style: 'dark',
                });
            }

            case 'space_gray': {
                return bridge.send('VKWebAppSetViewSettings', {
                    status_bar_style: 'light',
                });
            }

            case 'client_dark': {
                return bridge.send('VKWebAppSetViewSettings', {
                    status_bar_style: 'light',
                });
            }
        }
    }
};