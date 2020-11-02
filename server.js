  // Start the agent before any thing else in app if parameters are provided
  var apm = require('elastic-apm-node').start()
  const express = require('express');
  const bodyParser = require('body-parser')
  const cors = require('cors')
  const path = require('path');
  const app = express();
  const options = {
	  etag: true,
	  //maxAge: 3600000, it is in MS use it only in case all files are needed to be cached
	  setHeaders: function (res, resource, stat) {
		  res.set({
        'x-timestamp': Date.now(),
			  'Cache-Control': (resource && resource.includes && resource.includes('index.html')) ? 'no-store' : 'public, max-age: 315360000'
		  });
	  }
  };
  
  app.disable('x-powered-by');
  
  app.use(express.static(__dirname, options));
  
  app.use(cors())
  

  // need to declare a "catch all" route on your express server 
  // that captures all page requests and directs them to the client
  // the react-router do the route part
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  app.listen(
    process.env.PORT || 5000,
    function () {
      console.log(`Frontend start on http://localhost:5000`)
    }
  );
