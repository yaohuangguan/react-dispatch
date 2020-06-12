# What is this package?

This is a Event Emitter Class like util function. Just like Node.js EventEmitter, you can communicate through different components in your application.

# Installation

`npm install event-emitter`

or

`yarn add event-emitter`

Then...

```
import React,{ Fragment,useEffect } from 'react'
import { EventEmitter } from 'event-emitter'
const UPDATE = 'update'
const App  = () => {
    const onClick = () => EventEmitter.dispatch(UPDATE, 'hi,i am here!')
    return(
       <button onClick={onClick}> dispatch </button>
    )
  
}

const Child = () => {
    const [data, setData] = useState('')
    useEffect(() => {
        EventEmitter.subscribe(UPDATE, res => setData(res));
        // whenever it receives a dispatch, it will fire the callback. 
        return () => {
            EventEmitter.off(UPDATE)
        }
    },[])
    return (
        <>
        {data}
        </>
    )
}

```

# Provided API

`EventEmitter.dispatch(string:string, data:any)`
dispatch function takes string as its first argument, the data you want the subscribe function to receive is the second argument.

`EventEmitter.subscribe(string:string, callback)`
The first parameter of subscribe function takes EXACT same text you write in dispatch function to be able to match. The second parameter is the callback function that you do with the data from the dispatch.

`EventEmitter.off(string:string)`
This is usually used when component unmounted, and recycle the memory in case of memory leak in your application. Exp. Use in ComponentWillUnmount, etc..

# Better improvement?

Contact me at yaob@miamioh.edu
