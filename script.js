document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const piecesContainer = document.getElementById("pieces");
    const checkBtn = document.getElementById("check-btn");
    const resetBtn = document.getElementById("reset-btn");
    const result = document.getElementById("result");

    const imageSrc = "images.png"; // Change this to your image
    let correctOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    function getInversionCount(arr) {
        let invCount = 0;
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[i] > arr[j] && arr[i] !== null && arr[j] !== null) {
                    invCount++;
                }
            }
        }
        return invCount;
    }

    function generateSolvableShuffle() {
        let arr;
        do {
            arr = [...Array(9).keys()];
            arr.sort(() => Math.random() - 0.5);
        } while (getInversionCount(arr) % 2 !== 0);
        return arr;
    }

    function setupPuzzle() {
        piecesContainer.innerHTML = "";
        let shuffledOrder = generateSolvableShuffle();
        shuffledOrder.forEach(i => {
            let piece = document.createElement("div");
            piece.classList.add("piece");
            piece.setAttribute("draggable", "true");
            piece.dataset.index = i;

            let x = (i % 3) * -100;
            let y = Math.floor(i / 3) * -100;
            piece.style.backgroundImage = `url('${imageSrc}')`;
            piece.style.backgroundPosition = `${x}px ${y}px`;

            piecesContainer.appendChild(piece);
        });

        addDragAndDropEvents();
    }

    function addDragAndDropEvents() {
        let draggedPiece = null;

        document.querySelectorAll(".piece").forEach(piece => {
            piece.addEventListener("dragstart", (e) => {
                draggedPiece = e.target;
                setTimeout(() => (e.target.style.opacity = "0.5"), 0);
            });

            piece.addEventListener("dragend", (e) => {
                setTimeout(() => (e.target.style.opacity = "1"), 0);
                draggedPiece = null;
            });
        });

        document.querySelectorAll(".cell").forEach(cell => {
            cell.addEventListener("dragover", (e) => e.preventDefault());

            cell.addEventListener("drop", (e) => {
                if (!cell.hasChildNodes()) {
                    cell.appendChild(draggedPiece);
                    checkPiecesContainer();
                }
            });
        });
    }

    function checkPiecesContainer() {
        if (!piecesContainer.hasChildNodes()) {
            piecesContainer.style.display = "none";
        }
    }

    checkBtn.addEventListener("click", () => {
        let currentOrder = [];
        document.querySelectorAll(".cell").forEach(cell => {
            if (cell.firstChild) {
                currentOrder.push(parseInt(cell.firstChild.dataset.index));
            } else {
                currentOrder.push(null);
            }
        });

        result.textContent = JSON.stringify(currentOrder) === JSON.stringify(correctOrder) ? "🎉 You Win!" : "❌ Try Again!";
    });

    resetBtn.addEventListener("click", () => {
        result.textContent = "";
        document.querySelectorAll(".cell").forEach(cell => cell.innerHTML = "");
        piecesContainer.style.display = "flex";
        setupPuzzle();
    });

    setupPuzzle();
});