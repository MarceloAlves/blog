import React from 'react'
import Button from '../../../components/Button'
import { mq } from '../../../utils'
import { useSpacing } from '@kyleshevlin/layout'

const toEventObject = event => {
  if (typeof event === 'string') {
    return { type: event }
  }

  return event
}

const toTransitionObject = transition => {
  if (typeof transition === 'string') {
    return { target: transition }
  }

  return transition
}

const initialState = {
  current: 'unlit',
  data: {
    color: 'white',
  },
}

const BREAK_EVENT = {
  BREAK: {
    target: 'broken',
    cond: () => false,
  },
}
const RESET_EVENT = { RESET: initialState.current }

const NEXT_STATE_GRAPH = {
  lit: {
    ...BREAK_EVENT,
    ...RESET_EVENT,
    CHANGE_COLOR: 'lit',
    TOGGLE: 'unlit',
  },
  unlit: {
    ...BREAK_EVENT,
    ...RESET_EVENT,
    TOGGLE: 'lit',
  },
  broken: {
    ...RESET_EVENT,
  },
}

const stateReducer = (state, event) => {
  const nextState = NEXT_STATE_GRAPH[state.current][event.type]

  if (!nextState) return

  const possibleTransition = toTransitionObject(nextState)
  // Use default assignment to guarantee that `cond`
  // is a function and returns true if it's undefined
  const { target, cond = () => true } = possibleTransition

  if (cond()) {
    return target
  }

  return
}

const DATA_UPDATERS = {
  CHANGE_COLOR: (data, eventObj) => ({ ...data, color: eventObj.color }),
  RESET: () => initialState.data,
}

const dataReducer = (data, eventObj) => {
  const updater = DATA_UPDATERS[eventObj.type]
  return updater ? updater(data, eventObj) : data
}

const reducer = (state, event) => {
  const eventObj = toEventObject(event)
  const nextState = stateReducer(state, eventObj)

  if (!nextState) return state

  const nextData = dataReducer(state.data, eventObj)

  return {
    current: nextState,
    data: nextData,
  }
}

const normalEvents = ['TOGGLE', 'BREAK', 'RESET']
const colors = ['white', 'red', 'blue', 'green']

const COLOR_MAP = {
  white: '#feffeb',
  red: '#ff674f',
  blue: '#5cb6ff',
  green: '#8ff244',
}

