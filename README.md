# Lisp-Interpreter
Write LISP code in the input box and click the evaluate button to run.
Example input code:
```
(define (factorial n) 
  (if (= n 1) 
    n 
    (* n (factorial (- n 1)))))
(define x 5)
(factorial x)
```
which will will output 120.
Can also write code to recursivly calculate the nth fibonacci number like so:
```
(define (fib n) 
(cond ((= n 0) 0)
      ((= n 1) 1)
      (else (+ (fib (- n 1)) (fib (- n 2))))))

(fib 8)
```
