document.addEventListener("DOMContentLoaded", () => {
    const hint = document.getElementById("hint");
    const hintImg = document.getElementById("hint-image");
    const grid = document.getElementById("grid");
    const piecesContainer = document.getElementById("pieces");
    const checkBtn = document.getElementById("check-btn");
    const resetBtn = document.getElementById("reset-btn");
    const result = document.getElementById("result");
    const imageUpload = document.getElementById("imageUpload");

    const defaultImageSrc = "https://picsum.photos/500";
    let currentImageSrc = defaultImageSrc;
    let correctOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    function cropImageToSquare(originalImage) {
        const canvas = document.createElement('canvas');
        const size = Math.min(originalImage.width, originalImage.height);
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const offsetX = (originalImage.width - size) / 2;
        const offsetY = (originalImage.height - size) / 2;
        
        ctx.drawImage(
            originalImage,
            offsetX, offsetY, size, size,
            0, 0, size, size 
        );
        
        return canvas.toDataURL('image/jpeg');
    }

    imageUpload.addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    if (img.width === img.height) {
                        currentImageSrc = event.target.result;
                        setupPuzzle();
                    } else {
                        const shouldCrop = confirm("The image is not square. Would you like to automatically crop it to square? Click 'Cancel' to use default image instead.");
                        if (shouldCrop) {
                            currentImageSrc = cropImageToSquare(img);
                            setupPuzzle();
                        } else {
                            currentImageSrc = defaultImageSrc;
                            imageUpload.value = '';
                            setupPuzzle();
                        }
                    }
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

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
        piecesContainer.style.display = "grid";
        let shuffledOrder = generateSolvableShuffle();
        
        document.querySelectorAll(".cell").forEach(cell => cell.innerHTML = "");
        
        shuffledOrder.forEach(i => {
            let piece = document.createElement("div");
            piece.classList.add("piece");
            piece.setAttribute("draggable", "true");
            piece.dataset.index = i;

            let x = (i % 3) * -100;
            let y = Math.floor(i / 3) * -100;
            piece.style.backgroundImage = `url('${currentImageSrc}')`;
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

    hint.addEventListener("click", () => {
        hintImg.src = currentImageSrc;
        hintImg.style.display = "flex";
        setTimeout(() => {
            hintImg.style.display = "none";
        }, 3000);
    });

    checkBtn.addEventListener("click", () => {
        let currentOrder = [];
        document.querySelectorAll(".cell").forEach(cell => {
            if (cell.firstChild) {
                currentOrder.push(parseInt(cell.firstChild.dataset.index));
            } else {
                currentOrder.push(null);
            }
        });
        result.textContent = JSON.stringify(currentOrder) === JSON.stringify(correctOrder) 
    ? ("🎉 You Win!", grid.style.gap = "0px", "🎉 You Win!") 
    : "❌ Try Again!";

    });
    resetBtn.addEventListener("click", () => {
        result.textContent = "";
        setupPuzzle();
    });
    setupPuzzle();
});