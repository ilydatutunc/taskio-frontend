// DISCUSSIONS - START
const discussions = [
    {
        id: "1",
        teamId: "1",
        name: "İlayda Tütüncü",
        messages: [
            {
                "text": "Hey!",
            },
            {
                "text": "Hey, whatsup!?",
                "response": true
            }
        ],
        timer: "12 sec"
    },
    {
        id: "2",
        teamId: "1",
        name: "Doğan Koç",
        messages: [
            {
                "text": "Deneme selam!",
            },
            {
                "text": "Deneme aleyküm selam!",
                "response": true
            }
        ],
        timer: "3 min"
    },
    {
        id: "3",
        teamId: "1",
        name: "Sidar Yılmaz",
        messages: [],
        timer: "42 min"
    },
    {
        id: "4",
        teamId: "2",
        name: "Thomas Dbtn",
        messages: [],
        timer: "2 hour"
    },
    {
        id: "5",
        teamId: "2",
        name: "Elsie Amador",
        messages: [],
        timer: "1 day"
    },
    {
        id: "6",
        teamId: "3",
        name: "Billy Southard",
        messages: [],
        timer: "4 days"
    },
    {
        id: "7",
        teamId: "3",
        name: "Paul Walker",
        messages: [],
        timer: "1 week"
    }
];

const discussionsEl = document.querySelector(".discussions-list");

function DiscussionComponent (discussion) {
    let displayMessage = discussion.messages[discussion.messages.length - 1]?.text || "";
    html = `
        <div 
            id="discussion-${discussion.id}" 
            class="discussion" 
            onclick="displayMessagesByDiscussion(${discussion.id})"
        >
            <div class="photo">
            </div>
            <div class="desc-contact">
                <p class="name" >${discussion.name}</p>
                <p class="message">${displayMessage}</p>
            </div>
            <div class="timer">${discussion.timer}</div>
        </div>
    `;
    return html;
}

function selectDiscussion(discussionId) {
    const allDiscussions = document.querySelectorAll('.discussion');
    
    allDiscussions.forEach(discussion => {
        discussion.style.borderRight = ''; 
        discussion.style.backgroundColor = ''; 
    });

    const selectedDiscussion = document.getElementById(`discussion-${discussionId}`);
    selectedDiscussion.style.borderRight = '3px solid purple'; 
    selectedDiscussion.style.backgroundColor = 'white'; 
};

function displayDiscussions (teamId, filter) {
    localStorage.setItem("currentTeamId", teamId);
    discussionsEl.innerHTML = "";

    for(let i = 0; i < discussions.length; i++) {
        let discussion = discussions[i];
        if(discussion.teamId != teamId) {
           continue;
        };

        if(filter && filter.name) {
            console.log(filter.name.toLowerCase(), discussion.name.toLowerCase())
            if(filter.name.toLowerCase() == discussion.name.toLowerCase()) {
                discussionsEl.innerHTML += DiscussionComponent(discussion);
            }
        } else {
            discussionsEl.innerHTML += DiscussionComponent(discussion);
        }
    };
};
// DISCUSSIONS - END

// TEAMS - START
const teams = {
    "Front-end": {
        "id": "1",
    },
    "Back-end": {
        "id": "2"
    } ,
    "Design": {
        "id": "3"
    }
};

const teamsEl = document.querySelector(".items");

function displayTeams () {
    let teamsArr = Object.entries(teams); 
    let htmlContent = ''; 
    
    for (let [teamName, teamObj] of teamsArr) {
        htmlContent += `
            <li class="item d-flex flex-column" onclick="displayDiscussions(${teamObj.id})">
                <i class="fa fa-user" aria-hidden="true"></i>
                <p style="font-size: 13px;">${teamName}</p>
            </li>
        `;
    }
    
    teamsEl.innerHTML = htmlContent;
};
// TEAMS - END

// MESSAGES - START
function MessageComponent(message) {
    if(message.response) {
        return `
            <div class="message text-only">
                <div class="response">
                    <p class="text">${message.text}</p>
                </div>
            </div> 
        `
    } else {
        return `
        <div class="message text-only">
            <p class="text">${message.text}</p>
        </div>
    `
    }
};

const chatEl = document.querySelector(".messages-chat");
const chatNameEl = document.querySelector(".chat-name");

const chatSectionEl = document.querySelector(".chat");

function updateChatName(name) {
    chatNameEl.innerHTML = name;
};

function displayMessagesByDiscussion(discussionId) {
    chatSectionEl.style.display = "block";

    chatEl.innerHTML = "";
    let discussion = discussions.find(dis => dis.id == discussionId);
    updateChatName(discussion.name);

    for(let i = 0; i < discussion.messages.length; i++) {
        let message = MessageComponent(discussion.messages[i]);
        chatEl.innerHTML += message;
    }

    // here set the discussions id to localstorage to know when we send message where to send
    localStorage.setItem("currentDiscussionId", discussion.id);

    selectDiscussion(discussion.id);
};

const messageInputEl = document.querySelector(".write-message");

function sendMessage() {
    let message = messageInputEl.value;
    if(!message) {
        return;
    }

    let discussionId = localStorage.getItem("currentDiscussionId");
    let discussion = discussions.find(dis => dis.id == discussionId);

    let newMessageObj = {
        "text": message,
        "response": true
    };
    discussion.messages.push(newMessageObj);

    // now re render chat
    displayMessagesByDiscussion(discussionId);
    messageInputEl.value = "";
};

// MESSAGES - END

const searchEl = document.querySelector("#search-discussion");

function searchDiscussions() {
    let teamId = localStorage.getItem("currentTeamId");
    if(!teamId) {
        return;
    }
    displayDiscussions(teamId);

    if(!searchEl.value) {
        return;
    }

    let filter = {
        name: searchEl.value,
    };
    displayDiscussions(teamId, filter);
};

function main() {
    localStorage.clear();

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') { 
            sendMessage();
            searchDiscussions();
        }
    });

    displayTeams();
};

main();
