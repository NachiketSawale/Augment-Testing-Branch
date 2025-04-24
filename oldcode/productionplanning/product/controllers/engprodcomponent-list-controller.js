/**
 * Created by zwz on 12/16/2020.
 */
(function () {

	'use strict';
	var moduleName = 'productionplanning.product';
	var angModule = angular.module(moduleName);

	angModule.controller('productionplanningProductEngProdComponentListController', ListController);

	ListController.$inject = ['$scope', 'platformGridControllerService',
		'platformGridAPI',
		'productionplanningProductEngProdComponentDataService',
		'productionplanningProductEngProdComponentUIStandardService',
		'productionplanningProductEngProdComponentValidationService',
		'productionplanningProductEngProdCompMapCheckBtnExtension',
		'basicsCommonToolbarExtensionService'];
	function ListController($scope, platformGridControllerService,
		platformGridAPI,
		dataServ,
		uiStandardServ,
		validationServ,
		prodCompMapCheckBtnExtension,
		basicsCommonToolbarExtensionService) {

		var gridConfig = { initCalled: false, columns: [] };
		platformGridControllerService.initListController($scope, uiStandardServ, dataServ, validationServ, gridConfig);

		basicsCommonToolbarExtensionService.insertBefore($scope, prodCompMapCheckBtnExtension.createBtn(dataServ, $scope));

		function onSelectionChanged() {
			$scope.tools.update();
		}
		dataServ.registerSelectionChanged(onSelectionChanged);
		dataServ.parentService().registerUpdateDone(loadDataIfPhaseReqsUpdated);

		function loadDataIfPhaseReqsUpdated(updateData) {
			if (updateData && updateData.PhaseRequirementToSave) {
				dataServ.load();
			}
		}

		$scope.$on('$destroy', function () {
			dataServ.unregisterSelectionChanged(onSelectionChanged);
			dataServ.parentService().unregisterUpdateDone(loadDataIfPhaseReqsUpdated);
		});
	}
})();