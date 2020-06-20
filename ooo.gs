function getReplacedEventDescription(event){
  var descr    = event.getDescription()
  var tz       = CalendarApp.getDefaultCalendar().getTimeZone()
  var replaces = {
    "{{startdate}}" : Utilities.formatDate(event.getStartTime(), tz, "dd.MM.yyyy"),
    "{{enddate}}" : Utilities.formatDate(event.getEndTime(), tz, "dd.MM.yyyy"),
    "{{starttime}}" : Utilities.formatDate(event.getStartTime(), tz, "HH:mm"),
    "{{endtime}}" : Utilities.formatDate(event.getEndTime(), tz, "HH:mm")
  }
  for(placeholder in replaces){
    descr = descr.replace(placeholder,replaces[placeholder])
  }
  
  return descr
}
  
function setOutOfOffice(searchstring) {
  var now    = new Date();
  var later  = new Date(now.getTime() + (10 * 24 * 60 * 60 * 1000));
  var events = CalendarApp.getDefaultCalendar().getEvents(now, later,{search: searchstring});
  var vacation = Gmail.Users.Settings.getVacation('me');
  var tz = CalendarApp.getDefaultCalendar().getTimeZone()
  
  //gibt es überhaupt einen Event?
  if (events.length > 0) {
    // wenn abwesenheitsmeldung inaktiv, dann setze nächste Start/Ende auf Event Start/Ende. 
    if(vacation.enableAutoReply){
      var endDateString = Utilities.formatDate(events[0].getEndTime(), tz, "dd.MM.yyyy")
      //Setze Abwesenheit mit Start- und Enddatum des ersten gefundenen Termins events[0]
      Gmail.Users.Settings.updateVacation(
      {
        "enableAutoReply": true,
        "responseSubject": "Abwesend bis "+endDateString,
        "responseBodyHtml": getReplacedEventDescription(events[0]),
        "restrictToContacts": false,
        "restrictToDomain": false,
        "startTime":  events[0].getStartTime().getTime(),
        "endTime":  events[0].getEndTime().getTime()
      },
      'me'
    );
    }
    else{
      Logger.log('Autoreply .');
      return false
    }
  } else {
      Logger.log('No upcoming events found.');
      return false
  }
}

function go(){
 setOutOfOffice('Abwesend') // Searchstring
}

