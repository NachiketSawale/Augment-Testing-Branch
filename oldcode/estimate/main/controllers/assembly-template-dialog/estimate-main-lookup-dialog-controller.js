/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	/* global _ */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainLookupDialogController
	 * @function
	 *
	 * @description
	 * Main controller for the assembly template lookup
	 **/
	angular.module(moduleName).controller('estimateMainLookupDialogController', [
		'$scope', '$translate',
		function ($scope, $translate) {
			let headerText = 'estimate.main.lookupAssignAssemblyTemplate', options = $scope.options;
			setDialogSettings(options);

			$scope.isInit = false;
			$scope.gridDataAssemblyId = $scope.gridId;
			$scope.gridData = {
				state: $scope.gridDataAssemblyId
			};

			$scope.modalOptions = {
				closeButtonText: $translate.instant('cloud.common.cancel'),
				actionButtonText: $translate.instant('cloud.common.ok'),
				refreshButtonText: $translate.instant('basics.common.button.refresh'),
				headerText: headerText,
				disableOkButton: true,
				selectedItems: []
			};

			$scope.onClose = onClose;

			$scope.modalOptions.cancel = function () {
				onClose({isOk: false});
			};

			function onClose(result) {
				if (_.isEmpty(result)){
					$scope.$close({isOk: false});
				}else{
					$scope.$close(result);
				}
			}

			function setDialogSettings(options){
				headerText = options.lookupType === 'estplantassemblyfk' ?
					$translate.instant('estimate.main.lookupAssignPlantAssemblyDialog') : options.usageContext === 'estimateMainService' ?
						$translate.instant('estimate.main.lookupAssignAssemblyTemplate') : $translate.instant('estimate.main.lookupAssignAssemblyDialog');

				switch (options.usageContext){
					case 'estimateMainResourceService':
					case 'estimateAssembliesResourceService':
					case 'resourceEquipmentPlantEstimationResourceDataService':
					case 'resourceEquipmentGroupPlantEstimationResourceDataService':
					case 'resourcePlantEstimateResourceDataService':
						$scope.ngModel = $scope.entity.EstAssemblyFk;
						break;
				}

				// multi select condition for hide bulk editor
				$scope.settings.gridOptions.multiSelect = $scope.settings.gridOptions.multiSelect === true && $scope.entity;
			}
		}]);
})();
