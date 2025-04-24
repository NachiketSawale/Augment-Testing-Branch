/**
 * Created by zwz on 2021/3/16.
 */

(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.header';
	const angModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningHeaderGobacktoBtnsExtension
	 * @function
	 * @requires _, $translate, platformModuleNavigationService
	 * @description
	 * productionplanningHeaderGobacktoBtnsExtension provides goto-buttons for PPS header list/tree controller
	 */
	angModule.service('productionplanningHeaderGobacktoBtnsExtension', Extension);
	Extension.$inject = ['_', '$translate', 'ppsCommonToolbarGotoAndGobacktoBtnsExtension'];

	function Extension(_, $translate, ppsCommonToolbarGotoAndGobacktoBtnsExtension) {

		/**
		 * @ngdoc function
		 * @name createGobacktoBtns
		 * @description Public function that creates gobackto-buttons for PPS header list/tree controller.
		 * @param {Object} service: The dataService that functionality of gobackto-buttons depends on.
		 **/
		this.createGobacktoBtns = function (service) {
			let navBtnCreationObjs = [{
				id: 'projectGobackto',
				caption: $translate.instant('project.main.sourceProject'),
				iconClass: 'app-small-icons ico-project',
				navigator: {moduleName: 'project.main'},
				getNavigationEntity: () => new Promise((resolve) => {
					resolve(service.getSelected()); // return an entity that includes property PrjProjectFk
				}),
				triggerField: 'PrjProjectFk',
				disabled: () => {
					let selectedItem = service.getSelected();
					return !selectedItem || _.isNil(selectedItem.PrjProjectFk);
				}
			}, {
				id: 'jobGobackto',
				caption: $translate.instant('logistic.job.entityJob'),
				iconClass: 'app-small-icons ico-logistic-job',
				navigator: {moduleName: 'logistic.job'},
				getNavigationEntity: () => new Promise((resolve) => {
					resolve(service.getSelected()); // return an entity that includes property LgmJobFk
				}),
				triggerField: 'LgmJobFk',
				disabled: () => {
					let selectedItem = service.getSelected();
					return !selectedItem || _.isNil(selectedItem.LgmJobFk);
				}
			}, {
				id: 'contractGobackto',
				caption: $translate.instant('productionplanning.header.entityOrdHeaderFk'),
				iconClass: 'app-small-icons ico-sales-contract',
				navigator: {moduleName: 'sales.contract'},
				getNavigationEntity: () => new Promise((resolve) => {
					resolve(service.getSelected()); // return an entity that includes property OrdHeaderFk
				}),
				triggerField: 'OrdHeaderFk',
				disabled: () => {
					let selectedItem = service.getSelected();
					return !selectedItem || _.isNil(selectedItem.OrdHeaderFk);
				}
			}];

			return ppsCommonToolbarGotoAndGobacktoBtnsExtension.createGobacktoBtns(service, navBtnCreationObjs);
		};
	}
})(angular);
