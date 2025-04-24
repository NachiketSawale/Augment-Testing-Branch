/**
 * Created by pet on 6/12/2018.
 */
/* global */
(function (angular) {
	'use strict';
	var moduleName = 'defect.main';
	/**
        * @ngdoc controller
        * @name defectChecklistController
        * @function
        *
        * @description
        * defect checklist controller
        **/
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).controller('defectChecklistController',
		['_','$scope', 'platformGridControllerService', 'defectChecklistDataService', 'defectChecklistValidationService',
			'defectChecklistUIStandardService','platformGridAPI',
			function (_,$scope, gridControllerService, dataService, validationService, gridColumns,platformGridAPI) {
				var gridConfig = {
					columns: []
				};

				var setCellEditable = function () {
					var parentService = dataService.parentService();
					if(!_.isNil(parentService)){
						var parentSelectItem = parentService.getSelected();
						if(!!parentSelectItem && parentSelectItem.IsReadonlyStatus !== undefined && parentSelectItem.IsReadonlyStatus){
							return false;
						}
					}
					return true;
				};

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);
				platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);
				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
				});
			}
		]
	);
})(angular);