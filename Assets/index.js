const View = (() => {
    const domSelector = {
        gameBoard: document.querySelector("#game-board"),
        start: document.querySelector("#start-btn"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score")
    }

    const createTemp = (dataArr) => {
        let temp = "";
        const map = new Map();
        //0 and 1 represent mole status, 0 is empty, 1 is present
        map.set(0, '');
        map.set(1, '<img src="./Assets/mole.jpeg"/>');
        for (let index in dataArr) {
            if (index % 4 == 0) {
                temp += `<div class="row">
                <div class="block" id="${index}">${map.get(dataArr[index])}</div>`
            } else if (index % 4 == 3) {
                temp += `<div class="block" id="${index}">${map.get(dataArr[index])}</div>
                </div>`
            } else {
                temp += `<div class="block" id="${index}">${map.get(dataArr[index])}</div>`
            }
        }
        return temp;
    }

    const render = (ele, template) => {
        ele.innerHTML = template
    };

    return { domSelector, createTemp, render }
})()

const Model = ((view) => {
    const { createTemp, render, domSelector } = view;

    class State {
        constructor() {
            this._dataList = [];
        }

        get dataList() {
            return this._dataList;
        }

        set dataList(newList) {
            this._dataList = newList;
            const temp = createTemp(this._dataList);
            render(domSelector.gameBoard, temp);
        }
    }

    class Score {
        constructor() {
            this._score = 0;
        }

        get data() {
            return this._score;
        }

        set data(score) {
            this._score = score;
            render(domSelector.score, `Let's Go, your total score is: ${this._score}`);
        }
    }
    return { State, Score }
})(View)

const Controller = ((view, model) => {
    const { render, domSelector } = view;
    const { State, Score } = model;
    const state = new State();
    const score = new Score();
    let process;


    const startGame = () => {
        let inProcess = true;//initialize the status of the process
        let time = 30; // initialize left time
        state.dataList = new Array(12).fill(0);
        score.data = 0; // initialize score

        if (inProcess) {
            process = setInterval(() => {
                let count = 0;
                for (let i = 0; i < state.dataList.length; i++) {
                    if (state.dataList[i] === 1) {
                        count++;
                    };
                };
                //If mole less than 3, generate a new mole
                if (count < 3) {
                    let index = Math.floor(Math.random() * 12);
                    while (state.dataList[index] == 1) {
                        index = Math.floor(Math.random() * 12);
                    };
                    state.dataList[index] = 1;
                    state.dataList = state.dataList;
                };

                if (time > 0) {
                    time--;
                } else {
                    alert(`Game Over! Your score is ${score.data}`);
                    endGame();
                };
                render(domSelector.timeLeft, `Time Left ${time}`);
            }, 1000);
        };
    };

    const endGame = () => {
        inProcess = false;
        clearInterval(process);
    };

    //click on the start button
    domSelector.start.addEventListener('click', (event) => {
        if (!inProcess) {
            startGame();
        } else {
            endGame();
            setTimeout(startGame, 1000);
        };
    });

    //click on moles
    domSelector.gameBoard.addEventListener('click', (event) => {
        let index = event.target.id
        if (state.dataList[index] == 1) {
            state.dataList[index] = 0; // switch the mole status to empty
            state.dataList = state.dataList;
            score.data++;
        }
    })

    //Get the initail array with no mole
    const bootstrap = () => {
        render(domSelector.score, `Let's Go, your total score is 0`);
        startGame();
    };
    return { bootstrap }
})(View, Model)

Controller.bootstrap();