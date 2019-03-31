## Inspiration
In today's world, we have no idea what information is being read by the websites we visit every day. Confidentiality of information is slowly becoming a myth and people all across the world worry that their sensitive information could fall into the wrong hands. We believe that people deserve to have greater control over what information they send out online. This will offer people peace of mind and make the internet a safer place for everyone. Thus, we created Secure Send to protect user information.

## What it does
Secure Send is a Google Chrome extension that gives you complete control of the information you send online. A user can set the information that he/she wants to be protected, whether the information is sensitive or not, and on which websites the extension should be run. If a user attempts to send out private information or a website attempts to grab this information, Secure Send will prompt the user to confirm whether he/she wants to send out this information. If the user agrees to do so, website behavior continues as expected. If the user does not want this information to be sent out, the data will not be sent across.

## How we built it
We built this chrome extension using HTML, Javascript and React. We used the Chrome extension architecture to set up and load our extension and used React to create dynamic pages for our personalized user configurations. 
The primary functionality of the extension to ensure the security of every user's information is facilitated through Javascript. We store specific user info that we want to protect as well as websites that are whitelisted within chrome.storage. We overwrite the fetch and XMLHttpRequest functions so as change their behavior and check to see if specific information is being sent out. This is done by iterating through the relevant information in chrome.storage and seeing if there are any direct matches in the fetch or XMLHttpRequest parameters (URL, headers, body). If a match is detected, a warning is displayed asking the user to confirm whether he/she wants his/her data to be sent out. If not, we do not let fetch or XMLHttpRequest complete their designed functionalities.

## Challenges we ran into
The first challenge we faced was figuring out how to check fetch and XMLHttpRequest arguments (URL, headers, body) so as to ensure sensitive information isn't sent. Integrating the React app architecture with the chrome extension architecture proved to be the next major challenge. Updating chrome.storage to save settings for whitelisted websites and sensitive information also proved to be an issue. Updating chrome.storage to add whitelisted sites from our extension's popup also proved to be extremely challenging.

## Accomplishments that we're proud of
Secure Send is fully functional and is capable of stopping sensitive information from being sent out online. Users can personalize their settings as per their needs. They can add and delete information they want to protect and can add and delete whitelisted sites. Sites can be whitelisted using a simple popup when on the website. The user can also add whitelisted websites from the Secure Send config page.

## What we learned
We learned how to develop a Chrome extension from scratch following the Chrome extension architecture and how to integrate this architecture with a React app to create dynamic config pages for the extension. We also learned how to use chrome.storage to save states locally so as to remember personalized user settings.

## What's next for Secure Send
Secure Send aims to provide more flexibility in terms of data security. Going forward we could allow users to set how strict they want Secure Send to be. Currently, all exact matches are flagged. In the future, we could check for similar words and phrases as well. We also seek to improve the UI for our extension's popup and config page so as to make the user experience even better.
