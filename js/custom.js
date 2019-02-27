(function() {
  var burger = document.querySelector(".burger");
  var menu = document.querySelector("#" + burger.dataset.target);
  burger.addEventListener("click", function() {
    burger.classList.toggle("is-active");
    burger.setAttribute('aria-expanded', !(burger.getAttribute('aria-expanded') === "true"));
    menu.classList.toggle("is-active");
  });
})();

(function () {
	var tablist = document.querySelectorAll('[role="tablist"]')[0];
	var tabs;
	var panels;

	generateArrays();

	function generateArrays () {
		tabs = document.querySelectorAll('[role="tab"]');
		panels = document.querySelectorAll('[role="tabpanel"]');
	};

	// For easy reference
	var keys = {
		end: 35,
		home: 36,
		left: 37,
		up: 38,
		right: 39,
		down: 40,
		enter: 13,
		space: 32
	};

	// Add or substract depenign on key pressed
	var direction = {
		37: -1,
		38: -1,
		39: 1,
		40: 1
	};

	// Bind listeners
	for (i = 0; i < tabs.length; ++i) {
		addListeners(i);
	};

	function addListeners (index) {
		tabs[index].addEventListener('click', clickEventListener);
		tabs[index].addEventListener('keydown', keydownEventListener);
		tabs[index].addEventListener('keyup', keyupEventListener);

		// Build an array with all tabs (<button>s) in it
		tabs[index].index = index;
	};

	// When a tab is clicked, activateTab is fired to activate it
	function clickEventListener (event) {
		var tab;
		if (event.target.classList.contains('button')) {
		  tab = event.target;
    }
    else {
			tab = event.target.parentElement;
    }
		activateTab(tab, false);
	};

	// Handle keydown on tabs
	function keydownEventListener (event) {
		var key = event.keyCode;

		switch (key) {
			case keys.end:
				event.preventDefault();
				// Activate last tab
				focusLastTab();
				break;
			case keys.home:
				event.preventDefault();
				// Activate first tab
				focusFirstTab();
				break;

			// Up and down are in keydown
			// because we need to prevent page scroll >:)
			case keys.up:
			case keys.down:
				determineOrientation(event);
				break;
		};
	};

	// Handle keyup on tabs
	function keyupEventListener (event) {
		var key = event.keyCode;

		switch (key) {
			case keys.left:
			case keys.right:
				determineOrientation(event);
				break;
			case keys.enter:
			case keys.space:
				activateTab(event.target);
				break;
		};
	};

	// When a tablist’s aria-orientation is set to vertical,
	// only up and down arrow should function.
	// In all other cases only left and right arrow function.
	function determineOrientation (event) {
		var key = event.keyCode;
		var vertical = tablist.getAttribute('aria-orientation') == 'vertical';
		var proceed = false;

		if (vertical) {
			if (key === keys.up || key === keys.down) {
				event.preventDefault();
				proceed = true;
			};
		}
		else {
			if (key === keys.left || key === keys.right) {
				proceed = true;
			};
		};

		if (proceed) {
			switchTabOnArrowPress(event);
		};
	};

	// Either focus the next, previous, first, or last tab
	// depening on key pressed
	function switchTabOnArrowPress (event) {
		var pressed = event.keyCode;

		if (direction[pressed]) {
			var target = event.target;
			if (target.index !== undefined) {
				if (tabs[target.index + direction[pressed]]) {
					tabs[target.index + direction[pressed]].focus();
				}
				else if (pressed === keys.left || pressed === keys.up) {
					focusLastTab();
				}
				else if (pressed === keys.right || pressed == keys.down) {
					focusFirstTab();
				};
			};
		};
	};

	// Activates any given tab panel
	function activateTab (tab, setFocus) {
		setFocus = setFocus || true;
		// Deactivate all other tabs
		deactivateTabs();

		// Remove tabindex attribute
		tab.removeAttribute('tabindex');

		// Set the tab as selected
		tab.setAttribute('aria-selected', 'true');

		// Get the value of aria-controls (which is an ID)
		var controls = tab.getAttribute('aria-controls');

		// Remove hidden attribute from tab panel to make it visible
		document.getElementById(controls).removeAttribute('hidden');

		// Set focus when required
		if (setFocus) {
			tab.focus();
		};
	};

	// Deactivate all tabs and tab panels
	function deactivateTabs () {
		for (t = 0; t < tabs.length; t++) {
			tabs[t].setAttribute('tabindex', '-1');
			tabs[t].setAttribute('aria-selected', 'false');
		};

		for (p = 0; p < panels.length; p++) {
			panels[p].setAttribute('hidden', 'hidden');
		};
	};

	// Make a guess
	function focusFirstTab () {
		tabs[0].focus();
	};

	// Make a guess
	function focusLastTab () {
		tabs[tabs.length - 1].focus();
	};
}());

