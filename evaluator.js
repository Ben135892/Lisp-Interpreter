function eval(exp, env) {
    if (isSelfEvaluating(exp))
        return value(exp);
    if (isVariable(exp))
        return lookupVariableValue(exp, env);
    if (isQuoted(exp))
        return (textOfQuotation(exp));
    if (isAssignment(exp))
        return evalAssignment(exp, env);
    if (isDefinition(exp))
        return evalDefinition(exp, env);
    if (isIf(exp))
        return evalIf(exp, env);
    if (isLambda(exp))
        return makeProcedure(lambdaParameters(exp), lambdaBody(exp), env);
    if (isApplication(exp))
        return apply(eval(operator(exp), env), listOfValues(operands(exp), env));
    throw new Error('ERROR: Unknown expression in EVAL - ' + exp);
}

function apply(procedure, arguments) {
    if (isPrimitiveProcedure(procedure)) 
        return applyPrimitiveProcedure(procedure, arguments);
    else if (isCompoundProcedure(procedure)) {
        const newEnv = extendEnvironment(procedureParameters(procedure), arguments, procedureEnvironment(procedure));
        return evalSequence(procedureBody(procedure), newEnv);
    }
    throw new Error('ERROR: Unknown procedure type in APPLY - ' + procedure);
}

function listOfValues(exps, env) {
    return exps.map(x => eval(x, env));
}

function firstExp(exps) { return exps[0]; }
function isLastExp(exps) { return exps.length == 1; }

function evalSequence(exps, env) {
    if (isLastExp(exps))
        return eval(firstExp(exps), env);
    eval(exps[0], env);
    return evalSequence(exps.slice(1), env);
}

// if statements
function isTrue(exp) { return exp != false; }
function isFalse(exp) { return exp == false; }
function isIf(exp) { return isTaggedList(exp, 'if'); }
function ifPredicate(exp) { return exp[1]; }
function ifConsequent(exp) { return exp[2]; }

function ifAlternative(exp) { 
    if (exp[3])
        return exp[3];
    return 'false'; 
}

function evalIf(exp, env) {
    const predicate = eval(ifPredicate(exp), env);
    if (isTrue(predicate))
        return eval(ifConsequent(exp), env);
    return eval(ifAlternative(exp), env);
}

// assignment
function isAssignment(exp) {
    return isTaggedList(exp, 'set!');
}
function assignmentVariable(exp) { return exp[1]; }
function assignmentValue(exp) { return exp[2]; }

function evalAssignment(exp, env) {
    const value = eval(assignmentValue(exp), env);
    setVariableValue(assignmentVariable(exp), value, env);
    return 'ok';
}

//definition
function isDefinition(exp) {
    return isTaggedList(exp, 'define');
}

function definitionVariable(exp) {
    if (typeof exp[1] == 'string')
        return exp[1];
    return exp[1][0];
}

function definitionValue(exp) {
    if (!Array.isArray(exp[1]))
        return exp[2];
    return makeLambda(exp[1].slice(1), exp[2]); // parameters and body
}

function evalDefinition(exp, env) {
    const value = eval(definitionValue(exp), env);
    defineVariable(definitionVariable(exp), value, env);
    return 'ok';
}

// self evaluating
function isNumber(exp) { return typeof exp == 'number'; }
function isString(exp) { return typeof exp == 'string' && exp[0] == '"' && exp.slice(-1) == '"'; }
function isSelfEvaluating(exp) {
    return isNumber(exp) || isString(exp);
}

function value(exp) {
    if (isString(exp))
        return exp.slice(1, -1);
    return exp;
}

//variables
function isVariable(exp) {
    return typeof exp == 'string';
}

function isTaggedList(exp, tag) {
    return Array.isArray(exp) && exp[0] == tag;
}

function isQuoted(exp) {
    return isTaggedList(exp, 'quote');
}
function textOfQuotation(exp) { return exp[1]; }

// begin


// lambda expressions
function isLambda(exp) { return isTaggedList(exp, 'lambda'); }
function lambdaParameters(exp) { return exp[1]; }
function lambdaBody(exp) { return exp.slice(2); }
function makeLambda(parameters, body) { return ['lambda', parameters, body]; }

