import comparatorFactoryFactory from './'

describe('error', () => {
  test('key not function with default selector', () => expect(() => comparatorFactoryFactory<any>()('id')).toThrow())
})
