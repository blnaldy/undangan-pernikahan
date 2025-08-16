/*!
 * Firefly jQuery Plugin
 * Creates animated firefly effects
 * Version: 0.3
 */
!function(e){e.fn.firefly=function(t){function n(){var t=e("<div>").addClass("firefly").css({position:"absolute",width:r.width+"px",height:r.height+"px","background-color":r.color,"border-radius":"50%",opacity:Math.random(),"z-index":r.zIndex,top:Math.random()*i.height()+"px",left:Math.random()*i.width()+"px"});return t}function o(){var t=n();i.append(t),a(t)}function a(e){var t=Math.random()*i.width(),n=Math.random()*i.height(),o=Math.random()*r.speed+r.speed;e.animate({top:n+"px",left:t+"px",opacity:Math.random()},o,function(){a(e)})}var r=e.extend({color:"#00ff00",width:10,height:10,speed:2e3,zIndex:999,total:10},t),i=this;return this.each(function(){for(var e=0;e<r.total;e++)setTimeout(o,e*r.speed/r.total)})}}(jQuery);

// Usage example:
// $('body').firefly({
//   color: '#FFCAD4',
//   width: 8,
//   height: 8,
//   speed: 3000,
//   total: 15
// });
