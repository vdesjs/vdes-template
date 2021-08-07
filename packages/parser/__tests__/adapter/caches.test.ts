import { Caches } from "../../src/adapter/caches"

describe('caches', () => {
    test('set get rest value', () => {
        const cache = new Caches()
        cache.set('test', 'hello world')
        expect(cache.get('test')).toMatch('hello world')
        cache.reset()
        expect(cache.get('test')).toEqual(undefined)
    })

})