const input = document.getElementById('input');
const evaluate = document.getElementById('evaluate');
const output = document.getElementById('output');

// responsive styling
input.style.height = window.innerHeight * 0.6 + 'px';
input.style.width = window.innerHeight * 0.9 + 'px';

evaluate.onclick = (e => {
    if (input.value == '') {
        output.innerText = '';
        return;
    }
    try {
        const globalEnv = setupEnvironment();
        const evaluated = evalSequence(parenthesize(tokenize(input.value)), globalEnv);
        output.style.color = 'green';
        output.innerText = outputExp(evaluated);
    }
    catch(error) {
        output.style.color = 'red';
        output.innerText = error.message;
    }
});