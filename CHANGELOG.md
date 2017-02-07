# 0.0.1

* Added TypeScript compiler. :cool:
* Stubbed out directories and build environment.
* Stubbed out test environment and added Jest.
* Added linter. :cop:
* Added Travis CI. :arrows_counterclockwise:

### First Pass
* Added `DefaultsOptionsProvider`:

```typescript
interface MyOptions {
  field: number
}

const provider = new DefaultsOptionsProvider<MyOptions>({
  field: 123
})
```

---

# 0.0.0

* Documented the target API in Readme.
