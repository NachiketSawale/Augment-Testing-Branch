(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMainInstanceDetailController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for constructionSystem main instance form.
	 */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionSystemMainInstanceDetailController', [
		'$injector',
		'$scope',
		'platformDetailControllerService',
		'constructionSystemMainInstanceUIConfigService',
		'constructionSystemMainInstanceService',
		'constructionsystemMainTranslationService',
		'constructionSystemMainInstanceParameterHelpService', // don't remove for it should be initialized when the controller initializes
		'constructionSystemMainInstanceValidationService',
		function (
			$injector,
			$scope,
			platformDetailControllerService,
			uiConfigService,
			dataService,
			translateService,
			constructionSystemMainInstanceParameterHelpService,
			validationService) {

			uiConfigService.isDynamicReadonlyConfig = true;
			platformDetailControllerService.initDetailController($scope, dataService, validationService, uiConfigService, translateService);

			function costGroupLoaded(costGroupCatalogs) {
				$injector.get('basicsCostGroupAssignmentService').refreshDetailForm(costGroupCatalogs, {
					scope: $scope,
					dataService: dataService,
					validationService : validationService,
					formConfiguration: uiConfigService,
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

		}
	]);
})(angular);
