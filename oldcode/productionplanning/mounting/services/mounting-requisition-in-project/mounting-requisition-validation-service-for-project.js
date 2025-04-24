/**
 * Created by anl on 4/12/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).factory('productionpalnningMountingRequisitionForProjectValidationService', RequisitionValidationService);

	RequisitionValidationService.$inject = ['productionpalnningMountingRequisitionValidationFactory',
		'productionplanningMountingRequisitionForProjectDataService'];

	function RequisitionValidationService(mntRequisitionValidationFactory, dataService) {
		return mntRequisitionValidationFactory.createValidationService(dataService);
	}

})(angular);