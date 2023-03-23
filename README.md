# Simon Service
I was in the middle of making some changes to my startup and currently it doesn't work so I'll try to just commit the readme.

Anyway, things I learned or took away from the simon service is that this is the answer to getting the scores and such off local storage. I still don't see much of a purpose for the random quotes and images since I'm not planning on buying another website though I could make another html or even service (like simon) where I could store certain objects and files and such.

# Fetch
I could use fetch as a temporary placeholder for my questions until I learn how to use a database specifically with a website. I could also potentially use it as a local storage maybe? But honestly for now I could create an html file specifically holding javascipt objects that refer to the different questions. I don't know how I'd put multiple on the same webpage and I don't think having multiple would be good practice.

# Implementing js
There's lots to implement: shifting cards, scoreboard update, popups, and login to name a few. I also need to implement the next button. I'm going to store which question they left off on in localStorage and use that to help refresh the page when next is clicked.
Possible improvements: make thats me button turn into smiley face when chosen.

# Midterm Notes
For loading google fonts, I can use @import url('https://fonts.googleapis.com/css?family=Quicksand');
Box model is margin, border, padding, content
/i means case-insensitive
DOM textContent sets the child text for an element
JSON is {"x":3}, double quotes for first part
chmod +x deploy.sh makes a script executable
CNAME is used to point to another DNS record

# JS Simon
I didn't think I'd actually put anything here but here we are. Important note, when building strings in VSCode, I need to use backticks (same button as tilde) in order for it to style correctly. For example,

const background = `hsl(${this.hue}, 100%, ${level}%)`;

When I used single quotes, it didn't recognize the variables. Also, ${} is how you nest variables inside quotes/strings.

# Start up deliverable
Finished most of the html and css. It's pretty much all done but there are certain things that will be easier to implement at the same time as the js. Like I want to allow users to continue as guests which means instead of the table with their answers appearing in I'd Rather, there will be a message directing them to signin to save progress.

I really like green which is why I'm basing the color scheme around it but I might update it in the future. Here's the link for the color scheme: https://paletton.com/#uid=52J0u0koQvvf3JykkAwursMvwma

Once I start the javascript, the Objects and classes codepen will be pretty useful https://codepen.io/Tanman1712/pen/OJoRxqB

## Things I want to implement if I have time:
As mentioned before, continue as guest.  For some reason I can't remember any of the others so I'll update this later if they come back to me.

# CSS Simon
Honestly, I didn't learn a whole lot out of it. I learned that I'm not super creative when it comes to changing the css. I have no idea how I'm going to handle colors and stuff for the startup

# HTML Simon
Just finished it. There was a lot that I wanted to mess around with but they were more CSS and Javascript changes so I didn't change much of the example code. I did learn a lot from it. View the simon README.md for some notes. HTML really is pretty bare bones. 

# Deployment Script
Make sure to run the script inside of website-html. Here's the line of code
./deployWebsite.sh -k ~/Documents/CS\ 260/production.pem -h wouldyourather.click

# Html Stuff
The Html Introduction has a table of all the different divisions and special characters

# AWS Route 53
My domain name is wouldyourather.click
Not much else of import

# AWS EC2 Server
Line of code used to ssh (starting from home directory). ssh -i ./Documents/CS\ 260/production.pem ubuntu@18.119.143.2

I used gitbash for the ssh, maybe try to get it to work on vscode?

I did the elastic IP thing so now my IP address is **3.128.75.219**. Keep this in mind for the ealier ssh line of code.
**Yeah, looks like the old ip doesn't work anymore.**

***Important Reminder!
Make sure to remove the elastic when I terminate the server at the end of the semester!!!!!***

# Startup Specs
**The Pitch**
Here's the pitch. I want to create a Would You Rather application that updates after each person who uses it. That way, after someone picks a choice it can show percentage of people who chose each answer. I can even put how many people have answered so that there's more context behind the percentages. I want the app to only progress through the questions (no returning to a previous) or at least not allow users to change answers. At the end I want a free response question where people have the option to add a new would you rather question.

[b]Key features[/b]
Answer percentages, user feedback, total answers given, maybe a progress bar for how many questions left. Depending on what we learn in this class and what I need to implement, I may have the number of questions set but have it randomized or allow people to save their progress if there are too many questions. I'm also thinking of having the answer box colors randomized. Other ideas I could potentially implement are friend codes or groups so that you can see what answers were chosen by people you know.

[b]Images[/b]
I created prototype images on ninjamock which makes you upgrade to export so here is the link to view them. https://ninjamock.com/s/KMLTVKx

# startup
Would you Rather

I should record different would you rather questions here

Would you rather Only taste Spicy Food or Only taste Sour Food?

Would you rather Sleep All Day or Party All Night?

Some things learned from the GitHub assignment:
1) commit -am is amazing! not having to type add . is great
2) I've never dealt with a merge conflict before so that was cool
especially since my wife deals with them for work

I don't know if I should be keeping the previous stuff so for now I'll leave it.

