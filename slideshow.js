var getparam = getdata();
var messagetext = '';

function showStatus(msg) {
  document.getElementById('status').innerText = msg
}

var delay = getparam.delay * 1000
console.log(delay);
var nextTimeout
var sidx = 0
var allFiles = []

function shuffle(o){ //v1.0
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

function ready() {
  var window = chrome.app.window.current();
  window.fullscreen();

  $('#wasteheader').hide();
  $('#status').hide();

  document.body.addEventListener('keydown', function(evt) {
    if (evt.keyCode == 37) {
      // back
      if (nextTimeout) { clearTimeout(nextTimeout) }
      sidx++
        showRandom(undefined, sidx)
    } else if (evt.keyCode == 39) {
      // forward

      if (nextTimeout) { clearTimeout(nextTimeout) }
      sidx--
        showRandom(undefined, sidx)


    }

  })


  chrome.mediaGalleries.getMediaFileSystems({interactive:"no"},function(d){
    console.log('selected folders',d)
      var completed = 0
      function onedone() {
        completed++
          if (completed == d.length) {

            if (getparam.random == 1) {
              shuffle(allFiles);
            }

            startSlideshow()
          }
      }

    for (var i=0;i<d.length; i++) {
      addToFiles(d[i].root, allFiles, onedone)
    }

  })

  $('#schedule').html('<p>Showing any characters with scroll</p>');

  //get scroll text from server
  /*
  $.post(
      "http://192.168.100.209/gmailgetter/index.php",
      {

      },
      function(data){
        $('#schedule').html(data);
        messagetext = data;
      }
      );
  var rst = setInterval( function (){
    $.post(
        "http://192.168.100.209/gmailgetter/index.php",

        {

        },
        function(data){
          if( messagetext != data ){
            $('#schedule').html(data);
            messagetext = data;
          }
        }
        );
  }, 60 * 1000);
  */

}


function startSlideshow() {
  showRandom(true)
    showStatus('found ' + allFiles.length)
    // start the slideshow!
    chrome.storage.local.get('delay', function(d) {

      if (d && d.delay) {

        delay = d.delay
      }
      nextTimeout = setTimeout(showRandom, delay)
    })
}

function showRandom(dontschedule, customIdx) {
  var schedule = ! dontschedule
    //var idx = Math.floor( Math.random() * allFiles.length )
    if (customIdx !== undefined) {

      if (customIdx < 0) {
        customIdx = allFiles.length + customIdx
      }

      var idx = customIdx % allFiles.length
    } else {
      var idx = sidx % allFiles.length
        sidx++
    }

  var pic = allFiles[idx]
    showPicture(pic, idx)
    if (schedule) {
      nextTimeout = setTimeout(showRandom, delay)
    }
}


function showPicture(entry, idx) {
  var img = document.createElement('img');
  img.src = entry.toURL();
  img.style.width='100%';
  var imgtag = '<img id="pic'+idx+'" src="'+entry.toURL()+'" style="width:100%;"/>';
  //var text = document.createElement('span');
  //text.innerText = entry.fullPath;
  //console.log(text);
  
  //document.getElementById('content').innerHTML = '';
  if (idx == 0){
    idx = allFiles.length - 1;
  }
  $('#img2').html('');
  $('#img2').show();
  $('#img2').html( $('#img1').html() );
  
  $('#img1').html(imgtag).hide();


  $('#img2').fadeOut(2000);
  $('#img1').fadeIn(2000);

  
  //document.getElementById('content').appendChild(text)
  //document.getElementById('content').appendChild(document.createElement('br'))
  //console.log(entry.toURL());
  
  //document.getElementById('content').appendChild(img);

}

function addToFiles(entry, allresults, callback) {
  // createReader

  var reader = entry.createReader()

    function onreaderr(evt) {
      console.error('error reading dir',evt)
    }

  function alldone(results) {
    if (callback) { callback() }
    //arr = arr.concat(results)
  }

  function onreadsuccess(results) {
    console.log('onreadsuccess',results.length)
      if (results.length == 0) {
        alldone.bind(this)(allresults)
      } else {
        //allresults = allresults.concat( results )
        for (var i=0;i<results.length;i++) {
          if (isImage(results[i])) {
            allresults.push(results[i])
          }
        }
        showStatus('scanning... ' + allresults.length + ' entries.')
          reader.readEntries( onreadsuccess.bind(this),
              onreaderr.bind(this) )
      }
  }

  console.log('readentries')
    reader.readEntries( onreadsuccess.bind(this),
        onreaderr.bind(this))
}

if (! String.prototype.endsWith) {
  String.prototype.endsWith = function(substr) {
    for (var i=0; i<substr.length; i++) {
      if (this[this.length - 1 - i] !== substr[substr.length - 1 - i]) {
        return false
      }
    }
    return true
  }
}
if (! String.prototype.startsWith) {
  String.prototype.startsWith = function(substr) {
    for (var i=0; i<substr.length; i++) {
      if (this[i] !== substr[i]) {
        return false
      }
    }
    return true
  }
}

function isImage(entry) {
  var filename = entry.name
    return filename.endsWith('.png') ||
    filename.endsWith('.webp') ||
    filename.endsWith('.jpg') ||
    filename.endsWith('.jpeg') ||
    filename.endsWith('.gif')
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("back").addEventListener('click',function() {
    chrome.app.window.create('index.html',{id:'index'})
      chrome.app.window.current().close()
  })

  /*
     chrome.app.window.current().onClosed.addListener( function() {
     chrome.app.window.create('index.html',{id:'index'})
     })
     */

  ready()
})

function getdata(){
  if(window.location.search){
    /* URLの「?」以降のパラメータを変数nに代入 */
    var n=window.location.search.substring(1,window.location.search.length);
    /* テキストボックスにパラメータを表示 */
    n = n.split('&');
    var x = new Object();
    for (var i=0; i < n.length; i++) {
      var j = n[i].split('=');

      x[j[0]] = j[1];


    }
    return x;
  }
}

