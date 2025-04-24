/**
 * Created by reimer on 31.01.2018.
 */
(function () {

	'use strict';

	var moduleName = 'basics.audittrail';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsAudittrailHelperService',
		['$q', '$translate', '$http',
			function ($q, $translate, $http) {

				var service = {}, gridItems = [];

				service.getPeriodList = function () {

					var deferred = $q.defer();

					var result = [
						{Id: 1, Description: $translate.instant('basics.audittrail.FilterToday')},
						{Id: 2, Description: $translate.instant('basics.audittrail.FilterYesterday')},
						{Id: 3, Description: $translate.instant('basics.audittrail.FilterLast7Days')},
						{Id: 4, Description: $translate.instant('basics.audittrail.FilterLast30Days')},
						{Id: 5, Description: $translate.instant('basics.audittrail.FilterCustom')}
					];

					return deferred.resolve(result);

				};

				service.getPeriodByKey = function (value) {

					var deferred = $q.defer();
					service.getPeriodList(list).then(function () {
						for (var i = 0; i < list.length; i++) {
							if (list[i].Id === value) {
								return deferred.resolve(list[i]);
							}
						}
						return null;
					});
					return deferred.promise;
				};

				service.setGridDataItems = function (params) {
					return $http.post(globals.webApiBaseUrl + 'basics/audittrail/list', params).then(function (response) {
						gridItems = response.data.AudReportEntity;

						return {
							CurrentPageNo: response.data.CurrentPageNo,
							LastPageNo: response.data.LastPageNo,
							TotalRecords: response.data.TotalRecords,
							ItemsExist: true,
							PageSize: response.data.PageSize
						};
					});
				};

				service.getGridDataItems = function () {
					if (gridItems) {
						return gridItems;
					}
				};

				return service;

			}]);
})();

