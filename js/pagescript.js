var buttonContainer = document.getElementById("button-container");
var buttons = [
    document.getElementById("about"), 
    document.getElementById("projects"), 
    document.getElementById("contact")
];
var main = document.getElementById("main");
var email = document.getElementById("email");

function changeSelection(index, type){
    buttons.forEach(function(element){
        element.setAttribute("selected", "false")
    })
    buttons[index].setAttribute("selected", type)
}
function isSelected(){
    buttons.forEach(function(element){
        if(element.getAttribute("selected") == "true"){
            element.style.background = "rgba(255, 255, 255, 0.3)";
        }
        else {
            element.style.background = "rgba(255, 255, 255, 0)";
        }
    });
}

window.onload = function(){
    isSelected();
    buttons[0].addEventListener("click", function(){
        changeSelection(0, "true");
        isSelected();});
    buttons[1].addEventListener("click", function(){
        changeSelection(1, "true");
        isSelected();});
    buttons[2].addEventListener("click", function(){
        changeSelection(2, "true");
        isSelected();});
    email.addEventListener("click", function(){
        document.getElementById("emailtooltip").innerHTML = "Copied!";
    });
    main.addEventListener("scroll", function(){
        if (main.scrollTop > 0 && main.scrollTop <= 400) {
            changeSelection(0, "true");
            isSelected();
        }
        else if (main.scrollTop > 800 && main.scrollTop <= 1400){
            changeSelection(1, "true");
            isSelected();
        }
        else if (main.scrollTop > 1450){
            changeSelection(2, "true");
            isSelected();
        }
    });
};
