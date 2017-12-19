/**
 * @author Alex Jayaraj
 * 
 */
 /*jshint esversion: 6 */
 'use strict';

var util = require('util');
var async = require('async');
var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser');

var gitSearch = require('./github-search');
var textParser = bodyParser.text();
var jsonParser = bodyParser.json();

app.post('/search', jsonParser, function(req, response){
    var input = req.body;
    var users = input.users;
    var keywords = input.keywords;
    var res = [];
    
    async.forEach(keywords, function(keyword, outercb) {
        var resObj = {
            keyword: keyword
        };
        res.push(resObj);
        async.forEach(users, function(user, callback) {
            resObj.user = user;
            gitSearch.searchGIT(keyword, user, function(err, repos) {
                resObj.repos = repos;
                callback(err);
            });
        }, function(err) {
            outercb(err)
        });
    }, function(err) {
        response.status(200).send(res);
    });

});

app.get('/health', textParser, function(req, res) {
    res.status(200).send('success');
});

http.listen(3000, function(){
    console.log('listening on *:' + 3000);
});