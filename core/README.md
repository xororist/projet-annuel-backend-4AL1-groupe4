## Prérequis

Assurez-vous d'avoir les éléments suivants installés avant de poursuivre :

-   Python (version 3.12.1)
-   Django (version 5.0.4)

## Création de l'environnement virtuel

1. Ouvrez un terminal et accédez au répertoire de votre projet.
2. Créez un nouvel environnement virtuel: `python -m venv venv`
3. Activez l'environnement virtuel :

-   Sur Windows : `venv\Scripts\activate`
-   Sur macOS et Linux : `source venv/bin/activate`

## Installation

1. Clonez ce dépôt

```bash
git clone git@github.com:nbesoro/chancyapi.git
```

2. Accédez au répertoire du projet : `cd chancyapi`
3. Installez les dépendances : `pip install -r requirements.txt`
4. Créer un fichier `.env` copier le contenu du fichier `.env.example` et coller.
5. Mettre à jour le fichier `.env` avec vos informations SMTP pour l'envoi de mail.
6. Effectuez les migrations : `python manage.py migrate`

## Utilisation

Pour démarrer le serveur de développement, exécutez la commande suivante :

```bash
python manage.py runserver
```

Le site sera accessible à l'adresse http://127.0.0.1:8000/.

## Documentation via postman

https://documenter.getpostman.com/view/4931083/2sA3BhfaSt
