
# Screenshots

Click "connect" to start demo. This is the app in `try-wallet-connect` directory.

![Click to create WalletConnect connection](./images/00-start-connect.png)

![QR Code to create WalletConnect connection](./images/qrCodeWalletConnect.png)

Scan the above QR Code with the crypto wallet's camera. then you confirm connection.
![When mobile wallet scans the code above](./images/02-connectWallet.PNG)

Connection is established. Let's create a credential (VC). To do so you need to fill the form on the page.

![The next step is to create VC. The user needs to fill information about the VC to be created](./images/issueCredentialFormFilled.png)

When you click "create!", your crypto wallet ask you confirmation again.

![The page request eth_signTypedData to the wallet through WalletConnect](./images/04-SignTypedData.png)

Then this code appears in the page. This one needs to be scaned by the mobile phone's camera app.

![VC has been created. Now we need to share it to the DID wallet](./images/qrCodeVc.png)

Then you're redirected to the DID wallet app we've created.

![Scan the code above with the mobile phone](./images/05-sendVc.PNG)

You've received the credential. Nothing happens in this screen. Go to the next step.

![Receive VC](./images/06-receiveVc.PNG)

Scan this code with your mobile phone. This is the app in the `event-site` directory.

![Next is to scan this QR code to prove ownership](./images/qrCodeToVerifyOwnership.png)

Scan it.

![Scan it](./images/scanQrCodeOwnership.PNG)

That is a SIOP Request so that we're asked sign-in confirmation. Credentials are passed as additional values of sign-in response.

![Sign-in Confirmation](./images/confirmSignIn.PNG)

If you confirmed that you'll be redirected to the event page. If all verification passes, the green message shows up!

![All Done!](./images/completeVerify.PNG)
