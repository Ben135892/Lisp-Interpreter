# Lisp-Interpreter
Program that parses and interprets LISP code. Example input code:
```
(define x 5)
(define (factorial n) 
  (if (= n 1) 
    n 
    (* n (factorial (- n 1)))))
(factorial x)
```
This code will output 120.
Can also write code to output the nth fibonacci number like so:
```
(define (fib n) 
(cond ((= n 0) 0)
      ((= n 1) 1)
      (else (+ (fib (- n 1)) (fib (- n 2))))))

(fib 8)
```
