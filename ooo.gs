function getReplacedEventDescription(event){
  var descr    = event.getDescription()
  var tz       = CalendarApp.getDefaultCalendar().getTimeZone()
  descr = descr.replace(/{{startdate}}/g,Utilities.formatDate(event.getStartTime(), tz, "dd.MM.yyyy"))
  descr = descr.replace(/{{enddate}}/g,Utilities.formatDate(event.getEndTime(), tz, "dd.MM.yyyy"))
  descr = descr.replace(/{{starttime}}/g,Utilities.formatDate(event.getStartTime(), tz, "HH:mm"))
  descr = descr.replace(/{{endtime}}/g,Utilities.formatDate(event.getEndTime(), tz, "HH:mm"))

  return descr
}
  
function setOutOfOffice(searchstring) {
  var now    = new Date();
  var later  = new Date(now.getTime() + (24 * 60 * 60 * 1000));
  var events = CalendarApp.getDefaultCalendar().getEvents(now, later,{search: searchstring});
  var vacation = Gmail.Users.Settings.getVacation('me');
  var tz = CalendarApp.getDefaultCalendar().getTimeZone()
  
  //gibt es überhaupt einen Event?
  if (events.length > 0) {
    Logger.log(events[0].getTitle() +" gefunden")
    Logger.log(events[0].getEndTime())
    Logger.log(vacation.endTime)
    var endDateString = Utilities.formatDate(events[0].getEndTime(), tz, "dd.MM.yyyy")
    //setze nächste Start/Ende auf Event Start/Ende. 
    if(events[0].getStartTime().getTime().toString() != vacation.startTime || events[0].getEndTime().getTime().toString() != vacation.endTime){
        Logger.log("muss updaten")
      // Suche nach Betreff, sonst Standard setzen
      var re = /{{subject}}(.*){{endsubject}}/;
      var subject_match = getReplacedEventDescription(events[0]).match(re);
      if(Object.is(subject_match,undefined) || Object.is(subject_match,null)) {
        subject = "Abwesend bis "+endDateString
      }
      else{
        subject = subject_match[1]
      }
      Logger.log(subject)
      //Setze Abwesenheit mit Start- und Enddatum des ersten gefundenen Termins events[0]
      vacation = Gmail.Users.Settings.updateVacation(
      {
        "enableAutoReply": true,
        "responseSubject": subject,
        "responseBodyHtml": getReplacedEventDescription(events[0]).replace(re,""),
        "restrictToContacts": false,
        "restrictToDomain": false,
        "startTime":  events[0].getStartTime().getTime(),
        "endTime":  events[0].getEndTime().getTime()
      },
      'me'
    );
    }
  } else {
      Logger.log('Keine Termine gefunden');
      return false
  }
  Logger.log("erledigt")
  Logger.log(vacation)
  
}

function go(){
 setOutOfOffice('Abwesend')
}

