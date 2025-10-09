interface INotifier {
  send(message: string): void;
}

class EmailNotifier implements INotifier {
  send(message: string): void {
    console.log(`Sending email with message: "${message}"`);
  }
}

class SlackNotifier implements INotifier {
  send(message: string): void {
    console.log(`Sending Slack message: "${message}"`);
  }
}

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

const emailNotifier = new EmailNotifier();
const slackNotifier = new SlackNotifier();

const notificationService = new NotificationService([emailNotifier, slackNotifier]);

notificationService.notifyAll("Your order #12345 has shipped!");


console.log("\n...A few months later, we need to add SMS notifications...\n");

class SMSNotifier implements INotifier {
  send(message: string): void {
    console.log(`📱 Sending SMS with message: "${message}"`);
  }
}

const smsNotifier = new SMSNotifier();

const extendedNotificationService = new NotificationService([
  emailNotifier,
  slackNotifier,
  smsNotifier,
]);

extendedNotificationService.notifyAll("Your package is out for delivery!");
