# Reactive discord client

## How to use

Install dependency
```bash
npm install --save rx-discord-client
```

Use the reactive client to log all messages, filter by created and print all messages
```ts
import {DiscordClient} from 'rx-discord-client';


DiscordClient.create(process.env.TYPE_REQUEST_TOKEN)
    .pipe(
        tap(msg => console.log(`[${new Date().toISOString()}] `, `Received message of type [${msg.type}]`)),
        filter(msg => msg.type === 'MESSAGE_CREATE')
    )
    .subscribe((msg) => console.log(JSON.stringify(msg.data)));
```
You can obtain the discord authorization token by following [these instructions](https://www.youtube.com/watch?v=b9agj9jyNnI&ab_channel=Exordium)

Implementation example can be found on [GitLab](https://gitlab.com/MathijsBlok/discord-mirror)
In this example all newly created messages will be saved in mongo database.
