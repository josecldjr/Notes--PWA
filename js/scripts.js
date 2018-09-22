
// leitura do localstorage para variável
    let notes = window.localStorage.getItem('notes') || '{"data": [] }';  
notes = JSON.parse(notes);  

/**
 * cria uma nota
 */
var createNote = function(){
    // seleciona o input notes
    let input = document.querySelector('#form-add-note input[type="text"]');
    let value = input.value;

    notes.data.push(value);
    console.log(notes);
        
    // apaga o input
    input.value = "";
};

var updateList = function(){
    console.log('[app] start watch');
    
    Array.observe(notes.data,function(changes)  {
        let index = null;
        let value = "";
        let status = null;

        if (changes[0].type === 'splice'){
            index = changes[0].index;
            value = changes[0].object[index];
            status = (changes[0].addedCount > 0) ? 'created' : 'removed';
        }  
        
        if (changes[0].type === 'update'){
            index = changes[0].name;
            value = changes[0].object[index];
            status = 'updated';
        }

        if (value && status === 'created' && status === 'updated'){
            return;
        }

        let notesTag = document.getElementById('notes');

        if (status === 'updated'){
            console.log('TODO: implement this function');
            
        }

        if (status === 'removed'){
            let listOfNotes = document.querySelectorAll('#notes li');
            notesTag.removeChild(listOfNotes[index]);
        }

        if (status === 'created'){
            let newLi = document.createElement('li');
            newLi.innerHTML = value;
            notesTag.appendChild(newLi);                      
        }

        // atualiza o localstorage
        window.localStorage.setItem('notes', JSON.stringify(notes)); 

    });
};


// envento ao DOM carregar
document.addEventListener('DOMContentLoaded', function(event){
    
    // armazena as notas em uma lista / define a lista como "em branco"
    let listOfNotes = document.getElementById('notes');  
    let listHtml = ''; 

    // cria uma linha na lista para cada elemento do array notes.data
    for (let i = 0; i < notes.data.length; i++){
        listHtml += '<li>' + notes.data[i] + '</li>';
    }

    listOfNotes.innerHTML = listHtml;


    let formAddNotes = document.getElementById('form-add-note');
    
    formAddNotes.addEventListener('submit',function(e){
        e.preventDefault();
        console.log('Submit !');
        createNote();
    });
});

updateList();

// evento ao clicar
document.addEventListener('click', function(e){
     let notesTag  = this.getElementById('notes');

     if ((e.target.parentElement) === notesTag){
         
        // confirmação para remover nota da lista
         if (confirm('Remover nota?')){
            let listOfNotes = document.querySelectorAll('#notes li');

            listOfNotes.forEach(function(element, index){
                if (e.target === element){
                    notes.data.splice(index, 1);
                }
            });
             
         }
     }
});

// carrega o service worker
if ('serviceWorker' in navigator){
    navigator.serviceWorker
    .register('./service-worker.js')
    .then(function(reg){
        console.log('Service worker registered');
        
    })
    .catch(function(e){
        console.log('Failed to load service worker :' + e);
        
    })
}