# Authentication with Twitter

> ## Data
* Access Token

> ## Primary Flow
1. Obtain data (name, email, and Twitter ID) from Twitter API 
2. Check if it exists an user with the above email
3. Create a Twitter user account with the data we got 
4. Create an access token, from user ID, with 30 minutes expiration
5. Return the token genereated


> ## Alternative flow: User already exists
3. Update an user account with the data from Twitter (Twitter ID and name - just update the name in case that the user does not have one already)


> ## Exception flow: Invalid token or expired
1. Return an authentication error
