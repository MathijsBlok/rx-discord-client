import {RawData, WebSocket} from 'ws';
import {Observable, Subscriber} from 'rxjs';

export class DiscordClient extends Observable<{ type: string, data: any }> {

    private ws: WebSocket | undefined;
    private pingInterval: NodeJS.Timer | undefined;
    private sequence: number | null = null;

    private constructor(
        private token: string,
        private reinitializeOnClose = true
    ) {
        super((observer: Subscriber<{ type: string, operation: number, data: any }>) => {
            this.init(observer);
            const pingInterval = this.pingInterval;
            const ws = this.ws;
            return {
                unsubscribe(): void {
                    ws?.close();
                    if (pingInterval) {
                        clearInterval(pingInterval);
                    }
                }
            };
        });
    }

    public static create(token: string): Observable<{ type: string, data: any }> {
        return new this(token);
    }

    private parseMessage(message: RawData): { type: string, operation: number, data: any, sequence: number } {
        const parsed = JSON.parse(message.toString());
        const type = parsed.t;
        const operation = parsed.op;
        const data = parsed.d;
        const sequence = parsed.s;
        return {type, operation, data, sequence};
    }

    private handleWebsocketMessage(observer: Subscriber<{ type: string, data: any }>, msg: RawData): void {
        const {type, operation, data, sequence} = this.parseMessage(msg);

        this.sequence = sequence;

        switch (operation) {
            case 10:
                // Initial message received
                this.pingInterval = setInterval(() => {
                    this.ws?.send(JSON.stringify({op: 1, d: this.sequence}))
                }, data.heartbeat_interval);
                break;
            case 1:
                // Ping requested
                this.ws?.send(JSON.stringify({op: 1, d: this.sequence}));
                break;
            case 0:
                observer.next({type, data});
                break;
        }
    }

    private initializeConnection(): void {
        this.ws?.send(JSON.stringify({
            op: 2,
            d: {
                token: this.token,
                properties: {
                    $os: 'linux',
                    $browser: 'chrome',
                    $device: 'chrome',
                }
            }
        }));
    }

    private handleWebsocketClose(observer: Subscriber<{ type: string, operation: number, data: any }>, e: any): void {
        console.log(`[${new Date().toISOString()}] `, `Connection closed, recreating connection [${e.toString()}]`);
        if (this.reinitializeOnClose) {
            this.init(observer);
        } else {
            observer.complete();
        }
    }

    private handleWebsocketError(e: Error): void {
        console.log(`[${new Date().toISOString()}] `, `Connection error, closing connection [${e.toString()}]`);
        this.ws?.close();
    }

    private init(observer: Subscriber<{ type: string, operation: number, data: any }>): void {
        if (!this.token) {
            const error = 'Token is not set';
            observer.error(error);
            return;
        }
        this.ws = new WebSocket('wss://gateway.discord.gg/?v=6&encoding=json');
        this.ws.on('open', () => this.initializeConnection());
        this.ws.on('message', (m) => this.handleWebsocketMessage(observer, m));
        this.ws.on('error', (e) => this.handleWebsocketError(e));
        this.ws.on('close', (e) => this.handleWebsocketClose(observer, e));
    }
}
