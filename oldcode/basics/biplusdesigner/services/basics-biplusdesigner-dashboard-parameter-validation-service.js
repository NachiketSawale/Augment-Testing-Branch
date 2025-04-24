
(function (angular) {
	'use strict';

	angular.module('basics.biplusdesigner').factory('basicsBiPlusDesignerDashboardParameterValidationService',
		['basicsBiPlusDesignerDashboard2GroupDataService','basicsLookupdataLookupDescriptorService',
			function (dataService,basicsLookupdataLookupDescriptorService) {

				var service = {};

				service.validateSysContext = function validateSysContext(entity, value) {
					var contextItemList = basicsLookupdataLookupDescriptorService.getData('SysContextItemsLookup');
					var contextItem = _.find(contextItemList,function(item){
						return item.Id === value;
					});

					if(contextItem){
						entity.DescriptionInfo.Description = contextItem.Description || contextItem.description;
						entity.DescriptionInfo.Translated = entity.DescriptionInfo.Description;
						entity.DescriptionInfo.Modified = true;
					}

				};

				return service;
			}
		]);
})(angular);
