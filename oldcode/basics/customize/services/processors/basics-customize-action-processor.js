/**
 * Created by baf on 26.10.2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeActionProcessor
	 * @function
	 *
	 * @description
	 * The basicsCustomizeActionProcessor translates an action string into a list of actions descriptions usable by an action  formatter
	 */

	angular.module(moduleName).service('basicsCustomizeActionProcessor', BasicsCustomizeActionProcessor);

	BasicsCustomizeActionProcessor.$inject = ['_', '$injector', '$translate', 'basicsCustomizeStatusTransitionService', 'basicsCustomizePropertiesService', 'basicsCustomizeEmailServerConfigurationService'];

	function BasicsCustomizeActionProcessor(_, $injector, $translate, basicsCustomizeStatusTransitionService, basicsCustomizePropertiesService, basicsCustomizeEmailServerConfigurationService) {
		var self = this;

		this.provideActionSpecification = function provideActionSpecification(action, actionList) {
			switch (action) {
				case 'StatusTransition': {
					actionList.push({
						toolTip: $translate.instant('basics.customize.editStatusTransitions'),
						icon: 'tlb-icons ico-settings',
						callbackFn: basicsCustomizeStatusTransitionService.showDialog
					});
				}
					break;
				case 'TypeProperties': {
					actionList.push({
						toolTip: 'Edit Type Properties',
						icon: 'tlb-icons ico-settings',
						callbackFn: basicsCustomizePropertiesService.showDialog
					});
				}
					break;
				case 'ServerAssignmentConfiguration': {
					if(basicsCustomizeEmailServerConfigurationService.hasManagementAccess()){
						actionList.push({
							toolTip: $translate.instant('basics.customize.serverAssignmentConfiguration'),
							icon: 'control-icons ico-assignment',
							callbackFn: basicsCustomizeEmailServerConfigurationService.showEmailServerAssignmentDialog
						});

						actionList.push({
							toolTip: 'New E-Mail ServerSettings',
							icon: 'tlb-icons ico-rec-new',
							callbackFn: basicsCustomizeEmailServerConfigurationService.showCreateEmailServerSettingsDialog
						});
					}
				}
					break;
			}
		};

		this.processItem = function processItem(type) {
			type.actionList = [];
			if (type.Action) {
				var actions = type.Action.split(';');

				_.forEach(actions, function (action) {
					self.provideActionSpecification(action, type.actionList);
				});
			}
		};
	}
})(angular);
