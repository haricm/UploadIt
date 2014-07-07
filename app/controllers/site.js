/**
 * Module dependencies.
 */
var mailclient = require('../../libs/mailclient')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , url = require('url')
  , User = require('../models/user')
  , passport = require('passport')
  , login = require('connect-ensure-login')
  , utils = require('../../libs/utils')
  , UserClaim = require('../models/userclaim')
  , User = require('../models/user')
  , fs = require('fs')
  , crop = require('../../libs/crop')
/**
 * POST https://localhost:8000/upload  [reset]
 *
 */
exports.upload = function (req, res)	{

	User.findOne({ username: req.user.username }).exec(function (err, user) {
		if(err )	{
			console.log("Requested Document not found");
			res.redirect('/');
		} else if(!user)   {
			console.log("Wrong username");
			res.redirect('/');
	    }  else  {
	    	var count =user.count;
    		count++;
    		fs.readFile(req.files.image.path, function (err, data) {
        		var dirpath = __dirname + "/../../public/images/uploaded/"+req.user.username+"/" ;
        		var newdirpath = dirpath + count.toString() + '/';
        		var relativepath = "/images/uploaded/"+req.user.username+"/"+ count.toString() + '/'+req.files.image.name;
        		var relativepathdir = "/images/uploaded/"+req.user.username+"/"+ count.toString() + '/';
        		var filepath = __dirname + "/../../public" + relativepath;
        		fs.exists(dirpath, function(exists) {
    				if (exists) {
    					fs.mkdir(newdirpath,function(e){
    						if(!e || (e && e.code === 'EEXIST')){

        						fs.writeFile(filepath, data, function (err) {
        							crop.cropImage(newdirpath, filepath, 0, 0, 0, 0, 0, 0, 0, 0, function(){
            						user.images.push({ image1 : "https://localhost:8000" + relativepathdir + "horizontal.jpg",image2 :  "https://localhost:8000" + relativepathdir + "vertical.jpg",image3 : "https://localhost:8000" + relativepathdir +  "horizontal_small.jpg",image4 :  "https://localhost:8000" + relativepathdir + "gallery.jpg"});
            						user.count = count;
           							user.save(function(err){
           								if(!err)	{
            								res.send({image1 : "https://localhost:8000" + relativepathdir + "horizontal.jpg",image2 :  "https://localhost:8000" + relativepathdir + "vertical.jpg",image3 : "https://localhost:8000" + relativepathdir +  "horizontal_small.jpg",image4 :  "https://localhost:8000" + relativepathdir + "gallery.jpg"} );

           								}
           							}); 
        							});

           						});
    						} else	{

    						}
    					});
    				}	else {
    					fs.mkdir(dirpath,function(e){
    						if(!e || (e && e.code === 'EEXIST')){
        						//do something with contents

    					    	fs.mkdir(newdirpath,function(e){
    								if(!e || (e && e.code === 'EEXIST')){
    									fs.writeFile(filepath, data, function (err) {
    										crop.cropImage(newdirpath, filepath, 0, 0, 0, 0, 0, 0, 0, 0, function(){
            								user.images.push({ image1 : "https://localhost:8000" + relativepathdir + "horizontal.jpg",image2 :  "https://localhost:8000" + relativepathdir + "vertical.jpg",image3 : "https://localhost:8000" + relativepathdir +  "horizontal_small.jpg",image4 :  "https://localhost:8000" + relativepathdir + "gallery.jpg"});
            								user.count = count;
            								user.save(function(err){
            									if(!err)	{
            										res.send({image1 : "https://localhost:8000" + relativepathdir + "horizontal.jpg",image2 :  "https://localhost:8000" + relativepathdir + "vertical.jpg",image3 : "https://localhost:8000" + relativepathdir +  "horizontal_small.jpg",image4 :  "https://localhost:8000" + relativepathdir + "gallery.jpg"} );
            									}
            								}); 
        									});
 
            							});
    								} else	{

    								}
    							});   					
    						} else {
        						//debug
        						console.log(e);
    						}
						});

    				}
				});
    		});
	    /*	
	       var newFile = fs.createWriteStream("copy");
	       request.pipe(newFile);
	       request.on('end', function() {
    			response.end('uploaded!');
			});*/

	       /*
		   user.password = newpassword;
		   user.save(function(err)	{
			   if(err)
			       console.log(err)
			   else
			   {
				  mailclient.sendPasswordResetEmail(user.fullName, user.email, user.username, newpassword);
			   }
			   
		   });*/
		}
	});
	
};
/**
 * GET https://localhost:8000/
 *
 */
exports.index = function (req, res) {
	if(req.isAuthenticated())
	{
		res.render('home', { title : config.site.title, user: req.user, links : {} });
	} else {
		res.redirect('/login');
	}
};
/**
 * GET https://localhost:8000/login/
 *
 */
exports.loginForm = function (req, res) {
	if(req.isAuthenticated())
	{
		res.redirect('/');
	} else {
		res.render('login', { title : config.site.title } );
	} 
};
/**
 * POST https://localhost:8000/login/
 *
 */
