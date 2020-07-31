# React Dispatcher Util Library

A light weight🎆, extremely fast and efficient event emitter class written in TypeScript, for sending data up and down through components🔥

This is a Event Emitter Class like util function. Just like Node.js EventEmitter, you can communicate through different components in your application. But we use dispatch and subscribe, like subscribe pattern, instead of on, emit in Node.js world.

Checkout this demo : [Demo](https://codesandbox.io/s/frosty-cookies-c7n04)

# Background

In React or Vue, we all know how to pass props to manage data flow inside our application. But sometimes, we have brother components that they are not inside one another. This situation we usually would use some data management library like Redux or Context Api. 
But that would take longer time and more codes to set up. React dispatcher is made for this. Its pretty handy if you deal with shared data in different files. It lets developer easily communicate through components, making to all connected!

# Installation

`npm install react-dispatch`

or

`yarn add react-dispatch`

Then 4 main functions...

`dispatch(string, data:any)` dispatch an action, it will send whatever data you defined to subscribe function.

`on(string, () => {})` subscribe to an action, when an action got dispatched, this function will run

`once(string, () => {})` subscribe only once, similar to EventEmitter.once function in Node.js. The listener will be destroyed after first action get dispatched.

`off(string | string[])` used to clear the memory when done

# Example 

```
import React,{ useState } from 'react'
import { dispatcher } from 'react-dispatch'

const UPDATE = 'update' // good to import constant file outside

const App  = () => {

    const onClick = () => dispatcher.dispatch(UPDATE, 1)

    return(
       <button onClick={onClick}>dispatch Me.</button>
    )
  
}
```
```
import React,{ useState, useEffect } from 'react'
import { dispatcher } from 'react-dispatch'

const UPDATE = 'update' // good to import constant file outside
const AppBrotherComponent = () => {
    const [count, setCount] = useState(0)

    useEffect(() => {
        dispatcher.on(UPDATE, res => setCount(count + res));
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

```

# Provided API

`dispatcher.dispatch`
dispatch function takes string as its first argument, the data you want the subscribe function to receive is the second argument.

`dispatcher.on`
The first parameter takes EXACT same text you write in dispatch function to be able to match. The second parameter is the callback function that you do with the data from the dispatch.

`dispatcher.once`
This is similar to on function, whats different is it only gets called once. It will not work if you want to fire it multiple times.

`dispatcher.off`
This is usually used when component unmounted, and recycle the memory in case of memory leak in your application. Exp. Use in ComponentWillUnmount, etc.. It takes action you dispatched, it could be one action or array of actions.

# Better improvement?

Suggestions or issues, please open an issue on github