/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	//noinspection JSAnnotator
	/**
	 * @ngdoc factory
	 * @name modelMainSidebarWizardService
	 * @description
	 *
	 * @example
	 */
	angular.module('model.main').factory('modelMainSidebarWizardService',
		['platformSidebarWizardConfigService', 'platformSidebarWizardCommonTasksService', 'modelMainPropertyKeyWizardService',
			'modelMainObjectAssignmentWizardService',
			function (platformSidebarWizardConfigService, platformSidebarWizardCommonTasksService, modelMainPropertyKeyWizardService) {

				var service = {};

				function createPropertyKey() {
					modelMainPropertyKeyWizardService.createPropertyKey();
				}

				var modelMainWizardID = 'modelMainSidebarWizards';

				var modelMainWizardConfig = {
					showImages: true,
					showTitles: true,
					showSelected: true,
					items: [
						{
							id: 1,
							text: 'Groupname',
							text$tr$: 'model.main.wizardGroupname',
							groupIconClass: 'sidebar-icons ico-wiz-change-status',
							visible: true,
							subitems: [
								{
									id: 1,
									text: 'Create Propertykey',
									text$tr$: 'model.main.createPropertyKey',
									type: 'item',
									showItem: true,
									cssClass: 'rw md',
									fn: createPropertyKey
								}
							]
						}
					]
				};

				service.activate = function activate() {
					platformSidebarWizardConfigService.activateConfig(modelMainWizardID, modelMainWizardConfig);
				};

				service.deactivate = function deactivate() {
					platformSidebarWizardConfigService.deactivateConfig(modelMainWizardID);
				};

				return service;
			}
		]);
})(angular);