(function () {

	var users = [];
	var form = document.getElementById('user-registration');

	function clearForm(form) {
		var elems = form.elements;

		elems.username.value = '';
		elems.firstName.value = '';
		elems.lastName.value = '';
		elems.birthYear.value = '';
		elems.phoneNumber.value = '';
		elems.address.value = '';
		elems.postcode.value = '';
		elems.contactEmail.value = '';
		elems.agreeTerms.checked = false;

		var controlElements = document.querySelectorAll('form .control');
		var formInputs = document.querySelectorAll('form input');

		controlElements.forEach(function(element) {
			element.classList.remove('is-valid', 'is-invalid');
		});

		formInputs.forEach(function(element) {
			element.classList.remove('is-success', 'is-danger');
			element.removeAttribute('aria-describedby');
		});

		document.getElementById('birth-year-field').classList.add('hidden');
	};

	document.getElementById('submit-button').addEventListener('click', function(e){
		e.preventDefault();

		var formValid = true;
		var elems = form.elements;
		document.getElementById('form-success').innerHTML = '';

		if (elems.username.value === '') {
			formValid = false;
			elems.username.classList.remove('is-success');
			elems.username.classList.add('is-danger');
			elems.username.parentNode.classList.remove('is-valid');
			elems.username.parentNode.classList.add('is-invalid');
			elems.username.setAttribute('aria-describedby', 'username-danger');
		}
		else {
			elems.username.classList.remove('is-danger');
			elems.username.classList.add('is-success');
			elems.username.parentNode.classList.remove('is-invalid');
			elems.username.parentNode.classList.add('is-valid');
			elems.username.setAttribute('aria-describedby', 'username-success');
		}


		if (elems.firstName.value === '') {
			formValid = false;
			elems.firstName.classList.remove('is-success');
			elems.firstName.classList.add('is-danger');
			elems.firstName.parentNode.classList.remove('is-valid');
			elems.firstName.parentNode.classList.add('is-invalid');
			elems.firstName.setAttribute('aria-describedby', 'first-name-danger');
		}
		else {
			elems.firstName.classList.remove('is-danger');
			elems.firstName.classList.add('is-success');
			elems.firstName.parentNode.classList.remove('is-invalid');
			elems.firstName.parentNode.classList.add('is-valid');
			elems.firstName.setAttribute('aria-describedby', 'last-name-success');
		}

		if (elems.lastName.value === '') {
			formValid = false;
			elems.lastName.classList.remove('is-success');
			elems.lastName.classList.add('is-danger');
			elems.lastName.parentNode.classList.remove('is-valid');
			elems.lastName.parentNode.classList.add('is-invalid');
			elems.lastName.setAttribute('aria-describedby', 'last-name-danger');
		}
		else {
			elems.lastName.classList.remove('is-danger');
			elems.lastName.classList.add('is-success');
			elems.lastName.parentNode.classList.remove('is-invalid');
			elems.lastName.parentNode.classList.add('is-valid');
			elems.lastName.setAttribute('aria-describedby', 'first-name-success');
		}

		if (elems.phoneNumber.value === '' || !elems.phoneNumber.value.match(/^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){9,14}(\s*)?$/)) {
			formValid = false;
			elems.phoneNumber.classList.remove('is-success');
			elems.phoneNumber.classList.add('is-danger');
			elems.phoneNumber.parentNode.classList.remove('is-valid');
			elems.phoneNumber.parentNode.classList.add('is-invalid');
			elems.phoneNumber.setAttribute('aria-describedby', 'phone-number-danger');
		}
		else {
			elems.phoneNumber.classList.remove('is-danger');
			elems.phoneNumber.classList.add('is-success');
			elems.phoneNumber.parentNode.classList.remove('is-invalid');
			elems.phoneNumber.parentNode.classList.add('is-valid');
			elems.phoneNumber.setAttribute('aria-describedby', 'phone-number-success');
		}

		if (elems.address.value === '') {
			formValid = false;
			elems.address.classList.remove('is-success');
			elems.address.classList.add('is-danger');
			elems.address.parentNode.classList.remove('is-valid');
			elems.address.parentNode.classList.add('is-invalid');
			elems.address.setAttribute('aria-describedby', 'address-danger');
		}
		else {
			elems.address.classList.remove('is-danger');
			elems.address.classList.add('is-success');
			elems.address.parentNode.classList.remove('is-invalid');
			elems.address.parentNode.classList.add('is-valid');
			elems.address.setAttribute('aria-describedby', 'address-success');
		}

		if (elems.contactEmail.value === '' || !elems.contactEmail.value.match(/^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i)) {
			formValid = false;
			elems.contactEmail.classList.remove('is-success');
			elems.contactEmail.classList.add('is-danger');
			elems.contactEmail.parentNode.classList.remove('is-valid');
			elems.contactEmail.parentNode.classList.add('is-invalid');
			elems.contactEmail.setAttribute('aria-describedby', 'contact-email-danger');
		}
		else {
			elems.contactEmail.classList.remove('is-danger');
			elems.contactEmail.classList.add('is-success');
			elems.contactEmail.parentNode.classList.remove('is-invalid');
			elems.contactEmail.parentNode.classList.add('is-valid');
			elems.contactEmail.setAttribute('aria-describedby', 'contact-email-success');
		}

		if (!elems.agreeTerms.checked) {
			formValid = false;
			elems.agreeTerms.classList.remove('is-success');
			elems.agreeTerms.classList.add('is-danger');
			elems.agreeTerms.parentNode.classList.remove('is-valid');
			elems.agreeTerms.parentNode.classList.add('is-invalid');
			elems.agreeTerms.setAttribute('aria-describedby', 'agree-terms-danger');
		}
		else {
			elems.agreeTerms.classList.remove('is-danger');
			elems.agreeTerms.classList.add('is-success');
			elems.agreeTerms.parentNode.classList.remove('is-invalid');
			elems.agreeTerms.parentNode.classList.add('is-valid');
			elems.agreeTerms.removeAttribute('aria-describedby');
		}

		if (users.length > 0) {
			if (document.getElementById('birth-year-field').classList.contains('hidden')) {
				users.forEach(function(element) {
					if (elems.firstName.value === element.firstName && elems.lastName.value === element.lastName) {
						formValid = false;
						document.getElementById('birth-year-field').classList.remove('hidden');
						document.getElementById('birth-year-help').innerHTML = 'Please enter birth year';
						document.querySelector('#birth-year-field input').focus();
						return false;
					}
				});
			}
			else {
				document.getElementById('birth-year-help').innerHTML = '';
				if (elems.birthYear.value === '' || !elems.birthYear.value.match(/^\d+$/)) {
					formValid = false;
					elems.birthYear.classList.remove('is-success');
					elems.birthYear.classList.add('is-danger');
					elems.birthYear.parentNode.classList.remove('is-valid');
					elems.birthYear.parentNode.classList.add('is-invalid');
					elems.birthYear.setAttribute('aria-describedby', 'birth-year-danger');
				}
				else {
					elems.birthYear.classList.remove('is-danger');
					elems.birthYear.classList.add('is-success');
					elems.birthYear.parentNode.classList.remove('is-invalid');
					elems.birthYear.parentNode.classList.add('is-valid');
					elems.birthYear.setAttribute('aria-describedby', 'birth-year-success');
				}
			}
		}

		if (formValid) {
			var user = {
				username: elems.username.value,
				firstName: elems.firstName.value,
				lastName: elems.lastName.value,
				birthYear: elems.birthYear.value,
				phoneNumber: elems.phoneNumber.value,
				address: elems.address.value,
				postcode: elems.postcode.value,
				email: elems.contactEmail.value
			};

			users.push(user);
			clearForm(form);

			document.getElementById('form-success').innerHTML = 'New user successfully added.';
			form.focus();
		}
		else {
			document.querySelectorAll('form input.is-danger')[0].focus();
		}
	});
}());
