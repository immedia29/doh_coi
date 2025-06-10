document.addEventListener('DOMContentLoaded', function () {
  const fillSurveyBtn = document.getElementById('fillSurveyBtn');
  const editSurveyBtn = document.getElementById('editSurveyBtn');

  if (fillSurveyBtn && fillSurveyBtn.classList.contains('disabled')) {
    fillSurveyBtn.addEventListener('click', function (event) {
      event.preventDefault();
      alert('You have already submitted the survey.');
      console.log('Fill-up Survey button is disabled.');
    });
  }

  if (editSurveyBtn && editSurveyBtn.classList.contains('disabled')) {
    editSurveyBtn.addEventListener('click', function (event) {
      event.preventDefault();
      alert('Edit survey is not currently allowed.');
      console.log('Edit Survey button is disabled.');
    });
  }

  // Survey navigation
  const surveyParts = document.querySelectorAll('.survey-part');
  const progressSteps = document.querySelectorAll('.progress-step');
  const totalParts = surveyParts.length;
  let currentPart = 1;

  window.navigateToPart = function (partNumber) {
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

  roleRadios.forEach((radio) => {
    radio.addEventListener('change', function () {
      if (this.id === 'role_others' && this.checked) {
        othersSpecifyGroup.style.display = 'block';
      } else {
        othersSpecifyGroup.style.display = 'none';
        othersTextarea.value = '';
      }

      document.querySelectorAll('.radio-option').forEach((opt) => opt.classList.remove('selected'));
      if (this.checked) {
        this.closest('.radio-option').classList.add('selected');
      }
    });
  });

  updateProgressBar();

  if (surveyParts.length > 0) {
    surveyParts.forEach((part) => (part.style.display = 'none'));
    document.getElementById('part1').style.display = 'block';
    document.getElementById('part1').classList.add('active-part');
  }

  //Part 3: Financial Conflicts

  const modal = document.getElementById('textareaModal');
  const modalTextarea = document.getElementById('modalTextarea');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  let activeTextarea = null;

  function openModal(sourceTextareaElement) {
    if (!sourceTextareaElement) return;

    activeTextarea = sourceTextareaElement;

    modalTextarea.value = activeTextarea.value;

    modal.style.display = 'flex';
    modalTextarea.focus();
  }

  function closeModal() {
    if (activeTextarea) {
      activeTextarea.value = modalTextarea.value;
    }

    modal.style.display = 'none';
    activeTextarea = null;
  }

  // Financial Conflicts
  const expandBtn_A = document.getElementById('expandTextareaBtn');
  const textarea_A = document.getElementById('financial_conflict_details');
  if (expandBtn_A) {
    expandBtn_A.addEventListener('click', function () {
      openModal(textarea_A);
    });
  }

  // Non-financial Conflicts
  const expandBtn_B = document.getElementById('expandTextareaBtn_B');
  const textarea_B = document.getElementById('non_financial_conflict_details');
  if (expandBtn_B) {
    expandBtn_B.addEventListener('click', function () {
      openModal(textarea_B);
    });
  }

  // Other Declarations
  const expandBtn_C = document.getElementById('expandTextareaBtn_C');
  const textarea_C = document.getElementById('other_declarations_details');
  if (expandBtn_C) {
    expandBtn_C.addEventListener('click', function () {
      openModal(textarea_C);
    });
  }

  modalCloseBtn.addEventListener('click', function (event) {
    event.preventDefault();
    closeModal();
  });

  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  const conflictRadios = document.querySelectorAll('input[name="financial_conflict"]');
  const conflictDetailsGroup = document.getElementById('financial_conflict_details_group');
  const conflictTextarea = document.getElementById('financial_conflict_details');
  const nonConflictRadios = document.querySelectorAll('input[name="non_financial_conflict"]');
  const nonConflictDetailsGroup = document.getElementById('non_financial_conflict_details_group');
  const nonConflictTextarea = document.getElementById('non_financial_conflict_details');
  const otherDeclarationsRadios = document.querySelectorAll('input[name="other_declarations_conflict"]');
  const otherDeclarationsDetailsGroup = document.getElementById('other_declarations_details_group');
  const otherDeclarationsTextarea = document.getElementById('other_declarations_details');

  conflictRadios.forEach((radio) => {
    radio.addEventListener('change', function () {
      if (this.id === 'financial_conflict_yes' && this.checked) {
        conflictDetailsGroup.style.display = 'block';
      } else {
        conflictDetailsGroup.style.display = 'none';
        conflictTextarea.value = '';
      }
    });
  });

  nonConflictRadios.forEach((radio) => {
    radio.addEventListener('change', function () {
      if (this.id === 'non_financial_conflict_yes' && this.checked) {
        nonConflictDetailsGroup.style.display = 'block';
      } else {
        nonConflictDetailsGroup.style.display = 'none';
        nonConflictTextarea.value = '';
      }
    });
  });

  otherDeclarationsRadios.forEach((radio) => {
    radio.addEventListener('change', function () {
      if (this.id === 'other_declarations_conflict_yes' && this.checked) {
        otherDeclarationsDetailsGroup.style.display = 'block';
      } else {
        otherDeclarationsDetailsGroup.style.display = 'none';
        otherDeclarationsTextarea.value = '';
      }
    });
  });
});
