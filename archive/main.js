var http = require('http');
var urlObj = require('url');
var fs = require('fs');


//req is request object - contains details of the http request
//res is the response obj - ie, what gets sent back to the browser
http.createServer(function (req, res) {
  
    //req.url is the complete URL from the http request
  purl = urlObj.parse(req.url, true)  // parse into object bc true
  path = purl.pathname

  
  if (path == '/') // begining og home view 
  {	  
    file = 'hello.html';
      fs.readFile(file,function(err,txt) 
      {
        res.writeHead(200, {'Content-Type': 'text/html'});
       res.write(txt)
        response.end()
      })
  }// end of home view
  else if (path == '/about') {
    res.writeHead(200, {'Content-Type': 'text/html'});

	  res.write("<h1>About</h1>")
    response.end()
  }
  else if (path == '/process')
  {
    res.writeHead(200, {'Content-Type': 'text/html'});

	  res.write("<h1>Process</h1>")
	  res.write("The query value is: " + purl.query.number);
    response.end()
  }else 
  res.writeHead(200, {'Content-Type': 'text/html'});

  res.write("404 page not found")
   res.end();
 }).listen(8080);
