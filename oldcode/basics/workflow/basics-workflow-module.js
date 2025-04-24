/* global angular, globals */
(function (angular) {
	'use strict';

	var moduleName = 'basics.workflow';

	angular.module(moduleName, ['platform', 'cloud.desktop', 'reporting.platform', 'basics.common', 'basics.userform'])
		.config(['mainViewServiceProvider', 'basicsWorkflowModuleOptions', function (mainViewServiceProvider, basicsWorkflowModuleOptions) {
			mainViewServiceProvider.registerModule(basicsWorkflowModuleOptions);
		}])
		.run(['$templateCache', 'cloudDesktopSidebarService', 'globals', 'platformTranslateService', 'basicsWorkflowEventService', 'platformModuleStateService', 'basicsWorkflowInstanceService',
			function ($templateCache, cloudDesktopSidebarService, globals, platformTranslateService, basicsWorkflowEventService, platformModuleStateService, basicsWorkflowInstanceService) {
				$templateCache.loadTemplateFile('basics.workflow/templates/workflow-templates.html').then(function () {
					var workflowTasks = {
						name: 'workflow-tasks',
						type: 'template',
						templateUrl: globals.appBaseUrl + 'basics.workflow/templates/task/task-container.html'
					};
					var buttonTasks = {
						id: '#workflow-tasks',
						caption: 'cloud.desktop.sdCmdBarTask',
						type: 'item',
						cssClass: 'indicator',
						showSVGTag: true,
						svgSprite: 'sidebar-icons',
						svgImage: 'ico-task',
						buttonTemplate: $templateCache.get('workflow-notification-button.html')
					};

					var workflow = {
						name: 'workflow',
						type: 'template',
						templateUrl: globals.appBaseUrl + 'basics.workflow/templates/workflowSidebar/workflow-container.html'
					};
					var buttonWorkflow = {
						id: '#workflow',
						caption: 'cloud.desktop.sdCmdBarWorkflow',
						type: 'item',
						cssClass: 'indicator',
						showSVGTag: true,
						svgSprite: 'sidebar-icons',
						svgImage: 'ico-workflow',
						buttonTemplate: $templateCache.get('workflow-button.html')
					};

					cloudDesktopSidebarService.registerSidebarContainer(workflowTasks, true, buttonTasks);
					if (!globals.portal) {
						cloudDesktopSidebarService.registerSidebarContainer(workflow, true, buttonWorkflow);
					} else {
						cloudDesktopSidebarService.registerSidebarContainer(workflow, false, buttonWorkflow);
					}

				});

				var state = platformModuleStateService.state(moduleName);
				state.rootService = basicsWorkflowInstanceService;
				$templateCache.loadTemplateFile('basics.workflow/templates/user-input-action.html');
				platformTranslateService.registerModule([moduleName, 'basics.clerk']);

				basicsWorkflowEventService.registerEvent('28CDA93065E341D6BB793F282C2A62DF',
					'Create Requisition Wizard Event', 'requisitionId');

			}]);
	globals.modules.push(moduleName);
})(angular);
