# 0.0.1

### File Options
Sometimes a `Command<T>` can get its `T` from a config file. We now have a
`FileOptionsProvider<T>` that can help with that:

```typescript
interface T {
  option: string
  flag: boolean
}

class TCommand implements Command<T> {
  execute (t: T) {
    // Do something with `t`
  }
}

class TOptionsValidator implements OptionsValidator<T> {
  validate (input: any): Partial<T> {
    if (typeof input !== 'object') {
      throw new Error('Input must be an object')
    }

    const t = {}
    if (typeof input.option === 'string') {
      t.option = input.option
    }
    if (typeof input.flag === 'boolean') {
      t.flag = input.flag
    }
    return t
  }
}

const handler = new CommandHandler(
  new TCommand(),
  new FileOptionsProvider<T>(
    /\.t\.yml$/,
    new YamlFormatParser(), // or `new JsonFormatParser()`
    new TOptionsValidator()
  )
)
```

### Argv
A `Command<T>` needs a way to receive a `T` from command line arguments. To do that, an
implementation of the `OptionsProvider<T>` called `ArgvOptionsProvider<T>` is available
and works like this:

```typescript
interface T {
  option: string
  flag: boolean
}

class TCommand implements Command<T> {
  execute (t: T) {
    // Do something with `t`
  }
}

class TArgvParser implements ArgParser<T> {
  readonly flags = {
    option: ['--option'],
    flag: ['--flag']
  }

  parse (stream: ArgvStream, option: keyof T): T[typeof option] {
    switch (option) {
      case 'option':
        return stream.next()
      case 'flag':
        return true
    }
  }
}

const handler = new CommandHandler<T>(
  new TCommand(),
  [new ArgvOptionsProvider<T>(new TArgvParser())]
)
```

---

### Core
The core archetecture is built like this; a `Program` is executed, creating (or receiving)
a `Kernel` that it passes on to its `Handler`, which needs to perform some action. The
`Kernel` acts as the link to the OS and IO, such that it can be mocked for testing.

The `CommandHandler` (one implementation of the `Handler` interface), passes the `Kernel`
into each of a list of `OptionsProvider<T>`s, which together establish a `T` from the data
available through the `Kernel`. The `T` is then passed into a `Command<T>` which finally
executes the action.

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

* Added Travis CI. :arrows_counterclockwise:
* Added linter. :cop:
* Stubbed out test environment and added Jest.
* Stubbed out directories and build environment.
* Added TypeScript compiler. :cool:

---

# 0.0.0

* Documented the target API in Readme.
