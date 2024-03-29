This application is created to mitigate the limits imposed by chatgpt like no access to realtime data as well as help analyzing reasearch papers and custom data of user.
#### Backend is written in Python Language and frontend created by Nextjs and Reactjs. 
## How to use?
#### 1. Click [LINK](https://raggpt.vercel.app/) to access the app
#### 2. Enter your OpenAI key
#### 3. If you need the data from any url enter it OR if you need to analyze a document (file) like a research paper upload it
#### 4. Click Let's Start and ask your questions!
## Test the app: https://raggpt.vercel.app/
![image1](assets/demo.gif)
#### Full demo video is in assets folder.
## Why to use

### Access to realtime 
#### Needs to enter a url (e.g. a stock exchange website) 
![image1](assets/1.jpg)

### Helps researchers to analyze the papers easier and save time
#### Needs to upload the research paper as your document
![image2](assets/2.jpg)

#### And more...like answering questions about user custom file
Needs to upload your file as document
```
Question: How many different customer names exist in my file
```
```
Answer: There are 55 different customer names.
```

## Deploy the app on your computer
First you need to clone the repository and unzip it. For IDE, I recommend Visual Studio Code and you can install it by [LINK](https://code.visualstudio.com/download). Then you need to open two windows in VSC. By first one, open the folder of /backend to run server by below commands:

```
pip install -r requirements.txt
```
```
python .\main.py
```

Then in the other windows of VSC, go to folder /frontend/frontend (here you should see folders like public and scr). Now apply below commands:
```
npm i react-spinners
```
```
npm install next@latest react@latest react-dom@latest
```
```
npm run dev
```
Congrats, all done! 
#### NB: make sure both client side app and server are running at the same time. Simply, it means two mentioned VSC windows should be open at the same (do not close one and use another).
