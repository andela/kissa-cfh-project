/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../../config/config'),
    Schema = mongoose.Schema;

/**
 * Answer Schema
 */
var ArticleSchema = new Schema({
    id: {
        type: Number
    },
    title: {
        type: String,
        default: '',
        trim: true,
				required: true
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    user: {
        type: String,
        default: '',
        trim: true
    }
});

/**
 * Statics
 */
ArticleSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            id: id
        }).select('-_id').exec(cb);
    }
};

mongoose.model('Article', ArticleSchema);