# Testing Best Practices and Assertion Guidelines

This directory contains examples and guidelines for writing effective tests using proper assertion methods and cleanup patterns.

## 🎯 Key Principles

### 1. Choose the Right Assertion Method

#### For Scalar Values (numbers, strings, booleans)
Use `strictEqual` instead of `equal` or `deepStrictEqual`:

```javascript
// ❌ Not ideal - less specific assertion
t.assert.equal(response.statusCode, 200)
t.assert.deepStrictEqual(fastify.hasRoute({}), false)

// ✅ Better - correct assertion for scalar types
t.assert.strictEqual(response.statusCode, 200)
t.assert.strictEqual(fastify.hasRoute({}), false)
```

**Why?** `strictEqual` provides:
- Type checking (no implicit coercion)
- More specific error messages
- Better performance for simple comparisons

#### For Objects and Arrays
Use `deepStrictEqual` rather than `deepEqual` or `same`:

```javascript
// ❌ Not ideal - can miss type differences
t.assert.deepEqual(body.toString(), JSON.stringify({ hello: 'world' }))

// ✅ Better - ensures exact object equality
t.assert.deepStrictEqual(body.toString(), JSON.stringify({ hello: 'world' }))
```

**Why?** `deepStrictEqual` ensures:
- No type coercion
- Strict property comparison
- More reliable object matching

### 2. Direct Assertions with Awaited Methods

Combine assertions directly with awaited methods to reduce code verbosity:

```javascript
// ❌ Not ideal - unnecessary intermediate variable
const body = await response.text()
t.assert.deepStrictEqual(body, 'this was not found')

// ✅ Better - direct assertion
t.assert.deepStrictEqual(await response.text(), 'this was not found')
```

**Benefits:**
- Cleaner, more readable code
- Fewer variables to track
- Immediate assertion on result

### 3. Proper Resource Cleanup

Use `t.after()` hooks rather than closing resources at the end of tests:

```javascript
// ❌ Not ideal - may not run if test fails
test('should test server functionality', async (t) => {
  const fastify = await setupServer()
  
  // ... test logic ...
  
  fastify.close() // Won't run if test throws
})

// ✅ Better - ensures cleanup even if test fails
test('should test server functionality', async (t) => {
  const fastify = await setupServer()
  
  t.after(async () => {
    await fastify.close()
  })
  
  // ... test logic ...
})
```

**Why use `t.after()`?**
- Guaranteed cleanup even if test fails
- Proper resource management
- Prevents resource leaks
- Better test isolation

## 📁 File Structure

- `assertion-examples.js` - General assertion patterns and best practices
- `module-testing-examples.js` - Project-specific testing examples for DataController, MapController, etc.
- `README.md` - This documentation file

## 🚀 Running Tests

```bash
# Run all tests
node --test test/

# Run specific test file
node --test test/assertion-examples.js

# Run with coverage (if available)
node --test --experimental-test-coverage test/
```

## 📋 Testing Checklist

When writing tests, ensure you:

- [ ] Use `strictEqual` for scalar values (numbers, strings, booleans)
- [ ] Use `deepStrictEqual` for objects and arrays
- [ ] Set up `t.after()` hooks for resource cleanup
- [ ] Use direct assertions with async operations when possible
- [ ] Test both success and error scenarios
- [ ] Provide meaningful test descriptions
- [ ] Mock external dependencies appropriately

## 🔍 Common Patterns by Data Type

| Data Type | Assertion Method | Example |
|-----------|------------------|---------|
| Number | `strictEqual` | `t.assert.strictEqual(result, 42)` |
| String | `strictEqual` | `t.assert.strictEqual(message, 'success')` |
| Boolean | `strictEqual` | `t.assert.strictEqual(isValid, true)` |
| Object | `deepStrictEqual` | `t.assert.deepStrictEqual(user, expected)` |
| Array | `deepStrictEqual` | `t.assert.deepStrictEqual(items, [1, 2, 3])` |
| Function | `strictEqual` (type) | `t.assert.strictEqual(typeof fn, 'function')` |
| Error | `rejects` or `throws` | `await t.assert.rejects(promise, Error)` |

## 🛠️ Setup for New Tests

When creating new test files:

1. Import required modules:
```javascript
const test = require('node:test');
const assert = require('node:assert');
```

2. Follow the naming pattern:
   - Test files: `*.test.js` or place in `test/` directory
   - Descriptive test names: `'should do something when condition'`

3. Structure tests with proper cleanup:
```javascript
test('should test functionality with cleanup', async (t) => {
  // Setup
  const resource = await setupResource()
  
  // Cleanup registration
  t.after(async () => {
    await resource.cleanup()
  })
  
  // Test logic
  // Assertions
})
```

## 📝 Error Messages

Good assertion methods provide clear error messages:

```javascript
// This will show exactly what was expected vs actual
t.assert.strictEqual(actual, expected)
// AssertionError: Expected 200, got 404

// This will show the full object diff
t.assert.deepStrictEqual(actualObject, expectedObject)
// Shows detailed object comparison
```

## 🎨 Best Practices Summary

1. **Be Specific**: Use the most specific assertion method for your data type
2. **Clean Up**: Always use `t.after()` for resource cleanup
3. **Be Direct**: Combine assertions with async operations when possible
4. **Test Edge Cases**: Include error scenarios and boundary conditions
5. **Readable Names**: Use descriptive test and variable names
6. **Mock Wisely**: Mock external dependencies but keep tests realistic

## 📚 Additional Resources

- [Node.js Test Runner Documentation](https://nodejs.org/api/test.html)
- [Assert Module Documentation](https://nodejs.org/api/assert.html)
- Project-specific examples in `module-testing-examples.js`

---

*This testing guide helps ensure consistent, reliable, and maintainable tests across the project.*