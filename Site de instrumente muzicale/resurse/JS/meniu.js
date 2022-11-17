$(document).ready(function() {
    // Remove the class of child and grandchild
    // This removes the CSS 'falback'
    $("#nav ul.child").removeClass("child");
    $("#nav ul.grandchild").removeClass("grandchild");

    // When a list item that contains an unordered list
    // is hovered on
    $("#nav li")
        .has("ul")
        .hover(
            function() {
                //Add a class of current and fade in the sub-menu
                $(this)
                    .addClass("current")
                    .children("ul")
                    .fadeIn();
            },
            function() {
                // On mouse off remove the class of current
                // Stop any sub-menu animation and set its display to none
                $(this)
                    .removeClass("current")
                    .children("ul")
                    .stop(true, true)
                    .css("display", "none");
            }
        );
});