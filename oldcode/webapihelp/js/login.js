/**
 * Created by wed on 10/20/2017.
 */
(function ($, utility, authService) {
	'use strict';

	$(document).ready(function () {
		let selectLanguage = null;

		// init languages
		function initLanguages() {
			selectLanguage = authService.getDefaultLanguage() || {language: 'en', culture: 'en-gb'};
		}

		function thirdPartSignIn() {
			let thirdPartEnable = false;
			if (thirdPartEnable) {
				$('div.third-part-sign-in').show();
			}
		}

		function initVersionInfo() {
			$('div.login-form-api-version').text(window.globals ? window.globals.version : '');
		}

		function showFeedback(message, isError) {
			$('div.login-form-api-feedback').show().text(message).addClass(isError ? 'alert-danger' : 'alert-info');
			$('div.login-form-api-version').hide();
		}

		function initLoginEvent() {

			function extraLoginInfo() {
				let data = {};
				$('#loginModal').find('input').each(function () {
					let name = $(this).attr('name');
					data[name] = $(this).val();
				});
				return data;
			}

			$('#loginbutton').bind('click', function () {
				let data = extraLoginInfo();
				if (data.username && data.password) {
					resetLoading(true);
					showFeedback('Login in Process... Please Wait!', false);
					$('body').loadingbar('start');
					authService.login(data.username, data.password).then(() => {
						resetLoading(false);
						if (selectLanguage) {
							authService.mergeClientContext({
								language: selectLanguage.language,
								culture: selectLanguage.culture
							});
							authService.saveDefaultLanguage({
								language: selectLanguage.language,
								culture: selectLanguage.culture
							});
						}
						let url = utility.queryString('url');
						window.location.href = 'company.html' + (url ? '?url=' + encodeURIComponent(url) : '');
					}).fail(() => {
						showFeedback('Logon failed! Please try again...', true);
					}).always(() => {
						$('body').loadingbar('complete');
					});
				}
			});
		}

		function resetLoading(visible) {
			if (visible) {
				$('div.login-form-loading').show();
			} else {
				$('div.login-form-loading').hide();
			}
		}

		initLanguages();
		thirdPartSignIn();
		initVersionInfo();
		initLoginEvent();
	});
})(window.jQuery, window.utility, window.authService);
