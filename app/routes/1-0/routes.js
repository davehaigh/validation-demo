module.exports = function (router,_myData) {

    var version = "1-0";

    router.all('/' + version + '/*', function (req, res, next) {

        if(!req.session.myData || req.query.resetSession) {
            req.session.myData = JSON.parse(JSON.stringify(_myData))
        }
        
        // Reset page validation to false by default. Will only be set to true, if applicable, on a POST of a page
        req.session.myData.validationErrors = {}
        req.session.myData.validationError = "false"
        req.session.myData.includeValidation =  req.query.includeValidation || req.session.myData.includeValidation

        next()
    });

    router.get('/' + version + '/single-question', function (req, res) {
        res.render(version + '/single-question', {
            myData: req.session.myData
        });
    });
    router.post('/' + version + '/single-question', function (req, res) {
        req.session.myData.radios2AnswerTemp = req.body.radios2Answer

        //Set default answers if includeValidation is false and no answer given
        if(req.session.myData.includeValidation == "false"){
            req.session.myData.radios2AnswerTemp = req.session.myData.radios2AnswerTemp || "Yes"
        }

        // RADIOS

        // Returns true if no radio was selected
        if(!req.session.myData.radios2AnswerTemp){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.radios2Answer = {
                "anchor": "radios2-1",
                "message": "Select an answer"
            }
        }

        // Where to navigate next?? 

        // If there was an error, store temp data and re render page
        if(req.session.myData.validationError == "true") {
            // the temp variables are used to popualte the page with entered values if it invalidates
            // it's so, we dont override the actual session variable data that may have been stored previously.

            res.render(version + '/single-question', {
                myData: req.session.myData
            });
        // otherwise, store proper data and go to next page
        } else {
            req.session.myData.radios2Answer = req.session.myData.radios2AnswerTemp
            res.redirect(301, '/' + version + '/check-answers-single');
        }
    });

    router.get('/' + version + '/multiple-questions', function (req, res) {
        res.render(version + '/multiple-questions', {
            myData: req.session.myData
        });
    });
    router.post('/' + version + '/multiple-questions', function (req, res) {
        req.session.myData.radios1AnswerTemp = req.body.radios1Answer
        req.session.myData.text1AnswerTemp = req.body.text1Answer.trim()

        //Set default answers if includeValidation is false and no answer given
        if(req.session.myData.includeValidation == "false"){
            req.session.myData.radios1AnswerTemp = req.session.myData.radios1AnswerTemp || "Yes"
            req.session.myData.text1AnswerTemp = req.session.myData.text1AnswerTemp || "default"
        }

        // TEXT FIELD

        // Returns true if empty field
        if(req.session.myData.text1AnswerTemp == ""){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.text1Answer = {
                "anchor": "text1Answer",
                "message": "Enter something"
            }
        // Returns true if entered value is not exactly 7 characters long
        } else if(req.session.myData.text1AnswerTemp.length != 7){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.text1Answer = {
                "anchor": "text1Answer",
                "message": "Enter 7 characters exactly"
            }
        }

        // RADIOS

        // Returns true if no radio was selected
        if(!req.session.myData.radios1AnswerTemp){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.radios1Answer = {
                "anchor": "radios1-1",
                "message": "Select an answer"
            }
        }

        // Where to navigate next?? 

        // If there was an error, store temp data and re render page
        if(req.session.myData.validationError == "true") {
            // the temp variables are used to popualte the page with entered values if it invalidates
            // it's so, we dont override the actual session variable data that may have been stored previously.

            res.render(version + '/multiple-questions', {
                myData: req.session.myData
            });
        // otherwise, store proper data and go to next page
        } else {
            req.session.myData.radios1Answer = req.session.myData.radios1AnswerTemp
            req.session.myData.text1Answer = req.session.myData.text1AnswerTemp
            res.redirect(301, '/' + version + '/check-answers-multiple');
        }
    });

    router.get('/' + version + '/check-answers-multiple', function (req, res) {
        res.render(version + '/check-answers-multiple', {
            myData: req.session.myData
        });
    });
    router.post('/' + version + '/check-answers-multiple', function (req, res) {
        res.redirect(301, '/index');
    });

    router.get('/' + version + '/check-answers-single', function (req, res) {
        res.render(version + '/check-answers-single', {
            myData: req.session.myData
        });
    });
    router.post('/' + version + '/check-answers-single', function (req, res) {
        res.redirect(301, '/index');
    });

};