export default function IndestructableBulb() {
  const bs = useSpacing()
  const [state, send] = React.useReducer(reducer, initialState)
  const { current, data } = state

  return (
    <div
      css={{
        alignItems: 'center',
        border: '2px solid var(--colors-accent)',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        marginBottom: bs(1),
        marginTop: bs(1),
        padding: bs(1),
        textAlign: 'center',

        [mq.bravo]: {
          display: 'grid',
          gridGap: bs(1),
          gridTemplateColumns: 'auto 150px',
          gridTemplateAreas: `
            'heading bulb'
            'events bulb'
            'colors bulb'
            'code bulb'
          `,
          textAlign: 'left',
        },

        [mq.delta]: {
          gridColumnGap: bs(2),
          gridTemplateColumns: 'auto 300px',
        },
      }}
    >
      <div css={{ gridArea: 'heading' }}>
        <h4 css={{ marginBottom: 0 }}>Indestructable Bulb</h4>
      </div>
      <div
        css={{
          gridArea: 'bulb',
          marginTop: bs(1),
          marginBottom: bs(0.5),
          [mq.bravo]: {
            marginTop: 0,
            marginBottom: 0,
          },
        }}
      >
        <div
          css={{
            width: 75,

            [mq.alpha]: {
              width: 150,
            },

            [mq.delta]: {
              width: 300,
            },
          }}
        >
          {current === 'unlit' && <BulbSVG color="none" />}
          {current === 'lit' && <BulbSVG color={COLOR_MAP[data.color]} />}
          {current === 'broken' && <BrokenBulbSVG />}
        </div>
      </div>
      <pre
        css={{
          background: 'var(--colors-offset)',
          marginBottom: bs(1),
          marginTop: 0,
          padding: `%{bs(.5)} ${bs(1)}`,
          textAlign: 'left',
          gridArea: 'code',

          [mq.bravo]: {
            marginBottom: 0,
          },
        }}
      >
        <code>{JSON.stringify(state, null, 2)}</code>
      </pre>
      <div
        css={{
          marginBottom: bs(1),
          gridArea: 'events',
          [mq.bravo]: {
            marginBottom: 0,
          },
        }}
      >
        <div>Events</div>
        <div css={{ 'button + button': { marginLeft: bs(0.5) } }}>
          {normalEvents.map(event => (
            <Button key={event} onClick={() => send(event)}>
              {event}
            </Button>
          ))}
        </div>
      </div>

      <div
        css={{
          marginBottom: bs(1),
          gridArea: 'colors',
          [mq.bravo]: {
            marginBottom: 0,
          },
        }}
      >
        <div>Change Colors</div>
        <div css={{ 'button + button': { marginLeft: bs(0.5) } }}>
          {colors.map(color => (
            <Button
              key={color}
              onClick={() => send({ type: 'CHANGE_COLOR', color })}
            >
              {color}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

function BulbSVG({ color = '#000' }) {
  return (
    <svg
      width="100%"
      viewBox="0 0 279 509"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M86 399H192H193V399.049C198.053 399.551 202 403.815 202 409C202 414.185 198.053 418.449 193 418.951V419.049C198.053 419.551 202 423.815 202 429C202 434.185 198.053 438.449 193 438.951V439.049C198.053 439.551 202 443.815 202 449C202 454.185 198.053 458.449 193 458.951V459.049C198.053 459.551 202 463.815 202 469C202 474.185 198.053 478.449 193 478.951V479.049C198.053 479.551 202 483.815 202 489C202 494.185 198.053 498.449 193 498.951V509H86C80.4771 509 76 504.523 76 499C76 493.477 80.4771 489 86 489C80.4771 489 76 484.523 76 479C76 473.477 80.4771 469 86 469C80.4771 469 76 464.523 76 459C76 453.477 80.4771 449 86 449C80.4771 449 76 444.523 76 439C76 433.477 80.4771 429 86 429C80.4771 429 76 424.523 76 419C76 413.477 80.4771 409 86 409V399Z"
        fill={'var(--components-lightBulb-fill)'}
      />
      <path
        d="M277 139.5C277 165.474 265.948 192.278 253.728 215.619C248.665 225.291 243.432 234.312 238.736 242.41C237.774 244.068 236.835 245.688 235.924 247.266C230.607 256.48 226.187 264.416 224.112 270.339C222.048 276.232 219.775 287.25 217.529 300.296C215.273 313.399 213.02 328.711 211.019 343.293C209.017 357.878 207.266 371.747 206.015 381.969C205.389 387.08 204.889 391.28 204.545 394.203C204.412 395.333 204.302 396.273 204.218 397H74.7832C74.6982 396.267 74.5876 395.318 74.4531 394.175C74.107 391.235 73.6027 387.01 72.9694 381.872C71.7028 371.595 69.92 357.661 67.8554 343.03C65.7912 328.404 63.4431 313.066 61.0453 299.988C58.6606 286.982 56.1928 276.009 53.853 270.247C51.5398 264.552 47.0803 256.735 41.8127 247.557L41.2324 246.546C36.0625 237.54 30.1051 227.163 24.4098 215.899C12.5695 192.484 2 165.497 2 139.5C2 63.5608 63.5608 2 139.5 2C215.439 2 277 63.5608 277 139.5Z"
        stroke={'var(--components-lightBulb-fill)'}
        strokeWidth="4"
        fill={color}
      />
      <path
        d="M76 193L100.478 399M202 193L180.331 399"
        stroke={'var(--components-lightBulb-fill)'}
        strokeWidth="4"
      />
      <path
        d="M76 194.561C76 194.561 104.767 179.886 110.233 171.201C115.699 162.516 119.151 150.237 117.425 136.761C115.699 123.284 115.699 117.594 106.781 116.995C97.863 116.396 90.9589 137.06 91.5342 151.435C92.1096 165.811 93.5479 171.8 102.753 184.079C111.959 196.358 116.274 198.454 125.767 198.454C135.26 198.454 140.726 193.962 146.479 180.485C152.233 167.008 154.247 159.521 154.247 148.441C154.247 137.36 147.63 114 139.863 114C132.096 114 125.767 134.365 125.767 148.441C125.767 162.516 126.918 170.602 130.37 180.485C133.822 190.368 143.603 194.561 154.247 194.561C164.89 194.561 172.658 190.368 178.411 180.485C184.164 170.602 185.027 163.115 186.753 151.435C188.479 139.756 186.753 114 178.411 114C170.068 114 164.315 137.36 165.466 151.435C166.616 165.511 171.219 176.292 171.219 176.292C171.219 176.292 178.411 187.972 186.753 194.561C195.096 201.15 202 198.454 202 198.454"
        stroke={'var(--components-lightBulb-fill)'}
        strokeWidth="4"
      />
    </svg>
  )
}

function BrokenBulbSVG() {
  return (
    <svg
      width="100%"
      viewBox="0 0 279 509"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M86 399H192H193V399.049C198.053 399.551 202 403.815 202 409C202 414.185 198.053 418.449 193 418.951V419.049C198.053 419.551 202 423.815 202 429C202 434.185 198.053 438.449 193 438.951V439.049C198.053 439.551 202 443.815 202 449C202 454.185 198.053 458.449 193 458.951V459.049C198.053 459.551 202 463.815 202 469C202 474.185 198.053 478.449 193 478.951V479.049C198.053 479.551 202 483.815 202 489C202 494.185 198.053 498.449 193 498.951V509H86C80.4772 509 76 504.523 76 499C76 493.477 80.4772 489 86 489C80.4772 489 76 484.523 76 479C76 473.477 80.4772 469 86 469C80.4772 469 76 464.523 76 459C76 453.477 80.4772 449 86 449C80.4772 449 76 444.523 76 439C76 433.477 80.4772 429 86 429C80.4772 429 76 424.523 76 419C76 413.477 80.4772 409 86 409V399Z"
        fill={'var(--components-lightBulb-fill)'}
      />
      <path
        d="M277 139.5C277 165.474 265.948 192.278 253.728 215.619C248.665 225.291 243.432 234.312 238.736 242.41C237.774 244.068 236.835 245.688 235.924 247.266C230.607 256.48 226.187 264.416 224.112 270.339C222.048 276.232 219.775 287.25 217.529 300.296C215.273 313.399 213.02 328.711 211.019 343.293C209.017 357.878 207.266 371.747 206.015 381.969C205.389 387.08 204.889 391.28 204.545 394.203C204.412 395.333 204.302 396.273 204.218 397H74.7832C74.6982 396.267 74.5876 395.318 74.4531 394.175C74.107 391.235 73.6027 387.01 72.9694 381.872C71.7028 371.595 69.92 357.661 67.8554 343.03C65.7912 328.404 63.4431 313.066 61.0453 299.988C58.6606 286.982 56.1928 276.009 53.853 270.247C51.5398 264.552 47.0803 256.735 41.8127 247.557L41.2324 246.546C36.0625 237.54 30.1051 227.163 24.4098 215.899C12.5695 192.484 2 165.497 2 139.5C2 63.5608 63.5608 2 139.5 2C215.439 2 277 63.5608 277 139.5Z"
        stroke={'var(--components-lightBulb-fill)'}
        strokeWidth="4"
      />
      <path
        d="M76 193L100.478 399M202 193L180.331 399"
        stroke={'var(--components-lightBulb-fill)'}
        strokeWidth="4"
      />
      <path
        d="M77 195.607C77 195.607 105.767 180.932 111.233 172.247C116.699 163.562 120.151 151.283 118.425 137.807C116.699 124.33 116.699 118.64 107.781 118.041C98.863 117.442 91.9589 138.106 92.5342 152.481C93.1096 166.856 94.5479 172.846 103.753 185.125C112.959 197.404 117.274 199.5 126.767 199.5M133.5 167.046C136.952 176.929 144.856 195.607 155.5 195.607C166.144 195.607 173.658 191.414 179.411 181.531C185.164 171.648 186.027 164.161 187.753 152.481C189.479 140.801 187.753 115.046 179.411 115.046C171.068 115.046 165.315 138.405 166.466 152.481C167.616 166.557 172.219 177.338 172.219 177.338C172.219 177.338 179.411 189.018 187.753 195.607C196.096 202.195 203 199.5 203 199.5"
        stroke={'var(--components-lightBulb-fill)'}
        strokeWidth="4"
      />
    </svg>
  )
}
