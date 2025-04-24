/**
 * Created by wul on 3/6/2019.
 */
(function () {

	'use strict';

	var moduleName = 'basics.userform';

	/**
	 * @ngdoc controller
	 * @name basicsUserformPopupWindowController
	 * @function
	 *
	 * @description
	 * Main controller for the basics.userform module
	 **/

	angular.module(moduleName).controller('basicsUserformPopupWindowController', [
		'_',
		'$',
		'$q',
		'$timeout',
		'$scope',
		'$translate',
		'popupOptions',
		function (
			_,
			$,
			$q,
			$timeout,
			$scope,
			$translate,
			popupOptions) {

			var iframe = null;
			var userFormHelper = popupOptions.helper;

			function loadForm() {

				if (iframe) {
					let urlAsync = popupOptions.formLink ? function () {
						return $q.when({url: popupOptions.formLink});
					} : userFormHelper.getUrlAsync;
					urlAsync(popupOptions).then(function (result) {
						$(iframe).on('load', function () {
							if (angular.isFunction(popupOptions.onFormLoaded)) {
								popupOptions.onFormLoaded(iframe);
							}

						}).attr('src', result.url);
					});
				} else {
					$timeout(function () {
						iframe = $('#user_form_assign_parameter_frame_pupop').get(0);
						loadForm();
					}, 100);
				}

			}

			function initButtonProperty(eventName, win) {
				if (eventName === 'FormLoadFinish') {
					if (!_.isNull(win.initialData) && !_.isUndefined(win.initialData) && !_.isUndefined(win.initialData.isOkBtnDisabled)) {
						$scope.isOkBtnDisabled = win.initialData.isOkBtnDisabled;
					}
				}
			}

			userFormHelper.formTemplateStatus.register(initButtonProperty);

			$scope.isOkBtnDisabled = false;

			$scope.modalOptions = {
				headerText: $translate.instant('basics.userform.defaultContainerTitle'),
				ok: function () {
					var saveBtn = $(iframe).contents().find('button[name=\'SaveButton\']');
					if (saveBtn.length) {
						saveBtn.click();
						$scope.$close(true);
					} else {
						var form = $(iframe).contents().find('form').get(0);
						if (form) {
							var formData = userFormHelper.collectFormData(form);
							userFormHelper.saveFormData(formData).then(function () {
								$scope.$close(true);
							});
						} else {
							$scope.$close(true);
						}
					}
				},
				cancel: function (success) {
					$scope.$close(success || false);
				}
			};

			loadForm();

			$scope.$on('$destroy', function () {
				userFormHelper.formTemplateStatus.unregister(initButtonProperty);
			});

		}
	]);
})();