module.exports = function(app){
    var widgets = [
        { "_id": "123", "widgetType": "HEADING", "pageId": "321", "size": 2, "text": "GIZMODO"},
        { "_id": "234", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
            "url": "http://lorempixel.com/400/200/"},
        { "_id": "567", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
            "url": "https://www.youtube.com/embed/AM2Ivdi9c4E" }
    ];

    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../uploads' });
/*    var storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, '/../../uploads')
        },
        filename: function(req, file, callback) {
            console.log(file);
            callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        }
    });
*/
    // POST Calls.
    app.post('/api/page/:pageId/widget', createWidget);
    app.post('/api/upload', function(req, res) {
        var upload = multer({
            storage: storage
        }).single('userFile');
        upload(req, res, function(err) {
            res.end('File is uploaded')
        });
    });
    //app.post ('/api/upload', upload.single('myFile'), uploadImage);

    // GET Calls.
    app.get('/api/page/:pageId/widget', findAllWidgetsForPage);
    app.get('/api/widget/:widgetId', findWidgetById);

    // PUT Calls.
    app.put('/api/widget/:widgetId', updateWidget);

    // DELETE Calls.
    app.delete('/api/widget/:widgetId', deleteWidget);

    function createWidget(req, res) {
        var widget = req.body;
        var newWidget = {};
        if(widget.widgetType == "HEADING"){
            newWidget = {
                _id: new Date().getTime(),
                widgetType: widget.widgetType,
                pageId: widget.pageId,
                size: widget.size,
                text: widget.text
            }
        }
        else if(widget.widgetType == "IMAGE"){
            newWidget = {
                _id: new Date().getTime(),
                widgetType: widget.widgetType,
                pageId: widget.pageId,
                width: widget.width,
                url : widget.url
            }
        }
        else if(widget.widgetType == "YOUTUBE"){
            newWidget = {
                _id: new Date().getTime(),
                widgetType: widget.widgetType,
                pageId: widget.pageId,
                width: widget.width,
                url : widget.url
            }
        }
        else{
            res.status(500).send("Widget creation failed! Wrong widget type: " + widget.widgetType);
        }
        if(newWidget._id){
            widgets.push(newWidget);
            res.status(200).send(newWidget);
        } else{
            res.status(500).send("Widget creation failed!");
        }

    }

    function findAllWidgetsForPage(req, res) {
        var pageId = req.params.pageId;
        var result = [];
        for (var w in widgets) {
            var widget = widgets[w];
            if (parseInt(widget.pageId) === parseInt(pageId)) {
                result.push(widget);
            }
        }
        res.status(200).send(result);
    }

    function findWidgetById(req, res){
        var wgid = req.params.widgetId;
        for (w in widgets) {
            var widget = widgets[w];
            if (parseInt(widget._id) === parseInt(wgid)) {
                res.status(200).send(widget);
                return;
            }
        }
        res.status(404).send("Widget not found! ");
    }

    function updateWidget(req, res){
        var wgid = req.params.widgetId;
        var newWidget = req.body;
        var oldWidget = null;
        for (w in widgets) {
            var widget = widgets[w];
            if (parseInt(widget._id) === parseInt(wgid)) {
                oldWidget = widget;
            }
        }
        if(oldWidget){
            var index = widgets.indexOf(oldWidget);
            widgets[index].widgetType = newWidget.widgetType;
            widgets[index].pageId = newWidget.pageId;
            widgets[index].size = newWidget.size == null ? null : newWidget.size;
            widgets[index].text = newWidget.text == null ? null : newWidget.text;
            widgets[index].width = newWidget.width == null ? null : newWidget.width;
            widgets[index].url = newWidget.url == null ? null : newWidget.url;
            res.status(200).send(widgets[index]);
        } else{
            res.status(404).send("Widget not found!");
        }
    }

    function deleteWidget(req, res){
        var wgid = req.params.widgetId;
        for(var i = 0; i < widgets.length; i++){
            var widget = widgets[i];
            if (parseInt(widget._id) === parseInt(wgid)) {
                widgets.splice(i, 1);
                res.status(200);
                return;
            }
        }
        res.status(404).send("Widget not found!");
    }

    function uploadImage(req, res) {
        console.log(widgets);
        var widgetId      = req.body.widgetId;
        var width         = req.body.width;
        var myFile        = req.file;

        var userId = req.body.userId;
        var websiteId = req.body.websiteId;
        var pageId = req.body.pageId;

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        console.log(filename);
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;

        for(var i = 0; i < widgets.length; i++){
            if (parseInt(widgets[i]._id) === parseInt(widgetId)) {
                widgets[i].url = '/uploads/'+filename;
                //var callbackUrl   = "#/user/"+userId+"/website/"+websiteId+"/page/";
                //res.redirect(callbackUrl);
                return;
            }
        }

    }

}