/**
 * Created by anl on 5/13/2019.
 */

(function (angular) {

	'use strict';
	var moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('productionplanningCommonProductStatusLookupService', StatusLookupService);

	StatusLookupService.$inject = ['$q', '$http', 'basicsLookupdataLookupDescriptorService'];

	function StatusLookupService($q, $http, basicsLookupdataLookupDescriptorService) {
		var service = {};

		service.getList = function () {
			const obj =  basicsLookupdataLookupDescriptorService.getData('basics.customize.ppsproductstatus');
			for (let key in obj) {
				if(obj[key] && obj[key].DescriptionInfo){
					obj[key].Description = obj[key].DescriptionInfo.Translated;
				}
			}
			return obj;
		};

		service.load = function load() {
			return $http.post(globals.webApiBaseUrl + 'basics/customize/ppsproductstatus/list').then(function (response) {
				if (response && response.data) {
					_.forEach(response.data, function (status) {
						status.Description = status.DescriptionInfo.Translated;
					});
				}
				basicsLookupdataLookupDescriptorService.updateData('basics.customize.ppsproductstatus', response.data);
			});
		};

		service.getIsShippedProductStatus = function () {
			var list = service.getList();
			return _.filter(list, function (status) {
				return status.IsShipped;
			});
		};

		service.updateFilterStatus = function (statusItems, statusCriteria, selectedValues) {
			var filterStatus = [];
			if (statusCriteria) {
				if (statusCriteria.Id === 1) {
					filterStatus = selectedValues || filterStatus;
				}
				else {
					_.forEach(statusItems, function (item) {
						var find = false;
						_.forEach(selectedValues, function (value) {
							if (item.Id.toString() === value) {
								find = true;
								return;
							}
						});
						if (!find) {
							filterStatus.push(item.Id + '');
						}
					});
				}
			}
			if (!filterStatus || filterStatus.length === 0) {//if none, set all
				_.forEach(statusItems, function (item) {
					filterStatus.push(item.Id + '');
				});
			}
			return filterStatus;
		};

		service.load();

		return service;
	}

})(angular);