/**
 * Created by lvy on 6/12/2018.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMainObjectTemplateDetailController
	 * @require $scope
	 * @description controller for construction System Main Object Template Detail Controller
	 */

	var modulename = 'constructionsystem.main';
	angular.module(modulename).controller('constructionSystemMainObjectTemplateDetailController', [
		'$injector',
		'$scope',
		'constructionSystemMainObjectTemplateUIStandardService',
		'constructionSystemMainObjectTemplateDataService',
		'platformDetailControllerService',
		'platformTranslateService',
		'constructionSystemMainObjectTemplateValidationService',
		function (
			$injector,
			$scope,
			formConfiguration,
			dataService,
			detailControllerService,
			translateService,
			validationService
		) {
			formConfiguration.isDynamicReadonlyConfig = true;
			detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);

			function costGroupLoaded(costGroupCatalogs) {
				$injector.get('basicsCostGroupAssignmentService').refreshDetailForm(costGroupCatalogs, {
					scope: $scope,
					dataService: dataService,
					validationService : validationService,
					formConfiguration: formConfiguration,
					costGroupName: 'baseGroup'
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
			if (dataService.costGroupCatalogs) {
				costGroupLoaded(dataService.costGroupCatalogs);
			}

			$scope.$on('$destroy', function () {
				dataService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
			});

		}]);
})(angular);