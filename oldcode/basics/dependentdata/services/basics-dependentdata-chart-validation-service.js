(function (angular) {
	'use strict';

	angular.module('basics.dependentdata').factory('basicsDependentDataChartValidationService',['platformDataValidationService', 'platformRuntimeDataService','$translate','basicsDependentDataColumnLookupService',function(platformDataValidationService,platformRuntimeDataService,$translate,basicsDependentDataColumnLookupService){

		return function (dataService) {
			var service = {};
			angular.extend(service,{
				validateChartTypeFk:validateChartTypeFk,
				validateDependentdatacolumnXFk: validateDependentdatacolumnXFk,
				validateDependentdatacolumnYFk:validateDependentdatacolumnYFk,
				validateDependentdatacolumnGrp1Fk:validateDependentdatacolumnGrp1Fk,
				validateDependentdatacolumnGrp2Fk:validateDependentdatacolumnGrp2Fk
			});
			function validateChartTypeFk(entity, value, model){
				var result = {apply: true, valid: true};
				return result;
			}
			//validateDependentdatacolumnXFk
			function validateDependentdatacolumnXFk(entity, value, model) {
				var result = {apply: true, valid: true};
				if (value === 0 || value === null) {
					result.valid = false;
					result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
				}

				platformRuntimeDataService.applyValidationResult(result, entity, model);
				platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, service, dataService);
				dataService.fireItemModified(entity);
				return result;
			}
			//validateDependentdatacolumnYFk
			function validateDependentdatacolumnYFk(entity, value, model) {
				var result = {apply: true, valid: true};
				var columnEntity=basicsDependentDataColumnLookupService.getItemById(value);
				if (value === 0 || value === null) {
					result.valid = false;
					result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
				}
				if(columnEntity) {
					var DomainName=columnEntity.DisplayDomainEntity.DomainName;
					if (!('integer'=== DomainName||'money'===DomainName||'quantity'===DomainName||'factor'===DomainName||'exchangerate'===DomainName||'percent'===DomainName)) {
						result.valid = false;
						result.error = $translate.instant('basics.dependentdata.noNumErrorMessage', {fieldName: model});
					}
				}
				platformRuntimeDataService.applyValidationResult(result, entity, model);
				platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, service, dataService);
				dataService.fireItemModified(entity);
				return result;
			}
			//validateGroup1
			function validateDependentdatacolumnGrp1Fk(entity, value, model){
				if(5===entity.ChartTypeFk){
					entity.DependentdatacolumnGrp1Fk=entity.DependentdatacolumnXFk;
				}
			}
			//validateGroup2
			function validateDependentdatacolumnGrp2Fk(entity, value, model){

			}

			return service;
		};



	}]);


})(angular);
