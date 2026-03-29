# 🍽️ Mes Recettes

Application web statique pour gérer vos recettes de cuisine, directement dans votre navigateur.

## Fonctionnalités

- **Consulter** vos recettes sous forme de cartes (nom, catégorie, temps de préparation, portions)
- **Filtrer** par catégorie : Entrées, Plats, Desserts, Boissons, Autres
- **Rechercher** une recette par nom, ingrédient ou catégorie
- **Ajouter** une nouvelle recette (nom, catégorie, temps, ingrédients, étapes, notes)
- **Modifier** une recette existante
- **Supprimer** une recette (avec confirmation)
- **Persistance** automatique dans le `localStorage` du navigateur
- 5 recettes exemples chargées lors de la première visite

## Lancement

Aucune installation requise. Ouvrez simplement le fichier `index.html` dans votre navigateur :

```bash
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

Ou servez-le avec n'importe quel serveur HTTP statique :

```bash
# Python
python3 -m http.server 8000

# Node.js (npx)
npx serve .
```

Puis accédez à `http://localhost:8000`.

## Structure du projet

```
recettes/
├── index.html        # Page principale
├── css/
│   └── style.css     # Feuille de styles
├── js/
│   └── app.js        # Logique applicative (stockage, rendu, événements)
├── LICENSE
└── README.md
```

## Données

Les recettes sont sauvegardées dans le `localStorage` du navigateur sous la clé `recettes`.  
Aucune donnée n'est envoyée vers un serveur.

Pour réinitialiser les données, exécutez dans la console du navigateur :

```js
localStorage.removeItem('recettes');
location.reload();
```

## Licence

[MIT](LICENSE)