function tokenize(input) {
    let result = input.replaceAll('(', ' ( ').replaceAll(')', ' ) ').replaceAll('\n', '').trim().split(' ');
    const stack = [];
    for (let i = 0; i < result.length; i++) {
        if (result[i] == '(')
            stack.push('(');
        else if (result[i] == ')') {
            if (stack.length > 0)  
                stack.pop();
            else 
                throw new Error('ERROR: Invalid )');
        }  
        else if (result[i] == '') { // remove empty strings
            result.splice(i, 1);
            i--;
        }
    }
    if (stack.length > 0)
        throw new Error('ERROR: Was expecting a )');
    return result;
}

function readFromTokens(tokens) {
    const token = tokens.shift();
    if (token == '(') {
        const list = []; 
        while (tokens[0] != ')') {
            list.push(readFromTokens(tokens));
        }
        tokens.shift();
        return list;
    }
    if (!isNaN(parseInt(token)))
        return parseInt(token);
    return token;
}

function parenthesize(tokens) {
    const result = [];
    while (tokens.length > 0) 
        result.push(readFromTokens(tokens));
    return result;
}

