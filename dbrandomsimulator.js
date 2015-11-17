exports.gibMirFragen = function(anzahl){
    var fragen = [
        ["Wie heisst Karo mit Nachnamen?","Bergmann","Zwergmann","Maro","Swinjuschka"],
        ["Wann wurde die Finkenau 100 Jahre alt?","2014","2020","1950","200BC"],
        ["Wieviele Ecken hat ein Wuerfel?","4","8","keine","42"],
        ["Hummel hummel! -> .... .....","Mors mors","Biene Maja","Hau ab!","Gern geschehen"],
        ["Nenne die naechste Zahl: 256 512 1024 2048","4096","1920","42","Pi"],
        ["Welche Farbe entspricht 00FF00 in RGB?","Gelb","Gruen","Blau","Rot"],
        ["Binary: 101 + 101 =  ?","1010","111","1000","42"],
        ["Wie heisst ein wichtiger Gegenstand in der Filmindustrie?","McGuffin","Geld","Schatz","Genre"]
    ]

    var Fragen = [];

    for (var i = 0; i<anzahl; i++){

        Fragen.push(fragen[i]);

    }
    console.log(fragen);
    console.log(Fragen);
    return Fragen;
}
