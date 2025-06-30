document.addEventListener('DOMContentLoaded', function () {
  const surveyParts = document.querySelectorAll('.survey-part');
  const progressSteps = document.querySelectorAll('.progress-step');
  const modal = document.getElementById('textareaModal');
  const modalTextarea = document.getElementById('modalTextarea');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  // submission modal elements
  const submissionModal = document.getElementById('submissionModal');
  const mainForm = document.getElementById('coiSurveyForm');
  const submissionTypeInput = document.getElementById('submission_type');

  const totalParts = surveyParts.length;
  let currentPart = 1;
  let activeTextarea = null;

  const fillSurveyBtn = document.getElementById('fillSurveyBtn');
  if (fillSurveyBtn && fillSurveyBtn.classList.contains('disabled')) {
    fillSurveyBtn.addEventListener('click', function (event) {
      event.preventDefault();
      console.warn('Fill-up Survey is disabled. You may have already submitted it.');
    });
  }

  const editSurveyBtn = document.getElementById('editSurveyBtn');
  if (editSurveyBtn && editSurveyBtn.classList.contains('disabled')) {
    editSurveyBtn.addEventListener('click', function (event) {
      event.preventDefault();
      console.warn('Edit Survey is disabled. Admin permission may be required.');
    });
  }

  //======================================================================
  // SURVEY NAVIGATION & PROGRESS BAR

  window.navigateToPart = function (partNumber) {
    if (partNumber < 1 || partNumber > totalParts) {
      return;
    }

    if (partNumber === totalParts) {
      populateSummary();
    }

    if (document.getElementById('part' + currentPart)) {
      document.getElementById('part' + currentPart).style.display = 'none';
      document.getElementById('part' + currentPart).classList.remove('active-part');
    }

    if (partNumber === 7) {
      document.getElementById('progress-bar-container').style.display = 'none';
    }

    const newPart = document.getElementById('part' + partNumber);
    if (newPart) {
      newPart.style.display = 'block';
      newPart.classList.add('active-part');
    }

    currentPart = partNumber;
    updateProgressBar();
  };

  function updateProgressBar() {
    progressSteps.forEach((step) => {
      const stepNumber = parseInt(step.getAttribute('data-step'));
      const precedingLine = step.previousElementSibling;

      if (stepNumber < currentPart) {
        step.classList.add('completed');
        step.classList.remove('active');
      } else if (stepNumber === currentPart) {
        step.classList.add('active');
        step.classList.remove('completed');
      } else {
        step.classList.remove('active', 'completed');
      }

      if (precedingLine && precedingLine.classList.contains('progress-line')) {
        if (step.classList.contains('active') || step.classList.contains('completed')) {
          precedingLine.classList.add('active-line');
        } else {
          precedingLine.classList.remove('active-line');
        }
      }
    });
  }

  if (surveyParts.length > 0) {
    surveyParts.forEach((part) => (part.style.display = 'none'));
    const firstPart = document.getElementById('part1');
    if (firstPart) {
      firstPart.style.display = 'block';
      firstPart.classList.add('active-part');
    }
    updateProgressBar();
  }

  function setupConditionalField(radioName, detailsGroupId) {
    const radios = document.querySelectorAll(`input[name="${radioName}"]`);
    const detailsGroup = document.getElementById(detailsGroupId);
    const textarea = detailsGroup ? detailsGroup.querySelector('textarea') : null;

    radios.forEach((radio) => {
      radio.addEventListener('change', function () {
        const shouldShow = (this.value === 'yes' && this.checked) || (radioName === 'cpg_role' && this.value === 'Others' && this.checked);

        if (shouldShow) {
          if (detailsGroup) detailsGroup.style.display = 'block';
        } else {
          if (detailsGroup) detailsGroup.style.display = 'none';
          if (textarea) textarea.value = '';
        }
      });
    });
  }

  setupConditionalField('cpg_role', 'role_others_specify_group');
  setupConditionalField('financial_conflict', 'financial_conflict_details_group');
  setupConditionalField('non_financial_conflict', 'non_financial_conflict_details_group');
  setupConditionalField('other_declarations_conflict', 'other_declarations_conflict_details_group');

  document.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener('change', function () {
      document.querySelectorAll(`input[name="${this.name}"]`).forEach((rb) => {
        rb.closest('.radio-option')?.classList.remove('selected');
      });

      if (this.checked) {
        this.closest('.radio-option')?.classList.add('selected');
      }
    });
  });

  //======================================================================
  // EXPANDABLE TEXTAREA MODAL

  function openModal(sourceTextareaElement) {
    if (!sourceTextareaElement || !modal || !modalTextarea) return;
    activeTextarea = sourceTextareaElement;
    modalTextarea.value = activeTextarea.value;
    modal.style.display = 'flex';
    modalTextarea.focus();
  }

  function closeModal() {
    if (activeTextarea && modalTextarea) {
      activeTextarea.value = modalTextarea.value;
    }
    if (modal) modal.style.display = 'none';
    activeTextarea = null;
  }

  function setupExpandButton(buttonId, textareaId) {
    const expandBtn = document.getElementById(buttonId);
    const textarea = document.getElementById(textareaId);
    if (expandBtn && textarea) {
      expandBtn.addEventListener('click', () => openModal(textarea));
    }
  }

  setupExpandButton('expandTextareaBtn', 'financial_conflict_details');
  setupExpandButton('expandTextareaBtn_B', 'non_financial_conflict_details');
  setupExpandButton('expandTextareaBtn_C', 'other_declarations_conflict_details');

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', function (event) {
      event.preventDefault();
      closeModal();
    });
  }
  if (modal) {
    modal.addEventListener('click', function (event) {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  //======================================================================
  // FINAL SUBMISSION LOGIC

  if (mainForm) {
    mainForm.addEventListener('submit', function (event) {
      event.preventDefault();

      if (submissionModal) {
        submissionModal.style.display = 'flex';
      }
    });
  }

  const saveAsDraftBtn = document.getElementById('saveAsDraftBtn');
  if (saveAsDraftBtn) {
    saveAsDraftBtn.addEventListener('click', function () {
      if (submissionTypeInput) submissionTypeInput.value = 'draft';
      if (mainForm) mainForm.submit();
    });
  }

  const saveAndSubmitBtn = document.getElementById('saveAndSubmitBtn');
  if (saveAndSubmitBtn) {
    saveAndSubmitBtn.addEventListener('click', function () {
      if (submissionModal) submissionModal.style.display = 'none';
      if (finalSubmitModal) finalSubmitModal.style.display = 'flex';
    });
  }

  const backToSurveyBtn = document.getElementById('backToSurveyBtn');
  if (backToSurveyBtn) {
    backToSurveyBtn.addEventListener('click', function () {
      if (finalSubmitModal) finalSubmitModal.style.display = 'none';
      if (submissionModal) submissionModal.style.display = 'flex';
    });
  }

  const proceedSubmitBtn = document.getElementById('proceedSubmitBtn');
  if (proceedSubmitBtn) {
    proceedSubmitBtn.addEventListener('click', function () {
      if (submissionTypeInput) submissionTypeInput.value = 'final';
      if (mainForm) mainForm.submit();
    });
  }

  //======================================================================
  //  SUMMARY PAGE POPULATION

  function populateSummary() {
    const getValue = (name) => document.querySelector(`[name="${name}"]`)?.value || '';
    const getRadioValue = (name) => document.querySelector(`input[name="${name}"]:checked`)?.value || 'N/A';

    // --- Part 1: Personal Information ---
    const fullName = `${getValue('first_name')} ${getValue('last_name')}`;
    document.querySelector('[data-summary-for="first_name,last_name"]').textContent = fullName.trim() || 'N/A';
    document.querySelector('[data-summary-for="address"]').textContent = getValue('address') || 'N/A';
    document.querySelector('[data-summary-for="occupation"]').textContent = getValue('occupation') || 'N/A';
    document.querySelector('[data-summary-for="main_employer"]').textContent = getValue('main_employer') || 'N/A';
    document.querySelector('[data-summary-for="email"]').textContent = getValue('email') || 'N/A';
    document.querySelector('[data-summary-for="phone"]').textContent = getValue('phone') || 'N/A';

    // --- Part 2: CPG Role ---
    document.querySelector('[data-summary-for="cpg_group_name"]').textContent = getValue('cpg_group_name') || 'N/A';
    let role = getRadioValue('cpg_role');
    if (role === 'Others') {
      role = `Others: ${getValue('role_others_specify') || 'Not specified'}`;
    }
    document.querySelector('[data-summary-for="cpg_role"]').textContent = role;

    // --- Part 3 & 4 etc: COI Declarations ---
    function populateConflictSummary(baseName) {
      const answerBox = document.querySelector(`[data-summary-for="${baseName}"]`);
      const detailsBox = document.querySelector(`[data-summary-for="${baseName}_details"]`);
      if (!answerBox || !detailsBox) return;

      const radioValue = getRadioValue(baseName);
      const detailsValue = getValue(`${baseName}_details`);

      const iconClass = radioValue === 'yes' ? 'fa-check-circle text-success' : 'fa-times-circle text-danger';
      answerBox.innerHTML = `<i class="fas ${iconClass}"></i> ${radioValue.charAt(0).toUpperCase() + radioValue.slice(1)}`;

      if (radioValue === 'yes' && detailsValue) {
        detailsBox.textContent = detailsValue;
        detailsBox.style.display = 'block';
      } else {
        detailsBox.textContent = '';
        detailsBox.style.display = 'none';
      }
    }

    populateConflictSummary('financial_conflict');
    populateConflictSummary('non_financial_conflict');
    populateConflictSummary('other_declarations_conflict');
  }
});
