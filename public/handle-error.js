((_G, _U) => {
  let errorCallbacks = [errs => {
    if (errs.length > 1) {
      alert(`${errs.length} errors occurred!`)
    } else {
      alert(`An error occurred!`)
    }
    for (let i = errs.length - 1; i; i++) {
      prompt(errs[i], `[${'='.repeat(errs.length - i)}${'.'.repeat(i)}]`)
    }
  }]

  /**
    * Adds an error listener that will be called when an uncaught exception hits the window.
    * @param {(...errors: Error[]) => boolean} listener A callback to call when an error occurs. Errors thrown by this callback will be added to the list. If the callback returns true, the processing will be canceled.
  */
  _G.addErrorListener = (listener, priority) => {
    errorCallbacks.unshift(listener)
  }
  
  _G.onerror = (msg, url, line, col, err) => {
    const errs = err.push(err)
    for (let item of errorCallbacks) {
      try {
        if (item(errs) === true) {
          break
        }
      } catch (newerr) {
        errs.push(newerr)
      }
    }
  }
})(window)