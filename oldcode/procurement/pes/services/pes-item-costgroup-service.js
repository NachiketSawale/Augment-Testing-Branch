(function(angular){
	'use strict';

	var moduleName = 'procurement.pes';

	angular.module(moduleName).factory('pesItemCostGroupService', ['$injector','$q', 'procurementPesItemService',
		function($injector,$q, procurementPesItemService){

			var createOptions = {
				dataLookupType: 'PesItem2CostGroups',
				identityGetter: function (entity) {
					return {
						MainItemId: entity.Id
					};
				}
			};

			return $injector.get('basicsCostGroupDataServiceFactory').createService('PesItem', procurementPesItemService, createOptions);



		}]);
})(angular);
