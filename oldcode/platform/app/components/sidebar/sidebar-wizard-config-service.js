/**
 * Created by baedeker on 2014-08-13
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name cloud.platform.services:formContainerStandardConfigService
	 * @description
	 * Creates a form container standard config from dto and high level description
	 *
	 * @example
	 * <div paltform-layout initial-layout="name of layout", layout-options="options"></div>
	 */
	angular.module('platform').factory('platformSidebarWizardConfigService', ['cloudDesktopSidebarService', '$templateCache',

		function (cloudDesktopSidebarService, $templateCache) {

			var service = {};

			var usedConfig = null;
			var currentScope = null;
			var currentId = 0;
			var wizards = {
				name: cloudDesktopSidebarService.getSidebarIds().newWizards,
				title: 'Wizards',
				type: 'template',
				templateUrl: globals.appBaseUrl + 'app/components/sidebar/sidebar-wizards.html'
			};

			service.getName = function getName() {
				return cloudDesktopSidebarService.getSidebarIds().newWizards;
			};

			service.getTitle = function getTitle() {
				return 'Wizards';
			};

			service.getWizards = function getWizards() {
				return usedConfig;
			};

			service.setCurrentScope = function setCurrentScope(scope) {
				currentScope = scope;

				if (currentScope && (currentId !== 0)) {
					service.setSidebarOptions();
				}
			};

			service.setSidebarOptions = function setSidebarOptions() {
				currentScope.sidebarOptions = {};
				currentScope.sidebarOptions.name = service.getName();
				currentScope.sidebarOptions.title = service.getTitle();
				currentScope.sidebarOptions.wizards = service.getWizards();
				currentScope.sidebarOptions.lastButtonId = '';
				currentScope.sidebarOptions.showItemFunction = showItemFunction;
			};

			// click-Function
			function showItemFunction(id) {
				var itemById;
				// get group-element in list
				for (var i = 0; i < usedConfig.items.length; i++) {
					// get list-Element from found group-element
					itemById = _.find(usedConfig.items[i].subitems, 'id', id);
					// Execute function
					if (itemById) {
						itemById.fn();
						break;
					}
				}
			}

			service.getCurrentScope = function getCurrentScope() {
				return currentScope;
			};

			service.activateConfig = function activateConfig(id, config) {
				if(config.items){
					config.items = [];
				}
				usedConfig = config;
				currentId = id;

				cloudDesktopSidebarService.registerSidebarContainer(wizards, true);
				cloudDesktopSidebarService.showHideButtons([{
					sidebarId: cloudDesktopSidebarService.getSidebarIds().newWizards,
					sidebarContainer: wizards,
					active: true
				}]);
				if (currentScope !== null) {
					service.setSidebarOptions();
				}
			};

			service.deactivateConfig = function deactivateConfig(id) {
				cloudDesktopSidebarService.unRegisterSidebarContainer(wizards.name, true);
				if (id === currentId) {
					usedConfig = null;
					currentId = 0;
				}
			};

			return service;
		}
	]);
})(angular);
