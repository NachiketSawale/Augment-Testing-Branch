(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsCustomizeEstCostCodeTypeProcessor
	 * @function
	 *
	 * @description
	 * The basicsCustomizeEstCostCodeTypeProcessor checks IsEstimateCC ISRP,ISGA ISAllowance columns.
	 */

	angular.module('basics.customize').service('basicsCustomizeEstCostCodeTypeProcessor', BasicsCustomizeEstCostCodeTypeProcessor);

	BasicsCustomizeEstCostCodeTypeProcessor.$inject = ['platformRuntimeDataService'];

	function BasicsCustomizeEstCostCodeTypeProcessor(platformRuntimeDataService) {
		this.processItem = function processItem(costCodeTypeItem, value, model) {

			switch (model) {
				case 'IsAllowance' : {
					if (costCodeTypeItem.Isrp || costCodeTypeItem.Isga || costCodeTypeItem.Isam) {
						setReadOnlyFields(costCodeTypeItem, value, model, platformRuntimeDataService);
					} else {
						resetReadOnlyFields(costCodeTypeItem, value, model, platformRuntimeDataService);
					}
				}
					break;
				case 'Isrp' : {
					if (costCodeTypeItem.IsAllowance || costCodeTypeItem.Isga || costCodeTypeItem.Isam) {
						setReadOnlyFields(costCodeTypeItem, value, model, platformRuntimeDataService);
					} else {
						resetReadOnlyFields(costCodeTypeItem, value, model, platformRuntimeDataService);
					}
				}
					break;
				case 'Isga' : {
					if (costCodeTypeItem.IsAllowance || costCodeTypeItem.Isrp || costCodeTypeItem.Isam) {
						setReadOnlyFields(costCodeTypeItem, value, model, platformRuntimeDataService);
					} else {
						resetReadOnlyFields(costCodeTypeItem, value, model, platformRuntimeDataService);
					}
				}
					break;
				case 'Isam' : {
					if (costCodeTypeItem.IsAllowance || costCodeTypeItem.Isrp || costCodeTypeItem.Isga) {
						setReadOnlyFields(costCodeTypeItem, value, model, platformRuntimeDataService);
					} else {
						resetReadOnlyFields(costCodeTypeItem, value, model, platformRuntimeDataService);
					}
				}
					break;
				case 'IsEstimateCc' : {
					if (costCodeTypeItem && value) {
						costCodeTypeItem.IsAllowance = false;
						costCodeTypeItem.Isrp = false;
						costCodeTypeItem.Isga = false;
						costCodeTypeItem.Isam = false;

						var fields = [
							{field: 'IsAllowance', readonly: true},
							{field: 'Isrp', readonly: true},
							{field: 'Isga', readonly: true},
							{field: 'Isam', readonly: true}];

						platformRuntimeDataService.readonly(costCodeTypeItem, fields);
					} else {

						costCodeTypeItem.IsAllowance = true;
						costCodeTypeItem.Isrp = true;
						costCodeTypeItem.Isga = true;
						costCodeTypeItem.Isam = true;

						var fields1 = [
							{field: 'IsAllowance', readonly: false},
							{field: 'Isrp', readonly: false},
							{field: 'Isga', readonly: false},
							{field: 'Isam', readonly: false}];

						platformRuntimeDataService.readonly(costCodeTypeItem, fields1);
					}
				}
					break;
			}
		};
	}

	function setReadOnlyFields(costCodeTypeItem, value, model, platformRuntimeDataService) {
		costCodeTypeItem.IsEstimateCc = false;
		platformRuntimeDataService.readonly(costCodeTypeItem, [{field: 'IsEstimateCc', readonly: true}]);
	}

	function resetReadOnlyFields(costCodeTypeItem, value, model, platformRuntimeDataService) {
		costCodeTypeItem.IsEstimateCc = true;
		platformRuntimeDataService.readonly(costCodeTypeItem, [{field: 'IsEstimateCc', readonly: false}]);

		costCodeTypeItem.IsAllowance = false;
		costCodeTypeItem.Isrp = false;
		costCodeTypeItem.Isga = false;
		costCodeTypeItem.Isam = false;

		var fields = [
			{field: 'IsAllowance', readonly: true},
			{field: 'Isrp', readonly: true},
			{field: 'Isga', readonly: true},
			{field: 'Isam', readonly: true}];

		platformRuntimeDataService.readonly(costCodeTypeItem, fields);
	}
})(angular);
