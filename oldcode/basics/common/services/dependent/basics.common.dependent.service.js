(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonDependentService', ['platformModalService', '$translate', 'globals', function (platformModalService, $translate, globals) {
		const service = {};

		const defaultOption = {
			headerTextKey: 'Warning',
			bodyTextKey: '',
			showYesButton: true,
			showNoButton: true,
			iconClass: 'ico-warning',
			backdrop: false,
			resizeable: true,
			showDependantDataButton: true,
			dependantDataBtnText: $translate.instant('basics.common.dependent.dependantDataBtnText'),
			templateUrl: globals.appBaseUrl + 'basics.common/templates/dependent/dependent-dialog.html',
			loadingInfo: 'loading...'
		};

		service.showDependentDialog = function showDependentDialog(option) {
			option = angular.extend(angular.copy(defaultOption), option);

			return platformModalService.showDialog(option);
		};

		return service;
	}]);

})(angular);