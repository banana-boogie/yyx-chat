function debug(message: string) {
  // Set DEBUG environment variable to true to enable debug logs
  const isDebug = Deno.env.get('DEBUG') === 'true';
  if (isDebug) {
    console.debug(message);
  }
}

export default debug;
