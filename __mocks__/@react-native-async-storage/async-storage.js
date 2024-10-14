const items = {};

export default {
    setItem: jest.fn((key, value) => {
        items[key] = value;
        return Promise.resolve(value);
    }),
    getItem: jest.fn((key) => {
        return Promise.resolve(items[key]);
    }),
    removeItem: jest.fn((key) => {
        delete items[key];
        return Promise.resolve();
    }),
    clear: jest.fn(() => {
        for (let key in items) {
            delete items[key];
        }
        return Promise.resolve();
    }),
};