class Model {
    constructor() {
        this.board = [];
        for (let i = 0; i < 12; i++) {
            this.board.push({ id: i, status: 0 }); // status 0 means no mole, 1 means mole present
        }
    }

    updateBlockStatus(id, status) {
        this.board[id].status = status;
    }
}


class View {
    constructor() {
        this.gameBoard = document.getElementById('game-board');
        this.blocks = document.querySelectorAll('.block');
        this.scoreCounter = document.getElementById('score-counter');
        this.timer = document.getElementById('time-left');
    }

    renderBoard(board) {
        board.forEach((block, index) => {
            const blockElement = this.blocks[index];
            if (block.status === 1) {
                blockElement.style.visibility = 'visible';
            } else {
                blockElement.style.visibility = 'hidden';
            }
        });
    }

    renderScore(score) {
        this.scoreCounter.innerText = `Score: ${score}`;
    }

    renderTimer(time) {
        this.timer.innerText = `${time}`;
    }

    bindClickBlock(handler) {
        this.gameBoard.addEventListener('click', event => {

            if (event.target.matches('.block img')) {
                const id = parseInt(event.target.id);
                console.log(id);
                handler(id);
            }
        });
    }
}


class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.score = 0;
        this.time = 30; // set game time to 30 seconds
        this.timerId = null; // variable to hold timer interval ID
        this.moleIntervalId = null; // variable to hold mole creation interval ID
        this.moleCount = 0; // variable to track number of moles present on the board
        this.startBtn = document.getElementById('start-btn');
        this.bindStartGame();
    }

    startGame() {
        // reset game state
        this.score = 0;
        this.time = 30;
        this.moleCount = 0;
        this.model = new Model();
        this.view.renderBoard(this.model.board);
        this.view.renderScore(this.score);
        this.view.renderTimer(this.time);

        // start timer and mole creation
        this.timerId = setInterval(() => {
            this.time--;
            this.view.renderTimer(this.time);
            if (this.time <= 0) {
                this.endGame();
            }
        }, 1000);

        this.moleIntervalId = setInterval(() => {
            if (this.moleCount >= 3) {
                return;
            }

            const randomBlock = Math.floor(Math.random() * 12); // generate random block index
            if (this.model.board[randomBlock].status === 0) { // check if block is empty
                this.model.updateBlockStatus(randomBlock, 1); // update block status to have a mole
                this.view.renderBoard(this.model.board); // render updated board
                this.moleCount++;
            }
        }, 1000);

        this.view.bindClickBlock((id) => {
            this.clickBlock(id);
        });
    }

    endGame() {
        clearInterval(this.timerId);
        clearInterval(this.moleIntervalId);
        alert(`Game Over! Your score is ${this.score}`);
    }

    clickBlock(id) {
        console.log(id);
        if (id >= 0 && id < this.model.board.length && this.model.board[id].status == 1) {
            this.score++;
            this.view.renderScore(this.score);
            this.model.updateBlockStatus(id, 0); // update block status to remove the mole
            this.view.renderBoard(this.model.board); // render updated board
            this.moleCount--;
        }
    }

    bindStartGame() {
        this.startBtn.addEventListener('click', () => {
            this.endGame();
            this.startGame();
        });
    }
}

const app = new Controller(new Model(), new View());
app.startGame();