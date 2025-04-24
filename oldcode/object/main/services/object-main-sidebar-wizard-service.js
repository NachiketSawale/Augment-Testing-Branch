(function (angular) {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name basics.company.services:basicsCompanySidebarWizardService
	 * @description
	 * Provides wizard configuration and implementation of all basics wizards
	 *
	 * @example
	 * <div paltform-layout initial-layout="name of layout", layout-options="options"></div>
	 */
	angular.module('object.main').factory('objectMainSidebarWizardService', ['$translate', 'platformSidebarWizardConfigService', 'objectMainUnitService', 'basicsCommonChangeStatusService','objectMainProspectService', 'documentProjectDocumentsStatusChangeService', 'objectMainUnitInstallmentDataService',


		function ($translate, platformSidebarWizardConfigService, objectMainUnitService, basicsCommonChangeStatusService, objectMainProspectService, documentProjectDocumentsStatusChangeService, objectMainUnitInstallmentDataService) {

			var service = {};

			var objectUnitStatus = function  objectUnitStatus() {
				return basicsCommonChangeStatusService.provideStatusChangeInstance(
					{
						mainService: objectMainUnitService,
						statusField: 'UnitStatusFk',
						descField: 'Description',
						projectField: 'HeaderFk',
						title: 'basics.customize.objectunitstatus',
						statusName: 'objectunitstatus',
						updateUrl: 'object/main/unit/changestatus',
						id: 1
					}
				);
			};
			service.objectUnitStatus =  objectUnitStatus().fn;

			var objectProspectStatus = function  objectProspectStatus() {
				return basicsCommonChangeStatusService.provideStatusChangeInstance(
					{
						mainService: objectMainUnitService,
						dataService: objectMainProspectService,
						statusField: 'ProspectStatusFk',
						descField: 'Remark',
						projectField: 'UnitFk',
						title: 'basics.customize.objectprospectstatus',
						statusName: 'objectprospectstatus',
						updateUrl: 'object/main/prospect/changestatus',
						id: 2
					}
				);
			};
			service.objectProspectStatus =  objectProspectStatus().fn;

			var objectInstallmentAgreementStatus = function  objectInstallmentAgreementStatus() {
				return basicsCommonChangeStatusService.provideStatusChangeInstance(
					{
						mainService: objectMainUnitService,
						dataService: objectMainUnitInstallmentDataService,
						statusField: 'InstallmentAgreementStateFk',
						descField: 'Remark',
						projectField: 'UnitFk',
						title:  $translate.instant('object.main.entityInstallmentAgreementState'),
						statusName: 'objectinstallmentagreementstatus',
						updateUrl: 'object/main/installmentagreement/changestatus',
						id: 3
					}
				);
			};
			service.objectInstallmentAgreementStatus =  objectInstallmentAgreementStatus().fn;



			var basicsWizardID = 'objectMainSidebarWizards';

			var basicsWizardConfig = {
				showImages: true,
				showTitles: true,
				showSelected: true,
				items: [{
					id: 1,
					text: 'Groupname - Unit',
					text$tr$: 'object.main.wizardsGroupname1',
					groupIconClass: 'sidebar-icons ico-wiz-change-status',
					visible: true,
					subitems: [
						objectUnitStatus(),
						objectProspectStatus(),
						objectInstallmentAgreementStatus()
					]
				}
				]
			};


			service.activate = function activate() {
				platformSidebarWizardConfigService.activateConfig(basicsWizardID, basicsWizardConfig);
			};

			service.deactivate = function deactivate() {
				platformSidebarWizardConfigService.deactivateConfig(basicsWizardID);
			};

			var changeStatusForProjectDocument = function  changeStatusForProjectDocument() {
				return documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(objectMainUnitService, 'object.main');
			};
			service.changeStatusForProjectDocument =  changeStatusForProjectDocument().fn;


			return service;
		}
	]);
})(angular);
