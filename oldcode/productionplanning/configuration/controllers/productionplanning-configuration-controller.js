(function () {
	'use strict';
	var moduleName = 'productionplanning.configuration';
	var angModule = angular.module(moduleName);

	angModule.controller('productionplanningConfigurationController', productionplanningConfigurationController);

	productionplanningConfigurationController.$inject = ['$scope',
		'platformMainControllerService',
		'productionplanningConfigurationMainService',
		'productionplanningConfigurationTranslationService',
		'productionplanningConfigurationEngtypeDataService',
		'productionplanningConfigurationEventTypeSlotDataService',
		'productionplanningConfigurationEventTypeQtySlotDataService',
		'productionplanningConfigurationClerkRoleSlotDataService',
		'productionplanningConfigurationPlannedQuantitySlotDataService',
		'productionplanningConfigurationPhaseDateSlotDataService',
		'ppsConfigurationLogConfigDataService',
		'platformNavBarService',
		'ppsExternalConfigurationDataService',
		'ppsConfigurationUpstreamItemTemplateDataService',
		'ppsStatusInheritedTriggerRuleDataService',
		'ppsStatusInheritedTriggerDataService'];

	function productionplanningConfigurationController($scope,
		platformMainControllerService,
		dataServ,
		translationServ,
		engtypeDataServ,
		eventTypeSlotDataServ,
		eventTypeQtySlotDataServ,
		clerkRoleSlotDataServ,
		plannedQtySlotDataServ,
		phaseDateSlotDataServ,
		logConfigDataService,
		platformNavBarService,
		enternalConfigDataServ,
        ppsConfigurationUpstreamItemTemplateDataService,
		ppsStatusInheritedTriggerRuleDataService,
		ppsStatusInheritedTriggerDataService) {
		var options = {search: true, reports: false};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, dataServ,
			{}, translationServ, moduleName, options);


		function update(){
			dataServ.update().then(function(){
				engtypeDataServ.update();
				eventTypeSlotDataServ.update();
				eventTypeQtySlotDataServ.update();
				clerkRoleSlotDataServ.update();
				plannedQtySlotDataServ.update();
				phaseDateSlotDataServ.update();
				logConfigDataService.update();
				enternalConfigDataServ.update();
	            ppsConfigurationUpstreamItemTemplateDataService.update();
				ppsStatusInheritedTriggerRuleDataService.update();
			});

		}

		function refresh(){
			dataServ.refresh();
			engtypeDataServ.refresh();
			eventTypeSlotDataServ.refresh();
			eventTypeQtySlotDataServ.refresh();
			clerkRoleSlotDataServ.refresh();
			plannedQtySlotDataServ.refresh();
			phaseDateSlotDataServ.refresh();
			logConfigDataService.refresh();
			enternalConfigDataServ.refresh();
	        ppsConfigurationUpstreamItemTemplateDataService.refresh();
			ppsStatusInheritedTriggerDataService.load();
			ppsStatusInheritedTriggerRuleDataService.refresh();
		}

		platformNavBarService.getActionByKey('save').fn = update;
		platformNavBarService.getActionByKey('refresh').fn = refresh;

		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformMainControllerService.unregisterCompletely(dataServ, sidebarReports,
				translationServ, options);
		});
	}
})(angular);
