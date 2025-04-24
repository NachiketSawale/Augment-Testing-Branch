/**
 * @ngdoc directive
 * @name platform.directive:platformForm
 * @element div
 * @restrict A
 * @priority default value
 * @scope isolate scope
 * @description
 * Create form from passed in config which contains form's body(groups and rows).
 * It's not rely on form container, We can use this directive to create a single page form just pass in the form config object.
 *
 * @example
 <doc:example>
 <doc:source>
 <div data-platform-form data-form-config="formConfig" data-entity="currentItem"></div>
 </doc:source>
 </doc:example>
 */
(function (angular) {
	'use strict';

	angular.module('platform').directive('platformForm', platformForm);

	platformForm.$inject = ['$templateCache', 'platformFormConfigService', '$compile', 'platformModalService', 'platformDialogService', 'globals'];

	function platformForm($templateCache, platformFormConfigService, $compile, platformModalService, platformDialogService, globals) {
		return {
			restrict: 'A',
			replace: true,
			templateUrl: globals.appBaseUrl + 'app/components/form/form.html',
			scope: {
				formOptions: '=',
				// parameter entity here make binding easier.
				entity: '='
			},
			link: {
				pre: function (scope) {
					function configure(detailConfig) {
						platformFormConfigService.initialize(scope.formOptions, detailConfig);

						return detailConfig;
					}

					configure(scope.formOptions.configure);

					// show config dialog
					scope.formOptions.showConfigDialog = function () {
						platformDialogService.showDialog({
							headerText$tr$: 'cloud.desktop.formConfigDialogTitle',
							bodyTemplateUrl: globals.appBaseUrl + 'app/components/form/form-config-dialog.html',
							backdrop: false,
							scope: scope,
							windowClass: 'form-modal-dialog',
							resizeable: true,
							height: '600px',
							width: '800px',
							buttons: [{
								id: 'ok',
								caption$tr$: 'cloud.desktop.formConfigRestoreBnt'
							}, {
								id: 'cancel',
								caption$tr$: 'cloud.desktop.formConfigCancelBnt'
							}],
							customButtons: [{
								id: 'restore',
								caption$tr$: 'cloud.desktop.formConfigRestoreBnt'
							}]
						}).then(function (result) {
							if (result.isOK) {
								platformFormConfigService.saveSetting(result.setting, scope.formOptions);
								scope.$broadcast('form-config-updated');
							}
						});
					};

					// Navigation call back register
					scope.navigateEvents = {
						onLeaveLastRow: scope.formOptions.onLeaveLastRow
					};
				}

				// post: function(scope) {
				//	debugger;
				// }
			}
		};
	}
})(angular);