#!/bin/bash
git init
git branch -M main
git add .
git commit -m "Confiar PWA - admin user management"
git remote add origin https://github.com/alexandreedantas-cloud/confiar-pwa.git
git push -u origin main --force
