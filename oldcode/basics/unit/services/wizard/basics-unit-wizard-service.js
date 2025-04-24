(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('basics.unit').factory('basicsUnitSidebarWizardService',
		['platformSidebarWizardConfigService', 'basicsUnitExportWizardService',
			function ( platformSidebarWizardConfigService, basicsUnitExportWizardService) {

				var service = {};

				var basicsUnitWizardID = 'basicsUnitSidebarWizards';

				var basicsUnitWizardConfig = {
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
									cssClass: 'rw md',
									fn: exportUomService
								}

							]
						}
					]
				};
				service.activate = function activate() {
					platformSidebarWizardConfigService.activateConfig(basicsUnitWizardID, basicsUnitWizardConfig);
				};

				service.deactivate = function deactivate() {
					platformSidebarWizardConfigService.deactivateConfig(basicsUnitWizardID);
				};

				function exportUomService() {
					basicsUnitExportWizardService.exportUom();
				}


				return service;
			}
		]);
})(angular);
