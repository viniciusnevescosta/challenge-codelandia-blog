"use strict";

// MODAL
let btnCreate = document.querySelector('#create');
let modal = document.querySelector('.modal-container');
let btnClose = document.querySelector('#close');

// abrir
btnCreate.addEventListener('click', () => {
    modal.style.display = 'flex';
});

// fechar
btnClose.addEventListener('click', () => {
    modal.style.display = 'none';
});

document.addEventListener('keydown', (event) => {
	if(event.key === "Escape"){
		modal.style.display = 'none';
	}
});

// ESCREVER ARTIGO
let btnSubmit = document.querySelector('#submit');
let titleInput = document.querySelector('#title');
let contentInput = document.querySelector('#content');
let warn = document.querySelector('#warn');

const criarArtigo = (titulo, paragrafo, like = false) => {
    // função data atual
    const dateNow = () => {
        const data = new Date()
        const dia = data.getDate();

        const months = ["jan", "fev", "mar", "abr", "maio", "jun", "jul", "ago", "set", "out", "nov", "dez"];

        let mes = months[data.getMonth()];

        const ano = data.getFullYear();

        const hora = data.getHours();
        const min = data.getMinutes();

        if(min < 10) {
            const minatual = `0${data.getMinutes()}`;
            return `${dia} de ${mes}, ${ano} • ${hora}:${minatual}`;
        } else {
            const minatual = data.getMinutes();
            return `${dia} de ${mes}, ${ano} • ${hora}:${minatual}`;
        };
    };

    // adicionar a localstorage
    const dataAtual = dateNow();
    let post = JSON.parse(localStorage.getItem('post')) || [];
    post.push({dataAtual, titulo, paragrafo, like});

    localStorage.setItem('post', JSON.stringify(post));
    window.location.reload();
};

// CRIAR ARTIGO
btnSubmit.addEventListener('click', (e) => {
    e.preventDefault()

    const titleValue = titleInput.value;
    const contentValue = contentInput.value;

    if(titleValue === '' || contentValue === '') {
        warn.style.display = 'block';
        warn.innerText = 'Preencha todos os campos!';
        setInterval(() => {
            warn.innerText = '';
        }, 2500)
        return;
    } else {
        criarArtigo(titleInput.value, contentInput.value);
        modal.style.display = 'none';
    };
});

// CRIAR POST LOCALSTORAGE
const gerarPost = (date, title, content, like) => {
    // selecionando o main
    const main = document.querySelector('main');

    // criando artigo
    const artigo = document.createElement('div');
    artigo.classList.add('artigo');
    main.appendChild(artigo);

    // header
    const headerArtigo = document.createElement('div');;
    headerArtigo.classList.add('headerArtigo');

    // div data
    const data = document.createElement('div');
            
    // data
    const p = document.createElement('p');
    p.innerText = date;
        
    data.appendChild(p);

    // div botões
    const buttons = document.createElement('div');

    const heart = document.createElement('i');
    if(like === false) {
        heart.classList.add('ri-heart-line', 'ri-2x', 'heart');
    } else {
        heart.classList.add('ri-heart-fill', 'ri-2x', 'heart');
    }
        
    // add botões
    buttons.appendChild(heart);

    // adicionar no header
    headerArtigo.appendChild(data);
    headerArtigo.appendChild(buttons);

    // conteúdo
    const contentArticle = document.createElement('div');
    contentArticle.classList.add('content');

    // título
    const h1 = document.createElement('h1');
    h1.innerText = title;

    // parágrafo
    const paragraph = document.createElement('p');
    paragraph.innerText = content;

    // adicionar ao conteúdo
    contentArticle.appendChild(h1);
    contentArticle.appendChild(paragraph);

    // adicionar ao artigo
    artigo.appendChild(headerArtigo);
    artigo.appendChild(contentArticle);

    // evento favoritar
    heart.addEventListener('click', () => {
        let classe = heart.classList.contains('ri-heart-line');
        if(classe === true) {
            heart.classList.remove('ri-heart-line', 'ri-2x');
            heart.classList.add('ri-heart-fill', 'ri-2x');           
        } else {
            heart.classList.remove('ri-heart-fill', 'ri-2x');
            heart.classList.add('ri-heart-line', 'ri-2x');
        };
    });
}

window.onload = () => {
    let post = JSON.parse(localStorage.getItem('post')) || [];

    post.forEach(post => {
        gerarPost(post.dataAtual, post.titulo, post.paragrafo, post.like);
    });    
};

// SEARCH BAR
let search = document.querySelector('#search');
let post = JSON.parse(localStorage.getItem('post')) || [];

search.addEventListener("input", () => {
    let valor = search.value;

    post.forEach(post => {
        let title = post.titulo;

        const regex = new RegExp(valor);
        let result = regex.test(title);

        if(result === true) {
            let letra = regex.exec(title);
            let searchPost = (titulo) => {
                // selecionando o main
                const main = document.querySelector('main');
                const artigo = document.querySelectorAll('.artigo');
                for(let i = 0; i < artigo.length; i++) {
                    main.removeChild(artigo[i]);
                };
                
                // gerando post
                gerarPost(post.dataAtual, titulo, post.paragrafo, false);
            }
                      
            if(valor !== '') {
                searchPost(letra.input);
            } else {
                window.location.reload();
            };
        };
    });
});