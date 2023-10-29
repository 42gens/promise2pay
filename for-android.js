async function requestPermissions() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (stream) {
            // Close the stream after checking to ensure we don't unnecessarily access the user's camera/microphone
            stream.getTracks().forEach(track => track.stop());
            console.log("Permissions Granted");
            return true;  // permissions granted
        }
    } catch (error) {
        console.error("Permission error:", error);
        return false;  // permissions denied
    }
}
/////End of Permissions Check


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

function generateFilename(extension) {
    const borrowerName = document.getElementById('borrowerName').value;
    const lenderName = document.getElementById('lenderName').value;
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '');

    return `promise2pay-${borrowerName}-${lenderName}-${timestamp}.${extension}`;
}

async function startRecording() {
    const hasPermissions = await requestPermissions();
    
    if (!hasPermissions) {
        alert("Video and microphone permissions are required to record the agreement.");
        return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const video = document.getElementById('video');
    video.srcObject = stream;

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
            const txtData = `I ${document.getElementById('borrowerName').value}, will promise to pay ${document.getElementById('lenderName').value} back by ${document.getElementById('repaymentDate').value}. Sign ${document.getElementById('borrowerSignature').value} and ${document.getElementById('borrowerEmail').value} as a signature.`;
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
            <li>Email Video And Agreement To Yourself and The Borrower 
                <button onclick="openDefaultEmail()">Open Email</button>
            </li>
            <li>Set A Payback Reminder
                <button onclick="openDefaultCalendar()">Set Reminder</button>
            </li>
        </ol><br>
    `;
    document.body.appendChild(nextStepsSection);
}

function openDefaultEmail() {
    // Create mailto link with attachments
    const borrowerName = document.getElementById('borrowerName').value;
    const lenderName = document.getElementById('lenderName').value;
    const subject = `Promise to pay from ${borrowerName} to ${lenderName}`;
    const body = `Attached is the video and agreement.`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
}

function openDefaultCalendar() {
    const repaymentDate = document.getElementById('repaymentDate').value;
    const eventDescription = `Reminder to receive payment from ${document.getElementById('borrowerName').value}`;
    const calendarLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=Payment+Reminder&dates=${repaymentDate}T000000Z/${repaymentDate}T010000Z&details=${encodeURIComponent(eventDescription)}&location=&sf=true&output=xml`;
    window.open(calendarLink, '_blank');
}


// Attach the event listeners to the buttons
document.getElementById('startBtn').addEventListener('click', startRecording);
document.getElementById('stopBtn').addEventListener('click', stopRecording);
