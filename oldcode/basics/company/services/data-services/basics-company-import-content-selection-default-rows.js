/**
 * Created by ysl on 12/25/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.company';

	angular.module(moduleName).value('basicsCompanyImportContentJobStatus', {
		None: 0,
		Waiting: 1,
		InProgress: 2,
		Finish: 8,
		Aborting: 32,
		Aborted: 16
	});

	angular.module(moduleName).value('basicsCompanyImportContentTaskStatus', {
		None: 0,
		Waiting: 1,
		InProgress: 2,
		Failed: 4,
		Succeed: 8,
		Abort: 16
	});

	angular.module(moduleName).factory('basicsCompanyImportContentTaskStatusService', ['$translate',
		function ($translate) {
			return [
				{
					value: 1,
					description: $translate.instant('basics.company.importContent.taskStatus.waiting')
				},
				{
					value: 2,
					description: $translate.instant('basics.company.importContent.taskStatus.inprogress')
				},
				{
					value: 4,
					description: $translate.instant('basics.company.importContent.taskStatus.failed')
				},
				{
					value: 8,
					description: $translate.instant('basics.company.importContent.taskStatus.succeed')
				},
				{
					value: 16,
					description: $translate.instant('basics.company.importContent.taskStatus.abort')
				}
			];
		}
	]);

	angular.module(moduleName).factory('basicsCompanyImportContentAddSelectionService', ['$translate',
		function ($translate) {
			return [
				{
					runtimeCode: 'basics.masterdata',
					code: 'basics.masterdata',
					execOrder: 0,
					content: $translate.instant('basics.company.importContent.contentMasterData'),
					level1Data: [
						{
							id: 1001,
							execOrder: 1,
							runtimeCode: 'basics.taxcode',
							skipByLedgerContext: true,
							code: $translate.instant('basics.company.importContent.contentMasterDataTaxCode')
						},
						{
							id: 1002,
							execOrder: 2,
							runtimeCode: 'estimate.costtype',
							skipByMasterDataContext: true,
							code: $translate.instant('basics.company.importContent.contentMasterDataCostType')
						},
						{
							id: 1003,
							execOrder: 14,
							runtimeCode: 'project.contenttype',
							skipByLineItemContext: true,
							code: $translate.instant('basics.company.importContent.projectContentType')
						}
					]
				},
				{
					runtimeCode: 'basics.userform',
					skipByInternalImport: true,
					code: 'basics.userform',
					execOrder: 3,
					content: $translate.instant('basics.company.importContent.contentUserForm')
				},
				{
					runtimeCode: 'basics.unit',
					skipByInternalImport: true,
					code: 'basics.unit',
					execOrder: 4,
					content: $translate.instant('basics.company.importContent.contentUom')
				},
				{
					runtimeCode: 'basics.costgroup',
					code: 'basics.costgroup',
					skipByLineItemContext: true,
					execOrder: 5,
					content: $translate.instant('basics.company.importContent.contentCostGroup')
				},
				{
					runtimeCode: 'basics.costcode',
					code: 'basics.costcode',
					skipByMasterDataContext: true,
					execOrder: 6,
					content: $translate.instant('basics.company.importContent.contentCostCode')
				},
				{
					runtimeCode: 'basics.procurementstructure',
					code: 'basics.procurementstructure',
					skipByMasterDataContext: true,
					execOrder: 7,
					content: $translate.instant('basics.company.importContent.contentProcurementStructure')
				},
				{
					runtimeCode: 'basics.material',
					code: 'basics.material',
					skipByMasterDataContext: true,
					execOrder: 8,
					content: $translate.instant('basics.company.importContent.contentMaterial'),
					level1Url: 'basics/company/importcontent/materiallevel1',
					level2Url: 'basics/company/importcontent/materiallevel2'
				},
				{
					runtimeCode: 'estimate.rules',
					code: 'estimate.rules',
					skipByLineItemContext: true,
					execOrder: 9,
					content: $translate.instant('basics.company.importContent.contentEstimateRules')
				},
				{
					runtimeCode: 'boq.wic',
					code: 'boq.wic',
					skipByLineItemContext: true,
					execOrder: 10,
					content: $translate.instant('basics.company.importContent.contentWIC'),
					level1Url: 'basics/company/importcontent/wiccatalogslevel1'
				},
				{
					runtimeCode: 'estimate.assemblies',
					code: 'estimate.assemblies',
					skipByLineItemContext: true,
					execOrder: 11,
					content: $translate.instant('basics.company.importContent.contentAssembly'),
					level1Url: 'basics/company/importcontent/assemblylevel1'
				},
				{
					runtimeCode: 'boq.wic.assembly',
					code: 'boq.wic.assembly',
					skipByLineItemContext: true,
					execOrder: 12,
					content: $translate.instant('basics.company.importContent.contentWicAssembly'),
					level1Url: 'basics/company/importcontent/wiccatalogslevel1'
				},
				{
					runtimeCode: 'constructionsystem.master',
					code: 'constructionsystem.master',
					skipByLineItemContext: true,
					execOrder: 13,
					content: $translate.instant('basics.company.importContent.contentConstructionSystemMaster'),
					level1Url: 'basics/company/importcontent/cosmasterlevel1'
				}
				// Comment out the below code temporarily before the iTWO 6.2 version release,
				// because the back-end functions have not been developed.
				// {
				// 	runtimeCode: 'businesspartner.main',
				// 	code: 'businesspartner.main',
				// 	skipByLineItemContext: true,
				// 	execOrder: 14,
				// 	content: $translate.instant('basics.company.importContent.businessPartner')
				// }
			];
		}
	]);
})(angular);
