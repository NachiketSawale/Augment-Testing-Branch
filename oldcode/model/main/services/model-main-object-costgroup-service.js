(function(angular){
	'use strict';
	
	var moduleName = 'model.main';
	
	angular.module(moduleName).factory('modelMainObjectCostGroupService', ['$injector','$q', 'modelMainObjectDataService',
		function($injector,$q, modelMainObjectDataService){
		
			var createOptions = {
				dataLookupType: 'ModelObject2CostGroups',
				identityGetter: function (entity) {
					return {
						RootItemId: entity.ModelFk,
						MainItemId: entity.Id
					};
				}
			};
			
			return $injector.get('basicsCostGroupDataServiceFactory').createService('ModelObject2CostGroup', modelMainObjectDataService, createOptions);
			
		 
			
		}]);
})(angular);
