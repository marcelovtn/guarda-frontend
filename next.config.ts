import type { NextConfig } from 'next'

// O Next carrega .env.local sozinho, em build e em runtime — não é preciso
// chamar dotenv aqui. A versão anterior misturava `import` com
// `module.exports`, então este objeto nunca chegava a ser aplicado.
const nextConfig: NextConfig = {}

export default nextConfig
