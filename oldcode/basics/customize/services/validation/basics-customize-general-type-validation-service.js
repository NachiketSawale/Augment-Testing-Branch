/**
 * Created by henkel on 29.05.2020.
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'basics.customize';

	angular.module(moduleName).service('basicsCustomizeGeneralTypeValidationService', BasicsCustomizeGeneralTypeValidationService);
	BasicsCustomizeGeneralTypeValidationService.$inject = ['_', '$q', '$http', 'basicsLookupdataLookupDataService', 'platformDataValidationService', 'platformRuntimeDataService', 'basicsCustomizeInstanceDataService'];

	function BasicsCustomizeGeneralTypeValidationService(_, $q, $http, basicsLookupdataLookupDataService, platformDataValidationService, platformRuntimeDataService, basicsCustomizeInstanceDataService) {

		this.asyncValidateCrbPriceConditionTypeFk = function asyncValidateCrbPriceConditionTypeFk(entity, value) {
			var defer = $q.defer();
			$http.post(globals.webApiBaseUrl + 'basics/customize/crbpriceconditiontype/instance', {Id: value}).then(function (response) {
				if (!_.isNil(response) && response.data.IsGeneralstype === true) {
					entity.IsPercent = false;
					platformRuntimeDataService.readonly(entity, [{field: 'IsPercent', readonly: true}]);
					basicsCustomizeInstanceDataService.markItemAsModified(entity);
					defer.resolve(true);
				} else {
					platformRuntimeDataService.readonly(entity, [{field: 'IsPercent', readonly: false}]);
					defer.resolve(true);
				}
			},
			function () {
				defer.resolve();
			});

			return defer.promise;
		};
	}
})(angular);
