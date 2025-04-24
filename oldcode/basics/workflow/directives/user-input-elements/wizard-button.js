/*globals angular */
(function (angular) {
	'use strict';

	function basicsWorkflowWizardButtonDirective(basicsConfigWizardSidebarService, basicsWorkflowMasterDataService, _, platformModuleNavigationService, $timeout) {
		return {
			restrict: 'A',
			scope: {
				options: '='
			},
			replace: true,
			template: '<button class="btn btn-default fullwidth" type="button" data-ng-click="openWizard()">{{options.displayText}}</button>',
			link: function (scope) {
				scope.openWizard = function openWizard() {
					basicsWorkflowMasterDataService.getModule().then(function (module) {
						var currentModule = _.find(module, {Id: scope.options.module});
						platformModuleNavigationService.navigate({moduleName: currentModule.InternalName},
							scope.options.entity, 'Id');
						$timeout(function () {
							var setupData = basicsConfigWizardSidebarService.getWizardSetupDataMap()
								.get(scope.options.wizard);
							basicsConfigWizardSidebarService.invoke(setupData, null);
						}, 2000);
					});
				};
			}
		};
	}

	basicsWorkflowWizardButtonDirective.$inject = ['basicsConfigWizardSidebarService', 'basicsWorkflowMasterDataService', '_', 'platformModuleNavigationService', '$timeout'];

	angular.module('basics.workflow').directive('basicsWorkflowWizardButtonDirective', basicsWorkflowWizardButtonDirective);
})(angular);