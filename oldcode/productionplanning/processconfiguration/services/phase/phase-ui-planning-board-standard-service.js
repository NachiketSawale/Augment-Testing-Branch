
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).factory('ppsProcessConfigurationPhaseUIPlanningBoardService', UIPlanningBoardService);

	UIPlanningBoardService.$inject = ['$translate', 'ppsProcessConfigurationPhaseUIStandardService','platformSchemaService','platformUIStandardConfigService','productionplanningProcessConfigurationTranslationService','basicsLookupdataConfigGenerator','productionplanningFormworktypeLookupOverloadProvider'];

	function UIPlanningBoardService($translate, uiStandardService, platformSchemaService,uiStandardConfigService,translationService,basicsLookupdataConfigGenerator,formworktypeLookupOverloadProvider) {


		const detailConfig = getPlanningBoardDetailConfig(platformSchemaService,uiStandardConfigService,translationService,basicsLookupdataConfigGenerator,formworktypeLookupOverloadProvider);

		const customConfig = getCustomSettingsConfig(platformSchemaService, uiStandardConfigService, translationService, basicsLookupdataConfigGenerator, $translate);

		// addtional properties of planning board groups and rows
		let planningBoardGroups = detailConfig.getStandardConfigForDetailView().groups;
		let planningBoardRows = detailConfig.getStandardConfigForDetailView().rows;

		// existing properties from phase-ui-standard-service
		let groups = uiStandardService.getStandardConfigForDetailView().groups;
		let rows = uiStandardService.getStandardConfigForDetailView().rows;

		let mergedGroups = [...groups,...planningBoardGroups];
		let mergedRows = [...rows,...planningBoardRows];

		return {
			getStandardConfigForDetailView: function () {
				return {
					showGrouping: true,
					groups: mergedGroups,
					rows: mergedRows
				};
			},
			getCustomSettingsConfig: () => {
				return customConfig;
			}
		};
	}


	function getPlanningBoardDetailConfig(platformSchemaService,uiStandardConfigService,translationService,basicsLookupdataConfigGenerator,formworktypeLookupOverloadProvider){

		var layoutConfig =
			{
				'fid': 'productionplanning.processconfiguration.phaselayout',
				'version': '1.0.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						gid: 'product',
						attributes: ['statusfk','code','producttemplatecode','descriptioninfo','userdefined1','userdefined2','userdefined3','userdefined4','userdefined5']
					},
					{
						gid: 'project',
						attributes: ['projectno','projectname','lgmjobcode']

					},
					{
						gid: 'productdimension',
						attributes: ['length','height','width','weight','weight2','weight3','area','area2','area3','volume','volume2','volume3','planquantity','billquantity']
					},
					{
						gid: 'formwork',
						attributes: ['formworktypefk']
					},

				],
				'overloads': {
					code: { readonly: true},
					projectno: { readonly: true},
					projectname:  { readonly: true},
					lgmjobcode:  { readonly: true},
					statusfk:basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ppsproductstatus', null, {
						showIcon: true,
					}),
					formworktypefk: formworktypeLookupOverloadProvider.provideFormworktypeLookupOverload(true),
					producttemplatecode: { readonly: true }
				}
			};


		var ruleSetAttributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'PhaseForPlanningBoardDto',
			moduleSubModule: 'Productionplanning.ProcessConfiguration'
		});
		ruleSetAttributeDomains = ruleSetAttributeDomains.properties;

		const BaseService = uiStandardConfigService;
		return new BaseService(layoutConfig, ruleSetAttributeDomains, translationService);

	}

	function getCustomSettingsConfig(platformSchemaService, uiStandardConfigService, translationService, basicsLookupdataConfigGenerator, $translate) {
		return [{
			Name: $translate.instant('productionplanning.item.document.documentListTitle'),
			form: {
				fid: 'productionplanning.processconfiguration.documents',
				version: '1.0.0',
				showGrouping: false,
				groups: [
					{
						gid: 'general',
						header: 'Documents',
						header$tr$: $translate.instant('productionplanning.item.document.drawingDocumentListTitle'),
						isOpen: true,
						visible: true,
						sortOrder: 1
					}
				],
				rows: [

					{
						gid: 'general',
						rid: 'documents',
						visible: true,
						sortOrder: 1,
						readonly: false,
						type: 'directive',
						directive: 'phase-detail-dialog-documents-directive',
						options: {
						}
					}
				]
			}
		}];
	}
})(angular);