/**
 * Created by jim on 5/11/2017.
 */
/* global  */
(function (angular) {
	'use strict';
	/* global  */
	var moduleName='defect.main';
	/**
	 * @ngdoc controller
	 * @name defectMainHeaderDetailController
	 * @require $scope, $translate, platformDetailControllerService, defectMainHeaderDataService,  defectMainHeaderElementValidationService,defectMainHeaderUIStandardService,
	 *          modelViewerStandardFilterService
	 * @description controller for contract header
	 */
	angular.module(moduleName).controller('defectMainHeaderDetailController',['globals','$scope', '$translate','platformDetailControllerService', 'defectMainHeaderDataService',
		'defectMainHeaderElementValidationService','defectMainHeaderUIStandardService','platformTranslateService',
		'modelViewerStandardFilterService','$injector','$http',
		function (globals,$scope, $translate, platformDetailControllerService, defectMainHeaderDataService,defectMainHeaderElementValidationService,defectMainHeaderUIStandardService,
			platformTranslateService, modelViewerStandardFilterService,$injector,$http) {

			platformDetailControllerService.initDetailController($scope,defectMainHeaderDataService,defectMainHeaderElementValidationService,defectMainHeaderUIStandardService,
				platformTranslateService);
			function costGroupLoaded(costGroupCatalogs){
				$injector.get('basicsCostGroupAssignmentService').refreshDetailForm(costGroupCatalogs, {
					scope : $scope,
					dataService : defectMainHeaderDataService,
					validationService : defectMainHeaderElementValidationService,
					formConfiguration : defectMainHeaderUIStandardService,
					costGroupName : 'basicData'
				});
			}
			defectMainHeaderDataService.onCostGroupCatalogsLoaded.register(costGroupLoaded);
			/* refresh the columns configuration when controller is created */
			if(defectMainHeaderDataService.costGroupCatalogs){
				costGroupLoaded(defectMainHeaderDataService.costGroupCatalogs);
			}

			function headerSelectionChanged() {
				if(defectMainHeaderDataService.hasSelection()){
					var currentItem = defectMainHeaderDataService.getSelected();
					$http.get(globals.webApiBaseUrl + 'defect/main/header/getcostgroupcats' + '?id=' + currentItem.Id).then(function (response) {
						if(response.data !== ''){
							$injector.invoke(['basicsCostGroupAssignmentService', function (basicsCostGroupAssignmentService) {
								var responseData = response.data;
								responseData.dtos = [];
								responseData.dtos.push(currentItem);
								responseData.CostGroupCats.isForDetail = true;
								basicsCostGroupAssignmentService.process(responseData, defectMainHeaderDataService, {
									mainDataName: 'dtos',
									attachDataName: 'Defect2CostGroups', // name of MainItem2CostGroup
									dataLookupType: 'Defect2CostGroups',// name of MainItem2CostGroup
									identityGetter: function identityGetter(entity) {
										return {
											Id: entity.MainItemId
										};
									}
								});
							}]);
						}

					});

				}
			}
			defectMainHeaderDataService.registerSelectionChanged(headerSelectionChanged);


			modelViewerStandardFilterService.attachMainEntityFilter($scope, defectMainHeaderDataService.getServiceName());
			$scope.$on('$destroy', function () {
				defectMainHeaderDataService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
				defectMainHeaderDataService.unregisterSelectionChanged(headerSelectionChanged);
			});
		}
	]
	);
})(angular);
