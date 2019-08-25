export const mockPromise = (): jest.Mock =>
  jest.fn().mockImplementation(value => Promise.resolve(value))
