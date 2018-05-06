// remove hash when it's empty
window.onhashchange = function(){
    if (location.hash === '') {
        history.replaceState('', document.title, location.pathname + location.search);
    }
}

// display current section
var navitems = document.querySelectorAll('.nav li a'),
    anchors = document.querySelectorAll('.anchor'),
    positions = [],
    debounce

function offset(element) {
    var y = 0
    if (element) {
        do {
            if (!isNaN(element.offsetTop)) {
                y += element.offsetTop - element.scrollTop
            }
        } while (element = element.offsetParent)
    }
    return y
}

function checkPositions() {
    anchors.forEach(function(a, i){
        positions[i] = offset(a)
    })
}

function checkScroll() {
    var nearest, bestScore = Infinity

    anchors.forEach(function(a, i){
        var y = positions[i] - document.documentElement.scrollTop,
            score = Math.abs(y)
        if (score <= bestScore && y - window.innerHeight < 0) {
            bestScore = score
            nearest = a
        }
    })

    navitems.forEach(function(a, i){
        a.classList.toggle('on', nearest && nearest.getAttribute('data-anchor') == i)
    })
}

window.addEventListener('load', checkPositions)
window.addEventListener('scroll', checkScroll)
document.querySelectorAll('.gate').forEach(function(a){
    a.addEventListener('change', function(){checkPositions()})
})

// init
checkPositions()
checkScroll()
