/**
 * @author Alex Jayaraj
 * 
 * Last run node index.js 
 * 
 */
 /*jshint esversion: 6 */
 'use strict';
 
 var util = require('util');
 var GitHubApi = require('github');
 var fs = require('fs');
 var async = require('async');
 var userRepos = {}
 
 var github = new GitHubApi({});
 github.authenticate({
     type: 'oauth',
     token: '0a3cf22755adf91d898aa7e7b4e3df5ceac56d76'
 });
 
 exports.searchGIT = function(keyword, user, cb) {
    var response = {};
    var repos = [];
    github.search.code({
        q: keyword + '+user:' + user
    }).then(result => {
        var res = result;
        async.whilst(
            function() {
                return github.hasNextPage(result);
            },
            function(callback) {
                handleResults(result, repos);
                github.getNextPage(result)
                    .then(res => {
                        result = res;
                        callback();
                    });
            },
            function(err) {
                handleResults(result, repos);
                cb(null, repos);
                console.log('Done');
            }
        );
    
    }).catch(err => {
        console.log('Query failed for user ' + user + '. May be no repositories created. Ignore this error.' + util.inspect(err));
        cb(null, repos);
    });
 };
 
//  var processed = 0;
 function handleResults (result, repos) {
     var items = result.data.items;
     items.forEach(function(item) {
         if (!userRepos[item.repository.full_name]) {
             userRepos[item.repository.full_name] = item.repository.url;
             repos.push(item.repository.html_url);
         }
     });
    //  processed += result.data.items.length;
    //  console.log("Processed: " + processed);
 }