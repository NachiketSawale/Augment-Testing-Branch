/**
 * Created by jie on 2022-10-10.
 */
(function (angular) {
	'use strict';
	let moduleName = 'procurement.common';
	angular.module(moduleName).factory('procurementCommonWizardService', [
		'$injector',
		'platformSidebarWizardConfigService',
		'procurementContextService',
		'procurementDocumentChangeStatus',
		'platformTranslateService',
		function (
			$injector,
			platformSidebarWizardConfigService,
			procurementContextService,
			procurementDocumentChangeStatus,
			platformTranslateService
		) {
			let service = {};

			let wizardID = 'procurementDocumentSidebarWizards';

			function changeStatusForProcurementDocument() {
				return procurementDocumentChangeStatus.provideStatusChangeInstance($injector.get('procurementContextService').getMainService(), $injector.get('procurementContextService').getMainService().moduleName);
			}

			var wizards = {
				showImages: true,
				showTitles: true,
				showSelected: true,
				items: [
					{
						id: 1,
						text: 'Change Status Wizard',
						text$tr$: 'procurement.common.wizard.change.status.wizard',
						groupIconClass: 'sidebar-icons ico-wiz-change-status',
						visible: true,
						subitems: [
							changeStatusForProcurementDocument()
						]
					}]
			};
			service.changeProcurementDocumentStatus = changeStatusForProcurementDocument().fn;
			service.active = function activate() {
				platformSidebarWizardConfigService.activateConfig(wizardID, wizards);
			};
			var loadTranslations = function () {
				platformTranslateService.translateObject(wizards, ['text']);

			};

			// register translation changed event
			platformTranslateService.translationChanged.register(loadTranslations);
			service.deactive = function deactivate() {
				platformSidebarWizardConfigService.deactivateConfig(wizardID);
			};
			return service;
		}]);
})(angular);