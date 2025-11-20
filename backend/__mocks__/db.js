const mockDb = {
  collection: () => ({
    find: () => ({
      toArray: () => Promise.resolve([{ item: 'test' }]),
    }),
    insertOne: (doc) => Promise.resolve({ ...doc, _id: 'mockId' }),
  }),
};

function getDB() {
  return mockDb;
}

function connectDB() {
  return Promise.resolve(mockDb);
}

const isConnected = jest.fn();

module.exports = { connectDB, getDB, isConnected };
