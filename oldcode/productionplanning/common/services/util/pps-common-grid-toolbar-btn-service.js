/**
 * Created by zwz on 8/31/2022.
 */

(function (angular) {
	'use strict';
	/* globals angular, _ */
	const moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('ppsCommonGridToolbarBtnService', GridToolbarBtnService);

	GridToolbarBtnService.$inject = ['basicsLookupdataLookupControllerFactory'];

	function GridToolbarBtnService(basicsLookupdataLookupControllerFactory) {

		let service = {};

		/**
		 * @ngdoc function
		 * @name addToolsIncludesLayoutBtns
		 * @function
		 * @methodOf ppsPlannedQuantityAssignmentDialogToolbarBtnService
		 * @description add tools (includes systemTmplBtn, roleTmplBtn and layoutBtn) for grid
		 * @param gridOptions {object}
		 */
		service.addToolsIncludesLayoutBtns = function (gridOptions) {
			function createOptions(gridOptions) {
				var options = Object.create(gridOptions);
				if(gridOptions.options.tree) {
					var treeOptions = {
						collapsed: gridOptions.options.collapsed,
						parentProp: gridOptions.options.parentProp,
						childProp: gridOptions.options.childProp,
						showHeaderRow: gridOptions.options.showHeaderRow,
						idProperty: gridOptions.options.idProperty
					};
					options.treeOptions = options.treeOptions || {};
					_.extend(options.treeOptions, treeOptions);
				}

				return options;
			}

			gridOptions.gridData = gridOptions.data; // be consistent with relative codes in basicsLookupdataLookupControllerFactory(lookup-controller-factory.js)
			return basicsLookupdataLookupControllerFactory.create(
				{grid: true, dialog: true},
				gridOptions,
				createOptions(gridOptions)
			);
			// the return value is a controller, and we may need to call method controller.destroy() at the appropriate time
		};

		return service;
	}
})(angular);