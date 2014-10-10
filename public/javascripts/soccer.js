var $tiempo = $('#tiempo');
var $comando = $('#comando');
var $dirdesc = $('#direccion-desc');
/*  
  Arriba:       38  
  Abajo:        40
  Izquierda:    37
  Derecha:      39
*/

$(document).ready(function(){
  console.log("document ready.");
  window.io = io.connect();

  io.on('connect', function(){
    console.log('client -> hi');
    io.emit('hi');
  });

  io.on('hi server', function( data){
    console.log('My ID is ->', data.socketId);
  });
  
  $("#fwd").click( function(){
    $dirdesc.text('Adelante');
    $dirdesc.addClass('color-blue').removeClass('color-orange');
    io.emit('fwd',{tiempo: $tiempo.val()});
  });

  $("#left").click( function(){
    $dirdesc.text('Izquierda');
    $dirdesc.addClass('color-blue').removeClass('color-orange');
    io.emit('left',{tiempo: $tiempo.val()});
  });
  $("#stop").click( function(){
    $dirdesc.text('Parado!');
    $dirdesc.removeClass('color-blue').addClass('color-orange');
    io.emit('stop');
  });
  $("#right").click( function(){
    $dirdesc.text('Derecha');
    $dirdesc.addClass('color-blue').removeClass('color-orange');
    io.emit('right',{tiempo: $tiempo.val()});
  });
  $("#back").click( function(){
    $dirdesc.text('Atras');
    $dirdesc.addClass('color-blue').removeClass('color-orange');
    io.emit('back',{tiempo: $tiempo.val()});
  });

  $('#enviar-comando').click(function () {
     io.emit('comando',{tiempo: $tiempo.val(),comando: $comando.val()});
     $dirdesc.text('Se envio comando!');
    $dirdesc.addClass('color-blue').removeClass('color-orange');
  })

  $('#direccion').on( "keydown",function( event ) {
    switch(event.which){
      case 37:
        $('#left').trigger('click');
        break;
      case 38:
        $('#fwd').trigger('click');
        break;
      case 39:
        $('#right').trigger('click');
        break;
      case 40:
        $('#back').trigger('click');
        break;
      case 83:
        $('#stop').trigger('click');
        break;
    }
  });
});