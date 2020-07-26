const {createMachine, interpret, assign} = XState

const dragDropMachine = createMachine({
    initial: 'idle',
    context: {
        // position of box
        x: 0,
        y: 0,
        // where you clicked
        pointerx: 0,
        pointery: 0,
        dx: 0, // how far is x
        dy: 0 // how far is y
    },
    states: {
        idle: {
            on:{
              //event: nextState
              mousedown: {
                  target:'dragging',
                  // sideeffecr somewhere here,
                  actions: assign((context, MouseEvent)=>{ return {
                      ...context,
                      pointerx: MouseEvent.clientX,
                      pointery: MouseEvent.clientY
                  }
                      
                  })
                }  
            }
        },
        dragging: {
            on: {
                mousemove: {
                    target:'dragging',
                    actions: assign((context, MouseEvent)=>{ return {
                        ...context,
                        dx: MouseEvent.clientX - context.pointerx,
                        dy: MouseEvent.clientY - context.pointery
                    }
                        
                    })
                },
                mouseup: {
                    target: 'idle',
                    actions: assign((context)=>{
                        return {
                            ...context,
                            x: context.x + context.dx,
                            y: context.y + context.dy,
                            dx: 0,
                            dy: 0
                        }
                    })
                    // change context.x and context.y
                }
            }
        }
    }
})
const body = document.body
const box = document.getElementById('box')

const dragDropService = interpret(dragDropMachine)
    .onTransition(state => {
    console.log(state.context)
    box.style.setProperty('left', 
    // where the box is + how far the box moved
    state.context.x+ state.context.dx + 'px')

    box.style.setProperty('top', state.context.y + state.context.dy + 'px')

     body.dataset.state = state.toStrings().join(' ')
})
.start()


body.addEventListener('mousedown', (event)=>{
    //service.send(event)
    //event.clientX
    //event.clientY
    dragDropService.send(event)

})
body.addEventListener('mouseup', (event)=>{
    //service.send(event)
    dragDropService.send(event)

})

body.addEventListener('mousemove', event =>{
    dragDropService.send(event)
})