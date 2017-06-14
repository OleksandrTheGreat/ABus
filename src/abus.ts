interface ISubscription {
    type: Function;
    handler: any;
    key: string;
}

export class ABus {

    private _subscriptions: Array<ISubscription> = [];

    public Handle(
        type: Function, 
        handler: (massage: any) => void,
        key?: string
    ): ABus {

        if (key) 
            this._subscriptions = this._subscriptions.filter(x => x.key !== key);

        this._subscriptions.push({
            type: type,
            handler: handler,
            key: key
        });

        return this;
    }

    public Send(
        message: any
    ): ABus {

        this._subscriptions
            .filter(x => x.type == message.constructor)
            .forEach(x => x.handler(message));

        return this;
    }

    public SendAsync(
        message: any, 
        timeout: number = 10
    ): ABus {
        
        this._subscriptions
        .filter(x => x.type == message.constructor)
        .forEach(x => {
            let handler = x.handler;
            setTimeout(() => handler(message), timeout);
        });        

        return this;
    }

    public Unsubscribe(
        handler: (message: any) => void
    ): ABus {
        
        this._subscriptions = this._subscriptions.filter(x => x.handler !== handler);
    
        return this;
    }
}
