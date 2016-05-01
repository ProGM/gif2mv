function createDownloadableSprite(name, width, height) {
  var canvas_container = $(
'<a href="#" id="downloader" download="' + name + '.png">\
  <canvas width="' + width + '" height="' + height + '"></canvas>\
<\/a>'
  );
  canvas_container.appendTo('body');
  var canvas = canvas_container.find('canvas');
  canvas_container.click(function() {
    this.download = name + '.png';
    this.href = canvas[0].toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
  })
  return canvas[0].getContext("2d");
}

function loadGifData(file_name) {
  var sup1 = new SuperGif({ gif: document.getElementById('image_keeper') } );
  sup1.load(function() {
    var frames = sup1.get_frames(),
        json_data = [];
    if (frames[0]) {
      var width = frames[0].data.width,
          height = frames[0].data.height,
          file_name_no_ext = file_name.split('.')[0],
          number_of_images = parseInt(frames.length / 12) + 1;
      for (var image_count = 0; image_count < number_of_images; image_count++) {
        var image_name = "$" + file_name_no_ext + "_" + image_count;
        var context = createDownloadableSprite(image_name, width * 3, height * 4);
        for (var i = 0; i < frames.length; i++) {
          var x = parseInt(i % 3) * width,
              y = parseInt(i / 3) * height;
          context.putImageData(frames[i].data, x, y);
          var frame_data = {
            file_name: image_name,
            delay: parseInt(frames[i].delay * 60 / 1000.0)
          }
          json_data.push(frame_data)
        }
      }
    }
    var final_obj = {};
    final_obj[file_name_no_ext] = json_data;
    $('#spriteset_data').val(JSON.stringify(final_obj));
  });
}
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $('#image_keeper').attr('src', e.target.result);
      loadGifData(input.files[0].name);
    }

    reader.readAsDataURL(input.files[0]);
  }
}

$("#image_input").change(function(){
  readURL(this);
});
