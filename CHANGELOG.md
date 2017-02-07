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

* Added `CommandHandler`:

```typescript
import {Program, Command, CommandHandler, DefaultsOptionsProvider} from 'colonel'

interface MyOptions {
  field: string
}

class MyCommand implements Command<MyOptions> {
  execute ({ field }: MyOptions) {
    console.log(field)
  }
}

const handler = new CommandHandler<MyOptions>(
  new MyCommand(),
  [new DefaultsOptionsProvider<MyOptions>({ field: 'default' })]
)

declare program: Program
handler.execute(program)
```

---

# 0.0.0

* Documented the target API in Readme.
