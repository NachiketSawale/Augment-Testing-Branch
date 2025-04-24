/*
 * $Id: project-main-container-information-service.js 633813 2021-04-25 11:34:39Z baf $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'project.main';
	let projectMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name projectMainContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	projectMainModule.factory('projectMainContainerInformationService', ['_', '$injector', 'platformLayoutHelperService',
		'basicsLookupdataConfigGenerator', 'projectCommonLayoutOverloadService', 'projectMainConstantValues',
		'basicsLookupdataLookupFilterService', 'platformContextService', 'basicsLookupdataLookupDescriptorService',
		'basicsCommonComplexFormatter','projectCommonDragDropService',
		function (_, $injector, platformLayoutHelperService,
			basicsLookupdataConfigGenerator, projectCommonLayoutOverloadService, projectMainConstantValues,
			basicsLookupdataLookupFilterService, platformContextService, basicsLookupdataLookupDescriptorService,
			basicsCommonComplexFormatter,projectCommonDragDropService
		) {
			const guids = projectMainConstantValues.uuid.container;

			let service = {};
			let dynamicConfigurations = {};

			basicsLookupdataLookupFilterService.registerFilter(
				[{
					key: 'sales-tax-group-filter',
					fn: function (item) {
						let loginCompanyFk = platformContextService.clientId;
						if (loginCompanyFk) {
							var companies = basicsLookupdataLookupDescriptorService.getData('Company');
							let company = _.find(companies, {Id: loginCompanyFk});
							if (company) {
								return item.LedgerContextFk = company.LedgerContextFk;
							} else {
								return false;
							}
						}
					}
				}
				]);

			/* jshint -W074 */ // ignore cyclomatic complexity warning
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				let config = {};
				let layServ = null;
				let templInfo = {};
				switch (guid) {
					case '8b4e238704f84550b00830dec07b25b5': // modelProjectModelFileListController
						config = $injector.get('modelProjectContainerInformationService').getContainerInfoByGuid('8b4e238704f84550b00830dec07b25b5');
						break;
					case '4909263a40954a3caf4f757e782dd679': // modelProjectModelFileDetailController
						config = $injector.get('modelProjectContainerInformationService').getContainerInfoByGuid('4909263a40954a3caf4f757e782dd679');
						break;
					case 'd4d807d4047e439d9ba536d7114e9009': // modelProjectModelListController
						config = $injector.get('modelProjectContainerInformationService').getContainerInfoByGuid('d4d807d4047e439d9ba536d7114e9009');
						break;
					case 'd5d4776c5ea64701912a9c8b007ec446': // modelProjectModelVersionListController
						config = $injector.get('modelProjectContainerInformationService').getContainerInfoByGuid('d5d4776c5ea64701912a9c8b007ec446');
						break;
					case 'a16d5eb0ec314c00871308b03f4a1c39': // modelProjectModelVersionDetailController
						config = $injector.get('modelProjectContainerInformationService').getContainerInfoByGuid('a16d5eb0ec314c00871308b03f4a1c39');
						break;
					case '8a10e1cb69774d56926abd47c0c8dca9': // modelProjectModelDetailController
						config = $injector.get('modelProjectContainerInformationService').getContainerInfoByGuid('8a10e1cb69774d56926abd47c0c8dca9');
						break;
					case '7447B8DF191C45118F56DD84D25D1B41': // schedulingScheduleEditListController
						config = $injector.get('schedulingScheduleContainerInformationService').getContainerInfoByGuid('7447B8DF191C45118F56DD84D25D1B41');
						break;
					case '7F2C6C99ACB84BA8B1D455C2ACF93050': // schedulingScheduleEditDetailController
						config = $injector.get('schedulingScheduleContainerInformationService').getContainerInfoByGuid('7F2C6C99ACB84BA8B1D455C2ACF93050');
						break;
					case 'c4e358d939c54ee6aac910b3c06b3e8': // schedulingScheduleSubScheduleListController
						config = $injector.get('schedulingScheduleContainerInformationService').getContainerInfoByGuid('c4e358d939c54ee6aac910b3c06b3e8');
						break;
					case 'c7281a461e144aeda6478c6b1789a6ee': // schedulingScheduleSubScheduleDetailController
						config = $injector.get('schedulingScheduleContainerInformationService').getContainerInfoByGuid('c7281a461e144aeda6478c6b1789a6ee');
						break;
					case '42FF27D7F0EA40EABA389D669BE3A1DF': // projectLocationListController
						config = $injector.get('projectLocationContainerInformationService').getContainerInfoByGuid('42FF27D7F0EA40EABA389D669BE3A1DF');
						break;
					case '33761E17BFB84451BD226BF2882BC11D': // projectLocationDetailController
						config = $injector.get('projectLocationContainerInformationService').getContainerInfoByGuid('33761E17BFB84451BD226BF2882BC11D');
						break;
					case 'D11B8A235A8646B4AF9C7D317F192973': // schedulingScheduleTimelineEditListController
						config = $injector.get('schedulingScheduleContainerInformationService').getContainerInfoByGuid('D11B8A235A8646B4AF9C7D317F192973');
						break;
					case '6681A59396F24D02A4BEAB2FFF3C735F': // schedulingScheduleTimelineEditDetailController
						config = $injector.get('schedulingScheduleContainerInformationService').getContainerInfoByGuid('6681A59396F24D02A4BEAB2FFF3C735F');
						break;
					case '468be38b0d104ee58361b7e4395ac82d': // schedulingScheduleClerkListController
						config = $injector.get('schedulingScheduleContainerInformationService').getContainerInfoByGuid('468be38b0d104ee58361b7e4395ac82d');
						break;
					case '9dba09dfec334213bc8cb59ef42ffc27': // schedulingScheduleClerkDetailController
						config = $injector.get('schedulingScheduleContainerInformationService').getContainerInfoByGuid('9dba09dfec334213bc8cb59ef42ffc27');
						break;
					case 'c1fc5b2e7f6f47bdabaef27a7dfe05f1': // boqProjectClerkListController
						config = $injector.get('boqProjectContainerInformationService').getContainerInfoByGuid('c1fc5b2e7f6f47bdabaef27a7dfe05f1');
						break;
					case 'EBB7B20BD41047179D2FA0610423C1B1': // projectCostCodesListController
						config = $injector.get('projectCostCodesContainerInformationService').getContainerInfoByGuid('EBB7B20BD41047179D2FA0610423C1B1');
						break;
					case '01970505BE4B428288EE23567DEEED58': // projectCostCodesDetailController
						config = $injector.get('projectCostCodesContainerInformationService').getContainerInfoByGuid('01970505BE4B428288EE23567DEEED58');
						break;
					case '486bac686fa942449b4effcb8b2de308': // projectMaterialListController
						config = $injector.get('projectMaterialContainerInformationService').getContainerInfoByGuid('486bac686fa942449b4effcb8b2de308');
						break;
					case '9b3839487a6445cdb63d307dbf9de780': // projectMaterialDetailController
						config = $injector.get('projectMaterialContainerInformationService').getContainerInfoByGuid('9b3839487a6445cdb63d307dbf9de780');
						break;

					case 'def9a05422154aeba42939052f280a1a': // projectMaterialPortionListController
						config = $injector.get('projectMaterialContainerInformationService').getContainerInfoByGuid('def9a05422154aeba42939052f280a1a');
						break;
					case '4a1245ec24f94aa9a8005db8618bfe2d': // projectMaterialDetailPortionController
						config = $injector.get('projectMaterialContainerInformationService').getContainerInfoByGuid('4a1245ec24f94aa9a8005db8618bfe2d');
						break;
					case 'b187af9db8be4cdd87307c06b12d7c1c': // modelMainObjectInfoListController
						config = $injector.get('modelMainContainerInformationService').getContainerInfoByGuid('36abc91df46f4129a78cc26fe79a6fdc');
						break;
					case '38f9abc2a0024f898a2607dbc27e647d': // modelMainObjectInfoDetailController
						config = $injector.get('modelMainContainerInformationService').getContainerInfoByGuid('114f1a46eaee483d829648e7dd60a63c');
						break;
					case 'f9aae1e070e24b5bb2dacc96d5af9763': // objectProjectHeaderListController
						config = $injector.get('modelProjectContainerInformationService').getContainerInfoByGuid('34ce2fbe7aa74734b5389b19df8646b6');
						break;
					case '22be537a8ca5497a86350d825f809378': // objectProjectHeaderDetailController
						config = $injector.get('modelProjectContainerInformationService').getContainerInfoByGuid('e542d3f1f9374fd8815de4aef382b6a1');
						break;
					case '79bf98afdcfc42b1be7b9e661c6500ff': // objectProjectLevelListController
						config = $injector.get('modelProjectContainerInformationService').getContainerInfoByGuid('230a2d63c31e429486325c62660afcca');
						break;
					case 'd2f88bec61c14c89a93f87a226797f3d': // objectProjectLevelDetailController
						config = $injector.get('modelProjectContainerInformationService').getContainerInfoByGuid('cb60bceef3e243929c9e2b3d1a1292cb');
						break;
					case '84f41825c88a463286c9502f983b4e90': // Project-Stock-List-Container
						config = $injector.get('projectStockContainerInformationService').getContainerInfoByGuid('84f41825c88a463286c9502f983b4e90');
						break;
					case '82554e69247e442e82175ccd48147b81': // Project-Stock-Detail-Container
						config = $injector.get('projectStockContainerInformationService').getContainerInfoByGuid('82554e69247e442e82175ccd48147b81');
						break;
					case '55f6ac464f67460882c719f035091290': // Project-Stock-Location-List-Container
						config = $injector.get('projectStockContainerInformationService').getContainerInfoByGuid('55f6ac464f67460882c719f035091290');
						break;
					case '90b9dd6abb7c40c1b4f8f17d8919ac88': // Project-Stock-Location-Detail-Container
						config = $injector.get('projectStockContainerInformationService').getContainerInfoByGuid('90b9dd6abb7c40c1b4f8f17d8919ac88');
						break;
					case '562132b3f18e470f8eef6b9dbe5dc9d4': // Project-Stock-Material-List-Container
						config = $injector.get('projectStockContainerInformationService').getContainerInfoByGuid('562132b3f18e470f8eef6b9dbe5dc9d4');
						break;
					case 'ca05a162837b4e01b1416116a8a846be': // Project-Stock-Material-Detail-Container
						config = $injector.get('projectStockContainerInformationService').getContainerInfoByGuid('ca05a162837b4e01b1416116a8a846be');
						break;
					case '09B099CDD4BF4AAFB4BC7D28DD8BF1C9': // projectPrj2BPContactListController
						layServ = $injector.get('projectPrj2BPContactConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'projectPrj2BPContactConfigurationService';
						config.dataServiceName = 'projectPrj2BPContactService';
						config.validationServiceName = 'projectPrj2BPContactValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'B2CDEC2972234462804B1ACA15E00330': // projectPrj2BPContactDetailController
						layServ = $injector.get('projectPrj2BPContactConfigurationService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'projectPrj2BPContactConfigurationService';
						config.dataServiceName = 'projectPrj2BPContactService';
						config.validationServiceName = 'projectPrj2BPContactValidationService';
						break;
					case 'B15A05E067094D3988F4626281C88E24': // projectPrj2BPListController
						layServ = $injector.get('projectPrj2BPConfigurationService');
						config = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'projectPrj2BPConfigurationService';
						config.dataServiceName = 'projectPrj2BPService';
						config.validationServiceName = 'projectPrj2BPValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'A47736265C1242348D032A55DE80AA99': // projectPrj2BPDetailController
						layServ = $injector.get('projectPrj2BPConfigurationService');
						config = layServ.getStandardConfigForListView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'projectPrj2BPConfigurationService';
						config.dataServiceName = 'projectPrj2BPService';
						config.validationServiceName = 'projectPrj2BPValidationService';
						break;
					case '975AEC379E4E4B02BE76CCB7A0059F65': // projectMainClerkListController
						layServ = $injector.get('projectMainClerkConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'projectMainClerkConfigurationService';
						config.dataServiceName = 'projectClerkService';
						config.validationServiceName = 'projectMainClerkValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '190FEBD3204840F58F5D6398705744F9': // projectMainClerkDetailController
						layServ = $injector.get('projectMainClerkConfigurationService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'projectMainClerkConfigurationService';
						config.dataServiceName = 'projectClerkService';
						config.validationServiceName = 'projectMainClerkValidationService';
						break;

					case '': // projectMainCurrencyConversionListController   //??????????????? nicht im module-container.js vorhanden
						layServ = $injector.get('projectMainCurrencyConversionDataService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsCurrencyConversionColumnsService';
						config.dataServiceName = 'projectMainCurrencyConversionDataService';
						config.validationServiceName = 'basicsCurrencyConversionValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;

					case '463C61DED9AE494AA02850DBA570234F': // projectMainCurrencyRateListController
						layServ = $injector.get('projectMainCurrencyRateConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'projectMainCurrencyRateConfigurationService';
						config.dataServiceName = 'projectMainCurrencyRateDataService';
						config.validationServiceName = 'projectMainCurrencyRateValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '39d0fd4bf4ba4cd697d3b9198b321d9b':// prjMainBoqChangeOverviewController
						layServ = $injector.get('prjMainBoqChangeOverviewUIStandardService');
						config.layout = layServ.getStandardConfigForListView(moduleName);
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'prjMainBoqChangeOverviewUIStandardService';
						config.dataServiceName = 'prjMainBoqChangeOverviewService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '713B7D2A532B43948197621BA89AD67A':
					case guids.projectList: // projectMainProjectListController
						layServ = $injector.get('projectMainStandardConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						// config.standardConfigurationService = 'projectMainStandardConfigurationService';
						config.standardConfigurationService = 'projectMainDynamicConfigurationService';
						config.dataServiceName = 'projectMainService';
						config.validationServiceName = 'projectMainProjectValidationService';
						config.listConfig = {
							initCalled: false,
							dragDropService: projectCommonDragDropService,
							type: 'project.main',
							columns: [],
							grouping: true,
							cellChangeCallBack: function (arg) {
								let colService = $injector.get('projectMainCharacteristicColumnService');
								if (colService) {
									let column = arg.grid.getColumns()[arg.cell];
									let field = arg.grid.getColumns()[arg.cell].field;
									colService.fieldChange(arg.item, field, column);
								}
							},
							rowChangeCallBack: function (/* e, arg */) {
								var mainService = $injector.get('projectMainService');
								var selectedItem = mainService.getSelected();
								var isNewItem = false;
								if (selectedItem) {
									isNewItem = selectedItem.Version === 0;
								}
								var rateBookDataService = $injector.get('estimateProjectRateBookDataService');
								if (rateBookDataService && !isNewItem) {
									rateBookDataService.setThisContentTypeId(null);
								}
								var estimateProjectRateBookConfigDataService = $injector.get('estimateProjectRateBookConfigDataService');
								if (estimateProjectRateBookConfigDataService) {
									estimateProjectRateBookConfigDataService.setContentTypeId(null);
									// init
									estimateProjectRateBookConfigDataService.initData();
								}

								// refresh the leadingStructure2Rule for formatter
								let estimateRuleFormatterService = $injector.get('estimateRuleFormatterService');
								if (estimateRuleFormatterService) {
									estimateRuleFormatterService.refresh();
								}
								let estimateParameterFormatterService = $injector.get('estimateParameterFormatterService');
								if (estimateParameterFormatterService) {
									estimateParameterFormatterService.refresh();
								}
								$injector.get('estimateParamUpdateService').clear();
								let estimateMainParameterValueLookupService = $injector.get('estimateMainParameterValueLookupService');
								estimateMainParameterValueLookupService.clear();
							}
						};
						break;
					case 'E33FC83676E9439A959E4D8C2F4435B6':
					case guids.projectDetails: // projectMainProjectDetailController
						layServ = $injector.get('projectMainStandardConfigurationService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'projectMainDynamicConfigurationService';
						config.dataServiceName = 'projectMainService';
						config.validationServiceName = 'projectMainProjectValidationService';
						break;

					case '021C5211C099469BB35DCF68E6AEBEC7': // projectMainForCOStructureListController
						layServ = $injector.get('projectMainForCoStructureStandardConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'projectMainForCoStructureStandardConfigurationService';
						config.dataServiceName = 'projectMainForCOStructureService';
						config.validationServiceName = 'projectMainProjectValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;

					case '8d00d49507ea490f8f256518e84a98e8': // projectMainGeneralListController
						layServ = $injector.get('projectMainGeneralConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'projectMainGeneralConfigurationService';
						config.dataServiceName = 'projectMainGeneralService';
						config.validationServiceName = 'projectMainGeneralValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '82366961458345aa8113ed3c2fcddc1d': // projectMainGeneralDetailController
						layServ = $injector.get('projectMainGeneralConfigurationService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'projectMainGeneralConfigurationService';
						config.dataServiceName = 'projectMainGeneralService';
						config.validationServiceName = 'projectMainGeneralValidationService';
						break;
					case 'e755a4d373c44fb7a19339d238685dac': // projectMainKeyFigureListController
						layServ = $injector.get('projectMainForCoStructureStandardConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'projectMainKeyFigureConfigurationService';
						config.dataServiceName = 'projectMainKeyFigureService';
						config.validationServiceName = 'projectMainKeyFigureValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '011b0cf9e74e4e5094995de0ec1e9217': // projectMainSaleListController
						layServ = $injector.get('projectMainSaleConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'projectMainSaleConfigurationService';
						config.dataServiceName = 'projectMainSaleService';
						config.validationServiceName = 'projectMainSaleValidationService';
						config.listConfig = {
							// idProperty: 'ProjectFk',
							initCalled: false,
							grouping: true
						};
						break;
					case 'b85c94bf5b2a4496bd7e2cd7312b9104': // projectMainSaleDetailController
						layServ = $injector.get('projectMainSaleConfigurationService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'projectMainSaleConfigurationService';
						config.dataServiceName = 'projectMainSaleService';
						config.validationServiceName = 'projectMainSaleValidationService';
						break;
					case 'd161af4bc60047cc8961e186f889863a': // projectMainTenderResultListController
						layServ = $injector.get('projectMainTenderResultConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'projectMainTenderResultConfigurationService';
						config.dataServiceName = 'projectMainTenderResultService';
						config.validationServiceName = 'projectMainTenderResultValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '3dd9fa3c5742468db296da347a7f1c31': // projectMainTenderResultDetailController
						layServ = $injector.get('projectMainTenderResultConfigurationService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'projectMainTenderResultConfigurationService';
						config.dataServiceName = 'projectMainTenderResultService';
						config.validationServiceName = 'projectMainTenderResultValidationService';
						break;
					case 'fd77a1ee53124d0ebbc1715996942dcc': // Remark
						layServ = $injector.get('projectMainProjectRemarksContainerConfigurationService');
						return layServ.getContainerInfoByGuid(guid);
					case '078ea761dbf74be19f8b29cb28705e5a': // TenderRemark
						layServ = $injector.get('projectMainProjectRemarksContainerConfigurationService');
						return layServ.getContainerInfoByGuid(guid);
					case '8f8e4f4d4d3f4ccb9a4fb173f849d18d': // CallOffRemark
						layServ = $injector.get('projectMainProjectRemarksContainerConfigurationService');
						return layServ.getContainerInfoByGuid(guid);
					case '7e2299e11b01408290b7b3f49548a4a8': // WarrentyRemark
						layServ = $injector.get('projectMainProjectRemarksContainerConfigurationService');
						return layServ.getContainerInfoByGuid(guid);
					case '9ae8c2111f354edea6c775fb64469de3': // projecStructuresSortcode01ListController
						config = $injector.get('projectStructuresContainerInformationService').getContainerInfoByGuid('9ae8c2111f354edea6c775fb64469de3');
						break;
					case 'b5b27ff9adae4de09deb1e765b53bff9': // projecStructuresSortcode01DetailController
						config = $injector.get('projectStructuresContainerInformationService').getContainerInfoByGuid('b5b27ff9adae4de09deb1e765b53bff9');
						break;
					case '8a747d2e83ab42ed8c918f9840af2b2e': // projecStructuresSortcode02ListController
						config = $injector.get('projectStructuresContainerInformationService').getContainerInfoByGuid('8a747d2e83ab42ed8c918f9840af2b2e');
						break;
					case '77058c67284b412e92a65bfab55f8beb': // projecStructuresSortcode02DetailController
						config = $injector.get('projectStructuresContainerInformationService').getContainerInfoByGuid('77058c67284b412e92a65bfab55f8beb');
						break;
					case '8b8070460f8c477382a3f4ca0eccecf0': // projecStructuresSortcode03ListController
						config = $injector.get('projectStructuresContainerInformationService').getContainerInfoByGuid('8b8070460f8c477382a3f4ca0eccecf0');
						break;
					case '67f570d0ac7c4ee7b0049f7bd2069eaa': // projecStructuresSortcode03DetailController
						config = $injector.get('projectStructuresContainerInformationService').getContainerInfoByGuid('67f570d0ac7c4ee7b0049f7bd2069eaa');
						break;
					case '4232f7b7aa174dc9b9b1cbfb2d92e61b': // projecStructuresSortcode04ListController
						config = $injector.get('projectStructuresContainerInformationService').getContainerInfoByGuid('4232f7b7aa174dc9b9b1cbfb2d92e61b');
						break;
					case 'b47caaaecb014b9cabbbcc547eeb83f8': // projecStructuresSortcode04DetailController
						config = $injector.get('projectStructuresContainerInformationService').getContainerInfoByGuid('b47caaaecb014b9cabbbcc547eeb83f8');
						break;
					case '5d796e309aeb45318236d806a34f0028': // projecStructuresSortcode05ListController
						config = $injector.get('projectStructuresContainerInformationService').getContainerInfoByGuid('5d796e309aeb45318236d806a34f0028');
						break;
					case 'e5c93bd4eba44faeb922d79718f9d69e': // projecStructuresSortcode05DetailController
						config = $injector.get('projectStructuresContainerInformationService').getContainerInfoByGuid('e5c93bd4eba44faeb922d79718f9d69e');
						break;
					case 'bd4aebdaf1fe4a779bb2096946a918a5': // projecStructuresSortcode06ListController
						config = $injector.get('projectStructuresContainerInformationService').getContainerInfoByGuid('bd4aebdaf1fe4a779bb2096946a918a5');
						break;
					case '2ae50bf1b5074521a66f799b5b2db27b': // projecStructuresSortcode06DetailController
						config = $injector.get('projectStructuresContainerInformationService').getContainerInfoByGuid('2ae50bf1b5074521a66f799b5b2db27b');
						break;
					case '76cf8afdfef64049b7820423d83c24c5': // projecStructuresSortcode07ListController
						config = $injector.get('projectStructuresContainerInformationService').getContainerInfoByGuid('76cf8afdfef64049b7820423d83c24c5');
						break;
					case 'b788d63109d040ceb43615efaaf050a7': // projecStructuresSortcode07DetailController
						config = $injector.get('projectStructuresContainerInformationService').getContainerInfoByGuid('b788d63109d040ceb43615efaaf050a7');
						break;
					case '3a86e227a1d245148a04d0da26162ac4': // projecStructuresSortcode08ListController
						config = $injector.get('projectStructuresContainerInformationService').getContainerInfoByGuid('3a86e227a1d245148a04d0da26162ac4');
						break;
					case 'f4055b7677cb48609b5346cf1c52c480': // projecStructuresSortcode08DetailController
						config = $injector.get('projectStructuresContainerInformationService').getContainerInfoByGuid('f4055b7677cb48609b5346cf1c52c480');
						break;
					case '7eb96a183423427c8427f809c658359b': // projecStructuresSortcode09ListController
						config = $injector.get('projectStructuresContainerInformationService').getContainerInfoByGuid('7eb96a183423427c8427f809c658359b');
						break;
					case 'f38d7efcb775488191ed248bf121f52d': // projecStructuresSortcode09DetailController
						config = $injector.get('projectStructuresContainerInformationService').getContainerInfoByGuid('f38d7efcb775488191ed248bf121f52d');
						break;
					case '138e7d85bbc141a29501b08ec1e3d92e': // projecStructuresSortcode10ListController
						config = $injector.get('projectStructuresContainerInformationService').getContainerInfoByGuid('138e7d85bbc141a29501b08ec1e3d92e');
						break;
					case '9e2d856e32cf4e4aa36a79f29b1ce59f': // projecStructuresSortcode10DetailController
						config = $injector.get('projectStructuresContainerInformationService').getContainerInfoByGuid('9e2d856e32cf4e4aa36a79f29b1ce59f');
						break;
					case '1db4b61556414ef7893837ae7af004b0': // projectMainCopyFromLocationListController
						config = $injector.get('projectLocationContainerInformationService').getContainerInfoByGuid('42FF27D7F0EA40EABA389D669BE3A1DF');
						templInfo = {
							dto: 'LocationDto',
							http: 'project/location/',
							endRead: 'treebyprojects',
							filter: '?projectId=',
							filterFk: 'projectFk',
							presenter: 'tree',
							parentProp: 'LocationsParentFk',
							childProp: 'Locations',
							sourceDataService: 'projectLocationMainService'
						};
						config.templInfo = templInfo;
						// config.filterSrv = $injector.get('projectMainSourceFilterDataServiceFactory').getDataServiceName('1db4b61556414ef7893837ae7af004b0');
						config.dataServiceName = $injector.get('projectMainSourceDataServiceFactory').createDataService(templInfo);
						// config.dataServiceName = $injector.get('projectMainSourceDataServiceFactory').getDataServiceName(templInfo);
						config.validationServiceName = {};
						config.listConfig.type = 'sourceLocation';
						break;
					case 'b053362c4d4a4331bfe32bc3a835e664': // projectMainCopyFromCostGroupListController
						layServ = $injector.get('projectMainCostGroupLayoutService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'projectMainCostGroupLayoutService';
						config.listConfig = {
							initCalled: false,
							columns: [],
							parentProp: 'CostGroupFk',
							childProp: 'CostGroupChildren',
							type: 'sourceCostGroup',
							dragDropService: $injector.get('projectMainCostGroupClipboardService')
						};
						templInfo = {
							dto: 'CostGroupDto',
							http: 'project/main/costgroup/',
							endRead: 'tree',
							filterFk: ['costGroupCatalogFk', 'projectFk'],
							presenter: 'tree',
							parentProp: 'CostGroupFk',
							childProp: 'CostGroupChildren',
							sourceDataService: 'projectMainCostGroupDataService'
						};
						config.templInfo = templInfo;
						config.dataServiceName = $injector.get('projectMainSourceDataServiceFactory').createDataService(templInfo);
						config.validationServiceName = {};
						break;
					case 'c32e69481fa6417d871b0f422d37468e': // projectMainCopyFromCostGroupListControllerbylineitemcontext
						layServ = $injector.get('projectMainCostGroupLayoutService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'projectMainCostGroupLayoutService';
						config.listConfig = {
							initCalled: false,
							columns: [],
							parentProp: 'CostGroupFk',
							childProp: 'CostGroupChildren',
							type: 'sourceCostGroup',
							dragDropService: $injector.get('projectMainCostGroupClipboardService')
						};
						templInfo = {
							dto: 'CostGroupDto',
							http: 'project/main/costgroup/',
							endRead: 'tree',
							filterFk: ['costGroupCatalogFk'],
							presenter: 'tree',
							parentProp: 'CostGroupFk',
							childProp: 'CostGroupChildren',
							sourceDataService: 'projectMainCostGroupDataService'
						};
						config.templInfo = templInfo;
						config.dataServiceName = $injector.get('projectMainSourceDataServiceFactory').createDataService(templInfo);
						config.validationServiceName = {};
						break;
					case '31505e1e84e84626ad5ff43a038f5a79': // projectMainAccessObject2GrpRoleListController
						layServ = $injector.get('projectMainAccessObject2GrpRoleUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'projectMainAccessObject2GrpRoleUIStandardService';
						config.dataServiceName = 'projectMainAccessObject2GrpRoleService';
						config.validationServiceName = 'projectMainAccessObject2GrpRoleValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '48fa7592f1014230af0b2ca890e5acf3': // projectMainAccessObject2GrpRoleDetailController
						layServ = $injector.get('projectMainAccessObject2GrpRoleUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'projectMainAccessObject2GrpRoleUIStandardService';
						config.dataServiceName = 'projectMainAccessObject2GrpRoleService';
						config.validationServiceName = 'projectMainAccessObject2GrpRoleValidationService';
						break;
					case '130eb724690c429aa4e359ed0c53115b': // projectMainAddressListController
						layServ = $injector.get('projectMainAddressUiConfigService');
						config = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.listConfig = {initCalled: false, columns: []};
						config.standardConfigurationService = 'projectMainAddressUiConfigService';
						config.dataServiceName = 'projectMainAddressDataService';
						config.validationServiceName = 'projectMainAddressValidationService';
						break;
					case 'caa64e99b7d449bd981e798331c458f9': // projectMainAddressDetailController
						layServ = $injector.get('projectMainAddressUiConfigService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'projectMainAddressUiConfigService';
						config.dataServiceName = 'projectMainAddressDataService';
						config.validationServiceName = 'projectMainAddressValidationService';
						break;
					case '54a408657d304e7f8bbb51dba5d184c2': // projectMainCertificateListController
						layServ = $injector.get('projectMainCertificateConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'projectMainCertificateConfigurationService';
						config.dataServiceName = 'projectMainCertificateService';
						config.validationServiceName = 'projectMainCertificateValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'f21fe8dbcc1d47d7baaa495bf9a9015a': // projectMainCertificateDetailController
						layServ = $injector.get('projectMainCertificateConfigurationService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'projectMainCertificateConfigurationService';
						config.dataServiceName = 'projectMainCertificateService';
						config.validationServiceName = 'projectMainCertificateValidationService';
						break;

					case 'dc5f95a4f8c143a8ae0b2521a83d4e19': // projectMainManagedPlantLocListController
						layServ = $injector.get('projectMainManagedPlantLocConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'projectMainManagedPlantLocConfigurationService';
						config.dataServiceName = 'projectMainManagedPlantLocService';
						config.validationServiceName = 'projectMainManagedPlantLocValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '6ff893e4f04448d38552f2e3678e2c25': // projectMainManagedPlantLocDetailController
						layServ = $injector.get('projectMainManagedPlantLocConfigurationService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'projectMainManagedPlantLocConfigurationService';
						config.dataServiceName = 'projectMainManagedPlantLocService';
						config.validationServiceName = 'projectMainManagedPlantLocValidationService';
						break;
					/* case '37de9c2128f54ab199a62c1526b4d411': //estimateProjectRateBookListController
						layServ = $injector.get('estimateProjectRateBookConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'estimateProjectRateBookConfigurationService';
						config.dataServiceName = 'estimateProjectRateBookDataService';
						config.listConfig = {
							initCalled: false,
							columns: [],
							parentProp: 'RateBookParentFk',
							childProp: 'RateBookChildren',
							moduleState: 'projectMainModuleState',
							gridDataPath: 'selectedMainEntity.RateBook',
							type: 'RateBook'
						};
						break; */
					case guids.releaseList:
						config = platformLayoutHelperService.getStandardGridConfig(service.getReleaseServiceInfo(), service.getReleaseLayout);
						break;
					case guids.releaseDetails:
						config = platformLayoutHelperService.getStandardDetailConfig(service.getReleaseServiceInfo(), service.getReleaseLayout);
						break;
					case guids.costGroupCatalogList:
						config = platformLayoutHelperService.getStandardGridConfig(service.getCostGroupCatalogServiceInfo());
						break;
					case guids.costGroupCatalogDetails:
						config = platformLayoutHelperService.getStandardDetailConfig(service.getCostGroupCatalogServiceInfo());
						break;
					case guids.costGroupList:
						var listConfig = {
							initCalled: false,
							columns: [],
							parentProp: 'CostGroupFk',
							childProp: 'CostGroupChildren',
							type: 'projectCostGroup',
							dragDropService: $injector.get('projectMainCostGroupClipboardService'),
							cellChangeCallBack: function cellChangeCallBack(arg) {
								$injector.get('projectMainCostGroupDataService').handleCellChanged(arg);
							}
						};
						config = platformLayoutHelperService.getGridConfig(service.getCostGroupServiceInfo(), null, listConfig);
						break;
					case guids.costGroupDetails:
						config = platformLayoutHelperService.getStandardDetailConfig(service.getCostGroupServiceInfo());
						break;
					/* case '51f9aff42521497898d64673050588f4': //projectAssemblyListController
						config = $injector.get('projectAssemblyContainerInformationService').getContainerInfoByGuid('51f9aff42521497898d64673050588f4');
						break;
					case 'ab88e60997e04f269d4042bbe410aab9': //projectAssemblyDetailController
						config = $injector.get('projectAssemblyContainerInformationService').getContainerInfoByGuid('ab88e60997e04f269d4042bbe410aab9');
						break; */
					case 'e7bde34dea234e43ae69eb36612bedf3': // estimateProjectSpecificationController
						config.dataServiceName = 'estimateProjectSpecificationService';
						break;
					case guids.billToList:
						config = platformLayoutHelperService.getStandardGridConfig(service.getBillToServiceInfo());
						break;
					case guids.billToDetails:
						config = platformLayoutHelperService.getStandardDetailConfig(service.getBillToServiceInfo());
						break;
					case '47620dd38c874f97b75ee3b6ce342666': // DocumentClerkListController
						layServ = $injector.get('centralQueryClerkConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'centralQueryClerkConfigurationService';
						config.dataServiceName = 'centralQueryClerkService';
						config.validationServiceName = 'centralQueryClerkValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '7806e7a22b2142f8865ab189efe23c5a': // documentClerkDetailController
						layServ = $injector.get('centralQueryClerkConfigurationService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'centralQueryClerkConfigurationService';
						config.dataServiceName = 'centralQueryClerkService';
						config.validationServiceName = 'centralQueryClerkValidationService';
						break;

					case '02c3e17b1fc448789beb50a22ed21143': // basicsEfbsheetsProjectListController
						layServ = $injector.get('basicsEfbsheetsUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsEfbsheetsUIStandardService';
						config.dataServiceName = 'basicsEfbsheetsProjectMainService';
						config.validationServiceName = 'basicsEfbsheetsValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'f31c710ae1854e30aad0812c8ba14be6': // basicsEfbsheetsProjectDetailController
						layServ = $injector.get('basicsEfbsheetsUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsEfbsheetsUIStandardService';
						config.dataServiceName = 'basicsEfbsheetsProjectMainService';
						config.validationServiceName = 'basicsEfbsheetsValidationService';
						break;
					case 'f90a007080a5434bba20abd90a6ce823': // basicsEfbsheetsProjectAverageWageController
						layServ = $injector.get('basicsEfbsheetsAverageWageUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsEfbsheetsAverageWageUIStandardService';
						config.dataServiceName = 'basicsEfbsheetsProjectAverageWageService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'b9e35e5438c441c1ad3e056f7fcf29e8': // basicsEfbsheetsProjectAverageWageDetailController
						layServ = $injector.get('basicsEfbsheetsAverageWageUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsEfbsheetsAverageWageUIStandardService';
						config.dataServiceName = 'basicsEfbsheetsProjectAverageWageService';
						break;
					case 'e05fa5f85cc14e419fd7ca3adc492a88': // basicsEfbsheetsProjectCrewMixAfController
						layServ = $injector.get('basicsEfbsheetsCrewMixAfUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsEfbsheetsCrewMixAfUIStandardService';
						config.dataServiceName = 'basicsEfbsheetsCrewMixAfService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'c61d6e182951469dbf47cbd719345e76': // basicsEfbsheetsProjectCrewMixAfDetailController
						layServ = $injector.get('basicsEfbsheetsCrewMixAfUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsEfbsheetsCrewMixAfUIStandardService';
						config.dataServiceName = 'basicsEfbsheetsCrewMixAfService';
						break;
					case '252747cc4407415d9304a330a2340ea9': // basicsEfbsheetsProjectCrewMixAfsnController
						layServ = $injector.get('basicsEfbsheetsCrewMixAfsnUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsEfbsheetsCrewMixAfsnUIStandardService';
						config.dataServiceName = 'basicsEfbsheetsCrewMixAfsnService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'c72b5000b2a542c18cf76abebc1bd65a': // basicsEfbsheetsProjectCrewMixAfsnDetailController
						layServ = $injector.get('basicsEfbsheetsCrewMixAfsnUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsEfbsheetsCrewMixAfsnUIStandardService';
						config.dataServiceName = 'basicsEfbsheetsCrewMixAfsnService';
						break;
					case '5fbf701267ea4e20b4723a7d46dbee24': // basicsEfbsheetsProjectCrewMixCostCodeController
						layServ = $injector.get('basicsEfbsheetsProjectCrewMixCostCodeUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsEfbsheetsProjectCrewMixCostCodeUIStandardService';
						config.dataServiceName = 'basicsEfbsheetsProjectCrewMixCostCodeService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '4e0ba68eb6a94cd7bcada61f767c9fae': // basicsEfbsheetsProjectCrewMixCostCodeDetailController
						layServ = $injector.get('basicsEfbsheetsProjectCrewMixCostCodeUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsEfbsheetsProjectCrewMixCostCodeUIStandardService';
						config.dataServiceName = 'basicsEfbsheetsProjectCrewMixCostCodeService';
						break;
					case guids.actionToList:
						config = platformLayoutHelperService.getStandardGridConfig(service.getActionServiceInfo());
						break;
					case guids.actionToDetails:
						config = platformLayoutHelperService.getStandardDetailConfig(service.getActionServiceInfo());
						break;
					case guids.biddingConsortiumList:
						config = platformLayoutHelperService.getStandardGridConfig(service.getBiddingConsortiumServiceInfo());
						break;
					case guids.biddingConsortiumDetails:
						config = platformLayoutHelperService.getStandardDetailConfig(service.getBiddingConsortiumServiceInfo());
						break;
					case guids.actionEmployeeList:
						config = platformLayoutHelperService.getStandardGridConfig(service.getActionEmployeeServiceInfo());
						break;
					case guids.actionEmployeeDetails:
						config = platformLayoutHelperService.getStandardDetailConfig(service.getActionEmployeeServiceInfo());
						break;
					case 'c163031647d6459288c5c43ed46cf6e8': // projectPlantAssemblyListController
						config = $injector.get('projectPlantassemblyContainerInformationService').getContainerInfoByGuid('c163031647d6459288c5c43ed46cf6e8');
						break;
					case 'f7b4578655914fbc85dc7f65c803cfd8': // projectPlantAssemblyDetailController
						config = $injector.get('projectPlantassemblyContainerInformationService').getContainerInfoByGuid('f7b4578655914fbc85dc7f65c803cfd8');
						break;

					case '323812e8f71549019915dbb494a65142': // project2SalesTaxCodeListController
						config = platformLayoutHelperService.getStandardGridConfig(service.getProject2SalesTaxCodeServiceInfo());
						break;
					case '7cb4984e06ba46a4bb64ff72d169d23b': // project2SalesTaxCodeDetailController
						config = platformLayoutHelperService.getStandardDetailConfig(service.getProject2SalesTaxCodeServiceInfo());
						break;
					case '08a1a648b75547dda3fa06bb151a1eee': // salesTaxMatrixListController
						config = platformLayoutHelperService.getStandardGridConfig(service.getSalesTaxMatrixServiceInfo());
						break;
					case 'fc8217925f694f2296112740a1aa8b1b': // salesTaxMatrixDetailController
						config = platformLayoutHelperService.getStandardDetailConfig(service.getSalesTaxMatrixServiceInfo());
						break;
					case 'bceaa9e8a4f04e5797e87871078e6edc': // estimateProjectClerkListController
						config = $injector.get('estimateProjectContainerInformationService').getContainerInfoByGuid('bceaa9e8a4f04e5797e87871078e6edc');
						break;
					case 'a8eceb9f41f8475fa35b876a642c22d5': // estimateProjectClerkDetailController
						config = $injector.get('estimateProjectContainerInformationService').getContainerInfoByGuid('a8eceb9f41f8475fa35b876a642c22d5');
						break;
					case '70ce0ba51f5545fdabb81be621cfa2c5': // modelProjectClerkListController
						config = $injector.get('modelProjectContainerInformationService').getContainerInfoByGuid('70ce0ba51f5545fdabb81be621cfa2c5');
						break;
					case '32942b95e0e441e392a69c73361023cb': // modelProjectClerkDetailController
						config = $injector.get('modelProjectContainerInformationService').getContainerInfoByGuid('32942b95e0e441e392a69c73361023cb');
						break;
					case guids.clerkRoleList:
						config = platformLayoutHelperService.getStandardGridConfig(service.getProjectMainClerkRoleServiceInfo());
						break;
					case guids.clerkRoleDetails:
						config = platformLayoutHelperService.getStandardDetailConfig(service.getProjectMainClerkRoleServiceInfo());
						break;
					case guids.clerkSiteList:
						config = platformLayoutHelperService.getStandardGridConfig(service.getProjectMainClerkSiteServiceInfo());
						break;
					case guids.clerkSiteDetails:
						config = platformLayoutHelperService.getStandardDetailConfig(service.getProjectMainClerkSiteServiceInfo());
						break;
					case guids.bizPartnerSiteList:
						config = platformLayoutHelperService.getStandardGridConfig(service.getProjectMainBusinessPartnerSiteServiceInfo());
						break;
					case guids.bizPartnerSiteDetails:
						config = platformLayoutHelperService.getStandardDetailConfig(service.getProjectMainBusinessPartnerSiteServiceInfo());
						break;
					case guids.timekeeping2ClerkList:
						config = platformLayoutHelperService.getStandardGridConfig(service.getProjectMainTimekeeping2ClerkServiceInfo());
						break;
					case guids.timekeeping2ClerkDetail:
						config = platformLayoutHelperService.getStandardDetailConfig(service.getProjectMainTimekeeping2ClerkServiceInfo());
						break;
					case projectMainConstantValues.uuid.container.activityList:
						config = platformLayoutHelperService.getStandardGridConfig(service.getActivityServiceInfos(),service.getActivityLayout);
						break;
					case projectMainConstantValues.uuid.container.activityDetails:
						config = platformLayoutHelperService.getStandardDetailConfig(service.getActivityServiceInfos(),service.getActivityLayout);
						break;
					case projectMainConstantValues.uuid.container.pictureList:
						config = platformLayoutHelperService.getStandardGridConfig(service.getProjectPictureServiceInfos(),service.getProjectPictureLayout);
						break;
					default:
						config = service.hasDynamic(guid) ? dynamicConfigurations[guid] : {};
						break;
				}
				return config;
			};

			service.getReleaseServiceInfo = function getReleaseServiceInfo() {
				return {
					standardConfigurationService: 'projectMainReleaseLayoutService',
					dataServiceName: 'projectMainReleaseDataService',
					validationServiceName: 'projectMainReleaseValidationService'
				};
			};

			service.getReleaseLayout = function getReleaseLayout() {
				var res = platformLayoutHelperService.getTwoGroupsBaseLayout('1.0.0', 'project.main.release',
					['commenttext', 'releasedate'],
					platformLayoutHelperService.getUserDefinedTextGroup(5, null, null, '0'));

				// res.overloads = platformLayoutHelperService.getOverloads(['skilltypefk', 'skillgroupfk'], self);
				res.addAdditionalColumns = true;

				return res;
			};

			service.getCostGroupCatalogServiceInfo = function getCostGroupCatalogServiceInfo() {
				return {
					standardConfigurationService: 'projectMainCostGroupCatalogLayoutService',
					dataServiceName: 'projectMainCostGroupCatalogDataService',
					validationServiceName: 'projectMainCostGroupCatalogValidationService'
				};
			};

			service.getCostGroupCatalogLayout = function getCostGroupCatalogLayout() {
				var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'project.main.costgroupcatalog',
					['code', 'descriptioninfo']);

				// res.overloads = platformLayoutHelperService.getOverloads(['fk'], self);
				res.addAdditionalColumns = true;

				return res;
			};

			service.getCostGroupServiceInfo = function getCostGroupServiceInfo() {
				return {
					standardConfigurationService: 'projectMainCostGroupLayoutService',
					dataServiceName: 'projectMainCostGroupDataService',
					validationServiceName: 'projectMainCostGroupValidationService'
				};
			};

			service.getCostGroupLayout = function getCostGroupLayout() {
				var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'project.main.costgroup',
					['code', 'descriptioninfo', 'quantity', 'uomfk', 'referencequantitycode', 'leadquantitycalc', 'noleadquantity']);

				res.overloads = platformLayoutHelperService.getOverloads(['code', 'uomfk'], service);

				return res;
			};

			service.getBillToServiceInfo = function getBillToServiceInfo() {
				return {
					standardConfigurationService: 'projectMainBillToLayoutService',
					dataServiceName: 'projectMainBillToDataService',
					validationServiceName: 'projectMainBillToValidationService'
				};
			};

			service.getBillToLayout = function getBillToLayout() {
				var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'project.main.billto',
					['code', 'description', 'comment', 'remark', 'businesspartnerfk', 'customerfk', 'quantityportion', 'totalquantity', 'subsidiaryfk']);

				res.overloads = platformLayoutHelperService.getOverloads(['customerfk'], service);
				res.overloads.totalquantity = {readonly: true};
				res.overloads.businesspartnerfk = service.getBusinessPartnerLookup('projectMainBillToDataService');
				res.overloads.subsidiaryfk = service.getSubsidiaryLookup();
				return res;
			};

			service.getActionServiceInfo = function getActionServiceInfo() {
				return {
					standardConfigurationService: 'projectMainActionLayoutService',
					dataServiceName: 'projectMainActionDataService',
					validationServiceName: 'projectMainActionValidationService'
				};
			};

			service.getActionLayout = function geActionLayout() {
				var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'project.main.action',
					['code', 'description', 'reference', 'controllingunitfk', 'logisticjobfk', 'activityfk', 'actiontypefk', 'comment', 'projectchangefk', 'remark', 'validfrom', 'validto', 'isactive', 'isdiaryrelevant', 'projectfk',
						'userdefinedtext01', 'userdefinedtext02', 'userdefinedtext03', 'userdefinedtext04', 'userdefinedtext05', 'userdefinednumber01', 'userdefinednumber02',
						'userdefinednumber03', 'userdefinednumber04', 'userdefinednumber05', 'userdefineddate01', 'userdefineddate02', 'userdefineddate03', 'userdefineddate04',
						'userdefineddate05','groupfk','employeegroupfk','professionalcategoryfk']);

				res.addAdditionalColumns = true;
				res.overloads = platformLayoutHelperService.getOverloads(['controllingunitfk', 'logisticjobfk', 'activityfk', 'actiontypefk', 'projectfk', 'projectchangefk','groupfk','employeegroupfk','professionalcategoryfk'], service);
				return res;
			};

			service.getActionEmployeeServiceInfo = function getActionEmployeeServiceInfo() {
				return {
					standardConfigurationService: 'projectMainActionEmployeeLayoutService',
					dataServiceName: 'projectMainActionEmployeeDataService',
					validationServiceName: 'projectMainActionEmployeeValidationService'
				};
			};

			service.getActionEmployeeLayout = function geActionEmployeeLayout() {
				var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'project.main.actionemployee',
					['employeefk', 'comment']);

				res.addAdditionalColumns = true;
				res.overloads = platformLayoutHelperService.getOverloads(['employeefk'], service);
				return res;
			};

			service.getBiddingConsortiumServiceInfo = function getBiddingConsortiumServiceInfo() {
				return {
					standardConfigurationService: 'projectMainBiddingConsortiumLayoutService',
					dataServiceName: 'projectMainBiddingConsortiumDataService',
					validationServiceName: 'projectMainBiddingConsortiumValidationService'
				};
			};

			service.getProjectMainBiddingConsortiumLayout = function getProjectMainBiddingConsortiumLayout() {
				var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'project.main.biddingconsortium',
					['description', 'comment', 'businesspartnerfk', 'subsidiaryfk', 'valuepercent']);

				res.overloads = platformLayoutHelperService.getOverloads(['subsidiaryfk'], service);
				res.overloads.businesspartnerfk = service.getBusinessPartnerLookup('projectMainBiddingConsortiumDataService');

				return res;
			};

			service.getProject2SalesTaxCodeServiceInfo = function getProject2SalesTaxCodeServiceInfo() {
				return {
					standardConfigurationService: 'project2SalesTaxCodeLayoutService',
					dataServiceName: 'project2SalesTaxCodeDataService',
					validationServiceName: ''
				};
			};

			service.getProject2SalesTaxCodeLayout = function getProject2SalesTaxCodeLayout() {
				let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'project.main.project2salestaxcode',
					['salestaxcodefk']);

				res.overloads = platformLayoutHelperService.getOverloads(['salestaxcodefk'], service);

				return res;
			};

			service.getSalesTaxMatrixServiceInfo = function getSalesTaxMatrixServiceInfo() {
				return {
					standardConfigurationService: 'salesTaxMatrixLayoutService',
					dataServiceName: 'salesTaxMatrixDataService',
					validationServiceName: 'projectMainSalesTaxMatrixValidationService'
				};
			};

			service.getSalesTaxMatrixLayout = function getSalesTaxMatrixLayout() {
				let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'project.main.salestaxmatrix',
					['salestaxgroupfk', 'prjtaxpercent', 'taxpercent']);

				res.overloads = platformLayoutHelperService.getOverloads(['salestaxgroupfk'], service);
				res.overloads.taxpercent = {readonly: true};
				return res;
			};

			service.getProjectMainClerkRoleServiceInfo = function getProjectMainClerkRoleServiceInfo() {
				return {
					standardConfigurationService: 'projectMainClerkRoleLayoutService',
					dataServiceName: 'projectMainClerkRoleDataService',
					validationServiceName: 'projectMainClerkRoleValidationService'
				};
			};

			service.getProjectMainClerkRoleLayout = function getProjectMainClerkRoleLayout() {
				let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'project.main.clerkrole',
					['comment', 'clerkfk', 'clerkrolefk', 'validfrom', 'validto', 'countryfk', 'addressfk', 'telephonenumberfk', 'telephonetelefaxfk',
						'telephonemobilfk', 'telephoneprivatfk', 'telephoneprivatmobilfk', 'email']);

				res.overloads = platformLayoutHelperService.getOverloads(['clerkfk', 'clerkrolefk', 'countryfk', 'addressfk', 'telephonenumberfk', 'telephonetelefaxfk',
					'telephonemobilfk', 'telephoneprivatfk', 'telephoneprivatmobilfk'], service);

				res.overloads.clerkrolefk.grid.requiredInErrorHandling = true;
				res.overloads.clerkrolefk.detail.requiredInErrorHandling = true;
				res.overloads.comment = { requiredInErrorHandling: true };

				return res;
			};

			service.getProjectMainClerkSiteServiceInfo = function getProjectMainClerkSiteServiceInfo() {
				return {
					standardConfigurationService: 'projectMainClerkSiteLayoutService',
					dataServiceName: 'projectMainClerkSiteDataService',
					validationServiceName: 'projectMainClerkSiteValidationService'
				};
			};

			service.getProjectMainClerkSiteLayout = function getProjectMainClerkSiteLayout() {
				let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'project.main.clerksite',
					['comment', 'remark', 'locationfk', 'assetmasterfk', 'countryfk', 'addressfk', 'telephonenumberfk', 'telephonetelefaxfk',
						'telephonemobilfk', 'telephoneprivatfk', 'telephoneprivatmobilfk', 'email']);

				res.overloads = platformLayoutHelperService.getOverloads(['locationfk', 'countryfk', 'assetmasterfk', 'addressfk', 'telephonenumberfk', 'telephonetelefaxfk',
					'telephonemobilfk', 'telephoneprivatfk', 'telephoneprivatmobilfk'], service);

				return res;
			};

			service.getProjectMainBusinessPartnerSiteServiceInfo = function getProjectMainBusinessPartnerSiteServiceInfo() {
				return {
					standardConfigurationService: 'projectMainBusinessPartnerSiteLayoutService',
					dataServiceName: 'projectMainBusinessPartnerSiteDataService',
					validationServiceName: 'projectMainBusinessPartnerSiteValidationService'
				};
			};

			service.getProjectMainBusinessPartnerSiteLayout = function getProjectMainBusinessPartnerSiteLayout() {
				let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'project.main.bizpartnersite',
					['businesspartnerfk', 'subsidiaryfk', 'comment', 'remark', 'locationfk', 'assetmasterfk', 'telephonenumberfk', 'email']);

				res.overloads = platformLayoutHelperService.getOverloads(['subsidiaryfk', 'locationfk', 'assetmasterfk', 'telephonenumberfk', 'email'], service);
				res.overloads.businesspartnerfk = service.getBusinessPartnerLookup('projectMainBusinessPartnerSiteDataService');

				return res;
			};

			service.getProjectMainTimekeeping2ClerkServiceInfo = function getProjectMainTimekeeping2ClerkServiceInfo() {
				return {
					standardConfigurationService: 'projectMainTimekeepingClerkLayoutService',
					dataServiceName: 'projectMainTimekeepingClerkDataService',
					validationServiceName: 'projectMainTimekeepingClerkValidationService'
				};
			};

			service.getProjectMainTimekeepingClerkLayoutService = function getProjectMainTimekeepingClerkLayoutService() {
				let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'project.main.timekeeping2clerk',
					['jobfk', 'clerkfk', 'clerkrolefk', 'commenttext']);

				res.overloads = platformLayoutHelperService.getOverloads(['jobfk', 'clerkfk', 'clerkrolefk'], service);
				return res;
			};

			service.getActivityLayout = function getActivityLayout() {
				let res = platformLayoutHelperService.getSimpleBaseLayout(
					'1.0.0',
					'project.main.activity',
					['businesspartnerfk', 'activitytypefk', 'activitydate', 'comment', 'clerkfk', 'remark', 'documenttypefk', 'documentname', 'documentdate', 'fromdate', 'contactfk', 'remindercyclefk', 'reminderfrequency', 'reminderstartdate', 'reminderenddate', 'remindernextdate', 'isfinished', 'originfilename']);
				res.overloads = platformLayoutHelperService.getOverloads(['businesspartnerfk', 'activitytypefk', 'clerkfk', 'documenttypefk', 'contactfk', 'remindercyclefk', 'originfilename'], service);
				return res;
			};
			service.getActivityServiceInfos = function getActivityServiceInfos() {
				return {
					standardConfigurationService: 'projectMainActivityLayoutService',
					dataServiceName: 'projectMainActivityDataService',
					validationServiceName: 'projectMainActivityValidationService'
				};
			};

			service.getProjectPictureServiceInfos = function getProjectPictureServiceInfos() {
				return {
					standardConfigurationService: 'projectMainPictureLayoutService',
					dataServiceName: 'projectMainPictureDataService',
					validationServiceName: 'projectMainPictureValidationService',
				};
			};

			service.getProjectPictureLayout = function getProjectPictureLayout() {
				return platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'project.main.picturelist', ['comment', 'picturedate', 'sorting', 'isdefault', 'ishiddeninpublicapi']);
			};

			service.getNavigatorFieldByGuid = function getNavigatorByGuid(guid) {
				var navInfo = null;

				switch (guid) {
					case guids.projectList:
						navInfo = {field: 'ProjectNo', navigator: {moduleName: 'project.main', targetIdProperty: 'Id'}};
						break;
					case guids.projectDetails:
						navInfo = {field: 'ProjectNo', navigator: {moduleName: 'project.main', targetIdProperty: 'Id'}};
						break;
				}

				return navInfo;
			};

			service.hasDynamic = function hasDynamic(guid) {
				return !_.isNull(dynamicConfigurations[guid]) && !_.isUndefined(dynamicConfigurations[guid]);
			};

			service.takeDynamic = function takeDynamic(guid, config) {
				dynamicConfigurations[guid] = config;
			};

			function getCustomerOverload() {
				return {
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'business-partner-main-customer-lookup',
							lookupOptions: {
								filterKey: 'project-main-bill-to-customer-filter'
							}
						},
						formatter: 'lookup',
						formatterOptions: {'lookupType': 'customer', 'displayMember': 'Code'},
						width: 125
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'business-partner-main-customer-lookup',
							descriptionField: 'CustomerDescription',
							descriptionMember: 'Description',
							lookupOptions: {
								filterKey: 'project-main-bill-to-customer-filter'
							}
						}
					}
				};
			}

			service.getBusinessPartnerLookup = function getBusinessPartnerLookup(dataServiceName) {
				let ovl = platformLayoutHelperService.provideBusinessPartnerLookupOverload();
				// detail
				ovl.detail.options.IsShowBranch = true;
				ovl.detail.options.mainService = dataServiceName;
				ovl.detail.options.BusinessPartnerField = 'BusinessPartnerFk';
				ovl.detail.options.SubsidiaryField = 'SubsidiaryFk';

				// grid
				ovl.grid.editorOptions.lookupOptions.IsShowBranch = true;
				ovl.grid.editorOptions.lookupOptions.mainService = dataServiceName;
				ovl.grid.editorOptions.lookupOptions.BusinessPartnerField = 'BusinessPartnerFk';
				ovl.grid.editorOptions.lookupOptions.SubsidiaryField = 'SubsidiaryFk';

				return ovl;
			};
			service.getSubsidiaryLookup = function getSubsidiaryLookup() {
				let ovl = {
					detail: {
						type: 'directive',
						directive: 'business-partner-main-subsidiary-lookup',
						options: {
							initValueField: 'SubsidiaryAddress',
							filterKey: 'project-main-bill-subsidiary-filter',
							showClearButton: true,
							displayMember: 'AddressLine'
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'business-partner-main-subsidiary-lookup',
							lookupOptions: {
								showClearButton: true,
								filterKey: 'project-main-bill-subsidiary-filter',
								displayMember: 'AddressLine'
							}
						},
						width: 125,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Subsidiary',
							displayMember: 'AddressLine'
						}
					}
				};
				return ovl;
			};

			function getChangeLookupOverload() {
				var lookupOptions = {
					additionalColumns: true,
					showClearButton: true,
					filterOptions: {
						serverKey: 'project-change-lookup-for-logistic-settlement-filter',
						serverSide: true,
						fn: function (dataContext) {
							return {
								ProjectFk: dataContext.ProjectFk
							};
						}
					},
					addGridColumns: [{
						id: 'description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'description',
						readonly: true
					}]
				};

				return {
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'project-change-dialog',
							descriptionMember: 'Description',
							lookupOptions: lookupOptions
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'project-change-dialog',
							lookupOptions: lookupOptions
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'projectchange',
							displayMember: 'Code'
						},
						width: 130
					}
				};
			}

			service.getOverload = function getOverload(overload) {
				var ovl = null;

				switch (overload) {
					case 'code':
						ovl = {
							detail: {maxLength: 32},
							grid: {maxLength: 32}
						};
						break;
					case 'addressfk':
						ovl = {
							detail: {
								type: 'directive',
								directive: 'basics-common-address-dialog',
								model: 'Address',
								options: {
									titleField: 'cloud.common.address',
									foreignKey: 'AddressFk',
									showClearButton: true
								}
							},
							grid: {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-common-address-dialog',
									lookupOptions: {
										foreignKey: 'AddressFk',
										titleField: 'cloud.common.address'
									}
								},
								formatter: 'description',
								field: 'Address',
								formatterOptions: {
									displayMember: 'Street'
								}
							}
						};
						break;
					case 'actiontypefk':
						ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectactiontype', 'Description');
						break;
					case 'activityfk':
						ovl = projectCommonLayoutOverloadService.getScheduleActivityLookupOverload();
						break;
					case 'assetmasterfk':
						ovl = {
							grid: {
								formatter: 'lookup',
								formatterOptions: {lookupType: 'AssertMaster', displayMember: 'Code'},
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-asset-master-dialog',
									lookupOptions: {
										showClearButton: true,
										additionalColumns: true,
										displayMember: 'Code',
										addGridColumns: [{
											id: 'Description',
											field: 'DescriptionInfo',
											name: 'Description',
											width: 300,
											formatter: 'translation',
											name$tr$: 'cloud.common.entityDescription'
										}]
									}
								},
								width: 150
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-asset-master-dialog',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {'showClearButton': true}
								}
							}
						};
						break;
					case 'clerkfk':
						ovl = platformLayoutHelperService.provideClerkLookupOverload(true, 'ClerkFk', 'basics-clerk-by-company-filter');
						break;
					case 'clerkrolefk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsCustomClerkRoleLookupDataService',
							enableCache: true,
							filterKey: 'project-clerk-role-by-is-for-project-filter'
						});
						break;


					// basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectactiontype', 'Description');
					case 'groupfk':
						ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepinggroup');
						break;
					case 'employeegroupfk':
						ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepingemployeegroup');
						break;
					case 'professionalcategoryfk':
						ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepingprofessionalcategory');
						break;

					case 'controllingunitfk':
						ovl = $injector.get('resourceCommonLayoutHelperService').provideControllingUnitOverload(true, 'etm-plant-controllingunit-project-context-filter');
						break;
					case 'countryfk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsCountryLookupDataService',
							enableCache: true
						});
						break;
					case 'customerfk':
						ovl = getCustomerOverload();
						break;
					case 'currencyfk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideCurrencyLookupSpecification());
						break;
					case 'employeefk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'timekeepingEmployeeLookupDataService'
						});
						break;
					case 'locationfk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectLocationLookupDataService',
							filter: function (item) {
								return item.ProjectFk;
							}
						}, {
							doesDependOn: 'ProjectFk'
						});
						break;
					case 'jobfk':
						ovl = platformLayoutHelperService.provideJobLookupOverload({projectFk: 'ProjectFk', projectFkReadOnly: true});
						break;
					case 'logisticjobfk':
						ovl = platformLayoutHelperService.provideJobLookupOverload();
						break;
					case 'projectchangefk':
						ovl = getChangeLookupOverload();
						break;
					case 'projectfk':
						ovl = platformLayoutHelperService.provideProjectLookupReadOnlyOverload();
						break;
					case 'salestaxcodefk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'salesTaxCodeLookupDataService',
							cacheEnable: true
						});
						break;
					case 'salestaxgroupfk':
						ovl = {
							detail: {
								type: 'directive',
								directive: 'basics-sales-tax-group-lookup',
								options: {
									// initValueField: 'SubsidiaryAddress',
									filterKey: 'sales-tax-group-filter',
									showClearButton: true,
									displayMember: 'Code'
								}
							},
							grid: {
								editor: 'lookup',
								directive: 'basics-lookupdata-lookup-composite',
								editorOptions: {
									lookupType: 'SalesTaxGroup',
									lookupDirective: 'basics-sales-tax-group-lookup',
									displayMember: 'Code',
									lookupOptions: {
										showClearButton: true,
										filterKey: 'sales-tax-group-filter'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'SalesTaxGroup',
									displayMember: 'Code'
								}
							}
						};
						break;
					case 'subsidiaryfk':
						ovl = {
							detail: {
								type: 'directive',
								directive: 'business-partner-main-subsidiary-lookup',
								options: {
									initValueField: 'SubsidiaryAddress',
									filterKey: 'project-main-project-subsidiary-filter',
									showClearButton: true,
									displayMember: 'AddressLine'
								}
							},
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'business-partner-main-subsidiary-lookup',
									lookupOptions: {
										showClearButton: true,
										filterKey: 'project-main-project-subsidiary-filter',
										displayMember: 'AddressLine'
									}
								},
								width: 125,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Subsidiary',
									displayMember: 'AddressLine'
								}
							}
						};
						break;
					case 'telephonenumberfk':
						ovl = {
							detail: {
								type: 'directive',
								directive: 'basics-common-telephone-dialog',
								model: 'TelephoneNumber',
								options: {
									titleField: 'cloud.common.TelephoneDialogPhoneNumber',
									foreignKey: 'TelephoneNumberFk',
									showClearButton: true
								}
							}, grid: {
								editor: 'lookup',
								field: 'TelephoneNumber',
								editorOptions: {
									lookupDirective: 'basics-common-telephone-dialog',
									lookupOptions: {
										foreignKey: 'TelephoneNumberFk',
										titleField: 'cloud.common.TelephoneDialogPhoneNumber'
									}
								},
								formatter: basicsCommonComplexFormatter,
								formatterOptions: {
									displayMember: 'Telephone',
									domainType: 'phone'
								}
							}
						};
						break;
					case 'telephonetelefaxfk':
						ovl = {
							detail: {
								type: 'directive',
								directive: 'basics-common-telephone-dialog',
								model: 'TelephoneNumberTelefax',
								options: {
									titleField: 'cloud.common.fax',
									foreignKey: 'TelephoneTelefaxFk',
									showClearButton: true
								}
							},
							grid: {
								editor: 'lookup',
								field: 'TelephoneNumberTelefax',
								editorOptions: {
									lookupDirective: 'basics-common-telephone-dialog',
									lookupOptions: {
										foreignKey: 'TelephoneTelefaxFk',
										titleField: 'cloud.common.fax'
									}
								},
								formatter: basicsCommonComplexFormatter,
								formatterOptions: {
									displayMember: 'Telephone',
									domainType: 'phone'
								}
							}
						};
						break;
					case 'telephonemobilfk':
						ovl = {
							detail: {
								type: 'directive',
								directive: 'basics-common-telephone-dialog',
								model: 'TelephoneMobil',
								options: {
									titleField: 'cloud.common.mobile',
									foreignKey: 'TelephoneMobilFk',
									showClearButton: true
								}
							},
							grid: {
								editor: 'lookup',
								field: 'TelephoneMobil',
								editorOptions: {
									lookupDirective: 'basics-common-telephone-dialog',
									lookupOptions: {
										foreignKey: 'TelephoneMobilFk',
										titleField: 'cloud.common.mobile'
									}
								},
								formatter: basicsCommonComplexFormatter,
								formatterOptions: {
									displayMember: 'Telephone',
									domainType: 'phone'
								}
							}
						};
						break;
					case 'telephoneprivatfk':
						ovl = {
							detail: {
								type: 'directive',
								directive: 'basics-common-telephone-dialog',
								model: 'TelephonePrivat',
								options: {
									titleField: 'cloud.common.telephonePrivat',
									foreignKey: 'TelephonePrivatFk',
									showClearButton: true
								}
							},
							grid: {
								editor: 'lookup',
								field: 'TelephonePrivat',
								editorOptions: {
									lookupDirective: 'basics-common-telephone-dialog',
									lookupOptions: {
										foreignKey: 'TelephonePrivatFk',
										titleField: 'cloud.common.telephonePrivat'
									}
								},
								formatter: basicsCommonComplexFormatter,
								formatterOptions: {
									displayMember: 'Telephone',
									domainType: 'phone'
								}
							}
						};
						break;
					case 'telephoneprivatmobilfk':
						ovl = {
							detail: {
								type: 'directive',
								directive: 'basics-common-telephone-dialog',
								model: 'TelephonePrivatMobil',
								options: {
									titleField: 'cloud.common.privatMobil',
									foreignKey: 'TelephonePrivatMobilFk',
									showClearButton: true
								}
							},
							grid: {
								editor: 'lookup',
								field: 'TelephonePrivatMobil',
								editorOptions: {
									lookupDirective: 'basics-common-telephone-dialog',
									lookupOptions: {
										foreignKey: 'TelephonePrivatMobilFk',
										titleField: 'cloud.common.privatMobil'
									}
								},
								formatter: basicsCommonComplexFormatter,
								formatterOptions: {
									displayMember: 'Telephone',
									domainType: 'phone'
								}
							}
						};
						break;
					case 'uomfk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideUoMLookupSpecification());
						break;
					case 'remindercyclefk':
						ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.remindercycle', null, {showClearButton: false});
						break;
					case 'activitytypefk':
						ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectactivitytype');
						break;
					case 'documenttypefk':
						ovl = platformLayoutHelperService.provideDocumentTypeOverload();
						break
					case 'companyresponsiblefk':
						ovl = platformLayoutHelperService.provideCompanyLookupOverload();
						break;
					case 'companyfk':
						ovl = platformLayoutHelperService.provideCompanyLookupOverload();
						break;
					case 'businesspartnerfk':
						ovl = platformLayoutHelperService.provideBusinessPartnerLookupOverload();
						break;
					case 'contactfk':
						ovl = platformLayoutHelperService.provideContactOverload();
						break;
					case 'originfilename':
						ovl = { readonly: true }
							break;
				}

				return ovl;
			};

			return service;
		}
	]);
})(angular);
