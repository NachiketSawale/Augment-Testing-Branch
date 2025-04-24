(function () {

	'use strict';

	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainValidationService
	 * @description provides validation methods for estimate instances
	 */
	estimateMainModule.factory('estimateMainGroupSettingValidationService',
		['estimateMainGroupSettingService',
			function (estimateMainGroupSettingService) {
				let service = {};

				service.validateGroupStructureId = function validateColor() {
					let itemList = estimateMainGroupSettingService.getList();
					estimateMainGroupSettingService.onItemChange.fire(!(itemList && itemList.length > 0));
				};

				return service;
			}
		]);
})();
