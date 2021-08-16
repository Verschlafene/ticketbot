# **Ticket Bot** in Discord.JS v13 
## Wie kann ich den Bot verwenden?
#### Du kannst dir den Source Code herunterladen und die folgenden Schritte beachten:
#### Erstelle eine Datei namens **.env** und definiere die Variablen **TOKEN** und **MONGOURI** <br>**Die Datei sollte ungefähr so aussehen:** 
```javascript
TOKEN="Login Token von deinem Discord Bot" 
MONGOURI="Link zu deiner Mongo Datenbank"
```
#### Einen Token bekommst du auf [Discord.com/Developers](https://discord.com/developers)
#### Und eine gratis Datenbank bekommst du auf [MongoDB.com](https://www.mongodb.com/)
#### **Benötigte Packages:**
```
npm install discord.js@13.1.0 discord-api-types @discordjs/rest dotenv@10.0.0 npm@16.6.1 node@7.20.6 mongoose@5.13.7
```
#### **Wie bekomme ich den Bot auf meinen Server?**
#### Nachdem du deinen Bot auf [Discord.com/Developers](https://discord.com/developers) erstellt hast und den Token in der **.env Datei** eingefügt hast, kannst du den Bot auf deinen  Server über einen anderen Tab auf der selben Seite ([Discord.com/Developers](https://discord.com/developers)) einladen. Drücke dazu einfach auf OAuth2 und scrolle nach unten zu den Scopes. Dort ist es **sehr wichtig**, dass du nicht nur **bot** auswählst, sondern auch **application.commands**. Das erlaubt den Bot (/) Commands zu erstellen. Über den generierten Link kannst du den Bot ganz einfach einladen.
### Alles andere kann bearbeitet werden!
