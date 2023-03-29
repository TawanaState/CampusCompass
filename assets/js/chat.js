
const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();
var db = new Dexie('MyChats');
db.version(1).stores({
    chats : '++id, me, content, data'
});
select('.chats .msg', true).forEach((v, k, p) => {
    v.remove();
});
db.chats.each(item => {
    console.log(item);
    addMessage(item.content, item.data, item.me);
});


let model;
recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
let QNA = [];
try {
    QNA = [
        {
            q : ['thanks', 'thanx', 'thank you', 'great'],
            a : ['You are welcome. ', 'My Pleasure :)', 'Glad I could help. ']
        },
        {
            q : ['bye', 'see you', 'see ya'],
            a : ['Bye bye', 'come back soon (:']
        },
        {
            q : ['what is your name', 'tell me your name', 'who are you', 'what do you do'],
            a : ['Im a robot with currently no name. Created to help visitors of the University of Zimbabwe. ']
        },
        {
            q:['who made you', 'who is your maker', 'who developed you'],
            a : ['The developer is Tawananyashsa Mukoriwo and the Project manager is Sean Kaguramamba. ']
        },
        {
            q : ['hi', 'hello', 'hey there', 'hey', 'good morning', 'good afternoon', 'good evening'],
            a : ['Hey there ' + user.displayName, 'Watup ' + user.displayName, 'Hello ' + user.displayName, 'Hi '+ user.displayName, 'Hey ' + user.displayName]
        }
    ];
} catch (error) {
    notify(error);
}



(async ()=>{
    // Load the model.
    try {
        model = await qna.load();
        setchatState("online");
    } catch (error) {
        notify(error, 'text-danger');
        setchatState("offline");
    }
    
})();

function setchatState(text){
    select('#chat_state').innerText = text;
}

document.querySelector('input').addEventListener('keydown', (event) => {
    if (event.target.value !== ""){
        //select('.footer .audio-send .bi').classList.remove('bi-mic');
        select('.footer .audio-send .bi').classList.add('bi-send');
    }else{
        //select('.footer .audio-send .bi').classList.add('bi-mic');
        //select('.footer .audio-send .bi').classList.remove('bi-send');
    }
});

function startRecog() {
    recognition.start();
}

recognition.onresult = function(event) {
    select('input').value = event.results[0][0].transcript;
    console.log(`Confidence: ${event.results[0][0].confidence}`);
}

function addMessage(text, data, me=true) {
    let msg = document.createElement('div');
    msg.classList.add('msg');
    msg.innerHTML = `<span>
    <p>
        ${text}
    </p><i>${data}</i></span>`;
    if(me){
        msg.classList.add('me');
    }
    select('.chats').appendChild(msg);
    scrollToBottom();
    db.chats.put({
        date : (new Date),
        me : me,
        content : text,
        data : data
    });
}

async function sendMessage(msg = select('input').value) {
    // Finding the answers
    addMessage(msg, (new Date).toLocaleString());
    try {
        setchatState('typing...');
        let answers = await model.findAnswers(msg, window.MY_PASSAGES_DATASET);
        setchatState('');;
        addMessage(answers[0].text, `Accuracy : ${Math.round(answers[0].score * 100)}%`, false);
    } catch (error) {
        notify(error, 'text-danger');
    }
    
    
}
recognition.onspeechend = function() {
    recognition.stop();
    document.querySelector('.bi.bi-mic').classList.remove('text-danger');
}

on('click', '.suggestions > span',(event) => {
    select('input').value = event.target.innerText;
}, true);

function FormbtnClick(event) {
    if (event.target.querySelector('button i.bi.bi-mic') !== null){
        //startRecog();
        event.target.querySelector('button i.bi.bi-mic').classList.add('text-danger');
    }else{
        if(!response(select('input').value.toLowerCase())){
            sendMessage();
            select('input').value = "";
        }
        
    }
}

function scrollToBottom() {
    select('.chats').scroll(0, document.querySelector('.chats').scrollHeight);
}
scrollToBottom();

function response(qsn){
    let qsns = [];
    QNA.forEach((v, k, p) => {
        let rating = stringSimilarity.findBestMatch(qsn, v.q);
        qsns.push(rating.bestMatch);
    });
    qsns = qsns.sort((a, b) => {
        return b.rating - a.rating; 
    });
    if(qsns[0].rating > 0.5){
        let dd = QNA.filter(v => v.q.includes(qsns[0].target));
        addMessage(qsn, (new Date).toLocaleString());
        select('input').value = '';
        addMessage(randomPick(dd[0].a), '', false);
        return true;
    } else{
        return false;
    }
}

function randomPick(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    const item = arr[randomIndex];
    return item;
}
