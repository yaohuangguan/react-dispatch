# React Dispatcher Util Library

This is a Event Emitter Class like util function. Just like Node.js EventEmitter, you can communicate through different components in your application. But we use dispatch and subscribe, like subscribe pattern, instead of on, emit in Node.js world.

# Installation

`npm install react-dispatch`

or

`yarn add react-dispatch`

Then...

```
import React,{ useState, useEffect } from 'react'
import { dispatcher } from 'react-dispatch'

const UPDATE = 'update' // good to import constant file outside

const App  = () => {

    const onClick = () => dispatcher.dispatch(UPDATE, 'hi,i am here!')

    return(
       <button onClick={onClick}>dispatch Me.</button>
    )
  
}

const AppBrotherComponent = () => {
    const [data, setData] = useState('')

    useEffect(() => {
        dispatcher.subscribe(UPDATE, res => setData(res));
        // whenever it receives a dispatch, it will fire the callback. 
        return () => {
            dispatcher.off(UPDATE)
        }
    },[])

    return (
        <p>
        Data received from dispatch: {data}
        </p>
    )
}
export default App

```

# Provided API

`dispatcher.dispatch(string:string, data:any)`
dispatch function takes string as its first argument, the data you want the subscribe function to receive is the second argument.

`dispatcher.subscribe(string:string, callback)`
The first parameter of subscribe function takes EXACT same text you write in dispatch function to be able to match. The second parameter is the callback function that you do with the data from the dispatch.

`dispatcher.off(string:string)`
This is usually used when component unmounted, and recycle the memory in case of memory leak in your application. Exp. Use in ComponentWillUnmount, etc..

# Better improvement?

Contact me at yaob@miamioh.edu
