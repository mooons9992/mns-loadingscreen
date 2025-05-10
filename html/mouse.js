/**
 * MNS Custom Cursor System
 * Creates and manages a stylish custom cursor for the loading screen
 */

// Create the custom cursor element
function createCustomCursor() {
    const cursor = document.createElement("div");
    cursor.id = "custom-cursor";
    cursor.style.position = "fixed";
    cursor.style.width = "20px";
    cursor.style.height = "20px";
    cursor.style.borderRadius = "50%";
    cursor.style.border = "2px solid white";
    cursor.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    cursor.style.transform = "translate(-50%, -50%)";
    cursor.style.pointerEvents = "none";
    cursor.style.zIndex = "9999999";
    cursor.style.transition = "transform 0.15s ease, background-color 0.15s ease";
    cursor.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.5)";
    document.body.appendChild(cursor);
    return cursor;
}

// Track mouse movements and update cursor accordingly
function trackMouse(cursor) {
    // Handle mouse movement
    document.addEventListener("mousemove", (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;

        // Check if cursor is over interactive elements
        const element = document.elementFromPoint(e.clientX, e.clientY);
        if (
            element &&
            (element.tagName === "A" ||
             element.tagName === "BUTTON" ||
             element.closest("a") ||
             element.closest("button") ||
             element.tagName === "INPUT" ||
             element.tagName === "RANGE" ||
             getComputedStyle(element).cursor === "pointer")
        ) {
            cursor.style.transform = "translate(-50%, -50%) scale(1.2)";
            cursor.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
        } else {
            cursor.style.transform = "translate(-50%, -50%) scale(1)";
            cursor.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
        }
    });

    // Handle mouse clicks
    document.addEventListener("mousedown", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(0.8)";
        cursor.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    });
  
    document.addEventListener("mouseup", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(1)";
        cursor.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    });
    
    // Handle cursor leaving the window
    document.addEventListener("mouseleave", () => {
        cursor.style.opacity = "0";
    });
    
    document.addEventListener("mouseenter", () => {
        cursor.style.opacity = "1";
    });
}

// Hide the default browser cursor
function hideOriginalCursor() {
    const style = document.createElement("style");
    style.innerHTML = `
      * {
        cursor: none !important;
      }
      
      #custom-cursor {
        cursor: none !important;
      }
      
      /* Improve hover effects on interactive elements */
      a:hover, button:hover, input[type="range"]:hover {
        filter: brightness(1.2);
      }
    `;
    document.head.appendChild(style);
}

// Initialize the custom cursor system
function initCustomCursor() {
    // Check if cursor already exists to prevent duplicates
    if (document.getElementById("custom-cursor")) {
        return;
    }
    
    const cursor = createCustomCursor();
    trackMouse(cursor);
    hideOriginalCursor();

    // Ensure cursor remains visible after window events
    window.addEventListener("resize", () => {
        cursor.style.display = "block";
    });

    window.addEventListener("scroll", () => {
        cursor.style.display = "block";
    });

    window.addEventListener("focus", () => {
        cursor.style.display = "block";
    });
}

// Initialize the cursor when the document is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCustomCursor);
} else {
    initCustomCursor();
}

// Periodically check if cursor exists and recreate if necessary
setInterval(() => {
    if (!document.getElementById("custom-cursor")) {
        initCustomCursor();
    }
}, 1000);
