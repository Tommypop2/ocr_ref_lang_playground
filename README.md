# OCR Reference Language Playground

## About

This project aims to transpile OCR reference language from the OCR exam board into javascript, which can be easily run in the browser. This project was simply made for fun, and isn't intended to make OCR Reference Language viable as a computer language. Therefore, the compiler itself is very basic - parsing line-by-line, and making most of its AST processing whilst building the output JS code.

The playground itself uses monaco to create an editor, whose contents are recompiled upon change into javascript, which can be seen in the Output tab. The Result tab displays the program's output, whilst also getting the program's input. The solution for getting inputs is incredibly hacky, and is the entire reason behind all function declarations are marked with async, and all function calls are marked with await as the result worker cannot be blocked while it waits for input, otherwise the message with the input data would never be read.
