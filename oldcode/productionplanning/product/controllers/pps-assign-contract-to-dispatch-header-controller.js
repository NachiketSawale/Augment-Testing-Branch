/**
 * Created by anl on 21/2/2023.
 */

(() => {
	'use strict';
	/* global angular */
	const moduleName = 'productionplanning.product';

	angular.module(moduleName).controller('ppsProductAssignContractToDispatchNoteController', controller);
	controller.$inject = ['$scope', 'platformGridAPI', 'ppsProductAssignContractToDispatchNoteService'];

	function controller($scope, platformGridAPI, assignContractToDispatchNoteService) {

		assignContractToDispatchNoteService.initial($scope);

		let dispatchHeaderGridId = $scope.gridOptions.dispatchHeaderGrid.id;
		let orderHeaderGridId = $scope.gridOptions.orderHeaderGrid.id;

		const onCellModified = (e, arg) => {
			let col = arg.grid.getColumns()[arg.cell].field;
			if (col === 'IsMarked') {
				assignContractToDispatchNoteService.handleMarkersChanged(arg.item);
			}
		};

		platformGridAPI.events.register(orderHeaderGridId, 'onCellChange', onCellModified);
		platformGridAPI.events.register(dispatchHeaderGridId, 'onInitialized', assignContractToDispatchNoteService.onInitialized);
		platformGridAPI.events.register(dispatchHeaderGridId, 'onSelectedRowsChanged', assignContractToDispatchNoteService.onDispatchHeaderChanged);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister(orderHeaderGridId, 'onCellChange', onCellModified);
			platformGridAPI.events.unregister(dispatchHeaderGridId, 'onInitialized', assignContractToDispatchNoteService.onInitialized);
			platformGridAPI.events.unregister(dispatchHeaderGridId, 'onSelectedRowsChanged', assignContractToDispatchNoteService.onDispatchHeaderChanged);
		});
	}
})();