module.exports = function (router,_myData) {

    var version = "1-0";

    router.all('/' + version + '/*', function (req, res, next) {

        if(!req.session.myData || req.query.resetSession) {
            req.session.myData = JSON.parse(JSON.stringify(_myData))
        }
        
        // Reset page validation to false by default. Will only be set to true, if applicable, on a POST of a page
        req.session.myData.validationErrorInfo = {}
        req.session.myData.validationError = "false"

        next()
    });

    router.get('/' + version + '/form', function (req, res) {
        res.render(version + '/form', {
            myData: req.session.myData
        });
    });
    router.post('/' + version + '/form', function (req, res) {
        var _radiosAnswer = req.body.radiosAnswer

        //Set default answers if includeValidation is false and no answer given
        if(req.session.myData.includeValidation == "false"){
            _radiosAnswer = _radiosAnswer || "yes"
        }

        if(!_radiosAnswer){

            req.session.myData.validationError = "true"
            req.session.myData.validationErrorInfo = {
                "message1": "Select an answer"
            }

            res.render(version + '/form', {
                myData: req.session.myData
            });
        } else {
            req.session.myData.radiosAnswer = _radiosAnswer
            res.redirect(301, '/' + version + '/form-next');
        }
    });

    router.get('/' + version + '/form-next', function (req, res) {
        res.render(version + '/form-next', {
            myData: req.session.myData
        });
    });
    router.post('/' + version + '/form-next', function (req, res) {
        res.redirect(301, '/' + version + '/form');
    });

};