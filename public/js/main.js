const responsive = {
    0 : {
        items : 1
    },
    320 : {
        items : 1
    },
    560 : {
        items : 2
    },
    960 : {
        items : 3
    }
}
//Sticky navbar : 

$(window).scroll(function(){
    if($(this).scrollTop() > 100){
        $('.nav').addClass('sticky')
    } else{
        $('.nav').removeClass('sticky')
    }
});



$(document).ready(function(){
    $nav = $(".nav");
    $toggleCollapse = $('.toggle-collapse');
    
    /**click event on toggle class*/
    $toggleCollapse.click(function(){
        $nav.toggleClass('collapse');
    })
    $(".owl-carousel").owlCarousel({
        loop : true,
        autoplay : false,
        autoplayTimeout : 3000,
        dots : false,
        nav:true,
        responsive : responsive,
        navText : [$(".owl-navigation .owl-nav-prev"), $(".owl-navigation .owl-nav-next")]
    });
  
}); //end of the document 

//Scroll up to the upper section
$(".move-up span").click(function (){
    $("html, body").animate({
        scrollTop : 0
    },1000);
})
//comeback later
$("#contact-link").click(function(){
    $("#contact-link").toggleClass("current");
})
//Adding loader to the pages 
setTimeout(function(){
    $(".loader_bg").fadeToggle();
}, 2000);

//blur background on input click
//$(".input-box").click(function(){
//    $(".add-book-bg-image").toggleClass("blur-effect");
//})