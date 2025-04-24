(function (angular, globals) {
	'use strict';

	angular.module('cloud.desktop').factory('cloudDesktopSidebarRadiusSearchService', cloudDesktopSidebarRadiusSearchService);

	cloudDesktopSidebarRadiusSearchService.$inject = ['$http', '_', '$q', 'platformModalService', '$translate'];

	function cloudDesktopSidebarRadiusSearchService($http, _, $q, platformModalService, $translate) {
		var service = {
			setParameters: setParameters,
			resetFilter: resetFilter,
			filterRequested: filterRequested,
			fetchDistances: fetchDistances,
			getRegisterRfqDetail: getRegisterRfqDetail
		};

		var filterReq = false;
		service.selectedParameters = {};
		service.currentSearchColumns = [];
		service.currentModule;
		service.distance = {};

		// enhancedfilter  messengers
		service.onFilterChanged = new Platform.Messenger();

		function fetchDistances() {
			if (_.isNil(service.distance.items) || service.distance.items.length === 0) {
				return $http.get(globals.webApiBaseUrl + 'procurement/common/prcradius/getprcradius').then(function (response) {
					if (response.data.length > 0) {
						service.distance.items = _.orderBy(response.data, ['IsDefault', 'Sorting'], ['desc', 'asc']);
						var defaultItem = service.distance.items[0];
						service.distance.selectedItem = defaultItem;
						service.distance.selectedItemFk = defaultItem.Id;
						return service.distance.items;
					}
				});
			} else {
				return $q.when(service.distance.items);
			}
		}

		function setParameters(value) {
			if (value) {
				setAddressInfoDefaultValues(value);
				service.selectedParameters = value;
			}
		}

		function resetFilter(options, params) {
			var defaultParameters = {
				parameters: {
					radiusMode: undefined,
					radiusId: undefined,
					regionId: undefined,
					regionInput: undefined,
				}
			};
			const paramsToSet = params || defaultParameters;
			setAddressInfoDefaultValues(paramsToSet.parameters);
			setParameters(paramsToSet);
			if (options && !_.isNil(options.includeRadiusSearch)) {
				service.currentModule = options.moduleName;
				service.onFilterChanged.fire();
			}

		}

		function filterRequested(newValue) {
			if (!_.isNil(newValue)) {
				filterReq = newValue;
			}
			return filterReq;
		}

		function getRegisterRfqDetail(rfqProjectFk, rfqCompanyFk) {

			let url = globals.webApiBaseUrl + 'businesspartner/main/lookup/bp/getaddressfk?rfqCompanyFk=' + rfqCompanyFk;

			if (rfqProjectFk !== 'null') {
				url = url + '&rfqProjectFk=' + rfqProjectFk;
			}

			return $http.get(url).then(function (response) {
				service.rfqAddressInfo = response.data;
				return response.data;
			});
		}

		function setAddressInfoDefaultValues(value) {
			if (!value.addressInformation) {
				value.addressInformation = {};
			}
			Object.assign(value.addressInformation, {
				AddressModified: true, // activates input in address field
				isShowMapForRadiusSearch: true // shows map by default
			});
		}

		return service;
	}
})(angular, globals);