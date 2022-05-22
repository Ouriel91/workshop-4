class AsyncGame {
    constructor() {
        this.API_BASE = 'https://u-workshops.herokuapp.com'
    }

    /* 
        Note: most of these methods will use the `fetch` API
        It's ok if you don't fully understand it yet! You can think of it as a 'blackbox' for now
    */

    async createUser(name) {
        // POST request to the /new_user endpoint
        const response = await fetch(`${this.API_BASE}/new_user`, {
            method: 'POST',
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name})
        })

        //just for see the id
        const id = await response.json()
        console.log(id)
    }

    

    async addToQABank(objQuestion) {
        // POST request to /new_qa
        const {question, answer, ownerId} = objQuestion
        const sendQuestion = await fetch(`${this.API_BASE}/new_qa`, {
            method: 'POST',
            headers: { 
                Accept: "application/json",
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question, 
                answer,
                ownerId
            })
        })

        const response = await sendQuestion.json()
        console.log(response)
    }

    async getAllQuestions() {
        // GET request to /all_questions
        // Note! More questions will be added as other students progress in this workshop.
        // Ask around to see who's added new questions!
        const response = await fetch(`${this.API_BASE}/all_questions`)
        const allQuestions = await response.json()

        console.log("questions",allQuestions)
    }

    async answerQuestion(objAnswer) {
        // POST request to /answer_question
        // Note! In the response of this request you'll see whether your answer was correct or not.
        // If you answered incorrectly, try again or bring it up with the user who posted the question!
        const {qaId, answer, userId} = objAnswer
        const sendAnswer = await fetch(`${this.API_BASE}/answer_question`, {
            method: 'POST',
            headers: { 
                Accept: "application/json",
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                qaId, 
                answer,
                userId
            })
        })

        const response = await sendAnswer.json()
        console.log("answers",response)
    }

    async getAnswerSubmissions() {
        // GET request to /answer_submissions
        const response = await fetch(`${this.API_BASE}/answer_submission`)
        const answers = await response.json()
        return answers
    }

    async getUsers(){
        // GET request to /the_users

        const response = await fetch(`${this.API_BASE}/the_users`)
        const users = await response.json()
        return users
    }

    async calculateUserScores(game) {
        // +1 points for questions you've answered correctly
        // -1 points for questions you've answered incorrectly
        const users = await game.getUsers()
        const submissions = await game.getAnswerSubmissions()
        console.log("users",users)
        console.log("submissions",submissions)
        
        let scoresData = []
        submissions.forEach(submission => {
            const name = users[submission.userId].name
            const userId = submission.userId   
            
            let score = 0
            if(submission.correct === true) {
                score = 1
            }
            else{
                score = -1 
            }

            const newObject = {}
            newObject['name'] = name
            newObject['score'] = score
            newObject['userId'] = userId
            scoresData.push(newObject)
        })

        console.log("scoresData",scoresData)
        console.log(Object.keys(users).length)
        
        const scores = {}

        for(let i = 1; i < Object.keys(users).length; i++) {
            let score = 0
            scoresData.forEach(data => {
                if(data.userId === i){
                    score += data.score
                }
            })
            const newObject = {}
            const name = users[i].name
            newObject[name] = score
            Object.assign(scores, newObject)
        }

        console.log(scores)
        

        // This is the most "complicated" method - but you've got this ;)

        // Guidelines for this part (ignore if you want an extra challenge!)
        /*
            - Get the users
            - Get the submissions
            - Create an `scores` object
            - Loop through each user ID
                - Extract the username
                - Filter the correct submissions with matching user ID
                - Filter the incorrect submissions with matching user ID
                - Add a new entry to `scores` with the user's name and their score (correct.length - incorrect.length)

            Example of `score` at the end of this: 
            {
                Kayla: 12,
                Darwin: -1
            }
        */
    }
}

const game = new AsyncGame()
// Remember the server is unexpected, it might return an error!

// Example of running the game:
//game.createUser("ouriel") // cancel for not send the same user over and over again
//game.createUser("test") //demo user

//i get the id from createUser (i don't return it beacuse i dont want to create a new user again)
//my id = 2
//after add cancel the question beacuse we dont want to add the same questions over and over again
//game.addToQABank({question: "How many legs does a cat have?", answer: 4, ownerId: 2})
//game.addToQABank({question: "Who is the israeli premier leauge title in football in 21/22 leauge season?", answer: "Maccbi Haifa", ownerId: 2})
//game.addToQABank({question: "Who is the israeli MVP football player in 21/22 leauge season on israeli premier football leauge?", answer: "Omer Atzili", ownerId: 2})

//demo user id = 3
//game.addToQABank({question: "How many wheels car have", answer: 4, ownerId: 3})
//game.addToQABank({question: "How many seasons have in year", answer: 4, ownerId: 3})


game.getAllQuestions()

//comment for not submit the answer again
//game.answerQuestion({qaId: 1, answer: 100, userId: 2})
//game.answerQuestion({qaId: 4, answer: 4, userId: 2})
//game.answerQuestion({qaId: 4, answer: 4, userId: 3})

//game.getUsers() // <-- how can you output the results from here *without* console.log in the method?
//game.getAnswerSubmissions()

game.calculateUserScores(game)