// application
function isApplication(exp) { 
    return Array.isArray(exp);
}
function operator(exp) { return exp[0]; }
function operands(exp) { return exp.slice(1); }

function makeProcedure(parameters, body, env) {
    return ['procedure', parameters, body, env];
}
function isCompoundProcedure(p) { 
    return isTaggedList(p, 'procedure');
 }

function procedureParameters(p) { return p[1]; }
function procedureBody(p) { return p[2]; }
function procedureEnvironment(p) { return p[3]; }

// environments
function enclosingEnvironment(env) { return env[1]; }
function firstFrame(env) { return env[0]; }
const theEmptyEnvironment = null;

function makeFrame(variables, values) { return [variables, values]; }
function frameVariables(frame) { return frame[0]; }
function frameValues(frame) { return frame[1]; }
function addBindingToFrame(variable, value, frame) {
    frameVariables(frame).unshift(variable);
    frameValues(frame).unshift(value);
}

function extendEnvironment(vars, vals, baseEnv) {
    if (vars.length == vals.length)
        return [makeFrame(vars, vals), baseEnv];
    if (vars.length < vals.length)
        throw Error('ERROR: Too many arguments supplied - ', + vars + vals);
    else 
        throw Error('ERROR: Too few arguments supplied - ', + vars + vals);
}

function empty(arr) { return arr.length == 0; }
function lookupVariableValue(variable, env) {
    while (env != theEmptyEnvironment) {
        const vars = frameVariables(firstFrame(env));
        const vals = frameValues(firstFrame(env));
        for (let i = 0; i < vars.length; i++) {
            if (variable == vars[i]) 
                return vals[i];
        }
        env = enclosingEnvironment(env);
    }
    throw new Error('ERROR: Unbound variable - ' + variable);
}

function setVariableValue(variable, value, env) {
    while (env != theEmptyEnvironment) {
        const vars = frameVariables(firstFrame(env));
        const vals = frameValues(firstFrame(env));
        for (let i = 0; i < vars.length; i++) {
            if (variable == vars[i]) {
                vals[i] = value;
                return;
            }
        }
        env = enclosingEnvironment(env);
    }
    throw new Error('ERROR: Unbound variable in SET! - ' + variable);
}

function defineVariable(variable, value, env) {
    const frame = firstFrame(env);
    const vars = frameVariables(frame);
    const vals = frameValues(frame);
    for (let i = 0; i < vars.length; i++) {
        if (variable == vars[i]) {
            vals[i] = value;
            return;
        }
    }
    addBindingToFrame(variable, value, frame);
}

function setupEnvironment() {
    const initialEnv = extendEnvironment(primitiveProcedureNames(), primitiveProcedureObjects(), theEmptyEnvironment);
    defineVariable('false', false, initialEnv);
    defineVariable('true', true, initialEnv);
    return initialEnv;
}

function isPrimitiveProcedure(proc) { return isTaggedList(proc, 'primitive'); }
function primitiveImplementation(proc) { return proc[1]; }

const primitiveProcedures = [
    ['+', (args) => args[0] + args[1]],
    ['*', (args) => args[0] * args[1]],
    ['-', (args) => args[0] - args[1]],
    ['/', (args) => args[0] / args[1]],
    ['=', (args) => args[0] == args[1]],
];

function primitiveProcedureNames() { return primitiveProcedures.map(x => x[0]); }
function primitiveProcedureObjects() { return primitiveProcedures.map(x => ['primitive', x[1]]); }
function applyPrimitiveProcedure(proc, args) { return primitiveImplementation(proc)(args); }

const globalEnv = setupEnvironment();
try {   
    //eval( ['define', 'factorial', ['lambda', ['x'], ['if', ['=', 'x', 1], 'x', ['*', 'x', ['factorial', ['-', 'x', 1]]]] ]] , globalEnv);
    //console.log(eval( ['define', ['factorial', 'x'], ['if', ['=', 'x', 1], 1, ['*', 'x', ['factorial', ['-', 'x', 1]]] ] ] , globalEnv));
    //eval(['define', 'x', 2], globalEnv);
    // (define y 2), (define (factorial x) (if (= x 1) 1 (...)))
    //console.log(eval('x', globalEnv));
    //console.log(eval(['factorial', 8], globalEnv));
} 
catch(err) {
    console.log(err);
}
