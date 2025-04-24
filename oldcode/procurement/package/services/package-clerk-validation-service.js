/**
 * Created by chi on 2018/4/4.
 */
(function(angular){
	'use strict';

	var moduleName = 'procurement.package';

	angular.module(moduleName).factory('procurementPackageClerkValidationService', procurementPackageClerkValidationService);

	procurementPackageClerkValidationService.$inject = ['_', '$http','$q', '$translate', 'bascisCommonClerkDataServiceFactory','basicsCommonClerkValidationServiceFactory','platformRuntimeDataService','platformDataValidationService'];

	function procurementPackageClerkValidationService(_, $http, $q, $translate, bascisCommonClerkDataServiceFactory,basicsCommonClerkValidationServiceFactory,platformRuntimeDataService,platformDataValidationService){


		var dataService = bascisCommonClerkDataServiceFactory.getService('procurement.package.clerk', 'procurementPackageDataService',null,true);
		var validateService=basicsCommonClerkValidationServiceFactory.getService('procurement.package.clerk',dataService);

		validateService.validateClerkRoleFk = function validateClerkRoleFk(entity, value, model) {
			var result = true;
			if (value === 0 || value === null) {
				result = {
					apply: true,
					valid: false,
					error: '...',
					error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
					error$tr$param$: {
						fieldName: $translate.instant('basics.common.entityClerkRole')
					}
				};
			}
			var list=dataService.getList();
			var sameClerk=_.find(list,function(item){return item.ClerkRoleFk===value&&item.ClerkFk===entity.ClerkFk;});
			if(sameClerk){
				var error = $translate.instant('cloud.common.entityClerk');
				result = {
					apply: true,
					valid: false,
					error: '...',
					error$tr$: 'procurement.package.packageClerkUniqueError',
					error$tr$param$: {fieldName: error}
				};
			}
			if(entity.ClerkFk){
				platformRuntimeDataService.applyValidationResult(true, entity, 'ClerkFk');
				platformDataValidationService.finishValidation(true, entity, entity.ClerkFk, 'ClerkFk', validateService, dataService);
			}
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			platformDataValidationService.finishValidation(result, entity, value, model, validateService, dataService);
			return result;
		};

		var error = $translate.instant('cloud.common.entityClerk');

		validateService.validateClerkFk=function(entity,value,model){
			var result = true;
			if (value === 0 || value === null) {
				result = {
					apply: true,
					valid: false,
					error: '...',
					error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
					error$tr$param$: {fieldName: error}
				};
			}
			var list=dataService.getList();
			var sameClerk = _.find(list, function (item) {
				return item.ClerkRoleFk === entity.ClerkRoleFk && item.ClerkFk === value;
			});
			if (sameClerk) {
				result = {
					apply: true,
					valid: false,
					error: '...',
					error$tr$: 'procurement.package.packageClerkUniqueError',
					error$tr$param$: {fieldName: error}
				};
			}
			if(entity.ClerkRoleFk){
				platformRuntimeDataService.applyValidationResult(true, entity, 'ClerkRoleFk');
				platformDataValidationService.finishValidation(true, entity, entity.ClerkRoleFk, 'ClerkRoleFk', validateService, dataService);
			}
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			platformDataValidationService.finishValidation(result, entity, value, model, validateService, dataService);
			return result;
		};

		return validateService;

	}
})(angular);