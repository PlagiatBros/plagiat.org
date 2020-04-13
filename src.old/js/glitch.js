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

function glitch(canvas, slices, amount, horizontalOffset, colorOffset) {

    var
        // cache the width and height of the canvas locally
        x, y, w = canvas.width, h = canvas.height,

        // _len is an iterator limit, initially storing the number of slices
        // to create
        i, _len = amount || 6,
        slices = slices || 6,

        // pick a random amount to offset the color channel
        colorOffset = colorOffset || _len,
        channelOffset = (getRandInt(-colorOffset*2, colorOffset*2) * w * + getRandInt(-colorOffset, colorOffset)) * 4,

        // the maximum amount to offset a chunk of the image is a function of its width
        maxOffset = (horizontalOffset || _len) / 100 * w,

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
    for (i = 0; i < slices; i++) {

        // pick a random y coordinate to slice at
        y = getRandInt(0, h)

        // pick a random height of the slice
        chunkHeight = Math.min(getRandInt(1, h / slices), h - y)

        // pick a random horizontal distance to offset the slice
        x = getRandInt(-maxOffset, maxOffset)
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

    // copy the tweaked ImageData back into the context
    tempCtx.putImageData(targetImageData, 0, 0)

    return tempCanvas

}

var N_GLITCHES = 10,
    N_SLICES = 10

var glitchTimeout,
    glitchInterval,
    container = document.getElementById('glitch'),
    x = 0, i = 0,
    glitches = [],
    glitching = false,
    glitchAmount = 0.18,
    screenshot

function waitForGlitch(){
    disableGlitch()
    glitchTimeout = setTimeout(function(){
        enableGlitch()
    },10000)
}
function enableGlitch(){
    glitching = true
    var main = document.getElementById('main')
    html2canvas(main, {backgroundColor: null, scale: 1, logging: true}).then(function(canvas) {
        if (!glitching) return
        screenshot = document.createElement('canvas')
        var ctx = screenshot.getContext('2d')
        screenshot.width = main.offsetWidth
        screenshot.height = window.innerHeight
        ctx.drawImage(canvas, 0, document.documentElement.scrollTop, screenshot.width, screenshot.height, 0, 0, screenshot.width, screenshot.height)

        for (var i = 0; i < N_GLITCHES; i++) {
            var glitched = glitch(screenshot, N_SLICES)
            glitches.push(glitched)
            container.appendChild(glitched)
        }
        glitchLoop()
    })
}
function glitchLoop(){
    glitchInterval = setInterval(function(){
        glitches[x % (glitches.length-1)].classList.remove('show')
        x = Math.round(Math.random() * N_GLITCHES)
        if (Math.random() < glitchAmount) glitches[x % (glitches.length-1)].classList.add('show')
        i++
        if (i == 40) {
            i = 0
            var glitched = glitch(screenshot, N_SLICES)
            var del = glitches[(x - 1) % (glitches.length-1)]
            container.removeChild(del)
            container.appendChild(glitched)
            glitches[(x - 1) % (glitches.length-1)] = glitched
        }
    }, 50)
}
function disableGlitch(){
    glitchTimeout = clearTimeout(glitchTimeout)
    glitchInterval = clearInterval(glitchInterval)
    if (glitching) {
        glitching = false
        container.innerHTML = ''
        glitches = []
    }
}

waitForGlitch()
window.addEventListener('scroll', waitForGlitch)
window.addEventListener('resize', waitForGlitch)
document.addEventListener('mousemove', waitForGlitch)
document.addEventListener('touchstart', waitForGlitch)
