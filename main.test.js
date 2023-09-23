const API = require('./src/dev/api.dev')

test('API', () => {
    expect(API()).not.toBeNull()
})
