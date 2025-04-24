/*
 created by miu 0n 01.06.2022
 */
(function (angular) {
	/* global globals */
	'use strict';

	angular.module('basics.common').factory('bascisCommonChartColorProfileService', BascisCommonChartColorProfileService);

	BascisCommonChartColorProfileService.$inject = ['$http', '_', 'platformPermissionService', 'mainViewService'];

	function BascisCommonChartColorProfileService($http, _, platformPermissionService, mainViewService) {
		const service = {
			getCustomDataFromView: getCustomDataFromView,
			setCustomViewData: setCustomViewData,
			setViewConfig: setViewConfig
		};

		function getCustomDataFromView(guid, itemKey) {
			let customData = mainViewService.customData(guid, itemKey);
			return customData;
		}

		function setCustomViewData(guid, key, value) {
			mainViewService.customData(guid, key, value);
		}

		function setViewConfig(gridId, columnConfig) {
			mainViewService.setViewConfig(gridId, columnConfig, null, true);
		}

		return service;
	}
})(angular);