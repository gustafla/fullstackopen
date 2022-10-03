import React from 'react'

const ContactForm = ({ nameValue, handleNameChange, numberValue, handleNumberChange, handleSubmitClick }) => {
  return (
    <form>
      <div>
        name: <input value={nameValue} onChange={handleNameChange} />
        number: <input value={numberValue} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit" onClick={handleSubmitClick}>add</button>
      </div>
    </form>
  )
}

export default ContactForm
