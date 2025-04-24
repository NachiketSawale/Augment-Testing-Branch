(function () {
	'use strict';
	var moduleName = 'scheduling.template';

	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).controller('schedulingTemplateActivityCriteriaListController', SchedulingTemplateActivityCriteriaListController);

	SchedulingTemplateActivityCriteriaListController.$inject = ['$scope','platformContainerControllerService',
		'basicsCostGroupAssignmentService', 'schedulingTemplateActivityCriteriaService', 'schedulingTemplateActivityCriteriaValidationService',
		'schedulingTemplateActivityCriteriaUIStandardService'];
	function SchedulingTemplateActivityCriteriaListController($scope, platformContainerControllerService, basicsCostGroupAssignmentService, schedulingTemplateActivityCriteriaService, schedulingTemplateActivityCriteriaValidationService, schedulingTemplateActivityCriteriaUIStandardService) {
		platformContainerControllerService.initController($scope, moduleName, '1760df4e1cb24c218e70e3c9f3fbe092');

		schedulingTemplateActivityCriteriaService.costGroupService.registerCellChangedEvent($scope.gridId);

		function costGroupLoaded(costGroupCatalogs){
			basicsCostGroupAssignmentService.addCostGroupColumns($scope.gridId, schedulingTemplateActivityCriteriaUIStandardService, costGroupCatalogs, schedulingTemplateActivityCriteriaService, schedulingTemplateActivityCriteriaValidationService);
		}

		schedulingTemplateActivityCriteriaService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

		$scope.$on('$destroy', function () {
			schedulingTemplateActivityCriteriaService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
			schedulingTemplateActivityCriteriaService.costGroupService.unregisterCellChangedEvent($scope.gridId);
		});
	}
})();