/**
 * Created by shen on 7/10/2022
 */

(function (angular) {
	'use strict';
	let moduleName = angular.module('resource.requisition');

	moduleName.service('resourceRequisitionReadOnlyProcessor', resourceRequisitionReadOnlyProcessor);

	resourceRequisitionReadOnlyProcessor.$inject = ['platformRuntimeDataService'];

	function resourceRequisitionReadOnlyProcessor(platformRuntimeDataService) {
		this.processItem = function processRedRequisitionEntity(req) {
			if(req.IsReadOnlyStatus){
				platformRuntimeDataService.readonly(req, true);
			}
		};
	}
})(angular);

