(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.header';
	const angModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningHeaderGotoBtnsExtension
	 * @function
	 * @requires _, $translate, platformModuleNavigationService
	 * @description
	 * productionplanningHeaderGotoBtnsExtension provides goto-buttons for PPS header list/tree controller
	 */
	angModule.service('productionplanningHeaderGotoBtnsExtension', Extension);
	Extension.$inject = ['$translate', 'ppsCommonToolbarGotoAndGobacktoBtnsExtension'];

	function Extension($translate, ppsCommonToolbarGotoAndGobacktoBtnsExtension) {

		/**
		 * @ngdoc function
		 * @name createGotoBtns
		 * @description Public function that creates goto-buttons for PPS header list/tree controller.
		 * @param {Object} service: The dataService that functionality of goto-buttons depends on.
		 **/
		this.createGotoBtns = function (service) {
			let navBtnCreationObjs = [{
				id: 'ppsItemGoto',
				caption: $translate.instant('productionplanning.item.entityItem'),
				iconClass: 'app-small-icons ico-production-planning',
				navigator: {moduleName: 'productionplanning.item'},
				getNavigationEntity: () => new Promise((resolve) => {
					resolve({PpsHeaderFk: service.getSelected().Id}); // return an entity that includes property PpsHeaderFk
				}),
				triggerField: 'PpsHeaderFk',
				disabled: () => !service.getSelected()
			}];

			return ppsCommonToolbarGotoAndGobacktoBtnsExtension.createGotoBtns(service, navBtnCreationObjs);
		};
	}
})(angular);
