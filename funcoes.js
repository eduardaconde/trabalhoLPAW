var canvas = document.getElementById('exemplo');

var vidas = 1; //número de vidas do personagem
var pontos= 0; //pontuação
var level = 1; // nível 

// Se o contexto do canvas for capturado..
if (canvas.getContext) {
    //será capturado o contexto '2d'
    var context = canvas.getContext('2d');
    
    var w = 100; // largura do personagem
    var h = 109; // altura do personagem
    var x = 0; // ponto no eixo x onde começa o personagem
    var y = 600 - h; //ponto no eixo y onde começa o personagem
    
    var wMorte = 120; //largura do personagem morto
    var hMorte = 100; //altura do personagem morto
    var xMorte = 0; // ponto no eixo x onde começa o personagem morto
    var yMorte = 600 - hMorte; // ponto no eixo y onde começa o personagem morto
    
    var xMaca = 0; // ponto no eixo x onde começa as maçãs
    var yMaca = 0; // ponto no eixo y onde começa as maçãs
    var wMacaVerm = 50; //largura da maçã vermelha
    var hMacaVerm = 50; //altura da maçã vermelha
    var wMacaVerd = 50; //largura da maçã verde
    var hMacaVerd = 60; //altura da maçã verde
    var velocidadeMacaVerm = 5; // velocidade da maçã vermelha
    var velocidadeMacaVerde = 7; // velocidade da maçã verde
    var probMacaVermelha = 70; // probabilidade de maçãs vermelhas
    var contadorLevel = 0; // contador do nível
    var imgDirAtual = 0; // imagem atual a direita
    var imgEsqAtual = 0; // imagem atual a esquerda
    var listaImagensCaminharDireita = []; // array com as imagens do personagem caminhando a direita
    var listaImagensCaminharEsquerda = []; // array com as imagens do personagem caminhando a esquerda
    var listaImagensMorteDireita = []; // array com as imagens do personagem morto para a direita
    var listaImagensMorteEsquerda = []; // array com as imagens do personagem morto para a esquerda
    var macas = []; // array com as imagens das maçãs
    var direcaoAtual = 0; //0 = direita , 1 = esquerda.
    var cMorte = 0; // contador que indica a imagem do personagem morto atual
    var morte=false; // flag para indicar morte 
    var audioLigado = true; // flag para indicar a situação do audio de fundo
    var audioMorreu = new Audio(); 
    audioMorreu.src = "audios/morreu.mp3"; // audio da morte
    var audioColeta = new Audio(); 
    audioColeta.src = "audios/coleta.mp3"; // audio da coleta das maçãs
    var audioFundo = new Audio();
    audioFundo.src = "audios/musica.mp3"; // audio da música de fundos
    document.getElementById('info').innerHTML = 'Pontos: '+pontos+'&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Nível: '+level+'&emsp;&emsp;&emsp;&emsp;&emsp;Vidas: '+vidas; // coloca a pontuação, nível e vidas do personagem no elemento html pego pelo id do mesmo
    
   
    if (audioLigado) {// se a variavel for true, coloca o audio de fundo 
        audioFundo.play();
    }
    // faz a animação do personagem andando para a direita
    function animateDireita() {
        imgEsqAtual = 0;
        direcaoAtual = 0;
        context.clearRect(x-15, y, w+5, h);
        desenhaPersonagemDireita();

    }
    // faz a animação do personagem andando para a esquerda
    function animateEsquerda() {
        imgDirAtual = 0;
        direcaoAtual = 1;
        context.clearRect(x, y, w+15, h);
        desenhaPersonagemEsquerda();

    }
    // desenha maçãs em pontos aleatórios
    function criaMaca() {

        if(morte)  // verifica se o personagem morreu, para não haver mais movimento
            return;
        context.clearRect(0, 0, canvas.width, canvas.height - h);
        var corMaca = Math.random() * 100;
        yMaca = 0;
        xMaca = Math.random() * (580 - 30) + 30;
        if (corMaca > 30) {
            desenhaMacaVermelha();
            yMaca++;
            if (yMaca < y - hMacaVerm) {
                ret = requestAnimationFrame(animateMacaVermelha);
            } else if (xMaca + wMacaVerm >= x) {
                cancelAnimationFrame(ret);
                context.clearRect(0, 0, canvas.width, canvas.height - h);
            }
        } else {
            desenhaMacaVerde();
            yMaca++;
            if (yMaca < y - hMacaVerd) {
                ret = requestAnimationFrame(animateMacaVerde);
            } else if (xMaca + wMacaVerm >= x) {
                cancelAnimationFrame(ret);
                context.clearRect(0, 0, canvas.width, canvas.height - h);
            }
        }

    }
    // faz a animação das maçãs vermelhas caindo
    function animateMacaVermelha() {

        context.clearRect(xMaca, yMaca - velocidadeMacaVerm, wMacaVerm, hMacaVerm);
        var corMaca = Math.random() * 100;

        desenhaMacaVermelha();

        yMaca = yMaca + velocidadeMacaVerm;
        if( yMaca > canvas.height){
            cancelAnimationFrame(ret);
            context.clearRect(0, 0, canvas.width, canvas.height); 
            
            if(vidas>0){
               vidas--; 
            }
            else{
                cMorte = 0;
                animateMorte();
                
            }
                
            document.getElementById('info').innerHTML = 'Pontos: '+pontos+'&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Nível: '+level+'&emsp;&emsp;&emsp;&emsp;&emsp;Vidas: '+vidas;
           
            
            if (direcaoAtual == 0) {
                if (imgDirAtual > 0)
                    context.drawImage(listaImagensCaminharDireita[imgDirAtual - 1], x, y, w, h);
                else
                    context.drawImage(listaImagensCaminharDireita[5], x, y, w, h);
            } else if (direcaoAtual == 1) {
                if (imgEsqAtual > 0)
                    context.drawImage(listaImagensCaminharEsquerda[imgEsqAtual - 1], x, y, w, h);
                else
                    context.drawImage(listaImagensCaminharEsquerda[5], x, y, w, h);
            }

        }else if (yMaca < (y - hMacaVerm + 15)|| xMaca > (x + w - 10) || (xMaca + wMacaVerm) < (x+15) ) {
            ret = requestAnimationFrame(animateMacaVermelha);    
        } else {
            cancelAnimationFrame(ret);
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            audioColeta.play();
            pontos=pontos+5;
            contadorLevel=contadorLevel+5;
            determinaLevel();
            document.getElementById('info').innerHTML = 'Pontos: '+pontos+'&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Nível: '+level+'&emsp;&emsp;&emsp;&emsp;&emsp;Vidas: '+vidas;
            
            if (direcaoAtual == 0) {
                if (imgDirAtual > 0)
                    context.drawImage(listaImagensCaminharDireita[imgDirAtual - 1], x, y, w, h);
                else
                    context.drawImage(listaImagensCaminharDireita[5], x, y, w, h);
            } else if (direcaoAtual == 1) {
                if (imgEsqAtual > 0)
                    context.drawImage(listaImagensCaminharEsquerda[imgEsqAtual - 1], x, y, w, h);
                else
                    context.drawImage(listaImagensCaminharEsquerda[5], x, y, w, h);
            }

        }
    }
    //  faz a animação das maçãs verdes caindo
    function animateMacaVerde() {

        context.clearRect(xMaca, yMaca - velocidadeMacaVerde, wMacaVerd, hMacaVerd);
        var corMaca = Math.random() * 100;

        desenhaMacaVerde();

        yMaca = yMaca + velocidadeMacaVerde; 
        if( yMaca > canvas.height){
            cancelAnimationFrame(ret);
            context.clearRect(0, 0, canvas.width, canvas.height);
            
             if(vidas>0){
               vidas--; 
            }
            else{
                cMorte = 0;
                animateMorte();
                
            }
            document.getElementById('info').innerHTML = 'Pontos: '+pontos+'&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Level: '+level+'&emsp;&emsp;&emsp;&emsp;&emsp;Vidas: '+vidas;
            
            if (direcaoAtual == 0) {
                if (imgDirAtual > 0)
                    context.drawImage(listaImagensCaminharDireita[imgDirAtual - 1], x, y, w, h);
                else
                    context.drawImage(listaImagensCaminharDireita[5], x, y, w, h);
            } else if (direcaoAtual == 1) {
                if (imgEsqAtual > 0)
                    context.drawImage(listaImagensCaminharEsquerda[imgEsqAtual - 1], x, y, w, h);
                else
                    context.drawImage(listaImagensCaminharEsquerda[5], x, y, w, h);
            }

        }else if (yMaca < (y - hMacaVerd+15) || xMaca > (x + w - 10) || (xMaca + wMacaVerd) < (x+15) ) {
            ret = requestAnimationFrame(animateMacaVerde);
        } else {
            cancelAnimationFrame(ret);
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            audioColeta.play();
            pontos=pontos+10;
            contadorLevel=contadorLevel+10;
            determinaLevel();
            document.getElementById('info').innerHTML = 'Pontos: '+pontos+'&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Level: '+level+'&emsp;&emsp;&emsp;&emsp;&emsp;Vidas: '+vidas;
            
            if (direcaoAtual == 0) {
                if (imgDirAtual > 0)
                    context.drawImage(listaImagensCaminharDireita[imgDirAtual - 1], x, y, w, h);
                else
                    context.drawImage(listaImagensCaminharDireita[5], x, y, w, h);
            } else if (direcaoAtual == 1) {
                if (imgEsqAtual > 0)
                    context.drawImage(listaImagensCaminharEsquerda[imgEsqAtual - 1], x, y, w, h);
                else
                    context.drawImage(listaImagensCaminharEsquerda[5], x, y, w, h);
            }
        }
    }
    // faz a animação da morte do personagem
	function animateMorte(){
        morte = true;
		context.clearRect(0, 0, canvas.width, canvas.height);
        if(direcaoAtual == 0){
        context.drawImage(listaImagensMorteDireita[cMorte], x, y, wMorte, hMorte);
        cMorte = cMorte + 1;
		ret = requestAnimationFrame(animateMorte);
            if (cMorte > 7){
                cancelAnimationFrame(ret);
                context.clearRect(0, 0, canvas.width, canvas.height-h);
                textoFinal();
            }
        } 
        else{
            context.drawImage(listaImagensMorteEsquerda[cMorte], x, y, wMorte, hMorte);
        cMorte = cMorte + 1;
		ret = requestAnimationFrame(animateMorte);
            if (cMorte > 7){
                cancelAnimationFrame(ret);
                context.clearRect(0, 0, canvas.width, canvas.height-h);
                textoFinal();
        }
        }
	}
    // Escreve as informações finais, quando o personagem morre
    function textoFinal(){
        context.font = "30px Cursive";
        context.fillStyle = "#572925";
        context.fillText("VOCÊ MORREU!",canvas.width - 550,100);
        
        
        setTimeout(function(){
            context.font = "30px Cursive";
            context.fillStyle = "#6bd7a6";    
		    context.fillText("PONTUAÇÃO:"+pontos,canvas.width - 550,150);
            audioFundo.pause();
            audioMorreu.play();
            
	}, 1000);
        

    }
    // desenha o personagem para a direita
    function desenhaPersonagemDireita() {

        context.drawImage(listaImagensCaminharDireita[imgDirAtual], x, y, w, h);

        imgDirAtual++;
        if (imgDirAtual == 6)
            imgDirAtual = 0;
    }
    // desenha o personagem para a esquerda
    function desenhaPersonagemEsquerda() {

        context.drawImage(listaImagensCaminharEsquerda[imgEsqAtual], x, y, w, h);

        imgEsqAtual++;
        if (imgEsqAtual == 6)
            imgEsqAtual = 0;
    }
    // desenha as maçãs vermelhas
    function desenhaMacaVermelha() {
        //xMaca = Math.random() * (580-30) + 30 ;

        context.drawImage(macas[0], xMaca, yMaca, wMacaVerm, hMacaVerm);

    }
    // desenha as maçãs verdes
    function desenhaMacaVerde() {
        //xMaca = Math.random() * (580-30) + 30 ;

        context.drawImage(macas[1], xMaca, yMaca, wMacaVerd, hMacaVerd);

    }
    // determina o nível que está
    function determinaLevel(){
        
        if(contadorLevel >= 30){
            contadorLevel = contadorLevel-30;
            level++;
            velocidadeMacaVerm++;
            velocidadeMacaVerde++;
            if(probMacaVermelha < 84)
                probMacaVermelha++;
        }
    }
    // faz o pré carregamento de todas as imagens da personagem a direita
    function preCarregaImagens_Dir() {
        
         for(var i = 0; i < arguments.length; i++){
            listaImagensCaminharDireita[i] = new Image();
            listaImagensCaminharDireita[i].src = preCarregaImagens_Dir.arguments[i];
        }
    }
    // faz o pré carregamento de todas as imagens da personagem a esquerda
    function preCarregaImagens_Esq() {
        
         for(var i = 0; i < arguments.length; i++){
            listaImagensCaminharEsquerda[i] = new Image();
            listaImagensCaminharEsquerda[i].src = preCarregaImagens_Esq.arguments[i];
        }
    }
    // faz o pré carregamento de todas as imagens de maçãs/ vermelha e verde
    function preCarregaMacas(){
         for(var i = 0; i < arguments.length; i++){
            macas[i] = new Image();
            macas[i].src = preCarregaMacas.arguments[i];
        }
    }
    // faz o pré carregamento de todas as imagens da personagem morrendo a direita
    function preCarregaMorte_Dir(){
         for(var i = 0; i < arguments.length; i++){
            listaImagensMorteDireita[i] = new Image();
            listaImagensMorteDireita[i].src = preCarregaMorte_Dir.arguments[i];
        }
    }
    // faz o pré carregamento de todas as imagens da personagem morrendo a esquerda
    function preCarregaMorte_Esq(){
         for(var i = 0; i < arguments.length; i++){
            listaImagensMorteEsquerda[i] = new Image();
            listaImagensMorteEsquerda[i].src = preCarregaMorte_Esq.arguments[i];
        }
    }
    // função para desligar e ligar a música de fundo
    function ligaDesligaMusica(){
        if(audioLigado){
            audioFundo.pause();
            audioLigado = false;
        }
        else{
            audioFundo.play();
            audioLigado = true;   
        }
    }


    // Imagens do personagem caminhando a direita colocadas como argumento da função de carregamento
    preCarregaImagens_Dir("png/caminharD/direita1.png",
                          "png/caminharD/direita2.png",
                          "png/caminharD/direita3.png",
                          "png/caminharD/direita4.png",
                          "png/caminharD/direita5.png",
                          "png/caminharD/direita6.png"
                         );
    // Imagens do personagem caminhando a esquerda colocadas como argumento da função de carregamento
     preCarregaImagens_Esq("png/caminharE/esquerda1.png",
                          "png/caminharE/esquerda2.png",
                          "png/caminharE/esquerda3.png",
                          "png/caminharE/esquerda4.png",
                          "png/caminharE/esquerda5.png",
                          "png/caminharE/esquerda6.png"
                         );
    // Imagens das maçãs colocadas como argumento da função de carregamento
    preCarregaMacas("png/macaVermelha.png",
                   "png/macaVerde.png"
                   );
    // Imagens do personagem morrendo a direita colocadas como argumento da função de carregamento
    preCarregaMorte_Dir("png/morteD/morte1.png",
                        "png/morteD/morte2.png",
                        "png/morteD/morte3.png",
                        "png/morteD/morte4.png",
                        "png/morteD/morte5.png",
                        "png/morteD/morte6.png",
                        "png/morteD/morte7.png",
                        "png/morteD/morte8.png"
                       );
    // Imagens do personagem morrendo a esquerda colocadas como argumento da função de carregamento
    preCarregaMorte_Esq("png/morteE/morte1.png",
                        "png/morteE/morte2.png",
                        "png/morteE/morte3.png",
                        "png/morteE/morte4.png",
                        "png/morteE/morte5.png",
                        "png/morteE/morte6.png",
                        "png/morteE/morte7.png",
                        "png/morteE/morte8.png"
    
                       );

        
          

// movimentação do personagem
    document.addEventListener('keydown', function (e) {

        if (morte) // verifica se o personagem morreu, para não haver mais movimento
            return;
        if (e.keyCode === 39) { //seta direita
            if (x < 510) {
                x = x + 15;
                requestAnimationFrame(animateDireita);
            } else {
                x = 510;
                requestAnimationFrame(animateDireita);
            }
        } else if (e.keyCode === 37) { //  seta esquerda
            if (x > 15) {
                x = x - 15;
                requestAnimationFrame(animateEsquerda);
            } else {
                x = -10;
                requestAnimationFrame(animateEsquerda);
            }
        } else if (e.keyCode === 13) {
            imgDirAtual = 0;
            imgEsqAtual = 0;
            requestAnimationFrame(animateDireita);
             if (audioLigado) {// se a variavel for true, coloca o audio de fundo 
        audioFundo.play();
    }
        }
    });
    
    
    // faz o pré carregamento das imagens do personagem
    preCarregaImagens_Dir();
    preCarregaImagens_Esq();
    preCarregaMacas();
   

    requestAnimationFrame(animateDireita);
    if (audioLigado) // se a variavel for true, coloca o audio de fundo 
        audioFundo.play();

   // cria as maçãs num intervalos de 5,2
    setInterval(criaMaca, 5200);
 
}