# gs-gmail-out-of-office
for https://developers.google.com/apps-script/

Activates the out of office autoresponder in gmail according to calendar event.

Uses event description as ooo message.

Templatetags available:
- {{startdate}}  => dd.MM.yyyy
- {{starttime}}  => HH:mm
- {{enddate}}    => dd.MM.yyyy
- {{endtime}}    => HH:mm
- {{subject}}{{endsubject}} => gets set as the autoresponder email subject. place anywhere in event description

Create Trigger to run go() every hour
