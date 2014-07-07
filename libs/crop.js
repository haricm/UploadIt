var env = process.env.NODE_ENV || 'development'
    , config = require('../config/config')[env]
    , fs = require('fs')
    , easyimg = require('easyimage');

var cropImage = function(dirpath, filepath, x1, y1, x2, y2, x3, y3, x4, y4, cb)   {
easyimg.crop(
    {
        src:filepath, dst:dirpath + 'horizontal.jpg',
        cropwidth:755, cropheight:450,
        gravity:'Center',
        x:x1, y:y1
    },
    function(err, image) {
        if (err) throw err;
        easyimg.crop(
            {
                src:filepath, dst:dirpath + 'vertical.jpg',
                cropwidth:365, cropheight:450,
                gravity:'Center',
                x:x2, y:y2
            },
            function(err, image) {
                if (err) throw err;
                easyimg.crop(
                    {
                        src:filepath, dst:dirpath + 'horizontal_small.jpg',
                        cropwidth:365, cropheight:212,
                        gravity:'Center',
                        x:x3, y:y3
                    },
                    function(err, image) {
                        if (err) throw err;
                        easyimg.crop(
                            {
                                src:filepath, dst:dirpath + 'gallery.jpg',
                                cropwidth:380, cropheight:380,
                                gravity:'Center',
                                x:x4, y:y4
                            },
                            function(err, image) {
                                if (err) throw err;
                                    cb();
                            }
                        );
                    }
                );
            }
        );

    }
);

}

module.exports.cropImage =cropImage;