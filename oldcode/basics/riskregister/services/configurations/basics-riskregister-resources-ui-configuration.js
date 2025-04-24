(function (angular) {
	/*global angular,_*/
	'use strict';
	var moduleName = 'basics.riskregister';
	angular.module(moduleName).service('basicsRiskregisterResourcesUIConfiguration', [
		'$injector',
		function ($injector) {
			return {
				'fid': 'basics.riskregister.resource.detailform',
				'version': '1.0.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': [ 'estresourcetypefk','code','descriptioninfo','weightedvalue']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'overloads': {
					'code': {
						navigator: {
							moduleName: 'basics.costcodes',
							'navFunc': function (fieldConfig, item) {
								if (item && item.EstResourceTypeFk) {
									switch (item.EstResourceTypeFk) {
										case 1: // cost codes
											$injector.get('platformModuleNavigationService').navigate({moduleName: 'basics.costcodes'}, {Id : item.MdcCostCodeFk}, fieldConfig.field);
											break;
										case 2: // material
											$injector.get('platformModuleNavigationService').navigate({moduleName: 'basics.material'}, item, fieldConfig.field);
											break;
										case 3: // plant
											break;
										case 4: // assembly
											$injector.get('platformModuleNavigationService').navigate({moduleName: 'estimate.assemblies'}, item, 'EstAssemblyFk');
											break;
									}
								}
							}
						},
						'detail': {
							type: 'directive',
							directive: 'estimate-main-resource-code-lookup',
							options: {
								showClearButton: true,
								lookupField: 'Code',
								gridOptions: {
									multiSelect: false
								},
								isTextEditable: false,
								grid: false
							}
						},
						'grid': {
							editor: 'directive',
							editorOptions: {
								showClearButton: true,
								directive: 'estimate-main-resource-code-lookup',
								lookupField: 'Code',
								/*lookupOptions:{
									displayMember:'DescriptionInfo.Translated',
									'additionalColumns':true,
									'addGridColumns':[
										{
											id: 'Description',
											field: 'DescriptionInfo',
											name: 'Description',
											grouping:true,
											width: 300,
											formatter: 'translation',
											name$tr$: 'cloud.common.entityDescription'
										}
									]
								},*/
								gridOptions: {
									multiSelect: true
								},
								isTextEditable: false,
								grid: true
							},
							formatter: function(row, cell, value, columnDef, entity){
								var platformRuntimeDataService = $injector.get('platformRuntimeDataService');
								if (platformRuntimeDataService.hasError(entity, columnDef.field)){
									var errorMessage = platformRuntimeDataService.getErrorText(entity, columnDef.field);
									value = _.isEmpty(value) ? '' : value;
									return '<div class="invalid-cell" title="' + errorMessage + '">' + value +'</div>';
								}else{
									var resTypesRequired = [1, 2, 4, 5];
									if ((resTypesRequired.indexOf(entity.EstResourceTypeFk) > -1) && (_.isNull(value) || _.isUndefined(value) || (_.isString(value) && !value.length))){
										return '<div class="required-cell"></div>';
									}
								}

								return value;
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
								isTextEditable: false,
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
								isTextEditable: false,
								grid: true
							},
							bulkSupport: false
						},
						'grid': {
							editor: 'directive',
							editorOptions: {
								showClearButton: true,
								directive: 'estimate-main-resource-code-lookup',
								lookupField: 'DescriptionInfo.Translated',
								gridOptions: {
									multiSelect: true,
									DisplayMember: 'DescriptionInfo.Translated'
								},
								isTextEditable: false,
								DisplayMember: 'DescriptionInfo.Translated',
								grid: true
							},
							formatter: 'translation',
							bulkSupport: false
						}
					},
					'estresourcetypefk': {
						'grid': {
							editor: 'directive',
							editorOptions: {
								directive: 'estimate-main-resource-type-lookup',
								lookupOptions: {
									'showClearButton': true,
									'additionalColumns':true,
									'displayMember':'ShortKeyInfo.Translated',
									'addGridColumns':[
										{
											id: 'brief',
											field: 'DescriptionInfo',
											name: 'Description',
											width: 120,
											formatter: 'translation',
											name$tr$: 'basics.riskregister.resourceShortKey'
										}
									]
								}
							},
							formatter: 'lookup',
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
					}
				}
			};
		}
	]);
})(angular);
