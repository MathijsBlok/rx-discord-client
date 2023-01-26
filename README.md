# Reactive discord client

## How to use

Install dependency
```bash
npm install --save rx-discord-client
```

Use the reactive client to log all messages, filter by created and print all messages
```ts
import {DiscordClient} from 'rx-discord-client';


DiscordClient.create("some.authorization.token")
    .pipe(
        tap(msg => console.log(`[${new Date().toISOString()}] `, `Received message of type [${msg.type}]`)),
        filter(msg => msg.type === 'MESSAGE_CREATE')
    )
    .subscribe((msg) => console.log(JSON.stringify(msg.data)));
```

## How to obtain the authorization token
* Login on the [discord web app](https://app.discord.com) in Google Chrome
* Press F12 to open the developer console on the "Network" tab
* Start typing in a server, and then wait for the request with the name "typing" in the developer console
* Open the request and find the "authorization" header under "Request Headers"

The value of that header should be used as "some.authorization.token" in this example


Implementation example can be found on [GitLab](https://gitlab.com/MathijsBlok/discord-mirror)
In this example all newly created messages will be saved in a mongo database.
