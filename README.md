# AI Chatbot - Setup Instructions

## 🎯 What You Have

A production-quality bilingual (English & Punjabi) AI chatbot with:
- ✅ Real Google Gemini AI responses
- ✅ Dark ChatGPT/Gemini-style UI
- ✅ Chat history persistence
- ✅ New Chat, Clear, Regenerate features
- ✅ Secure backend (API key never exposed)
- ✅ 100% Expo Snack & Expo Go compatible

---

## 🚀 Quick Start (3 Steps)

### Step 1: Get Free Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikeys)
2. Click "Create API Key"
3. Copy the key

### Step 2: Start Backend on GitHub Codespaces
1. Open this repo on GitHub
2. Click **Code** → **Codespaces** → **Create codespace on main**
3. In the terminal:
   ```bash
   npm install
   export GEMINI_API_KEY="your-api-key-here"
   npm start
   ```
4. See the forwarded URL in the Ports tab (make it Public)

### Step 3: Update Expo App
1. In your Expo Snack, update `App.js` line 12:
   ```javascript
   const BACKEND_URL = 'https://your-codespace-url';
   ```
2. Save and test on your iPhone

**That's it! Your chatbot is now connected to real AI.** 🎉

---

## 📱 File Structure

```
expo-ai-chatbot/
├── App.js                 ← React Native frontend
├── server.js              ← Backend (Express + Gemini)
├── package.json           ← Backend dependencies
├── BACKEND_SETUP.md       ← Detailed setup guide
└── README.md              ← This file
```

---

## 🔑 Environment Setup

### On GitHub Codespaces:
```bash
export GEMINI_API_KEY="sk-..."
npm start
```

### On Local Machine:
Create `.env`:
```
GEMINI_API_KEY=your-key-here
PORT=3001
```

Then: `npm start`

---

## 📡 Architecture

```
iPhone (Expo Go)  →  Backend (Node.js)  →  Google Gemini API
   App.js              server.js              Real AI
```

**Why this way?**
- 🔒 API key stays secret on server
- 📱 Frontend stays lightweight
- ⚡ Scales easily
- 🛡️ Secure & production-ready

---

## ✅ Verification Checklist

- [ ] Gemini API key obtained from Google AI Studio
- [ ] Backend running on GitHub Codespaces (or local machine)
- [ ] Backend URL is public and accessible
- [ ] `BACKEND_URL` updated in App.js
- [ ] Expo Snack project refreshed
- [ ] Message sent from iPhone in Expo Go
- [ ] Real AI response received (not mock!)

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Backend URL not configured" | Update `BACKEND_URL` in App.js, refresh preview |
| "Error connecting to AI" | Check server is running, check URL is correct |
| CORS error | Ensure backend URL is public (not localhost) |
| API key invalid | Get new key from Google AI Studio |
| Server won't start | Check Node.js 18+ installed, run `npm install` |

---

## 📖 More Information

See **BACKEND_SETUP.md** for:
- Detailed deployment options
- Using ngrok for local testing
- Keeping server running 24/7
- API endpoint documentation
- Security best practices

---

## 🎓 Next Steps

After this works, you can:

1. **Connect a real database** - Store conversations permanently
2. **Add authentication** - User accounts & login
3. **Deploy to production** - Use Railway, Render, or Fly.io
4. **Mobile app** - Build native iOS app with EAS
5. **More languages** - Add more language support
6. **Custom AI personality** - Fine-tune system prompts

---

## ❓ FAQ

**Q: Is there a cost?**
A: No! Gemini free tier gives 60 requests/minute, perfect for testing.

**Q: Can I use other AI providers?**
A: Yes! The backend is provider-agnostic. Just replace the API call in `server.js`.

**Q: Will my API key be exposed?**
A: No! It lives only on your backend server, never sent to the frontend.

**Q: Can I deploy this to production?**
A: Yes! Use Railway, Render, Fly.io, or Heroku. Just set the environment variable.

**Q: How many users can it handle?**
A: As many as your backend can handle. Start with free tier, upgrade as needed.

---

## 📞 Support

If something doesn't work:
1. Check the server logs
2. Read BACKEND_SETUP.md
3. Test the `/health` endpoint
4. Verify your Gemini API key is valid

---

**Happy Chatting! 🚀**
