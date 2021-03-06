
/* This function is used to check the user input*/
function userInput(){

    // get user input
    let input = document.getElementById('search-input');
    let search = input.value;

    if(search == '' || typeof(search) == undefined){

        input.style.border = "1px solid red";
        input.setAttribute("placeholder","Channel name is required.");

    }else{

        input.style.border = "none";

        // it's not empty, so call function fetchData()

        fetchData(search);
    }
}


/* This function is used for getting the data from back */
function fetchData(info){

    // create XMLHttpRequest
    const xmlhttp = new XMLHttpRequest();

    // create url for server request
    let url = "app/index.php?search-info=" + info;

    // checking if the status == 4, if so, data has arrived
    xmlhttp.onreadystatechange = function(){

        if(xmlhttp.readyState == 4 && xmlhttp.status == 200){

            let data = JSON.parse(xmlhttp.responseText);
            
            displayData(data);
        }
    }

    // send the data
    xmlhttp.open("GET",url,true);
    xmlhttp.send();
}


/* Functions below are used for displaying data */
function displayData(data){

    // If there is no error, it means that we got the data
    if(data.error === false)
    {
        // first remove any existing elements ( div.result )
        if(document.querySelector(".result") !== null)
        {
            document.getElementsByClassName("result")[0].remove();
        }
        // Also remove errors (div.errorText), if there is any
        if(document.querySelector(".errorText") !== null)
        {
            document.getElementsByClassName("errorText")[0].remove();
        }

        // create section for displaying received results
        let resultSection = document.createElement("section");
        resultSection.setAttribute("class","result");

         // append to main element
        document.getElementsByTagName("main")[0].appendChild(resultSection);

        // create the main object (represents the channel);
        let channel = data.data;

        // call function author(), which displays info about the channel author
        author(channel);

        // call function entry(), which displays all the entries/videos
        entry(channel);

    }else{
       
            // first remove any existing errors, div.errorText
            if(document.querySelector(".errorText") !== null)
            {
                document.getElementsByClassName("errorText")[0].remove();
            }
            // Also remove results, if there are any
            if(document.querySelector(".result") !== null)
            {
                document.getElementsByClassName("result")[0].remove();
            }

            // create the error text
            let errorText = document.createElement("div");

            // check what is the value of errorCode, and add error message
            switch (data.errorCode) {

                case 2:
                    errorText.innerHTML = "Please check again. Name does not match any YT channel.";
                    break;
                case 3:
                    errorText.innerHTML = "There are no videos available for this YT channel.";
                    break;
            }
            
            // set class for the div element
            errorText.setAttribute("class","errorText");

            // add the div element at the beginning of the main element
            document.getElementsByTagName("main")[0].prepend(errorText);

    }
      
}

function author(channel){

    // get the main info 
    let authorName = channel.author.name
    let channelUri = channel.author.uri;
    let dateJoined = channel.published;

    // format the date, to get year
    dateJoined = dateJoined.split("-");
    yearJoined = dateJoined[0];

    // create the div for displaying author info
    let authorInfo = document.createElement("div");
    authorInfo.setAttribute("class","author-info");
    authorInfo.innerHTML = "<div class='author-name'><a href="+ channelUri +">"+"<i class='fas fa-user'></i> "+ authorName +"</a></div>";
    authorInfo.innerHTML += "<div class='date'>"+"<i class='far fa-clock'></i>"+ " Year joined: " + yearJoined +"</div>";

    // append it to the result section
    document.getElementsByClassName("result")[0].appendChild(authorInfo);
}

function entry(channel){

    // define the entry
    let video = channel.entry;

    // add the left arrow for slider
    document.getElementsByClassName("result")[0].innerHTML += "<i class='fas fa-arrow-alt-circle-left fa-3x'></i>";
    document.getElementsByClassName("fa-arrow-alt-circle-left")[0].setAttribute("onclick","slider('-')");

    for(i = 0; i < video.length; i++)
    {
        // create div to display video/entry
        let entryInfo = document.createElement("div");
        entryInfo.setAttribute("class","entry-info");

        // get the video id
        let videoID = video[i].id;
        videoID = videoID.split(":");
        videoID = videoID[2];
    
        // embed the video
        let iframe = document.createElement("iframe");
        iframe.setAttribute("class","video-window");
        
        // video link
        let embedVideo = "https://www.youtube.com/embed/" + videoID;
        
        // add video link to iframe
        iframe.setAttribute("src",embedVideo);
        
        // append the iframe to entryInfo
        entryInfo.appendChild(iframe);

        // get the video title, wrap it with anchor tag and add it to the entryInfo section
        let videoLink = "https://www.youtube.com/watch?v=" + videoID;
        let videoTitle = video[i].title;
        entryInfo.innerHTML += "<h2 class='video-title'><a href="+ videoLink +" target='_blank'>"+ videoTitle +"</a></h2>";

        // append the entryInfo to the result section
        document.getElementsByClassName("result")[0].appendChild(entryInfo);
        
    }

    // add the right arrow for slider
    document.getElementsByClassName("result")[0].innerHTML += "<i class='fas fa-arrow-alt-circle-right fa-3x'></i>";
    document.getElementsByClassName("fa-arrow-alt-circle-right")[0].setAttribute("onclick","slider('+')");

    // call the slider function for the first time
    slider();
}


/* Slider function */

function slider(slide){

	let elements = document.getElementsByClassName("entry-info");

    // first, reset all the videos display to none, every time this function is called
    for (i = 0; i < elements.length; i++) {

        elements[i].style.display = "none";
    }


	switch (slide) {
		
		case "+":
			elementCount+=3;
			break;
		case "-":
			elementCount-=3;
            break;
        default:
            elementCount = 0;
    }
    
    // get the arrows
    let leftArrow = document.getElementsByClassName("fa-arrow-alt-circle-left")[0];
    let rightArrow = document.getElementsByClassName("fa-arrow-alt-circle-right")[0];

    // reset the visibility of arrows
    leftArrow.style.visibility = "visible";
    rightArrow.style.visibility = "visible";

    // see what is the elementCount value, and based upon that decide to display or not to display the arrows
    if (elementCount < 3) {

        leftArrow.style.visibility = "hidden";

    } else if (elementCount >= elements.length - 3 ) {

        rightArrow.style.visibility = "hidden";
    }
    
    // display elements, 3 at a time
	for (i = 0 ; i < 3 ; i++) {
          
        elements[elementCount].style.display = "block";
        
        elementCount++;
    }
    
    // return to the previous value of element count
    elementCount-=3;

}