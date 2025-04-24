/**
 * Created by lav on 4/28/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.drawing';

	angular.module(moduleName).controller('productionplanningDrawingComponentListController', ResultListController);

	ResultListController.$inject = ['$scope',
		'platformContainerControllerService',
		'platformGridAPI'];

	function ResultListController($scope,
								  platformContainerControllerService,
								  platformGridAPI) {

		var guid = $scope.getContentValue('uuid');
		var _moduleName = $scope.getContentValue('moduleName') || moduleName;
		platformContainerControllerService.initController($scope, _moduleName, guid);

		var modCIS = platformContainerControllerService.getModuleInformationService(_moduleName);
		var layInfo = modCIS.getContainerInfoByGuid(guid);
		var dataServ = platformContainerControllerService.getServiceByToken(layInfo.dataServiceName);
		var onCellChange = function (e, args) {
			var col = args.grid.getColumns()[args.cell].field;
			dataServ.handleFieldChanged(args.item, col);
		};
		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
		});
	}

})(angular);