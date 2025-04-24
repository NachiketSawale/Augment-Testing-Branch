(function () {
	/* global globals, _ */
	'use strict';

	/*
	 ** BoQ Main module is created.
	 */
	angular.module('boq.main', ['project.structures']);
	globals.modules.push('boq.main');

	/*
	 ** Boq states are defined in this config block.
	 */
	/**
	 * @ngdoc textAngular decorator in config
	 * @name taOptions
	 * @function
	 *
	 * @description
	 * Decorator to register Custom tools of textAngular rich text control .
	 * Includes the Custom Tools to Toolbar.
	 */
	angular.module('boq.main')
		.config(['mainViewServiceProvider',
			function (platformLayoutService) {
				platformLayoutService.registerModule({
					'moduleName': 'boq.main',
					'resolve': {
						'loadDomains': ['platformSchemaService', 'boqMainSchemaService', function(platformSchemaService, boqMainSchemaService) {
							var schemas = boqMainSchemaService.getSchemas();

							schemas.push({moduleSubModule:'Mtwo.ControlTower', typeName: 'MtoPowerbiDto'});
							schemas.push({moduleSubModule:'Mtwo.ControlTower', typeName: 'MtoPowerbiitemDto'});
							schemas.push({moduleSubModule:'Qto.Main',          typeName: 'QtoDetailDto'});
							schemas.push({moduleSubModule:'Estimate.Main',     typeName: 'EstLineItemDto'});
							schemas.push({moduleSubModule:'Estimate.Main',     typeName: 'EstResourceDto'});

							return platformSchemaService.getSchemas(schemas);
						}],
						'loadLookup': ['basicsLookupdataLookupDefinitionService', function (basicsLookupdataLookupDefinitionService) {
							return basicsLookupdataLookupDefinitionService.load([
								'boqMainTextComplementCombobox',
								'boqMainCatalogAssignmentModeCombobox',
								'boqMainCatalogAssignmentGaebTypeCombobox',
								'estimateMainAssemblyTemplateLookup',
								'boqMainCatalogAssignCostgroupCombobox'
							]);
						}],
						'loadSystemOption':['basicCustomizeSystemoptionLookupDataService', function(basicCustomizeSystemoptionLookupDataService) {
							basicCustomizeSystemoptionLookupDataService.getList();
						}],
						'registerWizards': ['basicsConfigWizardSidebarService', function (wizardService) {

							var wizardData = [{
								serviceName: 'boqMainWizardService',
								wizardGuid: 'F8A13E7C7B834F33AF7FE5E4351A40A4',
								methodName: 'gaebImport',
								canActivate: true
							},
							{
								serviceName: 'boqMainWizardService',
								wizardGuid: 'A64400C91A9F4E92B4668F241D7F0F95',
								methodName: 'gaebExport',
								canActivate: true
							},
							{
								serviceName: 'boqMainWizardService',
								wizardGuid: 'ed5100547c6349e68b7cf92f4030ff37',
								methodName: 'excelImport',
								canActivate: true
							},
							{
								serviceName: 'boqMainWizardService',
								wizardGuid: '37b726a2ed9442f4ad3b39a858fe1509',
								methodName: 'excelExport',
								canActivate: true
							},
							{
								serviceName: 'boqMainWizardService',
								wizardGuid: '73C24BADB3AC407B893F1EDE70095A2B',
								methodName: 'renumBoq',
								canActivate: true
							},
							{
								serviceName: 'boqMainWizardService',
								wizardGuid: '13079738AD694D54B563D8FDC1BDB690',
								methodName: 'renumberFreeBoq',
								canActivate: true
							},
							{
								serviceName: 'boqMainWizardService',
								wizardGuid: 'a63da5e93d0e46a096e282fe35f41357',
								methodName: 'selectGroups',
								canActivate: true
							},
							{
								serviceName: 'boqMainWizardService',
								wizardGuid: '8D1C632537A1479D84943F7DED47F64A',// generated from database
								methodName: 'generateWicNumber',
								canActivate: true
							},
							{
								serviceName: 'boqMainWizardService',
								wizardGuid: 'C88B3BD481524814BDEAC60DC52D6D5B',// Update Data from WIC
								methodName: 'updateDatafromWIC',
								canActivate: true
							},
							{
								serviceName: 'boqMainWizardService',
								wizardGuid: '4626490160134270b69962eee026e817',
								methodName: 'scanBoq',
								canActivate: true
							},
							{
								serviceName: 'boqMainWizardService',
								wizardGuid: '2664f8902215459988cf49ca2fe27f6e',
								methodName: 'splitUrbItems',
								canActivate: true
							},
							{
								serviceName: 'boqMainWizardService',
								wizardGuid: 'dc1f30673d25402f8791e854962aef72',
								methodName: 'importOenOnlv',
								canActivate: true
							},
							{
								serviceName: 'boqMainWizardService',
								wizardGuid: '244e3ab2210a4f55a10f9561b8a63b89',
								methodName: 'exportOenOnlv',
								canActivate: true
							},
							{
								serviceName: 'boqMainWizardService',
								wizardGuid: '7da9e692d3164c4685b2be1999cfd438',
								methodName: 'exportOenOnlb',
								canActivate: true
							},
							{
								serviceName: 'boqMainWizardService',
								wizardGuid: 'e941741d309c478b8b7de63f84aa29eb',
								methodName: 'importCrbSia',
								canActivate: true
							},
							{
								serviceName: 'boqMainWizardService',
								wizardGuid: '3bfaa21822c140e78d1806e3130b2e7b',
								methodName: 'exportCrbSia',
								canActivate: true
							},
							{
								serviceName: 'boqMainWizardService',
								wizardGuid: 'dba80f3d3f31423ba1ac7674a9362ecf',
								methodName: 'updateBoq',
								canActivate: true
							},
							{
								serviceName: 'boqMainWizardService',
								wizardGuid: '2d61b03531c448c38e22137e423182b5',
								methodName: 'startQuantityInspector',
								canActivate: true
							},
							{
								serviceName: 'boqMainWizardService',
								wizardGuid: '8747E866890448B495422D1887554C25',
								methodName: 'eraseEmptyDivisions',
								canActivate: true
							},
							{
								serviceName: 'boqMainWizardService',
								wizardGuid: '04d2c4698ca44fe5894270b7e5d250a1',
								methodName: 'resetServiceCatalogNo',
								canActivate: true
							},
							{
								serviceName: 'boqMainWizardService',
								wizardGuid: 'ad834ca75a4840cdbeafd9a1ca1eef69',
								methodName: 'updateEstimate',
								canActivate: true
							},
							{
								serviceName: 'boqMainWizardService',
								wizardGuid: 'C29DD6F35A014C23ACE7468264A86469',
								methodName: 'formatBoQSpecification',
								canActivate: true
							},
							{
								serviceName: 'boqMainWizardService',
								wizardGuid: '6c6e9a4864c94dd4be1f9a294f925be2',
								methodName: 'generateSplitQuantitiesWithBillToAssignment',
								canActivate: true
							},
							{
								serviceName: 'boqMainWizardService',
								wizardGuid: '3dd1c55434164868a95ecb5c4cd3cb8f',
								methodName: 'billToWizard',
								canActivate: true
							}
								];
							wizardService.registerWizard(wizardData);
						}]
					}
				});
			}
		]).run(['$injector', 'platformModuleNavigationService', 'basicsConfigWizardSidebarService',
			function ($injector, naviService/* , wizardService */) {

				naviService.registerNavigationEndpoint(
					{
						moduleName: 'boq.main',
						navFunc: function (item, triggerField) {

							var boqMainService = $injector.get('boqMainService');
							boqMainService.setBoq(item, triggerField).then(function () {
								navToBoqItem();
							});

							function navToBoqItem() {
							// var boqItemViews = ['1', '5'];

								var boqItemFk = item.Id;  // from boq container
								if (item && triggerField.NavigatorFrom === 'BoqItemNavigator') {  // from estimate boq container
									boqItemFk = item.Id;
								} else if (item && triggerField.NavigatorFrom === 'EstBoqItemNavigator') {  // from estLine item list container
									boqItemFk = item.BoqItemFk;
								} else if (triggerField.NavigatorFrom === 'WicBoqItemNavigator') {
									boqItemFk = item.WicBoqItemFk;
								} else if (triggerField === 'Ids'){
									const ids = item.Ids.split(',').map(e => parseInt(e));
									item = { Id: ids[0] };
									boqItemFk = item.Id;
								}

								var boqItemSelected = boqMainService.getBoqItemById(boqItemFk);
								if (boqItemSelected) {
									boqMainService.setSelected(boqItemSelected);
								}
							}

							// init the master filter data
							if (item && item.BoqRootItem && !item.BoqRootItem.IsWicItem && item.Boq && item.Boq.PrjProjectFk) {
								var estimateProjectRateBookConfigDataService = $injector.get('estimateProjectRateBookConfigDataService');
								estimateProjectRateBookConfigDataService.initData(item.Boq.PrjProjectFk);
							}
						}
					}
				);
			}]);

	angular.module('boq.main').factory('boqMainSchemaService', [
		function () {
			var service = {};

			service.getSchemas = function() {
				var boqDtos = [];
				var boqSchemas = [];

				boqDtos.push('BoqItemDto');
				boqDtos.push('BoqHeaderDto');
				boqDtos.push('BoqTextComplementDto');
				boqDtos.push('BoqSplitQuantityDto');
				boqDtos.push('BoqWic2assemblyDto');
				boqDtos.push('BoqPriceconditionDto');
				boqDtos.push('BoqTextConfigurationDto');
				boqDtos.push('BoqItemDocumentDto');
				boqDtos.push('BoqBillToDto');

				boqDtos.push('CrbBoqItemDto');
				boqDtos.push('CrbBoqVariableDto');
				boqDtos.push('CrbPriceconditionDto');
				boqDtos.push('CrbPriceconditionScopeDto');
				boqDtos.push('CrbBoqItemScopeDto');

				boqDtos.push('OenBoqItemDto');
				boqDtos.push('OenLbMetadataDto');
				boqDtos.push('OenContactDto');
				boqDtos.push('OenLvHeaderDto');
				boqDtos.push('OenZzDto');
				boqDtos.push('OenZzVariantDto');
				boqDtos.push('OenAkzDto');
				boqDtos.push('OenServicePartDto');
				boqDtos.push('OenParamListDto');
				boqDtos.push('OenParamSetDto');
				boqDtos.push('OenParamDto');
				boqDtos.push('OenParamHeadlineDto');
				boqDtos.push('OenParamValueListDto');
				boqDtos.push('OenParamValueDto');
				boqDtos.push('BoqItemSubPriceDto');

				_.forEach(boqDtos, function(boqDto) {
					boqSchemas.push({ moduleSubModule:'Boq.Main', typeName:boqDto});
				});

				return boqSchemas;
			};

			return service;
		}
	]);

})();
