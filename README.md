# Confiar PWA (admin users)

Esta versão contém um painel para admin gerenciar usuários via API serverless no Vercel.

## Variáveis de ambiente no Vercel
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY  (Service Role Key do Supabase)

## Endpoints
- GET /api/users  (lista profiles)  — requer token de admin no header Authorization: Bearer <token>
- POST /api/create-user  (cria usuário) — requer token de admin

## Push para o GitHub
git init
git branch -M main
git add .
git commit -m "Confiar PWA - admin user management"
git remote add origin https://github.com/alexandreedantas-cloud/confiar-pwa.git
git push -u origin main --force
