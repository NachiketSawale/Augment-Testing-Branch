/**
 * Created by zwz on 2021/3/16.
 */

(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.item';
	let angModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningItemGobacktoBtnsExtension
	 * @function
	 * @requires _, $translate, platformModuleNavigationService
	 * @description
	 * productionplanningItemGobacktoBtnsExtension provides goto-buttons for PPS item list/tree controller
	 */
	angModule.service('productionplanningItemGobacktoBtnsExtension', Extension);
	Extension.$inject = ['_', '$translate', 'ppsCommonToolbarGotoAndGobacktoBtnsExtension'];

	function Extension(_, $translate, ppsCommonToolbarGotoAndGobacktoBtnsExtension) {

		/**
		 * @ngdoc function
		 * @name createGobacktoBtns
		 * @description Public function that creates gobackto-buttons for PPS item list/tree controller.
		 * @param {Object} service: The dataService that functionality of gobackto-buttons depends on.
		 **/
		this.createGobacktoBtns = function (service) {
			let navBtnCreationObjs = [{
				id: 'engDrawingGobackto',
				caption: $translate.instant('productionplanning.drawing.entityDrawing'),
				iconClass: 'app-small-icons ico-engineering-drawing',
				navigator: {moduleName: 'productionplanning.drawing'},
				getNavigationEntity: () => new Promise((resolve) => {
					resolve(service.getSelected()); // return an entity that includes property EngDrawingDefFk
				}),
				triggerField: 'EngDrawingDefFk',
				disabled: () => {
					let selectedItem = service.getSelected();
					return !selectedItem || _.isNil(selectedItem.EngDrawingDefFk);
				}
			}, {
				id: 'headerGobackto',
				caption: $translate.instant('productionplanning.header.entityHeader'),
				iconClass: 'app-small-icons ico-production-orders',
				navigator: {moduleName: 'productionplanning.header'},
				getNavigationEntity: () => new Promise((resolve) => {
					resolve(service.getSelected()); // return an entity that includes property PPSHeaderFk
				}),
				triggerField: 'PPSHeaderFk',
				disabled: () => {
					let selectedItem = service.getSelected();
					return !selectedItem || _.isNil(selectedItem.PPSHeaderFk);
				}
			}, {
				id: 'projectGobackto',
				caption: $translate.instant('project.main.sourceProject'),
				iconClass: 'app-small-icons ico-project',
				navigator: {moduleName: 'project.main'},
				getNavigationEntity: () => new Promise((resolve) => {
					resolve(service.getSelected()); // return an entity that includes property ProjectFk
				}),
				triggerField: 'ProjectFk',
				disabled: () => {
					let selectedItem = service.getSelected();
					return !selectedItem || _.isNil(selectedItem.ProjectFk);
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
