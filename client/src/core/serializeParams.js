export default function serializeParams(params) {
    const mapped = Object.keys(params).map((key, index) => {
        const itemToConcat = params[key];

        if (itemToConcat !== null) {
            if (Array.isArray(itemToConcat)) {
                if (itemToConcat.length === 0) {
                    return '';
                }

                const itemToReturn = itemToConcat.reduce(
                    (memo, item, index) => {
                        if (index === itemToConcat.length - 1) {
                            return `${memo}${key}=${item}`;
                        }
                        return `${memo}${key}=${item}&`;
                    },
                    ''
                );

                if (index === 0) {
                    return itemToReturn;
                }

                return `&${itemToReturn}`;
            }

            if (index === 0) {
                return `${key}=${encodeURIComponent(itemToConcat)}`;
            }
            return `&${key}=${encodeURIComponent(itemToConcat)}`;
        }
        return '';
    });

    return mapped.join('');
}
