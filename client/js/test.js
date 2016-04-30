function test(){
    // Selectoren
    var idInput = document.getElementById("id");
    var button1 = document.getElementById("1");
    var button2 = document.getElementById("2");
    var button3 = document.getElementById("3");
    var button4 = document.getElementById("4");
    var button5 = document.getElementById("5");
    var button6 = document.getElementById("6");
    var button7 = document.getElementById("7");
    var button8 = document.getElementById("8");
    var button9 = document.getElementById("9");
    var button10 = document.getElementById("0");
    var buttonc = document.getElementById("c");
    var buttoncall = document.getElementById("call");
    var connectButton = document.getElementById("connect");

    //ContentSelector
    var inputSection = document.getElementById("inputSection");
    var questionSection = document.getElementById("questionSection");

    button1.addEventListener("click",addDigit);
    button2.addEventListener("click",addDigit);
    button3.addEventListener("click",addDigit);
    button4.addEventListener("click",addDigit);
    button5.addEventListener("click",addDigit);
    button6.addEventListener("click",addDigit);
    button7.addEventListener("click",addDigit);
    button8.addEventListener("click",addDigit);
    button9.addEventListener("click",addDigit);
    button10.addEventListener("click",addDigit);
    buttonc.addEventListener("click",addDigit);
    buttoncall.addEventListener("click",addDigit);

    connectButton.addEventListener("click",initialize);

    function addDigit(event){
        var source = event.target || event.srcElement;
        var id = source.id;
        if(id == "1"){
            idInput.value += "1";
        }else if(id == "2"){
            idInput.value += "2";
        }else if(id == "3"){
            idInput.value += "3";
        }else if(id == "4"){
            idInput.value += "4";
        }else if(id == "5"){
            idInput.value += "5";
        }else if(id == "6"){
            idInput.value += "6";
        }else if(id == "7"){
            idInput.value += "7";
        }else if(id == "8"){
            idInput.value += "8";
        }else if(id == "9"){
            idInput.value += "9";
        }else if(id == "0"){
            idInput.value += "0";
        }else if(id == "c"){
            var len = idInput.value.length;
            console.log(len);
            if(len > 0){

                idInput.value= idInput.value.slice(0,-1);
            }
        }else if(id == "call"){
            idInput.value ="";
            idInput.setAttribute("placeholder","Screen ID eingeben");
        }
    }

    function initialize(){
        inputSection.style.height = "0 px";
        inputSection.style.display = "none";
        questionSection.style.display = "inline";
        //questionSection.style.visibility = "visible";
    }



/*
     function resize () {
        if (window.orientation == -90) {
            document.getElementById('test').className = 'orientright';
            //alert(document.getElementById('orient').className);
        }
        if (window.orientation == 90) {
            document.getElementById('test').className = 'orientleft';
        }
        if (window.orientation == 0) {
            document.getElementById('test').className = '';
        }
    };*/


        screen.orientation.lock('portrait').catch(function() {
            console.log('desktop');
        });
    /*
    window.addEventListener('orientationchange', resize, false);
    //window.addEventListener('resize', resize, false);
    */
}