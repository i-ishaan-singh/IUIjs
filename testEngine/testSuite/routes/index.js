var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* GET home page. */
router.get('/test/*', function(req, res, next) {
	var htmldata='';
	var url = req.url.slice(5);
	try{
		console.log(__dirname);
		htmldata = fs.readFileSync(path.join(__dirname, '../testTemplates',url)+'.html')
	}catch(err){
			console.log(err);
	}
  res.render('index', { title: 'Express', htmlData: htmldata });
});

router.get('/', function(req, res, next) {
	var htmldata='';	
  res.render('index', { title: 'Express', htmlData: htmldata });
});

module.exports = router;