exports.login = [
    passport.authenticate('local', {successReturnToOrRedirect: '/', failureRedirect: '/login', failureFlash: true })
];
/**
 * GET https://localhost:8000/activate/?md5=MD5SUM&secret=VERIFICATIONCODE
 *
 */
exports.activate = function (req, res) {
	var url_parts = url.parse(req.url,true);
	UserClaim.findOne( { md5sum : url_parts.query.md5 }, function (err, userclaims) { 
        if (err) {
			console.log(err);
        }
        else if (!userclaims) {
			console.log("Record Not Found");
        }
	    else if (!userclaims.activate(url_parts.query.secret)) { 
            console.log("Wrong Verification Code");
        }
        else
        {
			User.update({_id : userclaims.userid}, {userStatus : 1} , function(err, numberAffected, rawResponse) {
				if(err)
				{
					console.log(err);
				}
				else if(numberAffected===0)	{
					console.log("Updating User failed");
				} else
				{
					userclaims.remove();
				}
			});
		}
    });
    res.redirect('/login');
};
/**
 * GET https://localhost:8000/resetpassword
 *
 */
exports.resetPasswordForm = function (req, res)	{
	res.render('resetpassword', { title : config.site.title } );
};
/**
 * POST https://localhost:8000/resetpassword
 *
 */
exports.resetPassword = function (req, res)	{
	var newpassword = utils.uid(8);
	User.findOne({email : req.body.email}).exec(function (err, user) {
		if(err )	{
			console.log("Requested Document not found");
			res.redirect('/resetpassword');
		} else if(!user)   {
			console.log("Wrong Email Address");
			res.redirect('/resetpassword');
	    }  else  {
		   user.password = newpassword;
		   user.save(function(err)	{
			   if(err)
			       console.log(err)
			   else
			   {
				  mailclient.sendPasswordResetEmail(user.fullName, user.email, user.username, newpassword);
			   }
			   
		   });
		}
	})
	res.redirect('/login');
};
/**
 * GET https://localhost:8000/changepassword
 *
 */
exports.changePasswordForm = function (req, res)	{
	res.render('changepassword', { title : config.site.title, user: req.user  } );
};
/**
 * POST https://localhost:8000/changepassword
 *
 */
exports.changePassword = function (req, res) { //req.user.username
	if(!req.isAuthenticated())
	{
		res.redirect('/login');
	} else {
        User.findOne({ username: req.user.username }).exec(function (err, user) {
			if(err )	{
				console.log("Requested Document not found");
				res.redirect('/changepassword');
		    } 
			if(user.authenticate(req.body.password))	{
				user.password = req.body.password1;
				user.save(function(err)	{
					if(err)
						console.log(err)
					else
					{
						console.log("Database updated");
					}
				});
			}
		})
	}
	res.redirect('/account');
};
/**
 * GET https://localhost:8000/signup
 *
 */
exports.signUpForm = function (req, res) {
	console.log("signUpForm");
    //res.render('signup',  { title : config.site.title, flasherror : req.flash('flash-error') });
    res.render('signup',  { title : config.site.title, flasherror : ""});
};
/**
 * POST https://localhost:8000/signup
 *
 */
exports.signUp = function (req, res) {
    var newuser= new User({ fullName : req.body.fullName, email : req.body.email, username : req.body.username, password : req.body.password });
    newuser.save(function (err) { 
    if (err) {	
	    if(err.name === 'ValidationError')
		{
		    //var errorMsg = "<div class=\"alert\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>" + err.errors[Object.keys(err.errors)[0]].type + "</div>";
			var errorMsg = "Error";
			//res.render('signup', { title : config.site.title, error : errorMessage });
			req.flash('flash-error', errorMsg)
			res.redirect('/signup');
		}
		else 
		{
			console.log('Unknown Error while inserting User');
			res.render('signup', { title : config.site.title, error : '' });
		    console.log(err);
		}
    }  else  {
        var newuserclaim= new UserClaim({ fullName : newuser.fullName, email : newuser.email, userid : newuser._id });
		newuserclaim.save(function (err) { 
		if (err) {
		    if(err.name === 'ValidationError')
			{
				console.log(err);
			}  else   {
				console.log(err);
			}
		}
		});
    }	 
	});
    res.redirect('/login');
};
/**
 * GET https://localhost:8000/logout
 *
 */
exports.logout = function (req, res) {
    req.logout();
    res.redirect('/login');
};
/**
 * GET https://localhost:8000/account
 *
 */
exports.account = [
    login.ensureLoggedIn(),
    function (req, res) {
        res.render('account', { title : config.site.title, user: req.user });
    }
];

/**
 * GET https://localhost:8000/profile
 *
 */
exports.profile = [
    login.ensureLoggedIn(),
    function (req, res) {

    	User.findOne({ username: req.user.username }).exec(function (err, user) {
			if(err )	{
				console.log("Requested Document not found");
				res.redirect('/resetpassword');
			} else if(!user)   {
				console.log("Wrong Email Address");
				res.redirect('/resetpassword');
	  	    }  else  {
	  	    	var count = user.count;
	  	    	var images = user.images;
        		res.render('profile', { title : config.site.title, user: req.user, count: count, images: images });
			}
		})
    }
];
