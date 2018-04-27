/**
    Original code from glitch.js
    	@license glitch.js v0.1 <http://www.github.com/sjhewitt/glitch.js>
    	Released under MIT License
    	Copyright (c) 2012 Simon Hewitt.
    	http://www.twitter.com/sjhewitt
**/

function getRandInt(min, max) {
    return (Math.floor(Math.random() * (max - min) + min))
}

function glitch(canvas, amount) {

    var
        // cache the width and height of the canvas locally
        x, y, w = canvas.width, h = canvas.height,

        // _len is an iterator limit, initially storing the number of slices
        // to create
        i, _len = amount || 6,

        // pick a random amount to offset the color channel
        channelOffset = (getRandInt(-_len*2, _len*2) * w * + getRandInt(-_len, _len)) * 4,

        // the maximum amount to offset a chunk of the image is a function of its width
        maxOffset = _len * _len / 100 * w,

        // vars for the width and height of the chunk that gets offset
        chunkWidth, chunkHeight,

        // create a temporary canvas to hold the image we're working on
        tempCanvas = document.createElement("canvas"),
        tempCtx = tempCanvas.getContext("2d"),

        srcData, targetImageData, data

    // set the dimensions of the working canvas
    tempCanvas.width = w
    tempCanvas.height = h

    // draw the initial image onto the working canvas
    tempCtx.drawImage(canvas, 0, 0, w, h)

    // store the data of the original image for use when offsetting a channel
    srcData = tempCtx.getImageData(0, 0, w, h).data

    // randomly offset slices horizontally
    for (i = 0; i < _len; i++) {

        // pick a random y coordinate to slice at
        y = getRandInt(0, h)

        // pick a random height of the slice
        chunkHeight = Math.min(getRandInt(1, h / 4), h - y)

        // pick a random horizontal distance to offset the slice
        x = getRandInt(1, maxOffset)
        chunkWidth = w - x

        // draw the first chunk
        tempCtx.drawImage(canvas,
            0, y, chunkWidth, chunkHeight,
            x, y, chunkWidth, chunkHeight)

        // draw the rest
        tempCtx.drawImage(canvas,
            chunkWidth, y, x, chunkHeight,
            0, y, x, chunkHeight)
    }

    // get hold of the ImageData for the working image
    targetImageData = tempCtx.getImageData(0, 0, w, h)

    // and get a local reference to the rgba data array
    data = targetImageData.data

    // Copy a random color channel from the original image into
    // the working canvas, offsetting it by a random amount
    //
    // ImageData arrays are a single dimension array that contains
    // 4 values for each pixel.
    // so, by initializing `i` to a random number between 0 and 2,
    // and incrementing by 4 on each iteration, we can replace only
    // a single channel in the image
    for(i = getRandInt(0, 3), _len = srcData.length; i < _len; i += 4) {
        data[i+channelOffset] = srcData[i]
    }

    // Make the image brighter by doubling the rgb values
    for(i = 0; i < _len; i++) {
        data[i++] *= 2
        data[i++] *= 2
        data[i++] *= 2
    }

    // TODO: The above loops are the most costly in this function, iterating
    // over all the pixels in the image twice.
    // It maybe possible to optimize this by combining both loops into one,
    // and only processing every other line, as alternate lines are replaced
    // with black in the 'scan lines' block belop

    // copy the tweaked ImageData back into the context
    tempCtx.putImageData(targetImageData, 0, 0)

    // add scan lines
    // tempCtx.fillStyle = "rgb(0,0,0)"
    // for (i = 0; i < h; i += 2) {
    //     tempCtx.fillRect (0, i, w, 1)
    // }

    return tempCanvas

}

var img = new Image(),
    background = document.getElementById('background'),
    loaded = false,
    canvas = document.createElement('canvas'),
    ctx = canvas.getContext("2d"),
    glitches = []

img.src = window.BG
img.onload = function(){
    canvas.width = this.width
    canvas.height = this.height
    ctx.drawImage(img, 0, 0)
    for (var i = 0; i < 10; i++) {
        glitches.push('url('+ glitch(canvas,10).toDataURL("image/jpeg") +')')
    }
}

window.addEventListener('scroll', function(){
    var r = Math.round(Math.random()*20)
    if (r < 10) {
        background.style.backgroundImage = glitches[r]
    } else {
        background.style.backgroundImage = ''
    }
})
