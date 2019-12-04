var  express = require('express')
var router = express.Router()

var elastic = require('../elasticsearch.js')


/** Defining routes for documents **/

router.get('/suggest/:input', function(req,res,next) {
    elastic.getsuggestedDocs(req.params.input).then(function(result){
        res.json(result)
    })
})

router.post('/', function(req,res,next) {
    elastic.addDocumentToIndex(req.body).then(function(result) {
        res.json(result)
    })
})

module.exports = router