(angular => {
	'use strict';

	const moduleName = 'transportplanning.requisition';
	angular.module(moduleName).controller('trsReqPDFViewerController', trsReqPDFViewerController);

	trsReqPDFViewerController.$inject = ['$scope', '$controller', 'modelWdeViewerSelectionService', 'trsReqPDFViewerAnnotationExtension', 'transportplanningRequisitionMainService'];

	function trsReqPDFViewerController($scope, $controller, modelWdeViewerSelectionService, trsReqPDFViewerAnnotationExtension, transportplanningRequisitionMainService) {
		const baseController = 'modelWdeViewerIgeController';
		angular.extend(this, $controller(baseController, { $scope: $scope }));

		let isLoaded = false;
		$scope.$on('model.wdeviewer.loading', () => {
			isLoaded = false;
		});
		$scope.$on('model.wdeviewer.loaded', () => {
			isLoaded = true;
		});

		function updateTools() {
			$scope.tools.update();
		}

		const scopeFn = {
			isLoaded: () => isLoaded,
		};
		trsReqPDFViewerAnnotationExtension.setScopeFn(scopeFn);

		function onSelectedPDFChanged() {
			isLoaded = false;
			updateTools();
			trsReqPDFViewerAnnotationExtension.clearRecordedSelections();
		}

		function onSelectedTrsReqChanged() {
			const selected = transportplanningRequisitionMainService.getSelected();
			if (selected) {
				trsReqPDFViewerAnnotationExtension.setProjectFk(selected.ProjectFk);
				trsReqPDFViewerAnnotationExtension.setJobFk(selected.LgmJobFk);
				trsReqPDFViewerAnnotationExtension.setEngDrawingFk(null);
			}
		}

		modelWdeViewerSelectionService.selectionChanged.register(onSelectedPDFChanged);
		transportplanningRequisitionMainService.registerSelectionChanged(onSelectedTrsReqChanged);

		$scope.$on('$destroy', () => {
			modelWdeViewerSelectionService.selectionChanged.unregister(onSelectedPDFChanged);
			transportplanningRequisitionMainService.unregisterSelectionChanged(onSelectedTrsReqChanged);
		});
	}

})(angular);