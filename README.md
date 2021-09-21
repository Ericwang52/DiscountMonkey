# Welcome to Discount Monkey!
Discount Monkey is a price comparing app using the most updated web scraped data. Try it out [here](http://discountmonkey.herokuapp.com/)!
![Login Page](https://i.ibb.co/S3bC34S/Screen-Shot-2021-09-21-at-12-59-59-PM.png)

## How To Use 
After registering on the website, users are prompted to search for the items they are looking for. The initial search results are based off of walmart's API
![Search Results](https://i.ibb.co/mSbY4qH/Screen-Shot-2021-09-21-at-1-04-03-PM.png)

The user can then add items to their watchlist or choose to view the different web scraped prices available for the exact item
![Prices](https://i.ibb.co/ZWKBqKj/Screen-Shot-2021-09-21-at-1-05-23-PM.png)

## How It Works/Technologies Used
This project is built with the **MERN** stack. The frontend is built with **Bootstrap** and **ReactJS**. The **Express** server acts as a backend and uses **Mongoose** to model users for communicating with the **MongoDB** database.

User passwords are secured/encrypted with bcryptJS, and authentication is facilitated with the PassportJS middleware, with the **JSON Web Token** strategy.


