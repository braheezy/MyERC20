# MyERC20

## Why it exists
The original goal was to learn more Solidity and smart contract development. Without some way to interact with the contract, I had no nice way to show it worked. Because I also have interest in becoming a Dapp developer, I decided to use this oppurtunity to learn web development and hook up a web client. 

I completed the following in this application:
 
 - Native implementation of the [ERC20](https://eips.ethereum.org/EIPS/eip-20) token interface.
   - Learned more about Solidity, the true nature and purpose of tokens, and how to implement more financial-related contracts
   - Learned to create a factory contract to manage token creation and provide an interaction layer to the web app
 - Wrote a web application
   - Learned CSS basics, HTML basics, Javascript, [React](https://reactjs.org/), [Semantic UI](https://react.semantic-ui.com/)
   - Became more comfortable with connecting to web3 via MetaMask
   - Bettered my project architecture skills
 - Manage smart contracts with Truffle suite and use [Ganache](https://www.trufflesuite.com/ganache) for development

This project is by nowhere near complete. I could spend months fiddling and improving usability and interface friendlieness. The longer I use the app, the more QoL improvements and edge cases I find that could be handled. But life is short and there more projects to work on, especially those more smart contract based (sorry web dev). Keep an open mind as you use it.
   
## What it does
This application provides very basic token management services:

- Create new [ERC20](https://eips.ethereum.org/EIPS/eip-20) tokens
- Perform all [ERC20](https://eips.ethereum.org/EIPS/eip-20)-sanctioned methods

## Run
You'll need 
  - [Node](https://nodejs.org/en/)
  - [MetaMask](https://metamask.io/) connection to the Rinkeby test network
    - Alternatively, you can run [Ganache](https://www.trufflesuite.com/ganache) on localhost and use Truffle to migrate the contracts to your network manually. See these [docs](https://www.trufflesuite.com/docs/truffle/getting-started/running-migrations)
  
To run, download and do the following in a terminal:

* `cd MyERC20`
* `npm install`
* Ensure [Metamask](https://metamask.io/) is installed
* `npm run start`

## Things you can do
I'll point how to use the app and various things I did to make it work smoothly for a user. If you are a recruiter, this is me trying to impress you.

It's important to note there is no backend database holding data other than what's on the Ethereum blockchain. Deleting tokens only removes the token from the view and if you reload the page, the token will be back.

A complicated part of Dapps is the web3 and ethereum connections. I robustly handle the most common issues and display messages to the user to aid them. 
MetaMask no longer exposes Eth accounts by default, so I allow the user to connect when they want to:
![connect page](https://github.com/mbraha/MyERC20/blob/master/raw/metamask_connect_needed.png)

Once properly connected, this is the first view seen:
![Land page](https://github.com/mbraha/MyERC20/blob/master/raw/land_page_view.png)
Observe:
 - A nice form to create a new token. Per the ERC20 spec, only the supply is necessary to create one. The form clears when submit is clicked.
 - An area to retreive tokens. This only brings back tokens that were deleted during the current session.
 - A greeter displaying your Eth address and prompt to make coins. This message is dynamic and changes based on several conditions, such as MetaMask connection, eth connection, and the existence of tokens.
 
Of course, the next thing to do is create a token. Click the Create Token button and MetaMask should prompt you:
 ![Create token](https://github.com/mbraha/MyERC20/blob/master/raw/create_token_form_filled.png)
 
After accepting the transaction, the app auto-updates to show you a new token card:
  ![Create token_success](https://github.com/mbraha/MyERC20/blob/master/raw/token_create_success.png)
  
Make sure to check the new token out! All info is given plus user balance (as the token creator, user initially owns the entire supply):
 ![Create token_success](https://github.com/mbraha/MyERC20/blob/master/raw/token_detail_view.png)
 
Make more tokens and it's automatically added to the list:
  ![second token](https://github.com/mbraha/MyERC20/blob/master/raw/second_token.png)
  
Finally, delete tokens from the view. At this point, you can retrieve tokens:
  ![delete token](https://github.com/mbraha/MyERC20/blob/master/raw/deleted_token.png)

## Troubleshooting
Feel free to uncomment any log statements and view the web browser console to try and find out what's not working. It's mostly likely the web3 connection or getting access to smart contracts. 
