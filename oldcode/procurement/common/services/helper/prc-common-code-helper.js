/**
 * Created by lnb on 4/21/2015.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	var modelName = 'procurement.common';
	angular.module(modelName).factory('procurementCommonCodeHelperService', ['$http', '$q', '$injector',
		function ($http, $q, $injector) {
			var service = {};
			var uri = globals.webApiBaseUrl + 'procurement/common/code/getnext';

			service.getNext = function (rubricCatalogId) {
				var defer = $q.defer();
				$http.get(uri + '?rubricCatalogId=' + rubricCatalogId).then(function (response) {
					defer.resolve(response.data);
				});

				return defer.promise;
			};


			service.getCode = function (prcConfigurationId) {
				var defer = $q.defer();
				$http.get(globals.webApiBaseUrl + 'procurement/common/code/getcode?prcConfigurationId=' + prcConfigurationId).then(function (response) {
					defer.resolve(response.data);
				});

				return defer.promise;
			};

			service.getControllingUnits = function getControllingUnits(projectId) {
				var defer = $q.defer();
				$http.get(globals.webApiBaseUrl + 'controlling/structure/tree?mainItemId=' + projectId).then(function (response) {
					defer.resolve(response.data);
				});
				return defer.promise;
			};

			service.getAllLevelUnits = function getAllLevelUnits(Units, resultUnits) {
				_.forEach(Units, function (unit) {
					resultUnits.push(unit);
					if (unit.ControllingUnits !== null) {
						getAllLevelUnits(unit.ControllingUnits, resultUnits);
					}
				});
			};

			service.getIsAutoSelectCU = function getIsAutoSelectCU() {
				var defer = $q.defer();
				$http.post(globals.webApiBaseUrl + 'basics/customize/SystemOption/list').then(function (response) {
					var Info = _.filter(response.data, function (itemRecord) {
						return itemRecord.Id === 509 && (itemRecord.ParameterValue === '1' || itemRecord.ParameterValue.toLowerCase() === 'true');
					});
					defer.resolve(Info.length > 0);
				});
				return defer.promise;
			};

			service.updateControllingUnit = function updateControllingUnit(dataService, value, style) {
				var procurementCommonPrcItemDataService;
				if (style === 1) {
					procurementCommonPrcItemDataService = $injector.get('procurementCommonPrcItemDataService').getService(dataService);
				}
				else if (style === 2) {
					procurementCommonPrcItemDataService = $injector.get('procurementPesItemService');
				}


				var prcBoqMainService = $injector.get('prcBoqMainService').getService(dataService);
				var Items = procurementCommonPrcItemDataService.getList();
				if (Items !== null && Items.length > 0) {
					for (var i = 0; i < Items.length; i++) {
						Items[i].MdcControllingunitFk = value;
						procurementCommonPrcItemDataService.markItemAsModified(Items[i]);
					}
				}

				var BoqItems = prcBoqMainService.getList();
				if (BoqItems !== null && BoqItems.length > 0) {
					for (var j = 0; j < BoqItems.length; j++) {
						BoqItems[j].MdcControllingUnitFk = value;
						prcBoqMainService.markItemAsModified(BoqItems[j]);
					}
				}
				return true;

			};


			service.getUpdatePackageDescriptionByStructure = function getUpdatePackageDescriptionByStructure() {
				var defer = $q.defer();
				$http.post(globals.webApiBaseUrl + 'basics/customize/SystemOption/list').then(function (response) {
					var Info = _.filter(response.data, function (itemRecord) {
						return itemRecord.Id === 820 && (itemRecord.ParameterValue === '1' || itemRecord.ParameterValue.toLowerCase() === 'true');
					});
					defer.resolve(Info.length > 0);
				});
				return defer.promise;
			};

			service.IsPortalUser = function IsPortalUser() {
				var defer = $q.defer();
				$http.post(globals.webApiBaseUrl + 'procurement/common/common/isportaluser').then(function (res) {
					defer.resolve(res.data);
				});
				return defer.promise;
			};

			return service;
		}]);
})(angular);