// -*- coding: utf-8 -*-
module.exports = {
    entry: './entry.js',
    output: {
        path: __dirname + '/web/static/',
        filename: 'bundle.js',
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: 'style!css'}
        ]
    }
}
