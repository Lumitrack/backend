import { app } from "./app.js" // .js é padrão de módulos ESM para imports relativos
import "../cron/index.js"
import "../cron/alertChecker.js"

const PORT = 3333

app.listen(PORT, () => {
    console.log(`HTTP server running on http://localhost:${PORT}`)
})