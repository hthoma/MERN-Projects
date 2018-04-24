

var request = require('request');
var cheerio = require('cheerio');
var nodemailer = require('nodemailer');
var args = [].slice.call(arguments);
var foundSongs = Array();
var artistsEntered = Array();


	var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: '***@gmail.com', //Redacted, use your own gmail account. This is used to send the email. 
        pass: '*****'
    }
});


request('https://www.billboard.com/charts/rap-song', function (error, response, html) {
	if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);

        $('div.chart-row__title').each(function(i, element) {
            var info = $(this).text().split(/\n/);
       		var song = info[1];
       		var artist = info[3];

       		process.argv.forEach(function (val, index, array) {
  			if (artist.toLowerCase().search(val.toLowerCase())!= -1){
  				foundSongs.push((i + 1) + '. ' + artist + " - " + song);
  			}
			});
        });

        process.argv.forEach(function (val, index, array) {
       		artistsEntered.push(val);
       	});    
	}

	if (foundSongs.length == 0)
		console.log('No Occurences of your artist(s) found! No Email Sent. Make sure to enter at least one artist as an argument.');
	else{
	const mailOptions = {
  	from: '***@gmail.com', //Redacted, gmail will default as recognizing the sender as the auth key you used, so it must be the same email you used in createTransport
 	 to: '***@gmail.com',  //Email to send results to
  	subject: 'Your artist(s): ' + artistsEntered.slice(2).toString(), 
  	html: '<b>' + foundSongs.toString().replace(/,/g, "<br>") + '</b>'
};

	transporter.sendMail(mailOptions, function (err, info) {
   if(err)
     console.log(err)
   else
     console.log("Artist Found in the Rap Charts! Email Sent! Eskettit");
});
};
});






