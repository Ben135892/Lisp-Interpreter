# Lisp-Interpreter
Program that parses and interprets LISP code. Example code:
```
(define x 5)
(define (factorial n) 
  (if (= n 1) 
    n 
    (* n (factorial (- n 1)))))
(factorial 5)
```
This code will output 120.
