import { useEffect, useState } from 'react'
import axios from 'axios'

export default function ChatPage() {
  const [message, setMessage] = useState('')
  const [reply, setReply] = useState('')
  const [history, setHistory] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.get('/api/chat/history', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setHistory(res.data))
        .catch(() => {})
    }
  }, [])

  async function send() {
    const token = localStorage.getItem('token')
    try {
      if (token) {
        const res = await axios.post('/api/chat/send', { message }, { headers: { Authorization: `Bearer ${token}` } })
        setReply(res.data.reply)
        setHistory(h => [{ userMessage: message, aiResponse: res.data.reply, detectedMood: res.data.mood }, ...h])
      } else {
        const res = await axios.post('/api/chat/anonymous', { message })
        setReply(res.data.reply)
      }
      setMessage('')
    } catch (e) {
      setReply('Error sending message')
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Chat</h1>
      <div className="flex gap-2">
        <input className="border p-2 flex-1" value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your message" />
        <button className="bg-black text-white px-4" onClick={send}>Send</button>
      </div>
      {reply && (
        <div className="p-3 bg-white border rounded">
          <div className="text-sm text-gray-500">Assistant</div>
          <div>{reply}</div>
        </div>
      )}
      <div className="space-y-2">
        {history.map((h, i) => (
          <div key={i} className="p-3 bg-white border rounded">
            <div className="text-sm text-gray-500">You</div>
            <div className="mb-2">{h.userMessage}</div>
            <div className="text-sm text-gray-500">Assistant ({h.detectedMood})</div>
            <div>{h.aiResponse}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

