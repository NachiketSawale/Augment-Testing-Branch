/**
 * Created by lvy on 6/1/2018.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMasterObjectTemplateDetailController
	 * @require $scope
	 * @description controller for construction System Master Object Template Detail Controller
	 */

	var modulename = 'constructionsystem.master';
	angular.module(modulename).controller('constructionSystemMasterObjectTemplateDetailController', [
		'$injector',
		'$scope',
		'constructionSystemMasterObjectTemplateUIStandardService',
		'constructionSystemMasterObjectTemplateDataService',
		'platformDetailControllerService',
		'platformTranslateService',
		'constructionSystemMasterObjectTemplateValidationService',
		function (
			$injector,
			$scope,
			formConfiguration,
			dataService,
			detailControllerService,
			translateService,
			validationService) {

			formConfiguration.isDynamicReadonlyConfig = true;
			detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);
			var navigationFunctionsForMaterObjectTemplate = {
				onFirstItem: null,
				onPrevItem: null,
				onNextItem: null,
				onLastItem: null
			};
			angular.extend($scope.formOptions, navigationFunctionsForMaterObjectTemplate);
			angular.extend($scope.formContainerOptions, navigationFunctionsForMaterObjectTemplate);

			function costGroupLoaded(costGroupCatalogs) {
				$injector.get('basicsCostGroupAssignmentService').refreshDetailForm(costGroupCatalogs, {
					scope: $scope,
					dataService: dataService,
					validationService : validationService,
					formConfiguration: formConfiguration,
					costGroupName: 'basicData'
				});
			}

			/* $scope.formOptions.configure.dirty = function dirty(entity, field, options) {
				if (dataService.costGroupService && options && options.costGroupCatId) {
					dataService.costGroupService.createCostGroup2Save(entity, {
						costGroupCatId: options.costGroupCatId,
						field: options.model
					});
				}
			}; */

			dataService.onCostGroupCatalogsLoaded.register(costGroupLoaded);
			if(dataService.costGroupCatalogs){
				costGroupLoaded(dataService.costGroupCatalogs);
			}

			$scope.$on('$destroy', function () {
				dataService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
			});
		}]);
})(angular);