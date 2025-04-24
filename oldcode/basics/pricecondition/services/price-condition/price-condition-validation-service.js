(function (angular) {
	'use strict';

	var moduleName = 'basics.pricecondition';
	var priceConditionModule = angular.module(moduleName);
	priceConditionModule.factory('basicsPriceConditionValidationService', ['$http', '$q', '$translate', 'platformDataValidationService', 'basicsPriceConditionDataService',
		function ($http, $q, $translate, platformDataValidationService, dataService) {
			var service = {};

			var isAsyncUnique = function isAsyncUnique(httpRoute, entity, value, model, errorParam) {
				var defer = $q.defer();
				var id = entity.Id || 0;
				$http.get(httpRoute + '?id=' + id + '&&' + model + '=' + value).then(function (result) {
					if (!result.data) {
						defer.resolve(platformDataValidationService.createErrorObject('basics.pricecondition.priceConditionDescriptionUniqueError', errorParam || {object: 'descriptioninfo.translated'}));
					} else {
						defer.resolve(true);
					}
				});

				return defer.promise;
			};

			service.asyncValidateDescriptionInfo = function asyncValidateDescriptionInfo(entity, value, model) {
				var error = $translate.instant('procurement.requisition.ReqHeaderReferenceUniqueError');
				var result = isAsyncUnique(globals.webApiBaseUrl + 'basics/pricecondition/isunique', entity, value, 'description', error);
				dataService.fireItemModified(entity);
				return result;
			};
			return service;

		}]);
})(angular);