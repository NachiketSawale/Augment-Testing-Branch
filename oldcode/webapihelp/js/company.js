/**
 * Created by wed on 10/24/2017.
 */
(function (window, $, utility, authService) {
	'use strict';

	let currRole = null;
	let currCompany = null;
	let currSigneCompany = null;

	function checkLogon() {
		if (!authService.isLogon()) {
			window.location.href = 'login.html';
		}
	}

	checkLogon();

	// gets company,role from context
	let clientContext = null;

	function resetLoading(visible) {
		if (visible) {
			$('div.login-form-loading').show();
		} else {
			$('div.login-form-loading').hide();
		}
	}

	function resetContinueStatus() {
		let canExecute = !!currRole;
		canExecute = canExecute && currCompany && currCompany['canLogin'] && currCompany['companyType'] !== 2;
		if (canExecute) {
			$('#btncontinues').removeAttr('disabled');
		} else {
			$('#btncontinues').attr('disabled', true);
		}
	}

	function resetRoles(roles) {
		$('div.company-roles').each(function () {
			let instance = this.instance;
			if (instance) {
				let selected = null, currRoleId = clientContext.permissionRoleId;
				if (currRoleId) {
					selected = utility.array.find(roles, currRoleId, 'id');
				}
				instance.setData(roles, selected);
			}
		});
	}

	let _resizeTimerId = null;

	function resizeSelection() {
		window.clearTimeout(_resizeTimerId);
		_resizeTimerId = window.setTimeout(function () {
			let container = $('#companyForm > div.modal-content'),
				offset = container.height() - ($(window).height() - 60);
			let scroller = $('#company-scroller');
			if (offset > 0) {
				let height = scroller.height();
				scroller.css({'height': (height - offset) + 'px', 'overflow-y': 'auto'});
			} else {
				let uH = $('#company-tree > ul').height(), sH = scroller.height();
				if (uH > sH) {
					let h = sH + Math.min(Math.abs(offset), uH - sH);
					scroller.css({height: h + 'px', 'overflow-y': 'auto'});
				} else {
					scroller.css({height: (uH + 10) + 'px', 'overflow-y': 'auto'});
				}
			}
		}, 50);

	}

	function initialize() {

		// initialize company tree.
		authService.getAssignedCompaniesWithRoles().then(data => {
			resetLoading(false);
			$('#company-tree').companyTree({
				data: data,
				selected: clientContext.signedInClientId,
				onSelected: function (context, company, signCompany) {
					currCompany = company;
					currSigneCompany = signCompany;
					resetRoles(company.roles);
					resetContinueStatus();
				},
				onClear: function (/* context */) {
					currCompany = null;
					resetRoles([]);
				},
				onRenderComplete: function () {
					resizeSelection();
				},
				onExpanded: function () {
					resizeSelection();
				},
				onCollapsed: function () {
					resizeSelection();
				}
			});
		}).fail(data => {
			console.info(data);
		});

		// initialize company role
		$('div.company-roles').dropdown({
			data: [],
			textField: 'name',
			valueField: 'id',
			onSelected: function (context, role) {
				currRole = role;
				resetContinueStatus();
			}
		});

		// initialize data language
		let selectLanguage = null;
		$('div.data-language').dropdown({
			data: [],
			selected: null,
			textField: 'Description',
			valueField: 'Id',
			onSelected: function (context, item) {
				if (context.hasChanged) {
					selectLanguage = item;
					authService.mergeClientContext({
						dataLanguageId: selectLanguage.Id,
						language: selectLanguage.Culture
					});
				}
			}
		});
		authService.getLanguages().then(data => {
			let language = parseInt(clientContext.dataLanguageId || '1'),
				langData = data,
				selectLanguage = null;
			selectLanguage = utility.array.find(langData, language, 'Id');
			$('div.data-language').each(function () {
				let instance = this.instance;
				if (instance) {
					instance.setData(langData, selectLanguage);
				}
			});
		}).fail(data => {
			console.info(data);
		});
		$(window).resize(function () {
			resizeSelection();
		});

		// initialize continue
		$('#btncontinues').bind('click', function () {
			if (currRole) {
				authService.mergeClientContext({permissionRoleId: currRole.id, permissionClientId: currRole.clientId});
			}
			if (currCompany) {
				authService.mergeClientContext({
					signedInClientId: currCompany.id,
					clientId: currSigneCompany ? currSigneCompany.id : ''
				});
			}

			let href = window.location.href;
			let homeUrl = href.substring(0, href.indexOf('company.html'));
			let returnUrl = utility.queryString('url');

			window.location.href = returnUrl && utility.isValidUrl(returnUrl) ? returnUrl : homeUrl;
		});
	}

	$(document).ready(function () {

		resetLoading(true);
		authService.ready().then(() => {
			clientContext = authService.getClientContext();
			initialize();
		});
	});

})(window, window.jQuery, window.utility, window.authService);