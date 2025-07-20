const test = require('node:test');
const assert = require('node:assert');

// Example: Testing with proper scalar assertions
test('scalar value assertions should use strictEqual', async (t) => {
  const response = { statusCode: 200 };
  const fastify = { hasRoute: () => false };
  
  // ✅ Correct assertion for scalar types
  t.assert.strictEqual(response.statusCode, 200);
  t.assert.strictEqual(fastify.hasRoute({}), false);
  t.assert.strictEqual(typeof response.statusCode, 'number');
  t.assert.strictEqual(Boolean(response.statusCode), true);
});

// Example: Testing with proper object/array assertions
test('object and array assertions should use deepStrictEqual', async (t) => {
  const expectedObject = { hello: 'world', count: 42 };
  const actualObject = { hello: 'world', count: 42 };
  
  const expectedArray = [1, 2, { nested: 'value' }];
  const actualArray = [1, 2, { nested: 'value' }];
  
  // ✅ Correct assertion for objects and arrays
  t.assert.deepStrictEqual(actualObject, expectedObject);
  t.assert.deepStrictEqual(actualArray, expectedArray);
  
  // Example with JSON string comparison
  const jsonData = { user: 'john', role: 'admin' };
  t.assert.deepStrictEqual(
    JSON.parse(JSON.stringify(jsonData)), 
    { user: 'john', role: 'admin' }
  );
});

// Example: Direct assertions with awaited methods
test('should combine assertions directly with awaited methods', async (t) => {
  const mockResponse = {
    text: async () => 'expected response text',
    json: async () => ({ data: 'test', status: 'success' }),
    status: () => 200
  };
  
  // ✅ Direct assertion without intermediate variables
  t.assert.strictEqual(await mockResponse.text(), 'expected response text');
  t.assert.deepStrictEqual(
    await mockResponse.json(), 
    { data: 'test', status: 'success' }
  );
  t.assert.strictEqual(mockResponse.status(), 200);
});

// Example: Proper resource cleanup with t.after()
test('should use t.after() for proper resource cleanup', async (t) => {
  // Simulate fastify server setup
  const fastify = {
    listen: async (port) => console.log(`Server listening on port ${port}`),
    close: async () => console.log('Server closed'),
    register: (plugin) => console.log('Plugin registered'),
    ready: async () => console.log('Server ready')
  };
  
  // Setup server
  await fastify.listen(3000);
  await fastify.ready();
  
  // ✅ Ensure cleanup happens even if test fails
  t.after(async () => {
    await fastify.close();
  });
  
  // Test server functionality
  t.assert.strictEqual(typeof fastify.listen, 'function');
  t.assert.strictEqual(typeof fastify.close, 'function');
});

// Example: Multiple resource cleanup
test('should handle multiple resources with t.after()', async (t) => {
  const database = {
    connect: async () => console.log('Database connected'),
    disconnect: async () => console.log('Database disconnected')
  };
  
  const cache = {
    start: () => console.log('Cache started'),
    stop: () => console.log('Cache stopped')
  };
  
  // Setup resources
  await database.connect();
  cache.start();
  
  // ✅ Setup cleanup for all resources
  t.after(async () => {
    await database.disconnect();
    cache.stop();
  });
  
  // Test functionality
  t.assert.strictEqual(typeof database.connect, 'function');
  t.assert.strictEqual(typeof cache.start, 'function');
});

// Example: Testing error scenarios with proper assertions
test('should handle errors with proper assertion types', async (t) => {
  const errorFunction = () => {
    throw new Error('Something went wrong');
  };
  
  const asyncErrorFunction = async () => {
    throw new Error('Async error occurred');
  };
  
  // ✅ Test error messages with strictEqual for strings
  try {
    errorFunction();
    t.assert.fail('Expected function to throw an error');
  } catch (error) {
    t.assert.strictEqual(error.message, 'Something went wrong');
    t.assert.strictEqual(error.name, 'Error');
  }
  
  // ✅ Test async errors
  await t.assert.rejects(
    async () => await asyncErrorFunction(),
    { message: 'Async error occurred' }
  );
});

// Example: Complex object comparison scenarios
test('should properly compare complex nested objects', async (t) => {
  const complexObject = {
    user: {
      id: 123,
      profile: {
        name: 'John Doe',
        preferences: ['dark-mode', 'notifications'],
        settings: {
          language: 'en',
          timezone: 'UTC'
        }
      }
    },
    metadata: {
      lastLogin: new Date('2024-01-01'),
      isActive: true
    }
  };
  
  const expectedStructure = {
    user: {
      id: 123,
      profile: {
        name: 'John Doe',
        preferences: ['dark-mode', 'notifications'],
        settings: {
          language: 'en',
          timezone: 'UTC'
        }
      }
    },
    metadata: {
      lastLogin: new Date('2024-01-01'),
      isActive: true
    }
  };
  
  // ✅ Use deepStrictEqual for complex object comparison
  t.assert.deepStrictEqual(complexObject, expectedStructure);
  
  // ✅ Use strictEqual for individual scalar properties
  t.assert.strictEqual(complexObject.user.id, 123);
  t.assert.strictEqual(complexObject.user.profile.name, 'John Doe');
  t.assert.strictEqual(complexObject.metadata.isActive, true);
});