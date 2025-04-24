(function (angular) {
	'use strict';

	var moduleName = 'mtwo.chatbot';
	angular.module(moduleName).service('mtwoChatbotSideBarWizardService', MtwoChatbotSideBarWizardService);

	MtwoChatbotSideBarWizardService.$inject = ['platformSidebarWizardCommonTasksService', 'mtwoChatBotConfigurationDataService', 'mtwoChatbotConfigurationExportOptionsService', 'basicsExportService', 'basicsImportService', 'platformModalService'];

	function MtwoChatbotSideBarWizardService(platformSidebarWizardCommonTasksService, mtwoChatBotConfigurationDataService, mtwoChatbotConfigurationExportOptionsService, basicsExportService, basicsImportService, platformModalService) {
		this.exportRecord = function exportRecord(wizardParameter) {
			mtwoChatBotConfigurationDataService.updateAndExecute(function () {
				// var headerEntity = mtwoChatBotConfigurationDataService.getSelected();
				// if (!headerEntity) {
				//    return;
				// }
				var options = mtwoChatbotConfigurationExportOptionsService.getExportOptions(mtwoChatBotConfigurationDataService);
				options.MainContainer.uuid = 'A906C9A8D9BE43F39F9928EB969A2737';
				options.MainContainer.id = 'mtwo.chatbot.configuration.grid';
				options.ModuleName = 'mtwo.chatbot.configurations';// this should be match export name in logic
				options.wizardParameter = wizardParameter;
				basicsExportService.showExportDialog(options);
			});
		};

		this.importRecord = function importRecord() {
			// var headerEntity = mtwoChatBotConfigurationDataService.getSelected();
			// if (!headerEntity || angular.isUndefined(headerEntity.Id)) {
			//    platformModalService.showMsgBox('Please select Configuration first');
			//    //  platformModalService.showMsgBox($translate.instant('procurement.quote.selectedQuote'), 'Info', 'ico-info');
			//    return;
			// }
			mtwoChatBotConfigurationDataService.updateAndExecute(function () {
				var fields = [
					{
						PropertyName: 'Id',
						EntityName: 'Configuration',
						DomainName: 'integer',
						Editor: 'domain',
						DisplayName: 'entityChatbotConfigurationId'
					},
					{
						PropertyName: 'Code',
						EntityName: 'Configuration',
						DomainName: 'code',
						Editor: 'domain',
						DisplayName: 'entityChatbotConfigurationCode'
					},
					{
						PropertyName: 'Description',
						EntityName: 'PrcItem',
						DomainName: 'description',
						Editor: 'domain',
						DisplayName: 'entityChatbotConfigurationDescription',
						// ribFormatMappingName: 'Item Number',
						Only4RibFormat: false
					},
					{
						PropertyName: 'Islive',
						EntityName: 'Configuration',
						DomainName: 'boolean',
						Editor: 'domain',
						DisplayName: 'entityChatbotConfigurationIslive',
						// ribFormatMappingName: 'Item Number',
						Only4RibFormat: false
					},
					{
						PropertyName: 'NlpModelId',
						EntityName: 'Configuration',
						DomainName: 'description',
						Editor: 'domain',
						DisplayName: 'entityChatbotConfigurationNlpModelName',
						// ribFormatMappingName: 'Item Number',
						Only4RibFormat: false
					}
				];
				// var prcItemImportOptionsService = $injector.get('prcCommonItemImportOptionsService');
				// var options = prcItemImportOptionsService.getImportOptions(moduleName,config);
				var options = {
					ModuleName: 'mtwo.chatbot.configurations',
					SupportedFileFormats: [
						'.XLSX',
						'.XLSX_RibMat'
					],
					// preprocessor:
					ImportDescriptor: {
						CustomSettings: {},
						Fields: fields
					},
					ProcessImport: true
				};


				// options.preprocessor = addPreProcessor(options);
				// var prcHeaderFk = reqHeaderEntity ? reqHeaderEntity.PrcHeaderFk : null;
				options.ImportDescriptor.CustomSettings = {
					// PrcHeaderFk: prcHeaderFk,
					// IsImportPriceAfterTax : false,
					// BpdVatGroupFk : reqHeaderEntity.BpdVatGroupFk,
					// HeaderTaxCodeFk:reqHeaderEntity.TaxCodeFk
				};
				basicsImportService.showImportDialog(options);
			});
			// basicsImportService.showImportDialog(procurementQtnExcelImportWizardService.getImportOptions());
		};

		this.exportWf2intent = function exportWf2intent(wizardParameter) {
			mtwoChatBotConfigurationDataService.updateAndExecute(function () {
				var headerEntity = mtwoChatBotConfigurationDataService.getSelected();
				if (!headerEntity) {
					platformModalService.showMsgBox('Please select Configuration first');
					return;
				}
				var options = mtwoChatbotConfigurationExportOptionsService.getExportOptions(mtwoChatBotConfigurationDataService);
				options.MainContainer.uuid = '0097C0C570744F338742B4E906D1F31C';
				options.MainContainer.id = 'mtwo.chatbot.wf2intent.grid';
				options.ModuleName = 'mtwo.chatbot.wf2intent';// this should be match export name in logic
				options.wizardParameter = wizardParameter;
				basicsExportService.showExportDialog(options);
			});
		};
		this.importWf2intent = function importWf2intent() {
			var headerEntity = mtwoChatBotConfigurationDataService.getSelected();
			if (!headerEntity || angular.isUndefined(headerEntity.Id)) {
				platformModalService.showMsgBox('Please select Configuration first');
				// platformModalService.showMsgBox($translate.instant('procurement.quote.selectedQuote'), 'Info', 'ico-info');
				return;
			}
			mtwoChatBotConfigurationDataService.updateAndExecute(function () {
				var fields = [
					{
						PropertyName: 'Id',
						EntityName: 'wf2intent',
						DomainName: 'integer',
						Editor: 'domain',
						DisplayName: 'entityChatbotWf2intentId'
					},
					{
						PropertyName: 'Code',
						EntityName: 'wf2intent',
						DomainName: 'code',
						Editor: 'domain',
						DisplayName: 'entityChatbotWf2intentCode'
					},
					{
						PropertyName: 'Description',
						EntityName: 'wf2intent',
						DomainName: 'description',
						Editor: 'domain',
						DisplayName: 'entityChatbotWf2intentDescription',
						// ribFormatMappingName: 'Item Number',
						Only4RibFormat: false
					},
					{
						PropertyName: 'Intent',
						EntityName: 'wf2intent',
						DomainName: 'description',
						Editor: 'domain',
						DisplayName: 'entityChatbotWf2intentIntent',
						// ribFormatMappingName: 'Item Number',
						Only4RibFormat: false
					},
					{
						PropertyName: 'Wfetemplatefk',
						EntityName: 'wf2intent',
						DomainName: 'integer',
						Editor: 'domain',
						DisplayName: 'entityChatbotWf2intentWfetemplatefk',
						// ribFormatMappingName: 'Item Number',
						Only4RibFormat: false
					}
				];

				// var prcItemImportOptionsService = $injector.get('prcCommonItemImportOptionsService');
				var options = {
					ModuleName: 'mtwo.chatbot.wf2intent',
					SupportedFileFormats: [
						'.XLSX',
						'.XLSX_RibMat'
					],
					// preprocessor:
					ImportDescriptor: {
						CustomSettings: {},
						Fields: fields
					},
					ProcessImport: true
				};


				// options.preprocessor = addPreProcessor(options);
				// var prcHeaderFk = reqHeaderEntity ? reqHeaderEntity.PrcHeaderFk : null;
				options.ImportDescriptor.CustomSettings = {
					MtoConfiFk: headerEntity.Id
					// IsImportPriceAfterTax : false,
					// BpdVatGroupFk : reqHeaderEntity.BpdVatGroupFk,
					// HeaderTaxCodeFk:reqHeaderEntity.TaxCodeFk
				};
				basicsImportService.showImportDialog(options);

			});
		};

		// this.copy = function copy(wizardParameter) {
		// mtwoChatBotConfigurationDataService.updateAndExecute(function () {
		// var headerEntity = mtwoChatBotConfigurationDataService.getSelected();
		// if (!headerEntity) {
		// }
		// });
		// };
	}
})(angular);
