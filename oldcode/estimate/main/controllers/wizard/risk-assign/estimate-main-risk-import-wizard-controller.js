/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	/* global globals */
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainRiskImportWizardController
	 * @function
	 *a8b67228f08e415bb40b6c28c331aa07
	 * @description
	 * Controller for the list view of estimate main riskImport entities.
	 **/

	angular.module(moduleName).value('estimateMainRiskImportWizardController',
		function (
			$scope, $injector, cloudDesktopPinningContextService,
			$translate, platformGridAPI, platformContextService,
			basicsRiskRegisterUIConfigurationService,
			basicsRiskEventDataService,estimateMainRiskEventsDataService) {

			$scope.path = globals.webApiBaseUrl;
			$scope.entity = {

			};
			$scope.dataItem = {};

			function getEstHeaderFk() {
				let estimateService = $injector.get('estimateMainService');
				let isAssemblyModule = platformGridAPI.grids.exist('234bb8c70fd9411299832dcce38ed118');
				if(estimateService && !isAssemblyModule){
					$scope.entity.EstHeaderFk = estimateService.getSelectedEstHeaderId();
				}
				else{
					$scope.entity.EstHeaderFk = null;
				}
			}

			getEstHeaderFk();

			$scope.formOptionsReplacementSettings = {
				configure: basicsRiskRegisterUIConfigurationService.getImportFormConfig()
			};
			$scope.configTitle = $translate.instant('estimate.main.importRisksWizards.importDialogTitle');

			$scope.entity.estimateScope = 0;
			// setDefaultElement();
			// region loading status
			$scope.isLoading = false;

			$scope.loadingInfo = '';

			$scope.canExecute = function () {
				return true;// TODO:temp until sure what it does
			};

			$scope.execute = function () {
				$scope.dataItem.selectedRisks = basicsRiskEventDataService.getSelectedEntities();
				angular.forEach($scope.dataItem.selectedRisks,function (risk) {
					risk.EstHeaderFk = $scope.entity.EstHeaderFk;
				});
				if($scope.dataItem.selectedRisks.length > 0){
					let http = $injector.get('$http');
					let data = {
						data:$scope.dataItem.selectedRisks,
						estHeaderFk:$scope.entity.EstHeaderFk
					};
					http.post($scope.path +'estimate/main/riskcalculator/assignrisk2estimate',data).then(function () {
						estimateMainRiskEventsDataService.load();
						estimateMainRiskEventsDataService.gridRefresh();
					});
				}

				$scope.$close({ok: true, data: $scope.dataItem});
			};

			$scope.close = function () {
				$scope.$close(false);
			};

			function reset(){
				$scope.formOptionsReplacementSettings = {
					configure: basicsRiskRegisterUIConfigurationService.getImportFormConfig()
				};
			}
			// un-register on destroy
			$scope.$on('$destroy', function () {
				reset();
			});
		});
})(angular);
