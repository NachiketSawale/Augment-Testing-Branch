/**
 * Created by jhe on 7/23/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.regionCatalog';

	angular.module(moduleName).factory('basicsRegionCatalogSidebarWizardService',
		['platformSidebarWizardConfigService',
			function (platformSidebarWizardConfigService) {

				var service = {};

				var basicsRegionCatalogWizardID = 'basicsRegionCatalogSidebarWizards';

				var basicsRegionCatalogWizardConfig = {
					showImages: true,
					showTitles: true,
					showSelected: true,
					items: [
						{
							id: 1,
							text: 'Groupname',
							text$tr$: 'scheduling.calendar.wizardGroupname',
							groupIconClass: 'sidebar-icons ico-wiz-change-status',
							visible: true,
							subitems: [
								{
									id: 2,
									text: 'Create Vacation',
									text$tr$: 'scheduling.calendar.createVacation',
									type: 'item',
									showItem: true,
									cssClass: 'rw md'
								}

							]
						}
					]
				};
				service.activate = function activate() {
					platformSidebarWizardConfigService.activateConfig(basicsRegionCatalogWizardID, basicsRegionCatalogWizardConfig);
				};

				service.deactivate = function deactivate() {
					platformSidebarWizardConfigService.deactivateConfig(basicsRegionCatalogWizardID);
				};

				service.alertInfo = function () {
					alert('Hello');
				};

				return service;
			}
		]);
})(angular);
