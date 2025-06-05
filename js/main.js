document.addEventListener('DOMContentLoaded', function() {
    const fillSurveyBtn = document.getElementById('fillSurveyBtn');
    const editSurveyBtn = document.getElementById('editSurveyBtn');

    if (fillSurveyBtn && fillSurveyBtn.classList.contains('disabled')) {
        fillSurveyBtn.addEventListener('click', function(event) {
            event.preventDefault(); 
            alert("You have already submitted the survey.");
            console.log("Fill-up Survey button is disabled.");
        });
    }

    if (editSurveyBtn && editSurveyBtn.classList.contains('disabled')) {
        editSurveyBtn.addEventListener('click', function(event) {
            event.preventDefault(); 
            alert("Edit survey is not currently allowed.");
            console.log("Edit Survey button is disabled.");
        });
    }


// survey navigation
const surveyParts = document.querySelectorAll('.survey-part');
const progressSteps = document.querySelectorAll('.progress-step');
const totalParts = surveyParts.length;
let currentPart = 1;

window.navigateToPart = function(partNumber) {
    if (partNumber < 1 || partNumber > totalParts) {
        return; 
    }

    // Hide current part
    document.getElementById('part' + currentPart).style.display = 'none';
    document.getElementById('part' + currentPart).classList.remove('active-part');


    // Show new part
    document.getElementById('part' + partNumber).style.display = 'block';
    document.getElementById('part' + partNumber).classList.add('active-part');

    currentPart = partNumber;
    updateProgressBar();
};

function updateProgressBar() {
    progressSteps.forEach((step, index) => {
        const stepNumber = parseInt(step.getAttribute('data-step'));
        if (stepNumber < currentPart) {
            step.classList.add('completed'); 
            step.classList.remove('active');
        } else if (stepNumber === currentPart) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active');
            step.classList.remove('completed');
        }

        
        const precedingLine = step.previousElementSibling;
        if (precedingLine && precedingLine.classList.contains('progress-line')) {
            if (step.classList.contains('active') || step.classList.contains('completed')) {
                precedingLine.classList.add('active-line');
            } else {
                precedingLine.classList.remove('active-line');
            }
        }
    });
}


// Handle "Others" radio button for Role
const roleRadios = document.querySelectorAll('input[name="cpg_role"]');
const othersSpecifyGroup = document.getElementById('role_others_specify_group');
const othersTextarea = document.getElementById('role_others_specify');

roleRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.id === 'role_others' && this.checked) {
            othersSpecifyGroup.style.display = 'block';
        } else {
            othersSpecifyGroup.style.display = 'none';
            othersTextarea.value = '';
        }

       
        document.querySelectorAll('.radio-option').forEach(opt => opt.classList.remove('selected'));
        if(this.checked) {
            this.closest('.radio-option').classList.add('selected');
        }
    });
});

updateProgressBar();

if (surveyParts.length > 0) {
    surveyParts.forEach(part => part.style.display = 'none'); 
    document.getElementById('part1').style.display = 'block'; 
    document.getElementById('part1').classList.add('active-part');
}
});