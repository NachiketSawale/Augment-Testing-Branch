(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.productionset';
	let angModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningProductionsetGobacktoBtnsExtension
	 * @function
	 * @requires _, $translate, platformModuleNavigationService
	 * @description
	 * productionplanningProductionsetGobacktoBtnsExtension provides goto-buttons for PPS Productionset list/tree controller
	 */
	angModule.service('productionplanningProductionsetGobacktoBtnsExtension', Extension);
	Extension.$inject = ['_', '$translate', 'ppsCommonToolbarGotoAndGobacktoBtnsExtension'];

	function Extension(_, $translate, ppsCommonToolbarGotoAndGobacktoBtnsExtension) {

		/**
		 * @ngdoc function
		 * @name createGobacktoBtns
		 * @description Public function that creates gobackto-buttons for Productionset list/tree controller.
		 * @param {Object} service: The dataService that functionality of gobackto-buttons depends on.
		 **/
		this.createGobacktoBtns = function (service) {
			let navBtnCreationObjs = [{
				id: 'ppsItemGobackto',
				caption: $translate.instant('productionplanning.item.entityItem'),
				iconClass: 'app-small-icons ico-production-planning',
				navigator: {moduleName: 'productionplanning.item'},
				getNavigationEntity: () => new Promise((resolve) => {
					resolve(service.getSelected()); // return an entity that includes property ItemFk
				}),
				triggerField: 'ItemFk',
				disabled: () => {
					var selectedItem = service.getSelected();
					return !selectedItem || _.isNil(selectedItem.ItemFk);
				}
			}];

			return ppsCommonToolbarGotoAndGobacktoBtnsExtension.createGobacktoBtns(service, navBtnCreationObjs);
		};
	}
})(angular);
