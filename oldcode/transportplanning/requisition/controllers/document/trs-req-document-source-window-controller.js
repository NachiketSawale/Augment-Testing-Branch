(angular => {
	'use strict';

	const moduleName = 'transportplanning.requisition';
	angular.module(moduleName).controller('trsReqDocumentSourceWindowController', controller);
	controller.$inject = ['$scope',
		'$timeout',
		'platformGridAPI',
		'platformSourceWindowControllerService',
		'basicsCommonUploadDownloadControllerService',
		'basicsCommonToolbarExtensionService',
		'transportplanningRequisitionMainService',
		'trsReqDocumentLookupDataService'
	];

	function controller($scope,
		$timeout,
		platformGridAPI,
		platformSourceWindowControllerService,
		basicsCommonUploadDownloadControllerService,
		basicsCommonToolbarExtensionService,
		trsRequisitionMainService,
		trsReqDocumentLookupDataService) {

		const uuid = $scope.getContainerUUID();
		const filterArr = $scope.getContentValue('filter');

		platformSourceWindowControllerService.initSourceFilterController(
			$scope,
			uuid,
			'transportplanningRequisitionContainerInformationService',
			'trsReqDocumentSourceWindowFilterService',
			{
				afterInitSubController: scope => {
					scope.entity.inputOpen = true;
					addButtons(scope);

					trsReqDocumentLookupDataService.setFilterParams(filterArr);

					const selected = trsRequisitionMainService.getSelected();
					setFilterValue(selected);
				}
			}
		);

		function addButtons(scope) {
			const options = {
				enableDragAndDrop: false,
				enableProgressBar: false
			};
			basicsCommonUploadDownloadControllerService.initGrid(scope, trsReqDocumentLookupDataService, options);

			basicsCommonToolbarExtensionService.insertBefore(scope, {
				id: 'pinDrawingDoc',
				type: 'check',
				value: trsReqDocumentLookupDataService.getPinState(),
				caption: moduleName + '.pinDocumentLookupContainer',
				iconClass: 'tlb-icons ico-set-prj-context',
				fn: () => {
					trsReqDocumentLookupDataService.togglePinState();
				},
			});
		}

		function setFilterValue(selected) {
			if (!selected) {
				return;
			}
			trsReqDocumentLookupDataService.filterBySelection(selected);
		}

		trsRequisitionMainService.registerSelectionChanged(onSelectedTrsReqChanged);
		function onSelectedTrsReqChanged(_, selected) {
			setFilterValue(selected);
		}

		$scope.$watch('entity.inputOpen', () => {
			$timeout(() => platformGridAPI.grids.resize(uuid), 300);
		});

		$scope.$on('$destroy', () => {
			trsRequisitionMainService.unregisterSelectionChanged(onSelectedTrsReqChanged);
		});
	}
})(angular);