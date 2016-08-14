# RESTful API

Une API RESTful, est un style d'architecture comprenant les "guide lines" et "best practices" pour créer des services web. REST en anglais signifie "REPRESENTATIONAL STATE TRANSFER".

Une API RESTful est considérée comme plus rapide et plus maintenable car elle permet de séparées les responsabilités entre le client et le serveur. L'interface utilisateur est séparée de celle du stockage des données. Cela permet aux deux d'évoluer indépendamment.

Il n'y a pas besoin de définir un état spécifique. Chaque requête d'un client vers un serveur doit contenir toute l'information nécessaire pour permettre au serveur de comprendre la requête, sans avoir à dépendre d'un contexte conservé sur le serveur. Cela libère de nombreuses interactions entre le client et le serveur.

# Installation nécessaire pour faire fonctionner l'API

1) [Installer nodeJS et NPM](https://nodejs.org/en/)

NodeJS nous permettra de démarrer le server et NPM d'installer les modules dont on a besoin.

2) [Installer XAMPP](https://www.apachefriends.org/fr/index.html)

XAMPP marche aussi bien sur linux, mac ou windows et permet dans notre cas,en démarrant apache et MySQL,  d'avoir phpmyadmin pour comprendre les requetes.

3) [Installer Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop)

Petite appli proposée dans le chrome store très pratique pour envoyé des requètes et voir la magie de l'API à l'oeuvre une fois celle-ci lancé.

# Comment lancer l'API?
1) Empêcher l'obligation de l'utilisation de `sudo` lors d'installation de package via npm :

```bash
$ sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

### Sous Windows
4) Lancer le terminal NodeJS en admin

### Puis, Mac & Windows
5) Installer Ionic :

```bash
$ npm install -g cordova ionic
```

6) Installer les dépendances (platforms et plugins)

```bash
$ ionic state reset
```

7) Compiler l'application :

```bash
$ ionic build android
```

8) Copier les ressources vers les plateformes (icon, splashscreen)

```bash
$ ionic resources
```

9) Lancer l'application :

```bash
$ ionic run android
```
