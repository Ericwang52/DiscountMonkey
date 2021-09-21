# Welcome to Discount Monkey!
Discount Monkey is a price comparing app using the most updated web scraped data. Try it out [here](http://discountmonkey.herokuapp.com/)!
![Login Page](https://ibb.co/DRh2RHd)

## How To Use 
After registering on the website, users are prompted to search for the items they are looking for. The initial search results are based off of walmart's API
![Search Results](https://ibb.co/t3QNDsb)

The user can then add items to their watchlist or choose to view the different web scraped prices available for the exact item
![Prices](https://ibb.co/gzwSkw2)

## How It Works/Technologies Used
This project is built with the **MERN** stack. The frontend is built with **Bootstrap** and **ReactJS**. The **Express** server acts as a backend and uses **Mongoose** to model users for communicating with the **MongoDB** database.

User passwords are secured/encrypted with bcryptJS, and authentication is facilitated with the PassportJS middleware, with the **JSON Web Token** strategy.


