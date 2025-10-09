# Lab 0 TMPS - implement 3 out of 5 SOLID principles

## Installation

```shell
git clone https://www.github.com/DdimaPos/tmps-labs.git
cd tmps-labs/
npm i
```

To run the program do this

```shell
npx tsc
node src/index.js
```

## Adhered Solid principles

This is a very simple program that simulates a notification
system. You have an interface that describe what method 
must a Notifier have, 2 classes that implement this interface:

- Email Notifier
- Slack Notifier

And there is a notification service that accepts the classes that 
implement that interface

### Single Responsibility principle

Here the implementatio is pretty simple. All the notification services 
have only the purpose for which they were named and designed.

- `EmailNotifier` sends only the email messages
- `SlackNotifier` sends only the slack messages
- `NotificationService` only calls each of the service that was passed to him

None of these classes are doing other things that are not related to
notifications. For example calculating the fibonnaci sequence

### Open/Closed principle

If we look at the Notification service that it is completed and even
if in future we need to add a notification service via SMS, Push Notifications,
pigeons idk, we do not modify the NotificationService.

Instead we can create a new class `PigeonService` that will implement
`INotification` and in this way we extend the functionality, not modifying
already implemented things.

**Modules are opened for extention, closed for modification**

### Dependency inversion

**High-level modules should not depend on low level modules. Both should
depend on abstractions**

This principle is implemented in the `NotifierService`.

```ts
class NotificationService {
  private readonly notifiers: INotifier[];

  constructor(notifiers: INotifier[]) {
    this.notifiers = notifiers;
  }

  public notifyAll(message: string): void {
    console.log("--- Firing all notifications ---");
    this.notifiers.forEach(notifier => notifier.send(message));
  }
}
```

It does not depend specifically on the `SlackService` 
or the `EmailService`. It depends on the interface which
is an abstraction used by other services. And this construction allows
us to inject the low level modules for achieving the dependency inversion.

### (Bonus) Liskov Substitution principle

**Objects of a superclass should be replaceable with objects of its 
subclasses without breaking the application**

In my code

- The base type (superclass) is the `INotifier` interface.
- The subtypes (subclasses) are `EmailNotifier` and `SlackNotifier`
- The application is the `NotificationService`.


The NotificationService operates on an array of INotifier objects. 
It doesn't know or care about the specific concrete classes. 
It just knows that any object conforming to INotifier will have a 
.send() method that works as expected. You can substitute an 
EmailNotifier for an `SMSNotifier`, and the `NotificationService `
continues to function correctly.

To break this principle imagine that a new class is introduced like 
`SMSService`. Suddenly in the send method you throw an error 
on some condition.

```ts
class ShortMessageNotifier implements INotifier {
    send(message: string): void {
        if (message.length > 20) {
            throw new Error("Message is too long");
        }
        console.log(`Sending message: "${message}"`);
    }
}
```

The ShortMessageNotifier violates LSP because it introduces a 
new condition that the NotificationService knows nothing about, 
causing the program to crash.
