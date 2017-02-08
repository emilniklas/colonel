# 0.0.1

* Added TypeScript compiler. :cool:
* Stubbed out directories and build environment.
* Stubbed out test environment and added Jest.
* Added linter. :cop:
* Added Travis CI. :arrows_counterclockwise:

### Core
The core archetecture is built like this; a `Program` is executed, creating (or receiving)
a `Kernel` that it passes on to its `Handler`, which needs to perform some action. The
`Kernel` acts as the link to the OS and IO, such that it can be mocked for testing.

The `CommandHandler` (one implementation of the `Handler` interface), passes the `Kernel`
into each of a list of `OptionsProvider<T>`s, which together establish a `T` from the data
available through the `Kernel`. The `T` is then passed into a `Command<T>` which finally
executes the action.

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
```

* Added `Program`:

```typescript
const program = new Program(handler)

program.execute()
```

Optionally, a `Kernel` can be sent into the `execute()` method. If none is provided, a
`NodeKernel` will be used. The `Kernel` contains the argument vector:

```typescript
interface Kernel {
  readonly argv?: string[]
}
```

### Argv


---

# 0.0.0

* Documented the target API in Readme.
