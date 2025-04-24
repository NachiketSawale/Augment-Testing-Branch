/**
 * Created by anl on 11/14/2017.
 */

(function (angular) {
	'use strict';


	var moduleName = 'transportplanning.requisition';
	var RequisitionModul = angular.module(moduleName);

	RequisitionModul.controller('transportplanningRequisitionMatRequisitionListController', MatRequisitionListController);
	MatRequisitionListController.$inject = ['$scope',
		'platformContainerControllerService',
		'platformGridAPI'];

	function MatRequisitionListController($scope,
										  platformContainerControllerService,
										  platformGridAPI) {

		var containerUid = $scope.getContentValue('uuid');
		var moduleName_ = $scope.getContentValue('moduleName') || moduleName;
		platformContainerControllerService.initController($scope, moduleName_, containerUid);
		var containerInfo = platformContainerControllerService
			.getModuleInformationService(moduleName_)
			.getContainerInfoByGuid(containerUid);
		//register cell changed
		var onCellChange = function (e, args) {
			var field = args.grid.getColumns()[args.cell].field;
			containerInfo.dataServiceName.onPropertyChanged(args.item, field);
		};
		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
		});
	}
})(angular);