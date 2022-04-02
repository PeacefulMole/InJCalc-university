import React, {useEffect, useRef, useState} from 'react';
import s from './calc.module.scss'

const Calc = () => {
    // Это все Хуки React Js
    const [currentValue, setCurrentValue] = useState('0')
    const [pastValue, setPastValue] = useState('')
    const [mark, setMark] = useState('')

    const refValue = useRef()
    const refPastValue = useRef()
    const refMark = useRef()

    useEffect(() => {
        /* Почему Тут именно такой код? Это изменение содержимое тега div.
        Но вот почему нельзя было сократиться 8 строк кода в 3 маленьких слова?

        Пример:
            <div>{currentValue}</div>
            <div>{pastValue}</div>
            <div>{mark}</div>

        Причиной тому стала Очень странная ошибка со стороны NextJs. Как бы ошибка и правда вроде существует, но как бы
        ее и не должно быть. Сама ошибка: "Text content does not match server-rendered HTML."
        Ошибка появляется из-за того, что компилятор первичной разметки HTML, не может создать как раз таки эту разметку
        из-за того что "типа" в разметке есть код который рендерится "Динамически" не сразу, то есть компилятор ругался
        на Хук UseState, но это глупо, ибо useState сразу имеет уже определенное значение.
        Тут 3 варианта:
        1) Баг новой версии Next Js
        2) Обновление ReactJs или компилятора Next Js
        3) Я тупанул, и ошибка на самом деле в какой-то другой части кода

        Так-что я не знаю правильный ли код ниже(Под правильностью я имею в виду - что это не говно код)
        */
        if (currentValue === 'Infinity' || currentValue === 'NaN') {
            setCurrentValue('0')
        }
        refValue.current.innerHTML = currentValue !== 'Infinity' || currentValue === 'NaN' ? currentValue : '0'
        refValue.current.innerHTML = currentValue
        refPastValue.current.innerHTML = pastValue
        refMark.current.innerHTML = mark
    }, [currentValue, pastValue, mark])

    const markRecord = (value) => {
        // Проверка на наличие Знака, если его нету мы его добавляем и перекидываем тек число в прошлое
        if (mark === "" && currentValue !== '0') {
            setMark(value)
            setPastValue(currentValue)
            setCurrentValue('0')
        }
        // Изменение знака если ты случайно кликнул по другому
        else if (currentValue === '0' && pastValue !== '') {
            setMark(value)
        }
            // При выборе нового знака, если есть что-то в прошлом числе и в текущем, производим вычисление которое было
        // выбрано, после чего результат вычислений попадает в прошлое число и знак меняется на выбранный
        else if (mark !== '' && pastValue !== '' && currentValue !== '0') {
            setPastValue(String(resultMath(pastValue, mark, currentValue)))
            console.log((resultMath(pastValue, mark, currentValue)))
            setMark(value)
            setCurrentValue('0')
        }
    }
    const numbers = (value) => {
        // Если число первое число 0(Default), мы полностью заменяем его на выбранное число
        if (currentValue === '0') {
            setCurrentValue(String(value))
        }
        //  Добавляем числа в конец строки
        else {
            setCurrentValue(`${currentValue}${value}`)
        }
    }
    const lastSymbolDelete = () => {
        // Если число не является Нулем, и его длина больше 1 символа мы удаляем последний символ строки
        if (currentValue !== '0' && currentValue.length !== 1) {
            setCurrentValue(currentValue.substring(0, currentValue.length - 1))
        }
        // Если у нас всего одно число в строке, мы заменяем его на Default число 0
        else if (currentValue.length === 1 && currentValue !== '0') {
            setCurrentValue('0')
        }
            // Если Строка текущего числа пуста, но у нас стоит знак и прошлое число, мы "Удаляем" знак и перемещаем прошлое
        // число в текущее, не забывая про "Удаление" прошлого числа
        else if (currentValue === '0' && mark !== '' && pastValue !== '') {
            setCurrentValue(pastValue)
            setMark('')
            setPastValue('')
        }
    }

    const point = () => {
        // Проверка на существование точки в текущем значении, если ее нет, мы ее добавляем
        if (typeof currentValue == "string" && currentValue.includes('.') === false) {
            numbers('.') // Добавляется знак "." если в числе нету точки
        }
    }

    // Полная замена всего содержимого Текущего значения
    const fullFillNumbers = (value) => {
        setCurrentValue(String(value))
    }

    const resultMath = (pastValue, mark, value) => {
        let pastValueN = Number(pastValue)
        let valueN = Number(value)
        switch (mark) {
            case '/':
                return pastValueN / valueN
            case '*':
                return pastValueN * valueN
            case '-':
                return pastValueN - valueN
            case '+':
                return pastValueN + valueN
            case '^':
                return pastValueN ** valueN
        }
    }

    // Вычисление результата выражения
    const resultBtn = () => {
        if (!pastValue) return
        setCurrentValue(String(resultMath(pastValue, mark, currentValue)))
        setMark('')
        setPastValue('')
    }

    // Очищение всех полей
    const CE = () => {
        setPastValue('')
        setMark('')
        setCurrentValue('0')
    }

    // 1/x
    const OneDividedX = () => {
        // если в текущем значении у нас нет чисел, но у нас есть знак(Без знака не может существовать прошлое значение)
        // мы делаем вычисления с прошлым значением, и найденый ответ перемещаем в текущее значение
        if (mark !== '' && currentValue === '0') {
            setCurrentValue(String(resultMath('1', '/', pastValue)))
            setMark('')
            setPastValue('')
        }
        // Если СУЩЕСВУЕТ текущее значение, мы проводим вычисления с ним
        else {
            setCurrentValue(String(resultMath('1', '/', currentValue)))
            setMark('')
            setPastValue('')
        }
    }

    function factorialMath(n) {
        return n ? n * factorialMath(n - 1) : 1;
    }

    const factorial = () => {
        const number = (value) => value.includes('.') === false ?
            Number(value) :
            Number(value.split('.')[0])

        if (mark !== '' && currentValue === '0') {
            fullFillNumbers(factorialMath(number(pastValue)))
            setMark('')
            setPastValue('')
        } else {
            fullFillNumbers(factorialMath(number(currentValue)))
            setMark('')
            setPastValue('')
        }
    }

    const ModuleX = () => {
        if (mark !== '' && currentValue === '0') {
            fullFillNumbers(Math.abs(Number(pastValue)))
            setMark('')
            setPastValue('')
        } else {
            fullFillNumbers(Math.abs(Number(currentValue)))
            setMark('')
            setPastValue('')
        }
    }

    const twoDegreeX = () => {
        if (mark !== '' && currentValue === '0') {
            fullFillNumbers(Number(pastValue ** 2))
            setMark('')
            setPastValue('')
        } else {
            fullFillNumbers(Number(currentValue ** 2))
            setMark('')
            setPastValue('')
        }
    }

    const Square = () => {
        const number = (n) => Math.abs(Number(n))

        if (mark !== '' && currentValue === '0') {
            fullFillNumbers(Math.sqrt(number(pastValue)))
            setMark('')
            setPastValue('')
        } else {
            fullFillNumbers(Math.sqrt(number(currentValue)))
            setMark('')
            setPastValue('')
        }
    }
    const degreeTenX = () => {
        const number = (n) => Number(n)

        if (mark !== '' && currentValue === '0') {
            fullFillNumbers(10 ** number(pastValue))
            setMark('')
            setPastValue('')
        } else {
            fullFillNumbers(10 ** number(currentValue))
            setMark('')
            setPastValue('')
        }
    }

    const log = () => {
        const number = (n) => Math.abs(Number(n))

        if (mark !== '' && currentValue === '0') {
            fullFillNumbers(Math.log(number(pastValue)) / Math.log(10))
            setMark('')
            setPastValue('')
        } else {
            fullFillNumbers(Math.log(number(currentValue)) / Math.log(10))
            setMark('')
            setPastValue('')
        }
    }

    const ln = () => {
        const number = (n) => Math.abs(Number(n))

        if (mark !== '' && currentValue === '0') {
            fullFillNumbers(Math.log(number(pastValue)))
            setMark('')
            setPastValue('')
        } else {
            fullFillNumbers(Math.log(number(currentValue)))
            setMark('')
            setPastValue('')
        }
    }

    const plusOrMinus = () => {
        if (currentValue === '0' || currentValue === '-0') {
            return null
        }

        else if (currentValue.includes('-') === false) {
            setCurrentValue('-' + currentValue)
        }
        else {
            setCurrentValue(currentValue.split('-')[1])
        }
    }

    return (
        <div className={s.body}>
            <div className={s.wrapper}>
                <div className={s.output}>
                    <div className={s.items} ref={refPastValue}/>
                    <div className={s.items} ref={refMark}/>
                    <div className={s.items} ref={refValue}>0</div>
                </div>
                <div className={s.calc_area}>
                    <div className={s.item} onClick={twoDegreeX}>x
                        <div className={s.uppercase}>2</div>
                    </div>
                    <div className={s.item} onClick={() => fullFillNumbers(Math.PI)}>π</div>
                    <div className={s.item} onClick={() => fullFillNumbers(Math.E)}>e</div>
                    <div className={s.item} onClick={CE}>CE</div>
                    <div className={s.item} onClick={lastSymbolDelete}>удалить</div>
                    <div className={s.item} onClick={Square}>
                        <div className={s.uppercase}>2</div>
                        √x
                    </div>
                    <div className={s.item} onClick={OneDividedX}>1/x</div>
                    <div className={s.item} onClick={ModuleX}>|x|</div>
                    <div className={s.item} onClick={factorial}>n!</div>
                    <div className={s.item} onClick={() => markRecord("/")}>/</div>
                    <div className={s.item} onClick={() => markRecord('^')}>x
                        <div className={s.uppercase}>y</div>
                    </div>
                    <div className={s.item} onClick={() => numbers(7)}>7</div>
                    <div className={s.item} onClick={() => numbers(8)}>8</div>
                    <div className={s.item} onClick={() => numbers(9)}>9</div>
                    <div className={s.item} onClick={() => markRecord("*")}>X</div>
                    <div className={s.item} onClick={degreeTenX}>10
                        <div className={s.uppercase}>x</div>
                    </div>
                    <div className={s.item} onClick={() => numbers(4)}>4</div>
                    <div className={s.item} onClick={() => numbers(5)}>5</div>
                    <div className={s.item} onClick={() => numbers(6)}>6</div>
                    <div className={s.item} onClick={() => markRecord("-")}>-</div>
                    <div className={s.item} onClick={log}>log</div>
                    <div className={s.item} onClick={() => numbers(1)}>1</div>
                    <div className={s.item} onClick={() => numbers(2)}>2</div>
                    <div className={s.item} onClick={() => numbers(3)}>3</div>
                    <div className={s.item} onClick={() => markRecord("+")}>+</div>
                    <div className={s.item} onClick={ln}>ln</div>
                    <div className={s.item} onClick={plusOrMinus}>+/-</div>
                    <div className={s.item} onClick={() => numbers(0)}>0</div>
                    <div className={s.item} onClick={point}>.</div>
                    <div className={s.item} onClick={resultBtn}>=</div>
                </div>
            </div>
        </div>
    );
};

export default Calc;