/* global chrome */

(function(){
    var checkbox = document.querySelector("input[name=checkbox]");

    checkbox.addEventListener( 'change', function() {
        if(this.checked) {
            console.log("YESSS");
        } else {
            console.log("NOOO");
        }
    });
})();
