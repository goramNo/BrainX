# 🎮 BrainX - Installation Rapide

## 📦 Contenu du package

Ce dossier contient TOUS les fichiers nécessaires pour faire fonctionner le site :

```
brainx-complete/
├── index.html          ← Page principale
├── style.css           ← Styles CSS
├── script.js           ← Logique JavaScript
├── easter-egg.html     ← Page Easter Egg secrète
├── .htaccess           ← Configuration serveur
└── README.txt          ← Ce fichier
```

## 🚀 Installation (MÉTHODE SIMPLE)

1. **Copiez TOUT ce dossier** dans `C:\Users\Ngora\Desktop\BrainX\`

2. **Ajoutez votre image** `jawdan.jpg` dans le même dossier

3. **Structure finale attendue** :
   ```
   C:\Users\Ngora\Desktop\BrainX\
   ├── index.html
   ├── style.css
   ├── script.js
   ├── easter-egg.html    ← IMPORTANT !
   ├── .htaccess
   ├── jawdan.jpg         ← Votre image
   └── README.md
   ```

## 🌐 Lancer le site

### Option 1 : Avec Python
```bash
cd C:\Users\Ngora\Desktop\BrainX
python -m http.server 5500
```

Puis ouvrez : `http://127.0.0.1:5500/`

### Option 2 : Avec Live Server (VS Code)
- Clic droit sur `index.html`
- "Open with Live Server"

### Option 3 : Double-clic sur index.html
Si vous ne voulez pas de serveur local, ouvrez directement `index.html` dans votre navigateur.

## 🥚 Activer l'Easter Egg

1. Ouvrez le site
2. Cliquez **5 fois rapidement** sur le titre "DRACKS" en haut
3. Vous serez redirigé vers la page secrète avec votre image !

## ✅ Vérification

Pour vérifier que tout fonctionne :

1. Ouvrez `http://127.0.0.1:5500/index.html`
   → Vous devez voir les 4 jeux ✅

2. Ouvrez `http://127.0.0.1:5500/easter-egg.html`
   → Vous devez voir la page secrète ✅

3. Cliquez sur un jeu
   → Le jeu doit se lancer ✅

## 🚨 Si ça ne marche toujours pas

1. **Vérifiez que TOUS les fichiers sont dans le même dossier**
   ```bash
   dir C:\Users\Ngora\Desktop\BrainX
   ```

2. **Relancez le serveur**
   - Arrêtez (Ctrl+C)
   - Relancez dans le BON dossier

3. **Videz le cache du navigateur**
   - Ctrl + Shift + R

## 📤 Push sur GitHub

```bash
cd C:\Users\Ngora\Desktop\BrainX
git add .
git commit -m "🎮 Complete BrainX with Easter Egg"
git push origin main
```

---

🎮 **Bon jeu !** 🧠
