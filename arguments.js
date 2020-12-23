const getArguments = (command, input, expected = 1) => {
  let args = input.substring(command.length);

  if (expected == 1) {
    return args.length > 0 ? [args] : [];
  }

  return args.split(" ");
};

export { getArguments };
