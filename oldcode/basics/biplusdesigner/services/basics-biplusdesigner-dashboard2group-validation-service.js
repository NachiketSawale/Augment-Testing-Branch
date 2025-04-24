
(function (angular) {
	'use strict';

	angular.module('basics.biplusdesigner').factory('basicsBiPlusDesignerDashboard2GroupValidationService',
		['basicsBiPlusDesignerDashboard2GroupDataService','platformDataValidationService','platformRuntimeDataService','$translate','basicsLookupdataSimpleLookupService',
			function (dataService,platformDataValidationService,platformRuntimeDataService,$translate,basicsLookupdataSimpleLookupService) {

				var service = {};

				service.validateBasDashboardGroupFk = function validateBasDashboardGroupFk(entity, value,model) {
					var result = {apply: true, valid: true};
					entity[model] = value;
					if (!entity || !entity[model] || value < 1) {
						result = {apply: true, valid: false};
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', { fieldName: 'BasDashboardGroupFk' });
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);

					var groupItem = basicsLookupdataSimpleLookupService.getItemByIdSync(value,{
						lookupModuleQualifier: 'basics.customize.dashboardgroup',
						displayProperty: 'Description',
						valueProperty: 'Id',
						valueMember:'Id'
					});

					if(_.isEmpty(entity.DescriptionInfo.Translated)){
						if(groupItem && !_.isEmpty(groupItem.Description)){
							entity.DescriptionInfo.Translated = groupItem.Description;
							entity.DescriptionInfo.Modified = true;
						}
					}

					return result;
				};

				return service;
			}
		]);
})(angular);