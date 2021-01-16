export const search = (text, page = 0, count = 20) => {
    return fetch(`https://registry.npmjs.org/-/v1/search?text=${text}`)
        .then((response) => response.json())
        .catch(() => ({}));
}

export const getPackageByName = (name) => {
    return fetch(`https://cors-anywhere.herokuapp.com/https://npmjs.org/package/${name}`, {
        headers: {
            'x-requested-with': 'XMLHttpRequest',
            'x-spiferack': 1,
        },
    })
        .then((response) => response.json())
        .catch(() => ({}));
}