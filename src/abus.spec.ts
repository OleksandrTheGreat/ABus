import { ABus } from './abus';

class TestMessage {
    constructor(public time?: Date) { }
}

describe("ABus", function () {

    let bus: ABus;

    beforeEach(function () {
        bus = new ABus();
    });

    it("should send a message", function () {

        let expected = new TestMessage(new Date());
        let actual: TestMessage;

        bus.Handle(TestMessage, (message: any) => {
            actual = message;
        });

        bus.Send(expected);

        expect(actual).toBe(expected);
    });

    it("should send a message async", function () {

        let expected = new TestMessage(new Date());
        let actual: TestMessage;

        bus.Handle(TestMessage, (message: any) => {
            actual = message;
        });

        bus.SendAsync(expected);

        expect(actual).toBeUndefined();

        setTimeout(() => {
            
            if (actual!==expected)
                throw new Error();
            
            expect(actual).toBe(expected)
        }, 200);
    });

    it("should send a message to exact handler", function () {

        class DifferentMessage { }

        let expected = new TestMessage(new Date());
        let actual: any;

        bus.Handle(TestMessage, (message: any) => {
            actual = message;
        });

        bus.Send(expected);
        bus.Send(new DifferentMessage());

        expect(actual).toBe(expected);
    });

    it("should unsubscribe", function () {

        let expected = new TestMessage(new Date());
        let actual: TestMessage;

        let handler: any = (message: any) => {
            actual = message;
        };

        bus.Handle(TestMessage, handler);
        bus.Unsubscribe(handler);

        bus.Send(expected);

        expect(actual).toBeUndefined();
    });
    
    it('should handle latest named handler', () => {

        let buff = [];
        let key = 'KEY';

        bus.Handle(TestMessage, () => buff.push(1), key);
        bus.Handle(TestMessage, () => buff.push(2), key);

        bus.Send(new TestMessage());

        expect(buff.length).toEqual(1);
    });
});
