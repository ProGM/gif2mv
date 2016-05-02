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

function createSpritesFromFrames(frames, sprite_width, sprite_height, base_file_name) {
  var width = frames[0].data.width,
      height = frames[0].data.height,
      json_data = [],
      frames_per_sprite = sprite_width * sprite_height,
      number_of_sprites = parseInt(frames.length / frames_per_sprite) + 1;

  for (var sprites_count = 0; sprites_count < number_of_sprites; sprites_count++) {
    var image_name = base_file_name + "_" + sprites_count;
    var context = createDownloadableSprite(image_name, width * sprite_width, height * sprite_height);
    var start_index = sprites_count * frames_per_sprite;
    for (var i = 0; i < frames_per_sprite; i++) {
      var current_frame = i + start_index;
      if (current_frame >= frames.length) {
        break;
      }
      var x = parseInt(i % sprite_width) * width,
          y = parseInt(i / sprite_width) * height;
      context.putImageData(frames[current_frame].data, x, y);
      json_data.push({
        file_name: image_name,
        delay: parseInt(frames[current_frame].delay * 60 / 100.0)
      })
    }
  }

  return json_data;
}

function loadGifData(file_name) {
  var sup1 = new SuperGif({ gif: document.getElementById('image_keeper') } );
  sup1.load(function() {
    var frames = sup1.get_frames(),
        json_data = [],
        file_name_no_ext = file_name.split('.')[0]
    if (frames[0]) {
      json_data = createSpritesFromFrames(frames, 3, 4, "$" + file_name_no_ext);
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
