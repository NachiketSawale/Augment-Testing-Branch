/**
 * Created by yew on 2/19/2021.
 */
(function (angular) {
	'use strict';

	angular.module('hsqe.checklist').controller('hsqeCheckListGroupTemplateController',
		['$scope', 'globals', '$injector', 'platformGridControllerService', 'hsqeCheckListGroupTemplateUIStandardService',
			'hsqeCheckListGroupTemplateDataService', 'hsqeCheckListClipBoardService',
			function ($scope, globals, $injector, gridControllerService, gridColumns, dataService, clipboardService) {
				$scope.path = globals.appBaseUrl;
				var gridConfig = {
					columns: [],
					parentProp: 'HsqCheckListGroupFk',
					childProp: 'ChildItems',
					initialState: 'expanded',
					type: 'hsqeCheckListGroupTemplateDataService',
					dragDropService: clipboardService,
					extendDraggedData: function (draggedData) {
						draggedData.modelDataSource = clipboardService.myDragdropAdapter;
					}
				};
				gridControllerService.initListController($scope, gridColumns, dataService, {}, gridConfig);

			}
		]);
})(angular);
