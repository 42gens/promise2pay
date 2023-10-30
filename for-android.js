window.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
        document.getElementById("splash-screen").style.display = "none";
    }, 3000); // hides after 3 seconds
});


let mediaRecorder;
let recordedChunks = [];

document.getElementById('borrowerCheckbox').addEventListener('change', function() {
    if (this.checked) {
        sessionStorage.setItem('borrowerRequest', 'true');
        document.getElementById('lenderCheckbox').checked = false;
    } else {
        sessionStorage.removeItem('borrowerRequest');
    }
});

document.getElementById('lenderCheckbox').addEventListener('change', function() {
    if (this.checked) {
        sessionStorage.setItem('lenderRequest', 'true');
        document.getElementById('borrowerCheckbox').checked = false;
    } else {
        sessionStorage.removeItem('lenderRequest');
    }
});

///???
function showAgreement() {
    // Display the agreement logic here (based on your UI/HTML structure)
    // For example: document.getElementById('agreementSection').style.display = 'block';
}

function showLenderOptions() {
    const lenderOptionsSection = document.createElement('div');
    lenderOptionsSection.innerHTML = `
        <button onclick="offerSendEmail()">Offer Send Email</button>
        <button onclick="offerSendText()">Offer Text</button>
    `;
    document.body.appendChild(lenderOptionsSection);
}

function offerSendEmail() {
    const subject = `Lending Request`;
    const body = `You requested to borrow funds. Your lender is requesting for you to visit this link/app. From here, your lender will respond to you.`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
}

function offerSendText() {
    // Here, we use the SMS URI scheme to send SMS. Note: This may not work on all devices or browsers.
    const body = `You requested to borrow funds. Your lender is requesting for you to visit this link/app. From here, your lender will respond to you.`;
    window.location.href = `sms:?&body=${encodeURIComponent(body)}`;
}

////???

function generateFilename(extension) {
    const borrowerName = document.getElementById('borrowerName').value;
    const lenderName = document.getElementById('lenderName').value;
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '');

    return `promise2pay-${borrowerName}-${lenderName}-${timestamp}.${extension}`;
}

async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const video = document.getElementById('video');
    video.srcObject = stream;
    video.muted = true; // Mute the video to prevent echo


    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    function generateFilename(extension, timestamp) {
        const borrowerName = document.getElementById('borrowerName').value;
        const lenderName = document.getElementById('lenderName').value;
    
        return `promise2pay-${borrowerName}-${lenderName}-${timestamp}.${extension}`;
    }
    
    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, {
            type: 'video/webm'
        });
    
        const videoURL = URL.createObjectURL(blob);
        video.srcObject = null;
        video.src = videoURL;
    
        const downloadBtn = document.getElementById('downloadBtn');
    
        downloadBtn.addEventListener('click', function() {
            const currentTimestamp = new Date().toISOString().replace(/[:.-]/g, '');
    
            // Save the video file
            const videoFilename = generateFilename('webm', currentTimestamp);
            const a = document.createElement('a');
            a.href = videoURL;
            a.download = videoFilename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            showNextSteps();

    
            // Save the txt data
            const txtData = `I ${document.getElementById('borrowerName').value}, will promise to pay ${document.getElementById('lenderName').value} back by this date, ${document.getElementById('repaymentDate').value}. Sign ${document.getElementById('borrowerSignature').value} and ${document.getElementById('borrowerEmail').value}.`;
            const txtBlob = new Blob([txtData], {type: 'text/plain'});
            const txtURL = URL.createObjectURL(txtBlob);
            const txtFilename = generateFilename('txt', currentTimestamp);
            const txtLink = document.createElement('a');
            txtLink.href = txtURL;
            txtLink.download = txtFilename;
            document.body.appendChild(txtLink);
            txtLink.click();
            document.body.removeChild(txtLink);
        });
    };
    
    

    // Start the MediaRecorder
    mediaRecorder.start();

    // Hide the start button and show the stop button
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('stopBtn').style.display = 'block';
}

// Function to handle stopping the recording
function stopRecording() {
    mediaRecorder.stop();

    // Hide the stop button
    document.getElementById('stopBtn').style.display = 'none';
}

// ... (Your code up to the end of `function stopRecording() { ... }`)

function showNextSteps() {
    const nextStepsSection = document.createElement('div');
    nextStepsSection.id = 'nextSteps';
    nextStepsSection.innerHTML = `
        <h2>Next Steps:</h2>
        <ol>
            <li>Email The Video And Agreement To The Lender and  To Yourself 
                <button onclick="openDefaultEmail()">Open Email</button>
            </li><br><br><br><br>
            <li>Set A Payback Reminder
                <button onclick="openDefaultCalendar()">Set Reminder</button>
            </li>
        </ol><br>
    `;

    const contentContainer = document.getElementById('contentContainer');
    contentContainer.appendChild(nextStepsSection);
}


function openDefaultEmail() {
    // Create mailto link with attachments
    const borrowerName = document.getElementById('borrowerName').value;
    const lenderName = document.getElementById('lenderName').value;
    const subject = `Promise2Pay Says, Here Is Proof Your Borrower Will Pay You Back`;
    const body = `Your Borrower has video recorded their proimse to you back.  Attached in this emial is the Video And Agreement. Visit https://42gens.github.io/promise2pay/ to promise to pay back.`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
}


function openDefaultEmail3() {
    // Create mailto link with attachments
    // Get values (if you use them later)
    const borrowerName = document.getElementById('borrowerName').value;
    const lenderName = document.getElementById('lenderName').value;
    
    const subject = `You Requested To Borrow Money`;

    // Use plain text for URLs
    const body = `Your Lender Is Requesting You To Use Promise2Pay App:\n` +
                 `Visit: https://42gens.github.io/promise2pay/\n\n` + 
                 `For Protection From Unjust Law Enforcement...\n` +
                 `Visit: https://safe-watcher.com`;

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
}

///??
function openDefaultEmail2() {
    // Create mailto link with attachments
    const borrowerName = document.getElementById('borrowerName').value;
    const lenderName = document.getElementById('lenderName').value;
    const subject = `Promise2Pay says, what a good day.. Your Debt is Forgiven!`;
    const body = `Your personal loan is forgiven, feels good doesn't? Be sure to thank your lender! Safe-Watcher.com and safe-watcher app has your back!`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
}
///??



function openDefaultCalendar() {
    const repaymentDate = document.getElementById('repaymentDate').value;
    const eventDescription = `Reminder to receive payment from ${document.getElementById('borrowerName').value}`;
    const calendarLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=Payment+Reminder&dates=${repaymentDate}T000000Z/${repaymentDate}T010000Z&details=${encodeURIComponent(eventDescription)}&location=&sf=true&output=xml`;
    window.open(calendarLink, '_blank');
}


// Attach the event listeners to the buttons
document.getElementById('startBtn').addEventListener('click', startRecording);
document.getElementById('stopBtn').addEventListener('click', stopRecording);

function togglePlacardContent() {
    const content = document.querySelector(".placard-content");
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
    }
}

function togglePlacardContent2() {
    const content2 = document.querySelector(".placard2-content");
    if (content2.style.maxHeight) {
        content2.style.maxHeight = null;
    } else {
        content2.style.maxHeight = content2.scrollHeight + "px";
    }
}

function togglePlacardContent3() {
    const content2 = document.querySelector(".placard3-content");
    if (content2.style.maxHeight) {
        content2.style.maxHeight = null;
    } else {
        content2.style.maxHeight = content2.scrollHeight + "px";
    }
}



