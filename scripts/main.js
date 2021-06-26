const input = document.getElementById('input');
const evaluate = document.getElementById('evaluate');
const output = document.getElementById('output');

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