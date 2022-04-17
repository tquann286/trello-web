export const handleOnEnterDown = (event, action) => {
  if (event.key === 'Enter') {
    event.target[`${action}`]()
  }
}

export const onSelectALlInlineText = (e) => {
  e.target.select() 
  // or: document.execCommand('selectAll', false, null) (This feature is no longer recommended. Though some browsers might still support it)
}