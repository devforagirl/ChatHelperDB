const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
// const morgan = require('morgan')

// 载入设置文件 config
dotenv.config({ path: './config/config.env' })

connectDB()

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// 路由文件 routes
app.use('/', require('./routes/index'))

// // morgan 似乎只有错误才成功，是因为next关键字的原因吗？?
// app.use(morgan('dev'))

// // 处理errors
// app.use((req, res, next) => {
//   const error = new Error('Not found 233')
//   error.status = 404
//   next(error)
// })

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

// const PORT = process.env.PORT || 3002
// 3002已改成3003
const PORT = process.env.PORT

app.listen(PORT, function () {
  console.log(`Server is Running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})
