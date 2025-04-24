/**
 * Created by chk on 5/5/2017.
 */
(function (angular) {
	'use strict';

	angular.module('basics.procurementstructure').factory('basicsProcurementStructureEventOptionDataService', ['$q','basicsProcurementEventOptionService',
		function ($q,basicsProcurementEventOptionService) {
			return {
				getList: function () {
					var deferred = $q.defer();
					deferred.resolve(basicsProcurementEventOptionService.PrcEventOption);
					return deferred.promise;
				},
				getItemByKey: function (value) {
					var item = _.find(basicsProcurementEventOptionService.PrcEventOption, {Id: value});
					var deferred = $q.defer();
					deferred.resolve(item);
					return deferred.promise;
				}
			};
		}
	]);

})(angular);