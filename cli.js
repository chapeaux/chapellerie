const q = confirm('Would you like me to prompt you?');
if (q) {
    const resp = prompt('What would you like to do today?', 'Write code!');
    console.log(`${resp}...and go!`);
} else {
    alert("You've been alerted instead!");
}
