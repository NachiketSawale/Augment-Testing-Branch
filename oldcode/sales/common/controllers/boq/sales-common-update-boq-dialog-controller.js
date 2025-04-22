/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var moduleName = 'sales.common';

	angular.module(moduleName).value('salesCommonUpdateBoqFormConfig', {

		'fid': 'sales.wizard.updateBoq',
		'version': '1.1.0',
		showGrouping: false,
		title$tr$: '',
		skipPermissionCheck: true,
		change: 'change',
		'groups': [
			{
				'gid': 'UpdateBoq',
				'header$tr$': '',
				'isOpen': true,
				'visible': true,
				'sortOrder': 1
			}
		],
		'rows': [
			{
				gid: 'UpdateBoq',
				rid: 'scope',
				model: 'recalculationForBoqScope',
				type: 'radio',
				label: 'Base On',
				label$tr$: 'sales.common.wizard.baseOn',
				options: {
					valueMember: 'value',
					labelMember: 'label',
					items: [
						{
							value: 1,
							label: 'Uint Rate',
							label$tr$: 'boq.main.Price'
						},
						{
							value: 0,
							label: 'Corrected Unit Rate(Gross)',
							label$tr$: 'boq.main.Pricegross'
						}]
				}
			}
		]
	});

	/**
	 * @ngdoc controller
	 * @name salesCommonUpdateBoqDialogController
	 * @requires $scope
	 * @description
	 * #
	 * salesCommonUpdateBoqDialogController
	 */
	/* jshint -W072 */
	angular.module(moduleName).controller('salesCommonUpdateBoqDialogController', [
		'$scope', '$translate', '$injector', 'platformTranslateService', 'salesCommonUpdateBoqFormConfig',
		function ($scope, $translate, $injector, platformTranslateService, formConfig) {

			$scope.options = $scope.$parent.modalOptions;
			$scope.currentItem = { recalculationForBoqScope: 1 };

			$scope.modalOptions = {
				headerText: $scope.options.headerText,
				closeButtonText: $translate.instant('basics.common.cancel'),
				actionButtonText: $translate.instant('basics.common.ok')
			};

			formConfig = angular.copy(formConfig);

			// translate form config.
			platformTranslateService.translateFormConfig(formConfig);

			$scope.formContainerOptions = {
				statusInfo: function () {
				}
			};

			$scope.formContainerOptions.formOptions = {
				configure: formConfig,
				showButtons: [],
				validationMethod: function () {
				}
			};

			$scope.setTools = function (tools) {
				$scope.tools = tools;
			};

			$scope.modalOptions.ok = function onOK() {
				$scope.$close({isOk: true, isBaseOnCorrectedUPGross: $scope.currentItem.recalculationForBoqScope === 0});
			};

			$scope.modalOptions.close = function onCancel() {
				$scope.$close({isOk: false});
			};

			$scope.modalOptions.cancel = function () {
				$scope.$close(false);
			};

			$scope.$on('$destroy', function () {
				$scope.currentItem = {};
			});
		}
	]);
})(angular);
