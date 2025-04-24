(function () {

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	'use strict';
	var moduleName = 'constructionsystem.main';

	/**
     * @ngdoc service
     * @name constructionsystemMainResourceConfigurationService
     * @function
     *
     * @description
     * constructionsystemMainResourceConfigurationService is the config service for all estimate views.
     */
	angular.module(moduleName).factory('constructionsystemMainResourceConfigurationService', [
		'$injector','basicsLookupdataConfigGenerator',
		function ($injector,basicsLookupdataConfigGenerator) {

			var addColumns = [{
				id: 'Description',
				field: 'DescriptionInfo',
				name: 'Description',
				width: 300,
				formatter: 'translation',
				name$tr$: 'cloud.common.entityDescription'
			}];

			return {
				getEstimateMainResourceDetailLayout: function () {
					return {
						'fid': 'estimate.main.resource.detailform',
						'version': '1.0.0',
						'showGrouping': true,
						'addValidationAutomatically': true,
						'groups': [
							{
								'gid': 'basicData',
								'attributes': ['estresourcetypeshortkey', 'code', 'descriptioninfo', 'descriptioninfo1', 'basuomfk', 'bascurrencyfk', 'estcosttypefk', 'estresourceflagfk', 'sorting', 'budgetunit', 'budget', 'lgmjobfk', 'budgetdifference']
							},
							{
								'gid': 'ruleInfo',
								'attributes': ['ruletype', 'rulecode', 'ruledescription', 'evalsequencefk', 'elementcode', 'elementdescription']
							},
							{
								'gid': 'quantiyAndFactors',
								'attributes': [ 'quantitydetail', 'quantity',  'quantityfactordetail1', 'quantityfactor1', 'quantityfactordetail2', 'quantityfactor2',
									'quantityfactor3', 'quantityfactor4', 'productivityfactordetail', 'productivityfactor', 'efficiencyfactordetail1', 'efficiencyfactor1',
									'efficiencyfactordetail2', 'efficiencyfactor2', 'quantityfactorcc', 'quantityreal', 'quantityinternal', 'quantityunittarget', 'quantitytotal', 'quantityoriginal']
							},
							{
								'gid': 'costFactors',
								'attributes': ['costfactordetail1', 'costfactor1', 'costfactordetail2', 'costfactor2', 'costfactorcc']
							},
							{
								'gid': 'costAndHours',
								'attributes': ['costunit', 'costunitsubitem', 'costunitlineitem', 'costunittarget', 'costunitoriginal', 'costtotal', 'hoursunit', 'hourfactor', 'hoursunitsubitem', 'hoursunitlineitem',
									'hoursunittarget', 'hourstotal', 'dayworkrateunit', 'dayworkratetotal']
							},
							{
								'gid': 'flags',
								'attributes': ['islumpsum', 'isdisabled', 'isindirectcost', 'isdisabledprc', 'isgeneratedprc', 'isfixedbudget']
							},
							{
								'gid': 'package',
								'attributes': ['prcstructurefk']
							},
							{
								'gid': 'comment',
								'attributes': ['commenttext']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],

						'overloads': {
							'code': {
								'readonly': false,
								'detail': {
									type: 'directive',
									directive: 'estimate-main-resource-code-lookup',
									options: {
										showClearButton: true,
										lookupField: 'Code',
										gridOptions: {
											multiSelect: false
										},
										isTextEditable: true,
										grid: false,

									}
								},
								'grid': {
									editor: 'directive',
									editorOptions: {
										showClearButton: true,
										directive: 'estimate-main-resource-code-lookup',
										lookupField: 'Code',
										gridOptions: {
											multiSelect: true
										},
										isTextEditable: true,
										grid: true
									}
								}
							},
							'descriptioninfo': {
								'detail': {
									type: 'directive',
									directive: 'estimate-main-resource-code-lookup',
									options: {
										showClearButton: true,
										lookupField: 'DescriptionInfo.Translated',
										gridOptions: {
											multiSelect: false
										},
										DisplayMember: 'DescriptionInfo.Translated',
										isTextEditable: true,
										grid: false
									},
									editor: 'directive',
									editorOptions: {
										showClearButton: true,
										directive: 'estimate-main-resource-code-lookup',
										lookupField: 'DescriptionInfo.Translated',
										gridOptions: {
											multiSelect: true
										},
										isTextEditable: true,
										grid: true
									},
									bulkSupport: false,
									readonly: false
								},
								'grid': {
									editor: 'directive',
									editorOptions: {
										showClearButton: true,
										directive: 'estimate-main-resource-code-lookup',
										lookupField: 'DescriptionInfo.Translated',
										gridOptions: {
											multiSelect: true
										},
										isTextEditable: true,
										grid: true
									},
									bulkSupport: false
								}
							},
							'descriptioninfo1':{
								maxLength : 255
							},
							'lgmjobfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'estimateMainJobLookupByProjectDataService',
								cacheEnable: true,
								additionalColumns: false,
								filter: function () {
									return  $injector.get('constructionSystemMainInstanceService').getCurrentSelectedProjectId();

								}
							}),
							'hourfactor' : {'readonly': true},
							'quantitydetail':{'readonly': false},
							'quantityfactordetail1':{'readonly': false},
							'quantityfactordetail2':{'readonly': false},
							'productivityfactordetail':{'readonly': false},
							'costfactordetail1':{'readonly': false},
							'costfactordetail2':{'readonly': false},
							'efficiencyfactordetail1':{'readonly': false},
							'efficiencyfactordetail2':{'readonly': false},
							'quantityunittarget': {'readonly': false},
							'quantitytotal': {'readonly': true},
							'quantityoriginal': {'readonly': true},
							'costunittarget': {'readonly': true},
							'costunitoriginal': {'readonly': true},
							'costtotal': {'readonly': true},
							'hoursunit': {'readonly': true},
							'hoursunittarget': {'readonly': true},
							'hoursunitsubitem': {'readonly': true},
							'hoursunitlineitem': {'readonly': true},
							'hourstotal': {'readonly': true},
							'quantityfactorcc': {'readonly': true},
							'costfactorcc': {'readonly': true},
							'quantityreal': {'readonly': true},
							'quantityinternal': {'readonly': true},
							'costunitsubitem': {'readonly': true},
							'costunitlineitem': {'readonly': true},
							'ruletype': {'readonly': true},
							'rulecode': {'readonly': true},
							'ruledescription': {'readonly': true},
							'elementcode': {'readonly': true},
							'elementdescription': {'readonly': true},
							'dayworkratetotal': {'readonly': true},
							'dayworkrateunit': {'readonly': true},
							'costunit': {
								'readonly':true,
								'formatter': function (row, cell, value, columnDef, dataContext) {
									var formattedValue = '';
									formattedValue = $injector.get('platformGridDomainService').formatter('money')(0, 0, value, {});

									if (dataContext.CostUnitOriginal !== undefined && dataContext.CostUnit !== dataContext.CostUnitOriginal) {
										formattedValue = '<div class="text-right" style="color:red;">' + formattedValue + '</div>';
									}
									else {
										formattedValue = '<div class="text-right">' + formattedValue + '</div>';
									}
									return formattedValue;
								}
							},
							'quantity': {
								'formatter': function (row, cell, value, columnDef, dataContext) {
									var formattedValue = '';
									formattedValue = $injector.get('platformGridDomainService').formatter('quantity')(0, 0, value, {});

									if (dataContext.QuantityOriginal !== undefined  && dataContext.Quantity !== dataContext.QuantityOriginal) {
										formattedValue = '<div class="text-right" style="color:red;">' + formattedValue + '</div>';
									}else {
										formattedValue = '<div class="text-right">' + formattedValue + '</div>';
									}
									return formattedValue;
								}
							},
							// removed read-only attribute by defect #82470
							// 'quantityfactor1': {'readonly': true},
							// 'quantityfactor2': {'readonly': true},
							// 'quantityfactor3': {'readonly': true},
							// 'quantityfactor4': {'readonly': true},
							// 'costfactor1': {'readonly': true},
							// 'costfactor2': {'readonly': true},
							// 'productivityfactor': {'readonly': true},
							// 'efficiencyfactor1': {'readonly': true},
							// 'efficiencyfactor2': {'readonly': true},

							'evalsequencefk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('estimate.lookup.evaluationSequence', 'Description'),
							'estresourcetypeshortkey': {
								'grid': {
									editor: 'directive',
									editorOptions: {
										directive: 'estimate-main-resource-type-lookup',
										lookupOptions: {
											'showClearButton': true,
											'additionalColumns': true,
											'displayMember': 'ShortKeyInfo.Translated'
										}
									},
									formatter: function (row, cell, value, columnDef, entity) {
										let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
										if (platformRuntimeDataService.hasError(entity, columnDef.field)) {
											let errorMessage = platformRuntimeDataService.getErrorText(entity, columnDef.field);
											value = _.isEmpty(value) ? '' : value;
											return '<div class="invalid-cell" title="' + errorMessage + '">' + value + '</div>';
										}

										let resTypes = $injector.get('estimateMainResourceTypeLookupService').getList();

										let selectedItem = _.find(resTypes, function(resType){
											return entity.EstResourceTypeFk === resType.EstResourceTypeFk &&
												(entity.EstAssemblyTypeFk ? entity.EstAssemblyTypeFk === resType.EstAssemblyTypeFk : !_.isNumber(resType.EstAssemblyTypeFk)) &&
												(entity.EstResKindFk ? entity.EstResKindFk === resType.EstResKindFk : !_.isNumber(resType.EstResKindFk));});

										entity[columnDef.field] = selectedItem && selectedItem.ShortKeyInfo ? selectedItem.ShortKeyInfo.Translated : '';

										return entity[columnDef.field];
									},
									formatterOptions: {
										lookupType: 'resourcetype',
										displayMember: 'ShortKeyInfo.Translated',
										dataServiceName: 'estimateMainResourceTypeLookupService'
									}
								},
								'detail': {
									'type': 'directive',
									'directive': 'estimate-main-resource-type-lookup',
									'options': {
										'lookupDirective': 'estimate-main-resource-type-lookup',
										'descriptionField': 'ShortKeyInfo',
										'descriptionMember': 'ShortKeyInfo.Translated',
										'lookupOptions': {
											'initValueField': 'ShortKeyInfo'
										}
									}
								}
							},

							'bascurrencyfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCurrencyLookupDataService',
								enableCache: true,
								readonly: false
							}),
							'basuomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitLookupDataService',
								cacheEnable: true
							}, {required: false}),
							 'prcstructurefk': {
								 'readonly': false,
								 'grid': {
									 'editor': 'lookup',
									 'editorOptions': {
										 'directive': 'basics-procurementstructure-structure-dialog',
										 'lookupOptions': {
											 'additionalColumns': true,
											 'displayMember': 'Code',
											 'addGridColumns': addColumns
										 }
									 },
									 'formatter': 'lookup',
									 'formatterOptions': {
										 'lookupType': 'prcstructure',
										 'displayMember': 'Code'
									 }
								 },
								 'detail': {
									 'type': 'directive',
									 'directive': 'basics-lookupdata-lookup-composite',
									 'options': {
										 'lookupDirective': 'basics-procurementstructure-structure-dialog',
										 'descriptionField': 'StructureDescription',
										 'descriptionMember': 'DescriptionInfo.Translated',
										 'lookupOptions': {
											 'initValueField': 'StructureCode',
											 'showClearButton': true
										 }
									 }
								 }
							 },
							'estcosttypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('estimate.lookup.costtype', 'Description'),

							'estresourceflagfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('estimate.lookup.resourceflag', 'Description')
						},
						'addition': {
							grid: [
								{
									'afterId': 'estresourcetypeshortkey',
									'id': 'estresourcetypeshortkeydescription',
									'field': 'EstResourceTypeFkExtend',
									name: 'Description',
									width: 120,
									formatter: 'lookup',
									name$tr$: 'estimate.main.estResourceTypeDescription',
									'sortable': true,
									'readonly': true,
									'directive': 'estimate-main-resource-type-lookup',
									formatterOptions: {
										lookupType: 'resourcetype',
										displayMember: 'DescriptionInfo.Translated',
										dataServiceName: 'estimateMainResourceTypeLookupService'
									}
								}
							]
						}
					};
				}


			};
		}
	]);
})();