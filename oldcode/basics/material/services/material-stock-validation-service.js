/**
 * Created by lcn on 9/7/2017.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialStockValidationService', basicsMaterialStockValidationService);
	basicsMaterialStockValidationService.$inject = ['$q', '$http', 'platformRuntimeDataService', '$translate', 'platformDataValidationService', '$timeout', 'basicsMaterialRecordService'];
	function basicsMaterialStockValidationService($q, $http, platformRuntimeDataService, $translate, platformDataValidationService, $timeout, basicsMaterialRecordService) {
		return function (dataService) {
			var service = {
				asyncValidateProjectStockFk: asyncValidateProjectStockFk,
				setProjectStockFk: setProjectStockFk
			};
			return service;
			function asyncValidateProjectStockFk(entity, value, model) {
				var defer = $q.defer();
				var result = {apply: true, valid: true};
				if (angular.isUndefined(value) || value === null || value === 0) {
					result.valid = false;
					result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: 'Project Stock'});
				}
				else {
					$http.get(globals.webApiBaseUrl + 'basics/material/material2projectstock/isunique', {
						params: {
							projectStockId: value,
							mainItemId: basicsMaterialRecordService.getSelected().Id,
							Id: dataService.getSelected().Id
						}
					}).then(function (res) {
						if (res.data.ProjectId) {
							entity.ProjectFk = res.data.ProjectId;
							dataService.gridRefresh();
							platformRuntimeDataService.readonly(entity, [{ field: 'StockLocationFk', readonly: false }]);
						}
						if (res.data.IsUnique) {
							result.valid = false;
							result.error = $translate.instant('cloud.common.uniqueValueErrorMessage', {object: 'Project Stock'});
							platformRuntimeDataService.applyValidationResult(result, entity, model);
							platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, service, dataService);
							dataService.gridRefresh();
							defer.resolve(result);
							platformRuntimeDataService.readonly(entity, [{ field: 'StockLocationFk', readonly: true }]);
							return defer.promise;
						}
						}
					);
					$http.get(globals.webApiBaseUrl + 'project/stock/material/getprovisionallowed?projectStockId=' + value
					).then(function (res) {
						if (res) {
							var readOnlyField = [
								{field: 'ProvisionPercent', readonly: !res.data},
								{field: 'ProvisionPeruom', readonly: !res.data}];
							platformRuntimeDataService.readonly(entity, readOnlyField);
							if(!res.data){
								entity.ProvisionPercent=0;
								entity.ProvisionPeruom=0;
							}
							dataService.gridRefresh();
						}
					}
					);
				}
				platformRuntimeDataService.applyValidationResult(result, entity, model);
				platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, service, dataService);
				$timeout(dataService.gridRefresh, 0, false);
				defer.resolve(result);
				return defer.promise;
			}

			function setProjectStockFk(entity, value) {
				var result = {apply: true, valid: true};
				if (angular.isUndefined(value) || value === null || value === 0) {
					result.valid = false;
					result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: 'Project Stock'});
					platformRuntimeDataService.applyValidationResult(result, entity, 'ProjectStockFk');
					platformDataValidationService.finishValidation(angular.copy(result), entity, value, 'ProjectStockFk', service, dataService);
				}
				$http.get(globals.webApiBaseUrl + 'project/stock/material/getprovisionallowed?projectStockId=' + value
				).then(function (res) {
					if (res) {
						var readOnlyField = [
							{field: 'ProvisionPercent', readonly: !res.data},
							{field: 'ProvisionPeruom', readonly: !res.data}];
						platformRuntimeDataService.readonly(entity, readOnlyField);
						if(!res.data){
							entity.ProvisionPercent=0;
							entity.ProvisionPeruom=0;
						}
						dataService.gridRefresh();
					}
				}
				);
				dataService.gridRefresh();
				return result;
			}
		};
	}
})(angular);



