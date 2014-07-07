(function () {
var createImage = function () {
    var image = $('<img>');
    $("#temp-box").append(image);//.css('display', 'none');
    return image;
};
var getImgFile = function () {
    return $("#img-chooser")[0].files[0];
};
var setImgSource = function (image) {
    var imgFile = getImgFile();
    image.file = imgFile;
    var fileReader = new FileReader();
    $(fileReader).load(function (evt) {
        image[0].src = evt.target.result;
    });
    fileReader.readAsDataURL(imgFile);
};
var validateImage = function (image) {
    $(image).load(function () {
        if (this.naturalWidth  ===1024 && this.naturalHeight  ===1024) {
            console.log(this);
        } else {
            alert("Image should be 1024x1024 to upload!");
            $("form")[0].reset();
        }
        $("#temp-box").empty();
    });
};
var createAndValidateImage = function () {
    var previewImg= createImage();
    setImgSource(previewImg);
    validateImage(previewImg);
};

$("#img-chooser").change(function () {
    createAndValidateImage();
});

var refreshGallery = function (imageLinks) {
    var imgSrc, images;
    //$(".row").empty();
    var row = $("<div class='row'>");
    //$("#imgModal").modal();//Initialize bootstrap popover
    for (imgSrc in imageLinks) {
        var thumb = $("<div class='col-md-2 thumbnail'></div>");
        var image = $("<img />");

        (function (thumb, image) {
            thumb.append(image);
            image[0].src = imageLinks[imgSrc];
            row.append(thumb);
            $("#gallery").append(row);
            thumb.click(function (e) {
                $("#imgModal").modal('show');
                $(".modal-body").html(image.clone());
            });
        })(thumb, image);
        
    }
};



var progress = $('.progress');
var progressbar = $('.progress-bar');
var status = $('#status');
   
$('form').ajaxForm({
    beforeSend: function() {
        progress.show();
        status.empty();
        var percentVal = '0%';
        progressbar.width(percentVal)
        progressbar.html(percentVal);
    },
    uploadProgress: function(event, position, total, percentComplete) {
        var percentVal = percentComplete + '%';
        progressbar.width(percentVal)
        progressbar.html(percentVal);
		//console.log(percentVal, position, total);
    },
    success: function() {
        var percentVal = '100%';
        progressbar.width(percentVal)
        progressbar.html(percentVal);
    },
    complete: function(xhr) {
        console.log(xhr);
        refreshGallery(xhr.responseJSON);
        progress.hide();
	//sstatus.html("xhr.responseText");
    }
}); 

})();
