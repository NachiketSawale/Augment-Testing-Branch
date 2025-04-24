/**
 * Created by chi on 2021-10-11
 */
(function (angular) {
	'use strict';
	let moduleName = 'basics.common';
	angular.module(moduleName).factory('basicsCommonAddressGeoLocationConvertService', basicsCommonAddressGeoLocationConvertService);

	basicsCommonAddressGeoLocationConvertService.$inject = ['platformModalService', '$translate', 'globals'];

	function basicsCommonAddressGeoLocationConvertService(platformModalService, $translate, globals) {
		let service = {};
		let defaultModalOptions = {
			templateUrl: globals.appBaseUrl + 'basics.common/templates/address-geolocation-convert.html',
			backdrop: false,
			resizeable: true,
			headerText: $translate.instant('basics.common.geographicLocationInfo.title'),
			data: [],
			width: '1000px'
		};
		service.showDialog = showDialog;
		return service;

		function showDialog(options) {
			if (!options) {
				return;
			}

			let modalOptions = angular.copy(defaultModalOptions);
			modalOptions = angular.extend(modalOptions, options.custom);
			platformModalService.showDialog(modalOptions).then(function (result) {
				if (result && result.ok && angular.isFunction(options.okCallback)) {
					options.okCallback();
				}
			});
		}
	}
})(angular);