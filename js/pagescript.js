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
    if (active) window.addEventListener('mousedown', closeMenu);
    else window.removeEventListener('mousedown', closeMenu);
});

// Slideshow

let slideshows = document.getElementsByClassName('slideshow');
let activeSlideShows = [];

function setupSlideshow(show) {
    let context = this;

    // Slideshow variables
    this.slides = show.querySelectorAll('img');
    this.slideIndex = 0;
    this.currentSlide = show.querySelector('img:first-child');
    this.nextSlide = this.currentSlide.nextElementSibling;
    this.prevSlide = null;

    // Paging wrapper variable
    this.pagingWrapper = null;

    // Transition styling variable
    this.transition = '0.8s all cubic-bezier(0.72, 0, 0.24, 1)';

    // Change the slide to the new index    
    this.changeSlides = function() {
        this.currentSlide = this.slides[this.slideIndex];
        this.nextSlide = this.currentSlide.nextElementSibling != null && this.currentSlide.nextElementSibling.nodeName == 'IMG' ? this.currentSlide.nextElementSibling : null;
        this.prevSlide = this.currentSlide.previousElementSibling != null && this.currentSlide.previousElementSibling.nodeName == 'IMG' ? this.currentSlide.previousElementSibling : null;
        
        // Next slide is available
        if (this.nextSlide) {
            this.btnRight.addEventListener('click', this.goNextSlide);
            this.btnRight.classList.remove('hide');
        }
        // ... isn't available
        else {
            this.btnRight.classList.add('hide');
            this.btnRight.removeEventListener('click', this.goNextSlide);
        }
        // Previous slide is available
        if (this.prevSlide) {
            this.btnLeft.addEventListener('click', this.goPrevSlide);
            this.btnLeft.classList.remove('hide');
        }
        // ... isn't available
        else {
            this.btnLeft.classList.add('hide');
            this.btnLeft.removeEventListener('click', this.goPrevSlide);
        }

        // Move the current slide in view
        this.currentSlide.style.transition = this.transition;
        window.requestAnimationFrame(() => {
            this.currentSlide.style.marginLeft = null;
            this.currentSlide.style.position = 'relative';
        });

        // Move the other slides out of view
        this.slides.forEach((el, x) => {
            if (x != this.slideIndex) {
                // The next slides
                if (x > this.slideIndex) {
                    el.style.transition = this.transition;
                    window.requestAnimationFrame(() => { 
                        el.style.marginLeft = '100%';
                        el.style.position = 'absolute';
                    });
                }
                // The previous slides
                else {
                    el.style.transition = this.transition;
                    window.requestAnimationFrame(() => { 
                        el.style.marginLeft = '-100%';
                        el.style.position = 'absolute';
                    });
                }
            }
        });

        context.pagingWrapper.querySelector('.paging-pages.select').style.left = 15 * context.slideIndex + 'px';
    }

    // Goto the next available slide
    this.goNextSlide = function(e) {
        ++context.slideIndex;
        context.changeSlides();
    }

    // Goto the previous available slide
    this.goPrevSlide = function(e) {
        --context.slideIndex;
        context.changeSlides();
    }

    // Goto index of slide
    this.goSlide = function(slide) {
        if (slide > this.slides.length) {
            console.log('Slide number too large!', this);
        }
        else {
            context.slideIndex = slide;
            context.changeSlides();
        }
    }

    // Setup
    this.activate = function() {
        if (this.slides.length > 2) {
            // Creating slideshow buttons
            show.insertAdjacentHTML('afterBegin', '<div class="right">></div><div class="left"><</div>');
    
            // Saving slideshow buttons in variables
            this.btnRight = show.querySelector('.right');
            this.btnLeft = show.querySelector('.left');
    
            // Hiding the previous button from start
            this.btnLeft.classList.add('hide');
    
            // Creating paging wrapper
            show.insertAdjacentHTML('afterBegin', '<div class="paging"></div>');
    
            // Saving paging wrapper
            this.pagingWrapper = show.querySelector('.paging');
    
            this.slides.forEach((el, i) => {
    
                // Setting up the next slides in position
                if (el != context.currentSlide) {
                    el.style.marginLeft = '100%';
                    el.style.position = 'absolute';
                }
    
                // Creating slide paging inside the paging wrapper
                this.pagingWrapper.insertAdjacentHTML('beforeend', `<div class='paging-pages' id='${i}'></div>`);
            });
    
            // Creating the activity dot that indicates what slide is showing
            this.pagingWrapper.insertAdjacentHTML('beforeend', `<div class='paging-pages select' style='transition: ${context.transition};'></div>`)
    
            // Adding click events to the left/right buttons
            this.btnRight.addEventListener('click', this.goNextSlide);
            this.btnLeft.addEventListener('click', this.goPrevSlide);
    
            // Adding click events to the paging buttons
            this.pagingWrapper.querySelectorAll('.paging-pages:not(.select)').forEach((el, i) => {
                el.addEventListener('click', (e) => { context.goSlide(i); });
            });
        }
        else {
            console.log('Not enough "<img>" elements to activate slideshow (Minimum 2)')
        }
    }
}

// Loop to create the slideshows on the page
for (i = 0; i < slideshows.length; i++) {
    let slideshow = slideshows[i];
    activeSlideShows.push(new setupSlideshow(slideshow));
    activeSlideShows[i].activate();
}