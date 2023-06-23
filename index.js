const { writeFileSync } = require('fs');
const fs = require('fs');
const ics = require('ics')
const { v4 } = require('uuid');
const path = require('path');
const readlineSync = require('readline-sync');

const uuid = v4();

const title = readlineSync.question('Title: ')
const location = readlineSync.question('Location: ')
const year = readlineSync.question('Year (e.g: 2023): ')
const month = readlineSync.question('Month (e.g: 06): ')
const day = readlineSync.question('Day (e.g: 09): ')
const time = readlineSync.question('Time (e.g: 13:30): ')

// const title = 'Meeting with John';
// const location = 'Office';
// const year = '2023';
// const month = '06';
// const day = '24';
// const time = '14:00';

function createGmailCalendarLink(title, location, year, month, day, time) {
    const date = `${year}-${month}-${day}`
    const encodedTitle = encodeURIComponent(title);
    const encodedLocation = encodeURIComponent(location);
    const encodedDate = encodeURIComponent(date);
    const encodedTime = encodeURIComponent(time);
  
    const calendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&location=${encodedLocation}&dates=${encodedDate}T${encodedTime}/${encodedDate}T${encodedTime}:00`;
  
    return calendarLink;
  }

  function createOutlookCalendarLink(title, location, year, month, day, time) {
    const date = `${year}-${month}-${day}`
    const encodedTitle = encodeURIComponent(title);
    const encodedLocation = encodeURIComponent(location);
    const encodedDate = encodeURIComponent(date);
    const encodedTime = encodeURIComponent(time);
  
    const calendarLink = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodedTitle}&location=${encodedLocation}&startdt=${encodedDate}T${encodedTime}&enddt=${encodedDate}T${encodedTime}:00`;
  
    return calendarLink;
  }

  const createHtml = () => {
    const calendarLink = createGmailCalendarLink(title, location, year, month, day, time);
    const calendarLink2 = createOutlookCalendarLink(title, location, year, month, day, time);
    const folderPath = path.join(path.dirname(process.execPath), `outputs_${title}`);
    console.log(title, location, year, month, day, time)

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
    ics.createEvent({
        title,
        location,
        busyStatus: 'FREE',
        start: [parseInt(year), parseInt(month), parseInt(day), parseInt(time.split(':')[0]), parseInt(time.split(':')[1])],
        duration: { minutes: 50 }
      }, (error, value) => {
        if (error) {
          console.log(error)
        }
        writeFileSync(path.join(folderPath, `event${uuid}.ics`), value)
      })

    const html = `<p><strong>Add to Calendar:</strong>
    </p>
    <p>
      <a href="${calendarLink}" target="_blank">GOOGLE</a>&nbsp;|
      <a download="event.ics" href="https://marketingforms.net/wp-content/uploads/${year}/${month}/event${uuid}.ics">LOCAL</a> &nbsp;|<a href="${calendarLink2}" target="_blank">OUTLOOK</a>&nbsp;|</p>`
    
    fs.writeFile(path.join(folderPath, 'CALENDARLINKS.html'), html, (err) => {
        if (err) {
          console.error('Error creating the HTML file:', err);
        } else {
          console.log('HTML file created successfully!');
        }
      });

      console.log("\n DONT FORGET TO UPLOAD THE ICS FILE TO MARKETING FORMS \n")
    }
    createHtml()

  