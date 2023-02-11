function updateTextInput(val) {
    document.getElementById('textInput').value=val; 
  }

function updateTextInput1(val) {
    document.getElementById('textInput1').value=val; 
  }
  

window.onload= function(){
    x=100
    document.getElementById("filtrare").onclick=function(){
        var inpNume=document.getElementById("inp-nume").value.toLowerCase().trim();
        var inpCategorie=document.getElementById("inp-categorie").value;
        var inpMinPret=document.getElementById("inp-pret").value;
        var produse=document.getElementsByClassName("produs");
        var inpMaxPret=document.getElementById("inp-pret").value;


        y = parseInt(inpMinPret);
        z = parseInt(inpMaxPret);
        for (let produs of produse){
            var cond1=false, cond2=false, cond3=false, cond4=false;

            produs.style.display="none";
            let nume= produs.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase().trim();
            let categorie= produs.getElementsByClassName("val-categorie")[0].innerHTML;
            let pret= produs.getElementsByClassName("val-pret")[0].innerHTML;
            
            //verificam numele
            if(nume.includes(inpNume)){
                cond1=true;
            }
            
            if(inpCategorie=="toate" || categorie==inpCategorie){
                cond2=true;
            }
            x = parseInt(pret);
            
            if(x>y)
                {cond3=true;}

            if(cond1 && cond2 && cond3){
                produs.style.display="block";
            }
            
        }
        
    }

    document.getElementById("resetare").onclick=function(){
        //resteare produse
        var produse=document.getElementsByClassName("produs");
        for (let produs of produse){
            produs.style.display="block";
        }
        //resetare filtre
        document.getElementById("inp-nume").value="";
        document.getElementById("sel-toate").selected=true;

    }

    function sorteaza(semn){
        var produse=document.getElementsByClassName("produs");
        var v_produse=Array.from(produse);


        v_produse.sort(function(a,b){
            var pret_a=parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML);
            var pret_b=parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML);
            if(pret_a==pret_b){
                var nume_a=a.getElementsByClassName("val-nume")[0].innerHTML;
                var nume_b=b.getElementsByClassName("val-nume")[0].innerHTML;
                return semn*nume_a.localeCompare(nume_b);
            }
            return (pret_a-pret_b)*semn;
        })
        for (let produs of v_produse){
            produs.parentNode.appendChild(produs);
        }       
    }

    document.getElementById("sortCrescNume").onclick=function(){
        sorteaza(1);
    }
    document.getElementById("sortDescrescNume").onclick=function(){
        sorteaza(-1);
    }

}

window.onkeydown=function(e){
    console.log(e);
    if(e.key=='c' && e.altKey){
        var produse=document.getElementsByClassName("produs");
        let suma=0;
        for(let prod of produse){
            if (prod.style.display!="none")
                suma+=parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML)
        }
        if (!document.getElementById("rezultat")){
            rezultat=document.createElement("p");
            rezultat.id="rezultat";
            rezultat.innerHTML="<b>Pret total:</b> "+suma;
            //document.getElementById("produse").appendChild(rezultat);
            var ps=document.getElementById("p-suma");
            ps.parentNode.insertBefore(rezultat,ps.nextSibling);
            rezultat.style.border="1px solid purple";
            rezultat.onclick= function(){
                this.remove();
            }

            setTimeout(function (){
                document.getElementById("rezultat").remove();
            }, 2000);
        }
        //setInterval(function(){alert(1);}, 3000);
    }
}