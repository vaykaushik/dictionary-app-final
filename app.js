// Retrieving DOM elements.

const wrapper = document.querySelector('.wrapper'),
    searchInput = wrapper.querySelector('input'),
    synonyms = wrapper.querySelector('.synonyms .list'),
    infoText = wrapper.querySelector('.info-text'),
    volumeIcon = wrapper.querySelector('.word i'),
    removeIcon = wrapper.querySelector('.search span');


let audio;  // Representing audio icon

const searchTitle = document.querySelector('.word p');
const phoneticOfWord = document.querySelector('.word span');
const searchDesc = document.querySelector('.meaning span');
const wordExample = document.querySelector('.example span');

function displayData(dataObj, userInput) {
    
    // Replacing the message of 'No Definition is Found' located within the 'dataObj' called 'title' inside of the API with the message created below using 'infoText.innerHTML' if the user has entered a valid word or not.

    if (dataObj.title) {
        infoText.innerHTML = `Cannot find the meaning of <span>"${userInput}".</span><br> Please check your spelling and try again. Or, enter another word.`;
    } else {
        // Else if the word is true, then add the class of 'exists' to the wrapper class and replace relevant data within the DOM.

        wrapper.classList.add('exists');

        // Locating a singular definition within the 'dataObj'.

        let definitions = dataObj[0].meanings[0].definitions[0],
        phonetics = `${dataObj[0].meanings[0].partOfSpeech} /${dataObj[0].phonetics[0].text}/`;

        // Inserting data within markup.

        searchTitle.innerText = dataObj[0].word;
        phoneticOfWord.innerText = phonetics;
        searchDesc.innerText = definitions.definition;
        wordExample.innerText = definitions.example;

        // Creating a new instance of a string object and passing in the audio source using concatenation.

        audio = new Audio("https:" + dataObj[0].phonetics[0].audio);

        // If there are no synonyms, then hide the synonym div.

        if (definitions.synonyms[0] == undefined) {

            synonyms.parentElement.style.display = 'none';

        } else {
            synonyms.parentElement.style.display = 'block';
            synonyms.innerHTML = '';

            // Retrieving only 5 synonyms out of many as specified by 'i < 5'.

            for (let i = 0; i < 5; i++) {
            let tag = `<span onClick=search('${definitions.synonyms[i]}')>${definitions.synonyms[i]},</span>`;

            // Inserting all 5 synonyms into synonyms div.

            synonyms.insertAdjacentHTML('beforeend', tag);

            }
        }

    }
}

// Synonym search for when user clicks on a synonym. It then displays the new word definition.

function search(word) {
    searchInput.value = word;
    getDefinition(word);
    wrapper.classList.remove('exists');
}

// Defining a function of 'getDefinition' which will call the API based on whatever the user has entered.

function getDefinition(userInput) {

    wrapper.classList.remove('exists');

    infoText.innerHTML = `Searching for the meaning of: <span>'${userInput}'</span>`;
    infoText.style.color = '#000';

    let searchTerm = `https://api.dictionaryapi.dev/api/v2/entries/en/${userInput}`;

    // Making a request to the API using whatever the user has entered as indicated by the 'userInput' and converting the response to a JSON Object as indicated by 'dataObj' which both get passed in as arguements within the 'displayData' function as defined above.

    fetch(searchTerm)
        .then(response => response.json())
        .then(dataObj => displayData(dataObj, userInput));
}

searchInput.addEventListener('keyup', e => {

    // If the user presses enter and inputs a value,

    if (e.key === 'Enter' && e.target.value) {

        // Then return what they have entered as indicated by 'e.target.value' using the function of 'getDefinition' to do so.

        getDefinition(e.target.value);
    }

});

volumeIcon.addEventListener('click', () => {

    // Using the default Javascript play method, it will play the audio using the link within the 'dataObj[0].phonetic[0].audio' as in the Audio object defined above.

    audio.play();
});

removeIcon.addEventListener('click', () => {
    searchInput.value = "";
    searchInput.focus();
    wrapper.classList.remove('exists');
    infoText.innerHTML = 'Type a word and press enter to get the meaning, an example, the pronunciation, and relevant synonyms.';
    infoText.style.color = '#9a9a9a';
});