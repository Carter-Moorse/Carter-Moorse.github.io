// Auto page indexing

let links = document.getElementsByClassName('profile-links')[0];
let container = document.getElementsByClassName('right')[0];

function inView(element, link) {
    let windowHeight = window.innerHeight;
    let sizing = element.getBoundingClientRect();
    let bottom = sizing.top + sizing.height;

    if (bottom < windowHeight && bottom > 0) {
        link.classList.add('active');
    }
    else {
        if (link.classList.contains('active')) link.classList.remove('active');
    }
}

function activateLinks(linkWrapper, search){
    linkWrapper.querySelectorAll('a').forEach((e)=>{
        let id = e.getAttribute('href');
        inView(search.querySelector(id), e);
    });
}

activateLinks(links, container);

window.addEventListener('resize', (e)=>{activateLinks(links, container)});
window.addEventListener('scroll', (e)=>{activateLinks(links, container)});

// Hamburger menu button

let btn = document.getElementById('menu-button');
let leftContainer = document.getElementsByClassName('left')[0];
let active = false;

function hasParent(child, expectedParent) {
    let node = child.parentNode;
    while (node != null) {
        if (node == expectedParent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

function closeMenu(e) {
    let profileContainer = leftContainer.querySelector('.profile');
    if (event.button = 1 && !(hasParent(event.target, profileContainer) || event.target == profileContainer)) {
        if (!(hasParent(event.target, btn) || event.target == btn)) {
            btn.classList.remove('close');
            leftContainer.classList.remove('active');
            active = false;
        }
    }
}

btn.addEventListener('click', (e)=>{
    e.currentTarget.classList.toggle('close');
    leftContainer.classList.toggle('active');
    active = active ? false : true;
    // console.log(active);
    if (active) window.addEventListener('mousedown', closeMenu);
    else window.removeEventListener('mousedown', closeMenu);
});

// Slideshow

// let slideshows = document.getElementsByClassName('slideshow');
// let activeSlideShows = [];

// function setupSlideshow(show) {
//     let context = this;

//     this.currentSlide = show.querySelector('img:first-child');
//     this.nextSlide = this.currentSlide.nextElementSibling;
//     this.prevSlide = null;
//     this.setSlides = function() {
//         this.currentSlide.style.marginLeft = null;
//         if (this.nextSlide) {
//             this.btnRight.classList.remove('hide');
//             this.nextSlide.style.marginLeft = '100%';
//         }
//         else this.btnRight.classList.add('hide');
//         if (this.prevSlide) {
//             this.btnLeft.classList.remove('hide');
//             this.prevSlide.style.marginLeft = '-100%';
//         }
//         else this.btnLeft.classList.add('hide');
//     }
//     this.slide = function(el) {
//         if (el != null) {
//             this.currentSlide = el;
//             this.nextSlide = el.nextElementSibling != null && el.nextElementSibling.nodeName == 'IMG' ? el.nextElementSibling : null;
//             this.prevSlide = el.previousElementSibling != null && el.previousElementSibling.nodeName == 'IMG' ? el.previousElementSibling : null;
//             this.setSlides();
//         }
//     }

//     // Setup
//     if (show.childNodes.length > 3) {
//         show.insertAdjacentHTML('afterBegin', '<div class="right">></div><div class="left"><</div>');

//         //Buttons
//         this.btnRight = show.querySelector('.right');
//         this.btnLeft = show.querySelector('.left');

//         this.btnLeft.classList.add('hide');

//         this.btnRight.addEventListener('click', this.btnClickRight = ()=>   {context.slide(context.nextSlide);});
//         this.btnLeft.addEventListener('click', this.btnClickLeft = ()=>     {context.slide(context.prevSlide);});
//     }
// }

// for (i = 0; i < slideshows.length; i++) {
//     let slideshow = slideshows[i];
//     activeSlideShows.push(new setupSlideshow(slideshow));
// }