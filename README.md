# Colonel

[![Build Status](https://travis-ci.org/emilniklas/colonel.svg?branch=master)](https://travis-ci.org/emilniklas/colonel)

A strongly typed and manageable CLI library.

There are a lot of libraries on NPM that simplify parsing command line arguments, but they
all break down quickly without extending the architecture, since they focus on terseness
rather than scalability.

Colonel is written in TypeScript, and offers a strongly typed framework for bootstrapping
complex command line interfaces.

## Installation

```shell
npm install --save colonel
```

## Usage

```typescript
/**
 * The interface for the options that a specific
 * command requires.
 */
interface GreetOptions {
  name: string
  age: number
}

/**
 * The actual command class, which receives the
 * options specified above.
 */
class GreetCommand implements Command<GreetOptions> {
  execute ({ name, age }: GreetOptions) {
    console.log(`Hello ${name}, you are ${age} y.o.`)
  }
}

/**
 * One way to get the options required for the
 * command is by parsing the argument vector from
 * the shell. This needs to be implemented for
 * each options interface.
 */
class GreetArgvParser implements ArgvParser<GreetOptions> {
  /**
   * This property defines how different command
   * line flags correspond with properties on the
   * options object.
   */
  readonly flags: Flags<GreetOptions> = {
    name: ['-n', '--name'],
    age: ['-a', '--age']
  }

  /**
   * This method is used to map the command line
   * flags to a their corresponding values on the
   * options object.
   *
   * It is type safe, so the
   * compiler will complain if case clauses are
   * added for properties that do not exist on
   * the options object, as well as if the return
   * value inside a case clause does not match the
   * type of that option's defined value.
   */
  option (stream: ArgvStream, flag: keyof GreetOptions): GreetOptions[typeof flag] {
    switch (flag) {
      case 'name':
        return stream.next()
      case 'age':
        return parseInt(stream.next())
    }
  }
}

/**
 * If options are deserialized from some format that
 * doesn't contain type information, we must provide
 * an object that normalizes that input into a valid
 * object.
 *
 * This is used below for extracting options from a
 * YAML configuration file.
 *
 * `Validator` means that the input object does
 * not need to result in a complete options object.
 */
class GreetValidator implements Validator<GreetOptions> {
  /**
   * A `Partial<T>` object is simply a type alias for
   * `{ [P in keyof T]?: T[P] }`. That means the
   * returning object doesn't have to contain all
   * properties of `GreetOptions`, but the ones that
   * it does contain must be of the correct type.
   */
  validate (input: any): Partial<GreetOptions> {
    if (typeof input !== 'object') {
      throw new Error(`${input} must be an object`)
    }

    const options = {}

    if (typeof input.name === 'string') {
      options.name = input.name
    }

    if (typeof input.age === 'number') {
      options.age = input.age
    }

    return options
  }
}

// Now that our types are defined, we can wire
// everything up.
//
// First, we need to create a list of options
// providers, that collaborate to build up the
// options from different sources.
const optionsProviders: OptionsProvider<GreetOptions>[] = [

  // The order matters. The latter providers will
  // take precedence.
  //
  // Using our `Validator` from before to
  // extract some options from a YAML config file.
  new FileOptionsProvider<GreetOptions>(
    /^\.greet\.yml$/,
    new YamlFormatParser(), // A JsonFormatParser is also available!
    new GreetValidator()
  ),

  // Finally, we can use the `ArgvParser` that we
  // defined to create an `ArgvOptionsProvider`.
  new ArgvOptionsProvider<GreetOptions>(
    new GreetArgvParser()
  )
]

// To make sure that the command always receives a
// complete `GreetOptions` object, and not a
// `Partial<GreetOptions>`, we need to start with
// a complete object and apply changes to that.
//
// So we provide an object with the default options.
// If an option can be undefined and not have a
// default value, the interface must declare that
// with `field?: Type` or `field: Type | undefined`.
const defaultOptions: GreetOptions = {
  name: 'Universe',
  age: 4.5e9
}

// We can now assemble our option providers and the
// command with a `CommandHandler`.
const greetHandler = new CommandHandler<GreetOptions>(
  new GreetCommand(),
  defaultOptions,
  optionsProviders
)

// Finally, we pass in our handler into the main
// `Program` class.
const program = new Program(greetHandler)

// There is also a `MultiCommandHandler`, which can
// be used to support multiple commands by looking
// at the first command line argument.
const program = new Program(new MultiCommandHandler({
  'greet': greetHandler,
  'something-else': someOtherCommandHandler
}, {
  defaultCommand: 'greet'
}))

// Since the `MultiCommandHandler` accepts other instances
// of `CommandHandler`, we can also pass in
// `MultiCommandHandler` instances, creating a nested
// command structure.
//
// Given an executable called `p`, the configuration below
// enables these commands:
// - `p` --> delegates to `p greet`
// - `p greet` --> runs `GreetCommand`
// - `p global` --> shows help for `p some-global-command`
// - `p global some-command` --> runs `SomeCommand`
const program = new Program(new MultiCommandHandler({
  'greet': greetHandler,
  'global': new MultiCommandHandler({
    'some-command': someCommandHandler
  })
}, {
  defaultCommand: 'greet'
}))

// The `Program` can optionally be passed a `ProgramDisplay`
// which handles help pages, error messages and more.
// By default, a `ConsoleProgramDisplay` will be used, which
// uses some fancy colors and ASCII characters to create
// pretty output.
const program = new Program(greetHandler, new MyProgramDisplay())

// When we're ready to start the program, we simply need
// to strip away the `['/path/to/node', '/path/to/cli.js']`
// part of `process.argv`, and run `execute`
program.execute()
```
