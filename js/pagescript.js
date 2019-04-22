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
container.addEventListener('scroll', (e)=>{activateLinks(links, container)});
