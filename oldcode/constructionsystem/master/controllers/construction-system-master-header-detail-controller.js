(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionSystemMasterHeaderDetailController', [
		'$injector',
		'$scope',
		'platformDetailControllerService',
		'constructionSystemMasterHeaderService',
		'constructionSystemMasterHeaderValidationService',
		'constructionSystemMasterHeaderUIStandardService',

		function (
			$injector,
			$scope,
			platformDetailControllerService,
			constructionSystemMasterHeaderService,
			constructionSystemMasterHeaderValidationService,
			constructionSystemMasterHeaderUIStandardService) {

			constructionSystemMasterHeaderUIStandardService.isDynamicReadonlyConfig = true;
			platformDetailControllerService.initDetailController(
				$scope,
				constructionSystemMasterHeaderService,
				constructionSystemMasterHeaderValidationService,
				constructionSystemMasterHeaderUIStandardService,
				{});

			function costGroupLoaded(costGroupCatalogs) {
				$injector.get('basicsCostGroupAssignmentService').refreshDetailForm(costGroupCatalogs, {
					scope: $scope,
					dataService: constructionSystemMasterHeaderService,
					validationService : constructionSystemMasterHeaderValidationService,
					formConfiguration: constructionSystemMasterHeaderUIStandardService,
					costGroupName: 'basicData'
				});
			}

			/* $scope.formOptions.configure.dirty = function dirty(entity, field, options) {
				if (constructionSystemMasterHeaderService.costGroupService && options && options.costGroupCatId) {
					constructionSystemMasterHeaderService.costGroupService.createCostGroup2Save(entity, {
						costGroupCatId: options.costGroupCatId,
						field: options.model
					});
				}
			}; */

			constructionSystemMasterHeaderService.onCostGroupCatalogsLoaded.register(costGroupLoaded);
			if (constructionSystemMasterHeaderService.costGroupCatalogs) {
				costGroupLoaded(constructionSystemMasterHeaderService.costGroupCatalogs);
			}

			$scope.$on('$destroy', function () {
				constructionSystemMasterHeaderService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
			});

		}]);
})(angular);