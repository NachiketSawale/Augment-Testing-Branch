(function(angular){
	'use strict';

	var moduleName = 'defect.main';

	angular.module(moduleName).factory('defectMainCostGroupService', ['$injector', '$q', 'defectMainHeaderDataService',
		function ($injector, $q, defectMainHeaderDataService) {

			var createOptions = {
				dataLookupType: 'Defect2CostGroups',
				identityGetter: function (entity) {
					return {
						MainItemId: entity.Id
					};
				}
			};

			return $injector.get('basicsCostGroupDataServiceFactory').createService('Defect', defectMainHeaderDataService, createOptions);

		}]);
})(angular);
