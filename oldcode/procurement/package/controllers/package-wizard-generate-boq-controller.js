(function (angular) {
	'use strict';

	var moduleName = 'procurement.package';

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	/**
	 * @ngdoc controller
	 * @name procurementPackageWizardGenerateBoqController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for the grid in Package wizard 'Generate BoQ' dialog.
	 */
	angular.module(moduleName).controller('procurementPackageWizardGenerateBoqController', [
		'$scope', '$translate', '$timeout', 'platformGridAPI', 'basicsCommonDialogGridControllerService',
		'procurementPackageWizardPackageGridColumns', 'procurementPackageWizardGenerateBoqService',
		'procurementPackageDataService', 'procurementPackagePackage2HeaderService',
		function ($scope, $translate, $timeout, platformGridAPI, basicsCommonDialogGridControllerService,
			procurementPackageWizardPackageGridColumns, dataService,
			packageDataService, subPackageDataService) {

			var myGridConfig = {
				initCalled: false,
				columns: [],
				enableDraggableGroupBy: false,
				uuid: '39D73BDE88F741B99AD23CC7FF71800D'
			};
			var errorType = {
				info: 1,
				error: 3
			};
			var isLoading = false;

			/**
			 * checkbox validator
			 */
			$scope.package2HeaderIdChange = function (entity, value, model) {
				var list = dataService.getList();
				if (value === true) {
					list.forEach(function (item) {
						if (entity.Id !== item.Id) {
							item[model] = false;
						}
					});
				}

				dataService.gridRefresh();

				return {apply: true, valid: true};
			};

			$scope.modalOptions.ok = function () {
				var checkedItem = _.find(dataService.getList(), {package2HeaderId: true}); // get the checked item
				var packageItem = packageDataService.getSelected();

				if (checkedItem && checkedItem.Id && checkedItem.PrcHeaderFk && packageItem && packageItem.Id) {
					$scope.modalOptions.CancelBtnRequirement = true;
					isLoading = true;
					showError(true, $translate.instant('procurement.package.wizard.generateBoq.loadingInfo'), errorType.info);
					$scope.modalOptions.dialogLoading = true;

					// noinspection JSUnusedLocalSymbols
					dataService.generateBoQ(packageItem.Id, checkedItem.Id, checkedItem.PrcHeaderFk).then(function success(response) {// jshint ignore:line
						$scope.modalOptions.dialogLoading = false;
						$scope.modalOptions.CancelBtnRequirement = false;
						$scope.modalOptions.OKBtnRequirement = false;
						if (response.data === 1) {
							$scope.$close(false);
						} else {
							var message = '';
							switch (response.data) {
								case -1:
									message = $translate.instant('procurement.package.wizard.generateBoq.noBoqItemFk');
									break;
								case -2:
									message = $translate.instant('procurement.package.wizard.generateBoq.noEstimateLineItem');
									break;
								case -3:
									message = $translate.instant('procurement.package.wizard.generateBoq.noSubPackage');
									break;
								case -4:
									message = $translate.instant('procurement.package.wizard.generateBoq.boqStructureFkIsNotEqual');
									break;
								default:
									message = $translate.instant('procurement.package.wizard.generateBoq.generateBoQFailed');
							}

							showError(true, message, errorType.error);
						}
					}).catch(function error() {
						showError(true, $translate.instant('procurement.package.wizard.generateBoq.generateBoQFailed'), errorType.error);
						$scope.modalOptions.dialogLoading = false;
						$scope.modalOptions.CancelBtnRequirement = false;
						isLoading = false;
					});

				} else {
					showError(true, $translate.instant('procurement.package.wizard.generateBoq.noChooseSubPackageMessage'), errorType.info);
				}
			};

			$scope.$watch(function () {
				if (isLoading) {
					$scope.modalOptions.OKBtnRequirement = true; // disable 'OK' button
				} else {
					$scope.modalOptions.OKBtnRequirement = !dataService.isOnlyOneSelected();
				}
			});

			init();

			function init() {
				showError(false, '', errorType.error);

				dataService.setList(angular.copy(subPackageDataService.getList())); // set data

				basicsCommonDialogGridControllerService.initListController($scope, procurementPackageWizardPackageGridColumns, dataService, null, myGridConfig);

				generateIfCan();

				$timeout(function () {
					platformGridAPI.grids.resize($scope.getContainerUUID());
				});
			}

			function showError(isShow, message, type) {
				$scope.error = {
					show: isShow,
					messageCol: 1,
					message: message,
					type: type
				};
			}

			function generateIfCan() {
				var list = dataService.getList();
				if (Array.isArray(list) && list.length === 1) {
					list[0].package2HeaderId = true;
				}
			}
		}
	]);
})(angular);