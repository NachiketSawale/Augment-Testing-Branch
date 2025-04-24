(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).factory('constructionSystemMasterGlobalParamGroupValidationService',
		['_', '$translate', '$http', '$q', 'constructionSystemMasterGlobalParamGroupDataService', 'platformDataValidationService', 'platformPropertyChangedUtil',
			function (_, $translate, $http, $q, dataService, platformDataValidationService, platformPropertyChangedUtil) {

				var service = {};
				angular.extend(service,
					{
						validateCode: validateCode,
						validateIsDefault: validateIsDefault
					});


				return service;

				function validateCode(entity, value, model) {
					var itemList = dataService.getList();
					return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, itemList, service, dataService);
				}

				function checkCodeUnique(list, value, id) {
					var isUnique = list.some(function (item) {
						var isValid = (item.Code === value && item.Id !== id);
						if (!isValid && item.CosGlobalParamGroupChildren && item.CosGlobalParamGroupChildren.length > 0) {
							var isCheck = checkCodeUnique(item.CosGlobalParamGroupChildren, value, id);
							if (isCheck === true) {
								isValid = true;
								return true;
							}
						}
						return isValid;
					});
					return isUnique;
				}

				function validateIsDefault(entity, value, model){
					platformPropertyChangedUtil.onlyOneIsTrue(dataService, entity, value, model);
					return {apply: value, valid: true};
				}

				function validationFk(value) {
					return (angular.isUndefined(value) || value === null || value === '' || value === -1 || value === 0);
				}
			}]);

})(angular);