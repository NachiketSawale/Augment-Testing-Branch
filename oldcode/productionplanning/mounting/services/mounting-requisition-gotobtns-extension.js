/**
 * Created by zwz on 2021/4/8.
 */

(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.mounting';
	let angModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningMountingRequisitionGotoBtnsExtension
	 * @function
	 * @requires _, $translate, ppsCommonToolbarGotoAndGobacktoBtnsExtension
	 * @description
	 * productionplanningMountingRequisitionGotoBtnsExtension provides goto-buttons for Mounting Requisition list controller
	 */
	angModule.service('productionplanningMountingRequisitionGotoBtnsExtension', Extension);
	Extension.$inject = ['_', '$translate', 'ppsCommonToolbarGotoAndGobacktoBtnsExtension'];

	function Extension(_, $translate, ppsCommonToolbarGotoAndGobacktoBtnsExtension) {

		/**
		 * @ngdoc function
		 * @name createGotoBtns
		 * @description Public function that creates goto-buttons for Mounting Requisition list controller.
		 * @param {Object} service: The dataService that functionality of goto-buttons depends on.
		 **/
		this.createGotoBtns = function (service) {
			let navBtnCreationObjs = [{
				id: 'mntActivityGoto',
				caption: $translate.instant('productionplanning.activity.entityActivity'),
				iconClass: 'app-small-icons ico-mounting-activity',
				navigator: {moduleName: 'productionplanning.activity'},
				getNavigationEntity: () => new Promise((resolve) => {
					resolve(service.getSelected());
				}),
				disabled: () => !service.getSelected()
			}, {
				id: 'ppsItemGoto',
				caption: $translate.instant('productionplanning.item.entityItem'),
				iconClass: 'app-small-icons ico-production-planning',
				navigator: {moduleName: 'productionplanning.item'},
				getNavigationEntity: () => new Promise((resolve) => {
					resolve(service.getSelected());
				}),
				disabled: () => !service.getSelected()
			}];

			return ppsCommonToolbarGotoAndGobacktoBtnsExtension.createGotoBtns(service, navBtnCreationObjs);
		};
	}
})(angular);
