import { useState, useCallback, useEffect, useRef } from 'react'

function App() {
  const [length, setLength] = useState(8)
  const [useUpperCase, setUseUpperCase] = useState(true)
  const [useLowerCase, setUseLowerCase] = useState(true)
  const [numberAllowed, setNumberAllowed] = useState(false)
  const [charactersAllowed, setCharactersAllowed] = useState(false)
  const [password, setPassword] = useState('')
  const passwordRef = useRef(null)
  const [strength, setStrength] = useState('Weak')

  const calcStrength = useCallback((pass) => {
    let score = 0
    if (pass.length > 8) score++
    if (/[A-Z]/.test(pass)) score++
    if (/[a-z]/.test(pass)) score++
    if (/\d/.test(pass)) score++
    if (/[!@#$%^&*()_+=\-{}[\]|:;<>,.?/~`]/.test(pass)) score++
    if (score <= 2) return 'Weak'
    if (score <= 4) return 'Medium'
    return 'Strong'
  }, [])

  const generatePassword = useCallback(() => {
    let pass = ''
    let str = ''
    if (useUpperCase) str += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (useLowerCase) str += 'abcdefghijklmnopqrstuvwxyz'
    if (numberAllowed) str += '0123456789'
    if (charactersAllowed) str += '!@#$%^&*()_+=-{}[]|:;<>,.?/~`'
    if (!str) str = 'ABCabc123!'

    for (let i = 0; i < length; i++) {
      pass += str.charAt(Math.floor(Math.random() * str.length))
    }
    setPassword(pass)
    setStrength(calcStrength(pass))
  }, [
    length,
    useUpperCase,
    useLowerCase,
    numberAllowed,
    charactersAllowed,
    calcStrength,
    setPassword
  ])

  const copyPassword = useCallback(() => {
    passwordRef.current?.select()
    passwordRef.current?.setSelectionRange(0, length)
    window.navigator.clipboard.writeText(password)
  }, [password, length])

  useEffect(() => {
    generatePassword()
  }, [length, useUpperCase, useLowerCase, numberAllowed, charactersAllowed, generatePassword])

  return (
    <>
      <div className="max-w-md mx-auto shadow-xl rounded-xl p-4 my-8 text-orange-500 bg-gray-800">
        <h1 className="text-2xl font-bold mb-4 text-center">Enhanced Password Generator</h1>

        <div className="flex shadow mb-4 h-12">
          <input
            type="text"
            value={password}
            className="outline-none w-full py-1 px-3 bg-gray-700 text-white"
            placeholder="password"
            readOnly
            ref={passwordRef}
          />
          <button
            className="bg-blue-700 text-white px-3 hover:bg-gray-400 hover:text-blue-700"
            onClick={copyPassword}
          >
            Copy
          </button>
        </div>

        <div className="text-sm flex items-center justify-between mb-4">
          <label className="mr-2 flex items-center gap-x-2">
            <span>Length: {length}</span>
            <input
              type="range"
              min={6}
              max={30}
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="cursor-pointer"
            />
          </label>
          <div className="text-xs px-2 py-1 border rounded-full text-white"
               style={{
                 backgroundColor:
                   strength === 'Weak' ? '#DC2626' :
                   strength === 'Medium' ? '#F59E0B' : '#16A34A'
               }}>
            Strength: {strength}
          </div>
        </div>

        <div className="mb-2 flex flex-wrap gap-4">
          <label className="flex items-center gap-x-1">
            <input
              type="checkbox"
              checked={useUpperCase}
              onChange={() => setUseUpperCase((prev) => !prev)}
            />
            <span className="text-white">Uppercase</span>
          </label>
          <label className="flex items-center gap-x-1">
            <input
              type="checkbox"
              checked={useLowerCase}
              onChange={() => setUseLowerCase((prev) => !prev)}
            />
            <span className="text-white">Lowercase</span>
          </label>
          <label className="flex items-center gap-x-1">
            <input
              type="checkbox"
              checked={numberAllowed}
              onChange={() => setNumberAllowed((prev) => !prev)}
            />
            <span className="text-white">Numbers</span>
          </label>
          <label className="flex items-center gap-x-1">
            <input
              type="checkbox"
              checked={charactersAllowed}
              onChange={() => setCharactersAllowed((prev) => !prev)}
            />
            <span className="text-white">Symbols</span>
          </label>
        </div>

        <button
          className="w-full h-10 bg-green-600 hover:bg-green-500 text-white rounded"
          onClick={generatePassword}
        >
          Generate Password
        </button>
      </div>
    </>
  )
}

export default App