(function (angular) {
	'use strict';

	var moduleName = 'boq.main';

	angular.module(moduleName).factory('boqMainSplitQuantityCostGroupFactory',
		['platformGridAPI',
			'platformDataServiceFactory',
			'basicsCostGroupDataServiceFactory',
			function (platformGridAPI,
				platformDataServiceFactory,
				basicsCostGroupDataServiceFactory) {

				var factoryService = {};

				factoryService.createService = function (parentService) {

					var createOptions = {
						dataLookupType: 'BoqSplitQuantity2CostGroups',
						identityGetter: function (entity) {
							return {
								RootItemId: entity.BoqHeaderFk,
								NodeItemId: entity.BoqItemFk,
								MainItemId: entity.Id
							};
						}
					};

					return basicsCostGroupDataServiceFactory.createService('BoQ', parentService, createOptions);
				};

				return factoryService;
			}]);
})(angular);
