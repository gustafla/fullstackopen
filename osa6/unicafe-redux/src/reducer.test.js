import deepFreeze from 'deep-freeze'
import counterReducer from './reducer'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('should return a proper initial state when called with undefined state', () => {
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('good is incremented', () => {
    const action = {
      type: 'GOOD'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0
    })
  })

  test('ok is incremented', () => {
    const action = {
      type: 'OK'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 0,
      ok: 1,
      bad: 0
    })
  })

  test('bad is incremented', () => {
    const action = {
      type: 'BAD'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 0,
      ok: 0,
      bad: 1
    })
  })

  test('can be zeroed', () => {
    const state = initialState
    deepFreeze(state)

    const newState = counterReducer(state, { type: 'BAD' })
    deepFreeze(newState)

    const twiceState = counterReducer(newState, { type: 'BAD' })
    deepFreeze(twiceState)

    expect(twiceState).toEqual({
      good: 0,
      ok: 0,
      bad: 2
    })

    const action = {
      type: 'ZERO'
    }

    const zeroedState = counterReducer(twiceState, action)
    expect(zeroedState).toEqual({
      good: 0,
      ok: 0,
      bad: 0
    })
  })
})