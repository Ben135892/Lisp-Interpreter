// output an expression into LISP form, returning the string "<procedure>" if a procedure,
// to avoid printing out parameters, procedure body and enclosing body, which may be very long (or contain loops).
function outputExp(exp) {
    if (isCompoundProcedure(exp) || isPrimitiveProcedure(exp)) 
        return '<procedure>';
    if (!Array.isArray(exp))
        return exp;
    let output = '(';
    for (let i = 0; i < exp.length; i++) {
        output += outputExp(exp[i]);
        if (i < exp.length - 1)
            output += ' ';
    }
    return output + ')';
}