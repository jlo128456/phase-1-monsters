document.addEventListener('DOMContentLoaded', () =>{
    const monsterContainer = document.getElementById('monster-container');
    const createMonsterDiv = document.getElementById('create-monster');
    const backButton = document.getElementById('back');
    const forwardButton = document.getElementById('forward');

    //setting up 50pages
    let currentPage = 1;
    let monsterPerPage = 50;

    //talking to json sever
    const fetchMonsters = (page) => {
        fetch(`http://localhost:3000/monsters?_limit=${monsterPerPage}&_page=${page}`)
             .then(response => response.json())
             .then(monsters => {
                while (monsterContainer.firstChild){
                    monsterContainer.removeChild(monsterContainer.firstChild);
                }
                monsters.forEach(monster => displayMonster(monster))
             })
    };
    //displaying monster on page
    const displayMonster = (monster) => {
        const monsterDiv = document.createElement('div');
        const monsterName = document.createElement('h2');
        monsterName.textContent = monster.name;

        const monsterAge = document.createElement('p');
        monsterAge.textContent =`Age: ${monster.age}`;

        const monsterDescription =document.createElement('p')
        monsterDescription.textContent = `Description: ${monster.description}`;

        monsterDiv.appendChild(monsterName);
        monsterDiv.appendChild(monsterAge);
        monsterDiv.appendChild(monsterDescription);
        monsterContainer.appendChild(monsterDiv);

    };

    //creating form for monster
    const createMonsterForm = () =>{
        const form = document.createElement('form');

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'name';
        nameInput.placeholder = 'Name';
        nameInput.required = true;

        const ageInput = document.createElement('input');
        ageInput.type = 'number';
        ageInput.id = 'age';
        ageInput.placeholder = 'Age';
        ageInput.required = true;

        const descriptionInput = document.createElement('input');
        descriptionInput.type = 'text';
        descriptionInput.id = 'description';
        descriptionInput.placeholder = 'Description';
        descriptionInput.required = true;

        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Create Monster';

        form.appendChild(nameInput);
        form.appendChild(ageInput);
        form.appendChild(descriptionInput);
        form.appendChild(submitButton);

        createMonsterDiv.appendChild(form);

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const age = document.getElementById('age').value;
            const description = document.getElementById('description').value;

            const newMonster = {
                name,
                age,
                description
            };

            createMonster(newMonster);
            form.reset();
        });
    };

    const createMonster = (monster) => {
        fetch('http://localhost:3000/monsters', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(monster)
        })
        .then(response => response.json())
        .then(newMonster => {
            if (currentPage === 1) {
                displayMonster(newMonster);
            }
        });
    };

    backButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchMonsters(currentPage);
        }
    });

    forwardButton.addEventListener('click', () => {
        currentPage++;
        fetchMonsters(currentPage);
    });

    // Initial fetch
    fetchMonsters(currentPage);
    createMonsterForm();
})