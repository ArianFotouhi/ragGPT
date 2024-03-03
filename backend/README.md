# AskYourScraperBot
A chatbot that receives list of urls as input and is able to answer user questions according to the links. V1 uses FAISS vector DB on local machine (eg server that runs the app) while V2 does not use vector DB locally (cloud based). The below tests are conducted on V1. 

## Example 1 (relevant question)

Input example:
```
https://en.wikipedia.org/wiki/Candiac,_Quebec
```

Question:
```
Candiac age median?
```

Answer (LLM: GPT):
```
The median age of Candiac, Quebec is 42.0 years. This includes both males and females.
```

Answer (LLM: flan-t5-large):
```
42.0
```

## Example 2 (relevant question)

Input example:
```
https://en.wikipedia.org/wiki/Candiac,_Quebec
```

Question:
```
Candiac population?
```

Answer (LLM: GPT):
```
The population of Candiac, as of the 2021 Census, is 22,997.
```

Answer (LLM: flan-t5-large):
```
22,997
```

## Example 3 (irrelevant question)

Input example:
```
https://en.wikipedia.org/wiki/Candiac,_Quebec
```

Question:
```
Population of Barcelona?
```

Answer (LLM: GPT):
```
I'm sorry, but I don't have access to real-time data. The population of Barcelona can vary over time. It would be best to refer to official sources such as the National Institute of Statistics in Spain or the Barcelona City Council for the most up-to-date population information.
```

Answer (LLM: flan-t5-large):
```
No
```
