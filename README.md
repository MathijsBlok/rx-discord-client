# Reactive discord client

## How to use

```ts
DiscordClient.create(process.env.TYPE_REQUEST_TOKEN)
    .pipe(
        tap(msg => console.log(`[${new Date().toISOString()}] `, `Received message of type [${msg.type}]`)),
        filter(msg => msg.type === 'MESSAGE_CREATE')
    )
    .subscribe((msg) => saveMessage(msg.data))
```
You can obtain the discord authorization token by following [these instructions](https://www.youtube.com/watch?v=b9agj9jyNnI&ab_channel=Exordium)

