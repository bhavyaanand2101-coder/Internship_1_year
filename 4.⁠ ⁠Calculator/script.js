// Reference the calculator display input element
const display = document.getElementById("display");
// Reference all buttons on the calculator keypad
const buttons = document.querySelectorAll("button");

// State variable storing the mathematical equation string
let currentInput = "";

// Loop through each button to attach click event handlers
buttons.forEach(button => {

    button.addEventListener("click", () => {

        const value = button.textContent;

        // If the button clicked is the Clear 'C' button
        if(value === "C"){
            currentInput = "";
            display.value = "";
        }

        // If the button clicked is the Backspace '⌫' button
        else if(value === "⌫"){
            currentInput = currentInput.slice(0,-1); // Remove the last character
            display.value = currentInput;
        }

        // If the button clicked is the Equals '=' button
        else if(value === "="){

            try{
                // Safely evaluate the math equation string using eval() and convert result to string
                currentInput = eval(currentInput).toString();
                display.value = currentInput;
            }
            catch{
                // Display error message if the equation format is mathematically invalid (e.g. "8/*4")
                display.value = "Error";
                currentInput = "";
            }
        }

        // For any standard number or basic operator button
        else{
            currentInput += value;
            display.value = currentInput;
        }
    });
});

// Capture keyboard layout mapping to support desktop typing inputs
document.addEventListener("keydown",(event)=>{

    const key = event.key;

    // Allow digits and operational operators
    if(
        "0123456789+-*/.%".includes(key)
    ){
        currentInput += key;
        display.value = currentInput;
    }

    // Evaluate calculation when 'Enter' key is pressed
    else if(key === "Enter"){
        try{
            currentInput = eval(currentInput).toString();
            display.value = currentInput;
        }
        catch{
            display.value = "Error";
            currentInput = "";
        }
    }

    // Handle backspace deleting the last character
    else if(key === "Backspace"){
        currentInput = currentInput.slice(0,-1);
        display.value = currentInput;
    }

    // Handle escape clearing the entire input
    else if(key === "Escape"){
        currentInput = "";
        display.value = "";
    }
});