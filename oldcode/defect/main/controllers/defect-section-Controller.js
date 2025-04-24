/**
 * Created by pet on 6/12/2018.
 */
/* global  */
(function (angular) {
	'use strict';
	var moduleName = 'defect.main';
	/**
        * @ngdoc controller
        * @name defectSectionController
        * @function
        *
        * @description
        * defect Section controller
        **/
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).controller('defectSectionController',
		['_','$scope', 'platformGridControllerService', 'defectSectionDataService', 'defectSectionValidationService',
			'defectSectionUIStandardService', 'platformGridAPI',
			function (_,$scope, gridControllerService, dataService, validationService, gridColumns,platformGridAPI) {
				var gridConfig = {
					columns: []
				};
				var setCellEditable = function () {
					var parentService = dataService.parentService();
					if(!_.isNil(parentService)){
						return parentService.setReadonly();
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