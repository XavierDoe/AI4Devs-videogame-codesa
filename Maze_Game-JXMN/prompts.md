# Develop a Video Game with HTML, JavaScript, and CSS  

Develop a video game using HTML, JavaScript, and CSS that procedurally generates mazes using simple lines. The maze should be rendered on a `<canvas>` and consist of walls represented by black lines on a white background. The player controls a dot (●) or a letter (e.g., 'P') that starts at an entry point and must navigate to the exit.  

## Features  

### Procedural Maze Generation  
- Implement an algorithm such as **Recursive Backtracking**, **Prim’s Algorithm**, or **Wilson’s Algorithm** to generate the maze.  
- Ensure that there is always a valid path from the start to the exit.  
- Allow different maze sizes and difficulty levels.  

### Player Movement  
- The player should move using the arrow keys.  
- Prevent the player from passing through walls.  
- Maintain the player's position in each frame.  

### Victory Detection  
- Identify when the player reaches the exit and display a victory message.  
- Allow the generation of a new maze upon winning.  

### Performance and Optimization  
- Efficiently handle the `<canvas>` for fast rendering.  
- Avoid unnecessary calculations per frame to maintain high FPS.  

### Visual Style & UX  
- Minimalist design with simple lines and clear contrast between walls and background.  
- Initial instructions so the player knows how to move.  
- A reset button to generate a new maze.  

### Optional Extras  
- Add a **timer** to track how long the player takes to complete the maze.  
- Randomly generate the **start** and **exit** positions.  
- Implement simple visual effects, such as color changes upon winning.  
