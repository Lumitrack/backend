// Isso é uma exigência do padrão de módulos ESM que configuramos.
import { app } from "./app.js" // .js é padrão de módulos ESM para imports relativos

const PORT = 3333

app.listen(PORT, () => {
    console.log(`HTTP server running on http://localhost:${PORT}`)
})