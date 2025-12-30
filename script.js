document.addEventListener('DOMContentLoaded', () => {
    // Game canvas setup
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Game variables
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    let snake = [];
    let food = {};
    let direction = 'right';
    let nextDirection = 'right';
    let score = 0;
    let gameSpeed = 150; // milliseconds
    let gameInterval;
    let gameRunning = false;
    
    // Initialize game
    function initGame() {
        // Create initial snake (3 segments)
        snake = [
            {x: 5, y: 10},
            {x: 4, y: 10},
            {x: 3, y: 10}
        ];
        
        // Create initial food
        createFood();
        
        // Reset score
        score = 0;
        document.getElementById('score').textContent = score;
        
        // Set initial direction
        direction = 'right';
        nextDirection = 'right';
    }
    
    // Create food at random position
    function createFood() {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        // Make sure food doesn't spawn on snake
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                createFood();
                break;
            }
        }
    }
    
    // Draw game elements
    function draw() {
        // Clear canvas
        ctx.fillStyle = '#CEDEBD';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw snake
        snake.forEach((segment, index) => {
            // Snake head
            if (index === 0) {
                ctx.fillStyle = '#2E4F4F';
            } 
            // Snake body
            else {
                ctx.fillStyle = '#0E8388';
            }
            
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
            
            // Draw eyes on snake head
            if (index === 0) {
                ctx.fillStyle = 'white';
                
                // Position eyes based on direction
                if (direction === 'right' || direction === 'left') {
                    ctx.fillRect(segment.x * gridSize + (direction === 'right' ? 12 : 2), segment.y * gridSize + 4, 4, 4);
                    ctx.fillRect(segment.x * gridSize + (direction === 'right' ? 12 : 2), segment.y * gridSize + 12, 4, 4);
                } else {
                    ctx.fillRect(segment.x * gridSize + 4, segment.y * gridSize + (direction === 'down' ? 12 : 2), 4, 4);
                    ctx.fillRect(segment.x * gridSize + 12, segment.y * gridSize + (direction === 'down' ? 12 : 2), 4, 4);
                }
            }
        });
        
        // Draw food (apple)
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        const centerX = food.x * gridSize + gridSize / 2;
        const centerY = food.y * gridSize + gridSize / 2;
        const radius = gridSize / 2 - 2;
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw stem
        ctx.fillStyle = '#435334';
        ctx.fillRect(centerX - 1, food.y * gridSize + 2, 2, 4);
        
        // Draw grid (optional - for a more retro look)
        ctx.strokeStyle = 'rgba(67, 83, 52, 0.1)';
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i < tileCount; i++) {
            // Vertical lines
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, canvas.height);
            ctx.stroke();
            
            // Horizontal lines
            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(canvas.width, i * gridSize);
            ctx.stroke();
        }
    }
    
    // Update game state
    function update() {
        // Update direction
        direction = nextDirection;
        
        // Create new head based on current direction
        const head = {x: snake[0].x, y: snake[0].y};
        
        switch (direction) {
            case 'up':
                head.y--;
                break;
            case 'down':
                head.y++;
                break;
            case 'left':
                head.x--;
                break;
            case 'right':
                head.x++;
                break;
        }
        
        // Check for wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver();
            return;
        }
        
        // Check for self collision
        for (let i = 0; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver();
                return;
            }
        }
        
        // Add new head to snake
        snake.unshift(head);
        
        // Check for food collision
        if (head.x === food.x && head.y === food.y) {
            // Increase score
            score += 10;
            document.getElementById('score').textContent = score;
            
            // Create new food
            createFood();
            
            // Increase speed slightly
            if (gameSpeed > 50) {
                gameSpeed -= 2;
                clearInterval(gameInterval);
                gameInterval = setInterval(gameLoop, gameSpeed);
            }
        } else {
            // Remove tail if no food was eaten
            snake.pop();
        }
    }
    
    // Game loop
    function gameLoop() {
        update();
        draw();
    }
    
    // Game over function
    function gameOver() {
        clearInterval(gameInterval);
        gameRunning = false;
        
        // Display game over message
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);
        
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
        ctx.fillText('Press Start to play again', canvas.width / 2, canvas.height / 2 + 50);
    }
    
    // Start game function
    function startGame() {
        if (!gameRunning) {
            initGame();
            gameRunning = true;
            gameInterval = setInterval(gameLoop, gameSpeed);
        }
    }
    
    // Reset game function
    function resetGame() {
        clearInterval(gameInterval);
        gameRunning = false;
        initGame();
        draw();
    }
    
    // Event listeners for keyboard controls
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp':
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') nextDirection = 'right';
                break;
        }
    });
    
    // Event listeners for button controls
    document.getElementById('upBtn').addEventListener('click', () => {
        if (direction !== 'down') nextDirection = 'up';
    });
    
    document.getElementById('downBtn').addEventListener('click', () => {
        if (direction !== 'up') nextDirection = 'down';
    });
    
    document.getElementById('leftBtn').addEventListener('click', () => {
        if (direction !== 'right') nextDirection = 'left';
    });
    
    document.getElementById('rightBtn').addEventListener('click', () => {
        if (direction !== 'left') nextDirection = 'right';
    });
    
    // Event listeners for game control buttons
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('resetBtn').addEventListener('click', resetGame);
    
    // Initialize and draw initial state
    initGame();
    draw();
});