/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc directive
	 * @description
	 */
	angular.module(moduleName).directive('estimateAssembliesWizardImportControl', ['$timeout', '$injector', '$translate',
		function ($timeout, $injector, $translate) {

			let template =
				'<div class="input-group form-control"> ' +
				'<input type="text" class="input-group-content" ng-model="entity.FileData.name" readonly="true" /> ' +
				'<span class="input-group-btn">' +
				' <button id="openRBBImportFileDialog" ng-click="onUpload()" class="btn btn-default">' +
				'<div class="control-icons ico-input-lookup lookup-ico-dialog"></div>' +
				'></button> ' +
				'</span> ' +
				'</div>';

			return {
				restrict: 'A',
				replace: false,
				scope: {
					entity: '=',
					ngModel: '=',
					options: '='
				},
				template: template,
				link: linker
			};

			function linker(scope) {
				// set scope for reb import wizard
				$injector.get('platformSidebarWizardConfigService').setCurrentScope(scope.$root);

				scope.path = globals.appBaseUrl;

				// set default message for file selection
				if (!scope.entity.FileData) {
					scope.entity.FileData = {};
					scope.entity.FileData.name = $translate.instant('estimate.assemblies.importAssembliesWizard.selectFile');
				}
				let fileElement = angular.element('<input type="file" />');
				fileElement.attr('accept', '.xml');

				scope.onUpload = function () {
					fileElement.focus().click();
				};

				fileElement.bind('change', function (e) {
					scope.$apply(function() {
						scope.entity.FileData = e.target.files[0];
						scope.entity.IsFileSelected = true;
					});
				}).bind('destroy', function () {
					fileElement.unbind('change');
				});
			}
		}]);
})(angular);