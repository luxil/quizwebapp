exports.init = function(){
  var counter = 50;
  function logic(){
    if (counter <= 0){
        counter = 50;
    }
    counter -= 1;
    console.log(counter);
  };
  var interval = setInterval(logic,1000);
};