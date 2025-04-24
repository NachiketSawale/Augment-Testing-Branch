/**
 * Created by zwz on 9/27/2019.
 */
(function () {

	'use strict';
	var moduleName = 'productionplanning.header';
	var angModule = angular.module(moduleName);

	angModule.controller('productionplanningHeader2BpListController', ListController);

	ListController.$inject = ['$scope', 'platformGridAPI', 'platformGridControllerService',
		'productionplanningHeader2BpDataService',
		'productionplanningHeader2BpUIStandardService',
		'productionplanningHeader2BpValidationService'];
	function ListController($scope, platformGridAPI,platformGridControllerService,
							dataServ,
							uiStandardServ,
							validationServ) {

		var gridConfig = {initCalled: false, columns: []};
		platformGridControllerService.initListController($scope, uiStandardServ, dataServ, validationServ, gridConfig);

		var onCellChange = function (e, args) {
			var field = args.grid.getColumns()[args.cell].field;
			dataServ.onEntityPropertyChanged(args.item, field);
		};
		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
	}
})();