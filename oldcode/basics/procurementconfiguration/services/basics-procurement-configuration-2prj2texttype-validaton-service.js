(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementconfiguration';
	angular.module(moduleName).factory('basicsProcurementConfiguration2Prj2HeaderTextValidationService',
		['$translate','platformDataValidationService', 'basicsProcurementConfiguration2Prj2TextTypeService',
			function ($translate,platformDataValidationService, dataService) {
				var service = {};
				service.validatePrjProjectFk = function validateValue(entity, value,model) {
					if(value<1)
					{
						value=null;
					}
					var validateResult;
					if(value===null)
					{
						validateResult = platformDataValidationService.isMandatory(value, model);
					}
					else {
						if(entity.PrcTexttypeFk!==null&&entity.PrcTexttypeFk!==undefined&&entity.PrcTexttypeFk>0)
						{
							var uniqueValue = value + '.' + entity.PrcTexttypeFk;
							validateResult = isUnque(uniqueValue);
						}
					}

					//platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
					if(validateResult!==undefined&&validateResult.valid===true)
					{
						platformDataValidationService.finishValidation(validateResult, entity, value, 'PrcTexttypeFk', service, dataService);
						removeError(entity);
					}
					return validateResult;
				};
				service.validatePrcTexttypeFk= function validateValue(entity, value,model) {
					if(value<1)
					{
						value=null;
					}
					var validateResult;
					if(value===null)
					{
						validateResult = platformDataValidationService.isMandatory(value, model);
					}
					//var validateResult = platformDataValidationService.isMandatory(value, model);
					else
					{
						if(entity.PrjProjectFk!==null&&entity.PrjProjectFk!==undefined&&entity.PrjProjectFk>0) {
							var uniqueValue = entity.PrjProjectFk + '.' + value;
							validateResult = isUnque(uniqueValue);
						}
					}

					//platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
					if(validateResult!==undefined&&validateResult.valid===true)
					{
						platformDataValidationService.finishValidation(validateResult, entity, value, 'PrjProjectFk', service, dataService);
						removeError(entity);
					}
					return validateResult;
				};
				service.validateBasTextModuleFk = function validateValue(entity, value,model) {
					if(value<1)
					{
						value=null;
					}
					var validateResult = platformDataValidationService.isMandatory(value, model);
					//platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
					return validateResult;
				};

				function isUnque(value)
				{
					var result = null;
					var list=dataService.getList();
					var array=[];
					_.forEach(list,function(item){
						array.push(item.PrjProjectFk+'.'+item.PrcTexttypeFk);
					});
					if(array.indexOf(value)<0)
					{
						result = {
							apply: true,
							error: null,
							valid: true
						};

					}
					else{
						result = {
							apply: true,
							error: $translate.instant('basics.procurementconfiguration.ProjectTextsOnlyError'),
							valid: false
						};
					}
					return result;
				}

				function removeError (entity) {
					if (entity.__rt$data && entity.__rt$data.errors) {
						entity.__rt$data.errors = null;
					}
				}

				return service;

			}]);
})(angular);