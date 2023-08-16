require('dotenv').config()
const PORT = process.env.PORT
const express = require("express")
const socketIO = require("socket.io")
const axios = require("axios")
// const rateLimit = require('express-rate-limit')


const app = express()
app.use(express.json())

// Rate limiting
// const limiter = rateLimit({
//     windowMs: 10 * 60 * 1000, // 10 mins
//     max: 100
// })

// app.use(limiter)

const server = app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
})

const socketHandler = socketIO(server)

socketHandler.on("connection", (socket) => {

    socket.on("connect_error", () => {
        console.log("Connection error")
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected")
    })

    console.log("Client Connected")
    socket.emit('crypto', "Hello Cryptos Client")
})

const getPrices = () => {
    axios.get(process.env.CRYPTO_LIST_URL, {
    headers: {
        "x-messari-api-key": process.env.API_KEY
    }
})
    .then((response) => {
        const priceList = response.data.data.map((item) => {
            return {
                id: item.id,
                name: item.symbol,
                price: item.metrics.market_data.price_usd
            }
        })
        socketHandler.emit("crypto", priceList)
    })
    .catch((err) => {
        console.log(err)
        socketHandler.emit("crypto", {
            error: true,
            message: "Error Fetching Prices Data From API"
        })
    })
}

setInterval(() => {
    getPrices()
},20000)

app.get('/cryptos/profile/:id', (req,res) => {
    const cryptoId = req.params.id
    if (!cryptoId) {
        res.json({ error: true, message: "Missing Crypto Id in the API URL"})
    }

    axios.get(`${process.env.BASE_URL_V2}/${cryptoId}/profile`, {
        headers: {
            "x-messari-api-key": process.env.API_KEY
        }
    }).then((responseData) => {
        res.json(responseData.data.data)

    }).catch((err) => {
        res.json({
            error: true,
            message: "Error Fetching Prices Data From API",
            errorDetails: err
        })
    })
})

app.get('/cryptos/market-data/:id', (req,res) => {
    const cryptoId = req.params.id
    if (!cryptoId) {
        res.json({ error: true, message: "Missing Crypto Id in the API URL"})
    }

    axios.get(`${process.env.BASE_URL_V1}/${cryptoId}/metrics/market-data`, {
        headers: {
            "x-messari-api-key": process.env.API_KEY
        }
    }).then((responseData) => {
        res.json(responseData.data.data)

    }).catch((err) => {
        res.json({
            error: true,
            message: "Error Fetching Prices Data From API",
            errorDetails: err
        })
    })
})




