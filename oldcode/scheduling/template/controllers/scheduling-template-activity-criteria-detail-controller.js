(function (angular) {

	'use strict';
	var moduleName = 'scheduling.template';
	/**
	 * @ngdoc controller
	 * @name schedulingTemplateActivityCriteriaDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of activity criteria entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingTemplateActivityCriteriaDetailController', SchedulingTemplateActivityCriteriaDetailController);

	SchedulingTemplateActivityCriteriaDetailController.$inject = ['$scope', 'platformContainerControllerService',
		'basicsCostGroupAssignmentService', 'schedulingTemplateActivityCriteriaService', 'schedulingTemplateActivityCriteriaValidationService',
		'schedulingTemplateActivityCriteriaUIStandardService'];

	function SchedulingTemplateActivityCriteriaDetailController($scope, platformContainerControllerService, basicsCostGroupAssignmentService, schedulingTemplateActivityCriteriaService, schedulingTemplateActivityCriteriaValidationService, schedulingTemplateActivityCriteriaUIStandardService) {
		platformContainerControllerService.initController($scope, moduleName, 'f4960681c4a84df28dcb77aee3802a9c', 'schedulingTemplateTranslationService');

		$scope.formOptions.configure.dirty = function dirty(entity, field, options) {
			if (schedulingTemplateActivityCriteriaService.costGroupService) {
				schedulingTemplateActivityCriteriaService.costGroupService.createCostGroup2Save(entity, {
					costGroupCatId: options.costGroupCatId, field: options.model
				});
			}
		};

		function costGroupLoaded(costGroupCatalogs) {
			basicsCostGroupAssignmentService.refreshDetailForm(costGroupCatalogs, {
				scope: $scope,
				dataService: schedulingTemplateActivityCriteriaService,
				validationService: schedulingTemplateActivityCriteriaValidationService,
				formConfiguration: schedulingTemplateActivityCriteriaUIStandardService,
				costGroupName: 'referenceGroup'
			}
			);
		}

		schedulingTemplateActivityCriteriaService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

		$scope.$on('destroy', function () {
			schedulingTemplateActivityCriteriaService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
		});
	}
})(angular);
