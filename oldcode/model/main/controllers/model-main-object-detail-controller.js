/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.main';

	angular.module(moduleName).controller('modelMainObjectDetailController',
		ModelMainObjectDetailController);

	ModelMainObjectDetailController.$inject = ['$scope', 'platformContainerControllerService',
		'modelMainObjectDataService', 'modelMainObjectConfigurationService', '$injector',
		'modelMainObjectValidationService'];

	function ModelMainObjectDetailController($scope, platformContainerControllerService,
		modelMainObjectDataService, modelMainObjectConfigurationService, $injector,
		modelMainObjectValidationService) {

		modelMainObjectConfigurationService.isDynamicReadonlyConfig = true;
		platformContainerControllerService.initController($scope, moduleName, 'DF88148725F34267A7E7D9F015331216', 'modelMainTranslationService');

		$scope.formOptions.configure.dirty = function dirty(entity, field, options) {
			if (modelMainObjectDataService.costGroupService) {
				modelMainObjectDataService.costGroupService.createCostGroup2Save(entity, {
					costGroupCatId: options.costGroupCatId, field: options.model
				});
			}
		};
		/* add costGroupService to mainService */
		if (!modelMainObjectDataService.costGroupService) {
			modelMainObjectDataService.costGroupService = $injector.get('modelMainObjectCostGroupService');
		}

		function costGroupLoaded(costGroupCatalogs) {
			$injector.get('basicsCostGroupAssignmentService').refreshDetailForm(costGroupCatalogs, {
				scope: $scope,
				dataService: modelMainObjectDataService,
				validationService: modelMainObjectValidationService,
				formConfiguration: modelMainObjectConfigurationService,
				costGroupName: 'referenceGroup'
			});
		}

		modelMainObjectDataService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

		$scope.$on('destroy', function () {
			modelMainObjectDataService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
		});
		//
		$scope.formContainerOptions.createBtnConfig.fn = function () {
			modelMainObjectDataService.createItemForSubModel();
		};
	}
})(angular);
