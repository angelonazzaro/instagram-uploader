# Instagram-uploader
As the name suggests, this is a simple bot written in ```NodeJs``` to automate the upload of a post on [Instagram](https://www.instagram.com/). <br>
The bot has been made for the purpose of posting on meme pages like: "SpongeBobEveryDay", "JoeRoganEveryDay" and so on. 

## Installation
Clone the repo: <br>
```
$ git clone https://www.github.com/sl1mSha4dey/instagram-uploader.git 
```

Navigate to the repo folder and install the packages:
```
$ npm i 
```
Once you've installed the packages, all you need to do is to configure you ```.env``` file that you will need to run the program. 
You can also not use the .env file, however you will need to replace all the ```process.env.CONSTANT``` occurences with the associated data.

## Configuring the ```.env``` file
Create a file named ```.env``` into the repo folder and set it up like this:
<div>
 <img src="https://user-images.githubusercontent.com/58223071/194145957-8105a177-7daf-4576-8e74-97b62a026ebc.png" alt=".env-configuration-pic" />
</div>

- IG_USR -> your instagram username
- IG_PWD -> your instagram password
- PHOTO_PATH -> path to the file you wish to upload as a post
- DAYS_FILE -> path to the file where the bot will keep count of the number of the days
- TIME_FILE -> path to the file where the bot will save the last time it posted

### Why ```TIME_FILE```?
The initial idea was to schedule the bot to post everyday at a certain time with the [```cron```](https://www.npmjs.com/package/cron) package in **headless** mode. <br>
Since Instagram somehow manages to block headless attempts to login I decided it was far easier to simple set up a basic activity in Windows and let the script run everytime the user logged in. 

## Usage
Once you've installed the packages and set up the .env file all you need to do is run the following command:
```
$ node index.js
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change :shipit:

## License
License under [MIT](https://choosealicense.com/licenses/mit/)
