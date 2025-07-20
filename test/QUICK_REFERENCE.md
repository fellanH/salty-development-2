# Quick Reference: Test Assertions & Cleanup

## 🎯 Assertion Patterns

### Scalar Values → `strictEqual`
```javascript
// Numbers, strings, booleans
t.assert.strictEqual(response.statusCode, 200)
t.assert.strictEqual(user.name, 'John')
t.assert.strictEqual(isValid, true)
t.assert.strictEqual(typeof obj.method, 'function')
```

### Objects & Arrays → `deepStrictEqual`
```javascript
// Objects
t.assert.deepStrictEqual(user, { id: 1, name: 'John' })

// Arrays
t.assert.deepStrictEqual(items, [1, 2, 3])

// JSON comparisons
t.assert.deepStrictEqual(JSON.parse(response), expectedObject)
```

### Direct Async Assertions
```javascript
// ✅ Direct assertion
t.assert.strictEqual(await response.text(), 'expected')
t.assert.deepStrictEqual(await response.json(), { data: 'test' })

// ❌ Avoid unnecessary variables
const body = await response.text()
t.assert.strictEqual(body, 'expected')
```

## 🧹 Cleanup Patterns

### Single Resource
```javascript
test('should clean up server', async (t) => {
  const server = await startServer()
  
  t.after(async () => {
    await server.close()
  })
  
  // test logic...
})
```

### Multiple Resources
```javascript
test('should clean up all resources', async (t) => {
  const db = await connectDB()
  const cache = await startCache()
  
  t.after(async () => {
    await db.disconnect()
    await cache.stop()
  })
  
  // test logic...
})
```

## 🚨 Error Testing
```javascript
// Sync errors
try {
  errorFunction()
  t.assert.fail('Expected error')
} catch (error) {
  t.assert.strictEqual(error.message, 'Expected message')
}

// Async errors
await t.assert.rejects(
  async () => await asyncErrorFunction(),
  { message: 'Expected message' }
)
```

## 📊 Common Test Structure
```javascript
test('should do something when condition', async (t) => {
  // 1. Setup
  const resource = await setupResource()
  
  // 2. Register cleanup
  t.after(async () => {
    await resource.cleanup()
  })
  
  // 3. Execute
  const result = await resource.doSomething()
  
  // 4. Assert with proper method
  t.assert.strictEqual(result.status, 'success')
  t.assert.deepStrictEqual(result.data, expectedData)
})
```

## ⚡ Commands
```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage
```

## 🔍 Decision Tree

**Is it a single value?** → `strictEqual`
- Numbers: `t.assert.strictEqual(count, 5)`
- Strings: `t.assert.strictEqual(name, 'test')`
- Booleans: `t.assert.strictEqual(flag, true)`

**Is it an object/array?** → `deepStrictEqual`
- Objects: `t.assert.deepStrictEqual(obj, expected)`
- Arrays: `t.assert.deepStrictEqual(arr, [1,2,3])`

**Need cleanup?** → `t.after()`
- Always use for servers, databases, files, etc.
- Register cleanup immediately after setup

**Testing async?** → Direct assertion
- `t.assert.strictEqual(await promise, value)`
- Avoid intermediate variables when possible