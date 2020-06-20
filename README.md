# gs-gmail-out-of-office
Activates the out of office autoresponder in gmail according to calendar event.

Uses event description as ooo message.

Templatetags available:
- {{startdate}}  => dd.MM.yyyy
- {{starttime}}  => HH:mm
- {{enddate}}    => dd.MM.yyyy
- {{endtime}}    => HH:mm

Create Trigger to run go() every hour
