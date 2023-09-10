const API = require('./dist/api')

test('API', () => {
    expect(API()).not.toBeNull()
})