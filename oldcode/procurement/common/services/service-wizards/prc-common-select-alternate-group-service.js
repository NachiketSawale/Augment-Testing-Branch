/**
 * Created by alm on 16/5/2022.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('procurementCommonSelectAlternateGroupService', ['$translate', '$http', 'platformModalService',
		function ($translate, $http, platformModalService) {
			var service = {};

			service.showSelectAlternateGroupWizardDialog = function (commonPrcItemService) {
				var params = {};
				params.prcItemService = commonPrcItemService;
				params.prcItems = angular.copy(commonPrcItemService.getList());
				var modalOptions = {
					templateUrl: globals.appBaseUrl + 'procurement.common/templates/prc-item-select-group.html',
					windowClass: 'form-modal-dialog',
					headerTextKey: 'boq.main.selectGroupsPopup',
					lazyInit: true,
					resizeable: true,
					width: '60%',
					params: params
				};
				platformModalService.showDialog(modalOptions);

			};

			service.saveChangedItems = function (params) {
				return $http.post(globals.webApiBaseUrl + 'procurement/common/prcitem/updatePrcItemGroup', params)
					.then(function () {
						return;
					}, function (reason) {
						console.log(reason);
					});
			};

			return service;
		}]);

})(angular);