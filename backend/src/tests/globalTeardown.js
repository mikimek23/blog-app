export default async () => {
  await global.__MONGOINSTANCE.stop()
}
