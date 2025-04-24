/**
 * Created by reimer on 06.03.2017.
 */

(function () {
	/* global globals */
	'use strict';

	var moduleName = 'boq.main';

	/**
	 * @ngdoc controller
	 * @name
	 * @function
	 *
	 * @description
	 *
	 **/

	angular.module(moduleName).controller('boqMainGaebImportWizardController',
		['$scope', '$translate', 'boqMainGaebImportService', 'platformGridAPI', '$timeout', 'platformTranslateService',
			function ($scope, $translate, importService, platformGridAPI, $timeout, platformTranslateService) {
				var _importOptions = $scope.$parent.modalOptions.importOptions;

				$scope.options = {};
				$scope.entity = {};
				$scope.entity.GaebInfo = _importOptions.GaebInfo;
				$scope.path = globals.appBaseUrl;

				$scope.uncheckSubRows = function(row) {
					// If the parent checkbox is unchecked, uncheck all sub-row checkboxes
					if (!($scope.entity.GaebInfo[row.model.split('.')[1]])) {
						angular.forEach(row.subRows, function(subRow) {
							$scope.entity.GaebInfo[subRow.model.split('.')[1]] = false;  // Set subRow to false (unchecked)
						});
					}
				};

				$scope.steps = [
					{
						number: 0,
						identifier: 'fileselection',
						name: $translate.instant('boq.main.gaebImport'),
						skip: true  // file will be selected inside the service - therefore step is currently unnecessary
					},
					{
						number: 1,
						identifier: 'partialimport',
						name: $translate.instant('boq.main.gaebPartialImport'),
						skip: !_importOptions.wizardParameter.showPartialImportPage
					},
					{
						number: 2,
						identifier: 'gaebinfo',
						name: $translate.instant('boq.main.gaebImport'),
						skip: !_importOptions.wizardParameter.showCatalogAssignmentPage
					}
				];

				// region loading status

				$scope.isLoading = false;
				$scope.canNext = true;
				$scope.loadingInfo = '';

				// endregion

				var formConfigPartialImport =
					{
						showGrouping: false,
						groups: [
							{
								gid: '1',
								header: 'Partial Import',
								header$tr$: '',
								isOpen: true,
								visible: true,
								sortOrder: 1
							}
						],
						rows: [
							{
								gid: '1',
								rid: 'AddNewItems',
								label: $translate.instant('boq.main.addNewItems'),
								type: 'boolean',
								model: 'GaebInfo.AddNewItems',
							},
							{
								gid: '1',
								rid: 'OverwriteExistingItems',
								label: $translate.instant('boq.main.overwriteExistingItems'),
								type: 'boolean',
								model: 'GaebInfo.OverwriteExistingItems',
								subRows: [
									{
										gid: '1',
										rid: 'KeepBidderData',
										label: $translate.instant('boq.main.KeepBidderData'),
										type: 'boolean',
										model: 'GaebInfo.OverwriteExistingItemsKeepBidderData'
									},
									{
										gid: '1',
										rid: 'OnlyAqQuantities',
										label: $translate.instant('boq.main.OnlyAqQuantities'),
										type: 'boolean',
										model: 'GaebInfo.OverwriteExistingItemsOnlyAqQuantities'
									},
								]
							},
							{
								gid: '1',
								rid: 'DeleteMissing',
								label: $translate.instant('boq.main.DeleteMissing'),
								type: 'boolean',
								model: 'GaebInfo.DeleteMissingItems'
							},
						]
					};

				$scope.formOptionsPartialImport = {
					configure: formConfigPartialImport
					// validationMethod:
				};

				// region config view step 0 (Importfile)

				// step currently not in use! File will be selected inside the import service.

				var formConfigSelectFile =
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
								rid: 'SelectFile2Import',
								label: 'GAEB File to Import',
								label$tr$: 'basics.import.entityFile2Import',
								type: 'directive',
								model: 'File2Import',
								directive: 'boq-main-gaeb-import-file-selection-control',
								options: {},
								visible: true,
								sortOrder: 1
							}
						]
					};

				$scope.formOptionsSelectFile = {
					configure: formConfigSelectFile
					// validationMethod:
				};

				// endregion

				// region config view step 1 (Catalog Assignment Dialog)

				var formConfigGaebInfo =
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
								rid: 'catalogassignmentgrid',
								label: 'Catalog Assignment',
								label$tr$: 'boq.main.catalogAssignments',
								type: 'directive',
								// model: 'GaebInfo.Catalogs',
								model: 'GaebInfo',
								directive: 'boq-main-gaeb-import-catalog-assignment-grid'
							}
						]
					};

				$scope.formOptionsGaebInfo = {
					configure: formConfigGaebInfo
					// validationMethod:
				};

				// endregion

				// region wizard navigation

				var getFirstStep = function () {
					for (var i = 0; i < $scope.steps.length; i++) {
						if ($scope.steps[i].skip === false) {
							return i;
						}
					}
				};

				var getLastStep = function () {
					for (var i = $scope.steps.length - 1; i >= 0; i--) {
						if ($scope.steps[i].skip === false) {
							return i;
						}
					}
				};

				$scope.isLastStep = function () {
					return $scope.currentStep.number === getLastStep();
				};

				$scope.isFirstStep = function () {
					return $scope.currentStep.number === getFirstStep();
				};

				$scope.previousStep = function () {
					$scope.canNext = true;
					if ($scope.isFirstStep() || $scope.isLoading) {
						return;
					}

					// find previous step
					for (var i = $scope.currentStep.number - 1; i >= 0; i--) {
						if ($scope.steps[i].skip === false) {
							setCurrentStep(i);
							break;
						}
					}
				};

				$scope.nextStep = function () {

					if ($scope.isLastStep()) {    // start import
						platformGridAPI.grids.commitAllEdits();
						$scope.close(true);
						return;
					}

					// find next step
					var newStep;
					for (newStep = $scope.currentStep.number + 1; newStep < $scope.steps.length; newStep++) {
						if ($scope.steps[newStep].skip === false) {
							break;
						}
					}

					switch ($scope.currentStep.identifier) {

						case 'fileselection':
							importService.parseGaebFile(_importOptions.GaebInfo, $scope.entity.FileData).then(function (gaebInfo) {
									$scope.entity.GaebInfo = gaebInfo;
									setCurrentStep(newStep);
									$timeout(function () {
										$scope.isWorking = false;
									}, 0);
								}
							);
							break;

						default:
							setCurrentStep(newStep);
							break;

					}
				};

				function setCurrentStep(step) {
					$scope.currentStep = angular.copy($scope.steps[step]);
					// modifyTranslation($scope);
				}

				$scope.currentStep = angular.copy($scope.steps[getFirstStep()]);

				// endregion

				// region translation

				$scope.getButtonText = function () {
					if ($scope.isLastStep()) {
						return $translate.instant('basics.common.button.ok');
					}
					return $translate.instant('basics.common.button.nextStep');
				};

				$scope.canExecuteNextButton = function () {

					switch ($scope.currentStep.number) {
						case 0:
							return $scope.entity.FileData && $scope.entity.FileData.name.length > 0;
						default:
							return !$scope.isLoading && $scope.canNext;
					}
				};

				$scope.canExecutePreviousButton = function () {
					return !$scope.isFirstStep() && !$scope.isLoading;
				};

				// endregion

				// un-register on destroy
				$scope.$on('$destroy', function () {
					// platformTranslateService.translationChanged.unregister(loadTranslations);
					// importService.cancelPendingRequest('controller was destroyed');   --> NO! Import function will be called inside the import service.
				});

				// region misc

				$scope.close = function (success) {
					$scope.$parent.$close(success || false);
				};

				// endregion

				var init = function () {
					platformTranslateService.translateFormConfig(formConfigPartialImport);
					platformTranslateService.translateFormConfig(formConfigGaebInfo);
				};
				init();

			}
		]);
})();
