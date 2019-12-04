var elasticsearch = require('elasticsearch')

var elasticClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'info'
})

/** Declaring index **/
var indexName = 'randomindex'


/** Deleting random existing indexes **/
function deleteIndex() {
    return elasticClient.indices.delete({
        index: indexName
    })
}



/** Initiating new index **/
function initIndex() {
    return elasticClient.indices.create({
        index: indexName
    })
}

/** Checking for existing index **/
function isIndexExist() {
    return elasticClient.indices.exists({
        index: indexName
    })
}

/** Mapping data to be stored in elastic search**/
function initMapping() {
    return elasticClient.indices.putMapping({
        index: indexName,
        type: "document",
        includeTypeName: true,
        body: {
            properties: {
                title: { type: 'text' },
                content: { type: 'text' },
                suggest: {
                    type: 'completion',
                    analyzer: 'simple',
                    search_analyzer: 'simple'
                }
            }
        }
    })
}

/** Function to add coument to index**/
function addDocumentToIndex(doc) {
    return elasticClient.index({
        index: indexName,
        type: 'document',
        body: {
            title: doc.title,
            content: doc.content,
            suggest: {
                input: doc.title.split(' ')
            },
            output: doc.title
        }
    })
}


/** Function to get suggestd documents**/
function getsuggestedDocs(input) {
    return elasticClient.search({
        index: indexName,
        type: 'document',
        body: {
            query: {
                match: {
                    title: {
                        query: input,
                        fuzziness: "AUTO"
                    }
                }
            }
        }
    })
}



/** Exporting All Functions**/
exports.deleteIndex = deleteIndex;
exports.initIndex = initIndex;
exports.isIndexExist = isIndexExist;
exports.initMapping = initMapping;
exports.addDocumentToIndex = addDocumentToIndex;
exports.getsuggestedDocs = getsuggestedDocs;