/**
 * Created by reimer on 01.09.2016.
 */

(function () {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.txinterface';

	/**
	 * @ngdoc controller
	 * @name
	 * @function
	 *
	 * @description
	 *
	 **/

	angular.module(moduleName).controller('procurementTxInterfaceWizardController', [
		'$scope',
		'$q',
		'procurementTxInterfaceWizardService',
		'platformTranslateService',
		'$translate',
		'platformModalService',
		function ($scope,
			$q,
			wizardService,
			platformTranslateService,
			$translate,
			platformModalService) {

			$scope.path = globals.appBaseUrl;

			var formConfig =
				{
					showGrouping: false,
					groups: [
						{
							gid: '1',
							header: '',
							header$tr$: '',
							isOpen: true,
							visible: true,
							sortOrder: 1
						}
					],
					rows: [
						{
							gid: '1',
							rid: 'FormSatzId',
							label: 'Forms',
							label$tr$: 'procurement.txinterface.entityFormSatz',
							model: 'FormSatzId',
							type: 'directive',
							directive: 'procurement-tx-interface-form-satz-combobox',
							options: {},
							visible: true,
							sortOrder: 1
						},
						{
							gid: '1',
							rid: 'boqselection',
							label: 'BoQ',
							type: 'directive',
							model: 'BoqRootItems',
							directive: 'procurement-tx-interface-boq-selection-directive',
							options: {},
							visible: true,
							sortOrder: 1
						},
						{
							gid: '1',
							rid: 'Documents',
							label: 'Documents',
							type: 'directive',
							model: 'Documents',
							directive: 'procurement-tx-interface-document-selection-directive',
							options: {},
							visible: true,
							sortOrder: 1
						}
					]
				};

			// region loading status

			$scope.isLoading = false;
			$scope.loadingInfo = '';

			function loadingStatusChanged(newStatus) {
				$scope.isLoading = newStatus;
			}

			wizardService.loadingStatusChanged.register(loadingStatusChanged);

			// endregion

			$scope.entity = wizardService.getEntity();

			// object holding translated strings
			$scope.translate = {};

			var loadTranslations = function () {
				platformTranslateService.translateFormConfig(formConfig);
			};

			// register translation changed event
			platformTranslateService.translationChanged.register(loadTranslations);

			// register a module - translation table will be reloaded if module isn't available yet
			if (!platformTranslateService.registerModule(moduleName)) {
				// if translation is already available, call loadTranslation directly
				loadTranslations();
			}

			$scope.formOptions = {
				configure: formConfig
				// validationMethod:
			};

			$scope.canExecuteOkButton = function () {

				var result = false;
				angular.forEach($scope.entity.BoqRootItems, function (item) {
					if (item.Checked) {
						result = true;
					}
				});
				return result;
			};

			var init = function () {
			};
			init();

			$scope.startProcess = function () {

				wizardService.startImport($scope.entity).then(function (result) {
					if (result) {
						platformModalService.showMsgBox('procurement.txinterface.message.importSuccessful');
						$scope.close();
					}
				});

			};

			$scope.close = function () {
				// $modalInstance.dismiss();
				$scope.$parent.$close(false);
			};

			// un-register on destroy
			$scope.$on('$destroy', function () {
				platformTranslateService.translationChanged.unregister(loadTranslations);
				wizardService.loadingStatusChanged.unregister(loadingStatusChanged);
			});
		}
	]);
})();