/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	const moduleName = 'basics.characteristic';

	/**
	 * @ngdoc controller
	 * @name basicsCharacteristicUsedInCompanyController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of Used In Company.
	 **/
	angular.module(moduleName).controller('basicsCharacteristicUsedInCompanyController',
		basicsCharacteristicUsedInCompanyController);

	basicsCharacteristicUsedInCompanyController.$inject = ['$scope', 'platformGridAPI', '_',
		'basicsCharacteristicUsedInCompanyService', 'platformGridControllerService',
		'basicsCharacteristicUsedInCompanyUIStandardService'];

	function basicsCharacteristicUsedInCompanyController($scope, platformGridAPI, _,
		dataService, platformGridControllerService,
		basicsCharacteristicCompanyUIStandardService) {

		const myGridConfig = {
			initCalled: false,
			columns: [],
			parentProp: 'CompanyFk',
			childProp: 'Companies',
			// expandSelected: function () {
			// const companySelected = dataService.getSelected();
			// if (companySelected && companySelected.CompanyChildren.length === 0 && companySelected.HasChildren) {
			// dataService.doLeafHttpRead(companySelected);
			// }
			// else {
			// platformGridAPI.rows.expandAllSubNodes($scope.gridId);
			// }
			// },
			// updateChangeCallBack: function updateChangeCallBack(list) {
			// // return if undefined or not an object
			// if (!list || !angular.isArray(list) || list.length === 0 || list[0].nodeInfo) {
			// return;
			// }
			//
			// dataService.buildHierarchicalData(list, 0);
			// },
			addValidationAutomatically: false
		};

		platformGridControllerService.initListController($scope, basicsCharacteristicCompanyUIStandardService, dataService, null, myGridConfig);

		function onGridCellClicked(e, args) {

			if (args.item.Companies && args.item.Companies.length > 0)   // node has child items
			{
				setStateRecursive(args.item, args.item.Checked);
			}

			// refresh grid
			platformGridAPI.grids.invalidate($scope.gridId);

		}

		platformGridAPI.events.register($scope.gridId, 'onCellChange', onGridCellClicked);

		// recursively get all id's of the current node and all sub-nodes
		function setStateRecursive(item, newState) {

			item.Checked = newState;
			dataService.markItemAsModified(item);

			const len = item.Companies ? item.Companies.length : 0;
			for (let i = 0; i < len; i++) {
				setStateRecursive(item.Companies[i], newState);
			}
		}

		const removeItems = ['create', 'delete', 'createChild'];
		$scope.tools.items = _.filter($scope.tools.items, function (item) {
			return item && removeItems.indexOf(item.id) === -1;
		});

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onGridCellClicked);
		});

	}
})(angular);
