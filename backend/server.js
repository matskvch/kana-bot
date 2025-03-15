import express from 'express'
import { supabase } from './database.js'

const server = express()
const PORT = process.env.PORT || 4001

server.use(express.json())

server.get('/test', async (req, res) => {
    const { data, error } = await supabase
        .from('hiragana')
        .select('*')
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
})







server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)  
})
