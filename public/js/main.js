$(window).scroll(function(){
    if($(this).scrollTop() > 800){
      $("nav").addClass("sticky-top")
    $("nav").css("transition", "all 1s ease")    
      $("nav").css("background-color", "#181818b0")
    }else{
      $("nav").removeClass("sticky-top")
      $("nav").css("background-color", "transparent")
    }
  })