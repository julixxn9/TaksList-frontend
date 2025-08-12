// unknown  
    function imprimirAlgo(que: unknown) {
        if(typeof que === 'string') {
            console.log(que);
        }
        if (typeof que === 'number') {
            console.log(que);
        }
        if (typeof que === 'boolean') {
            console.log(que);
        }
    }
    imprimirAlgo(2)
    imprimirAlgo("hola")
    imprimirAlgo(true)

    // inferencia

    const numero = 2
    console.log(numero) 


    // enums replacement with union type
    type Color = 'ROJO' | 'AZUL' | 'VERDE';

    let color: Color = 'ROJO';
    color = 'AZUL';
    console.log(color);
