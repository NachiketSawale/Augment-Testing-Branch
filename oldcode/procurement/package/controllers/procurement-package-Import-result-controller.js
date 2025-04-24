/**
 * Created by chk on 7/26/2016.
 */
(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.package').controller('procurementPackageImportResultController',
		['platformGridControllerService', '$scope', '$translate', 'platformGridAPI',
			'procurementPackageImportWizardService', '$timeout',
			function (platformGridControllerService, $scope, $translate, platformGridAPI,
				procurementPackageImportWizardService/* , $timeout */) {

				$scope.modalOptions = $scope.modalOptions || {};
				$scope.modalOptions.headerText = 'Import Package';
				$scope.gridId = 'EF0901BD78454160A581020B97C71CE0';

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					var showColumns = procurementPackageImportWizardService.modalOptions.columns;
					var dataList = procurementPackageImportWizardService.modalOptions.result;
					/* if(items && items.length >0){
						dataList = items;
						$timeout(function(){
							platformGridAPI.items.data($scope.gridId,dataList);
						},2000);
					} */
					var grid = {
						columns: showColumns,
						data: dataList,
						id: $scope.gridId,
						lazyInit: true,
						options: {
							indicator: true,
							idProperty: 'Id',
							iconClass: ''
						}
					};

					platformGridAPI.grids.config(grid);
				}

				$scope.gridData = {
					state: $scope.gridId
				};

				$scope.onCancel = function () {
					$scope.$close({isOK: true});
				};

				$scope.$on('$destroy', function () {
					platformGridAPI.grids.unregister('EF0901BD78454160A581020B97C71CE0');
				});

			}]);
})(angular);