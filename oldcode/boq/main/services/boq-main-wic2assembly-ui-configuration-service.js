/**
 * Created by mov on 4/20/2017.
 */

(function () {

	/* global _ */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainWic2AssemblyUIConfigurationService
	 * @function
	 *
	 * @description
	 * boqMainWic2AssemblyUIConfigurationService is the config service for all estimate views.
	 */
	angular.module(moduleName).factory('boqMainWic2AssemblyUIConfigurationService', [
		'$injector', 'basicsLookupdataConfigGenerator', 'basicsLookupdataConfigGeneratorExtension', 'platformObjectHelper',
		'$translate', 'estimateCommonNavigationService', 'mainViewService', 'boqMainService',
		function ($injector, basicsLookupdataConfigGenerator, basicsLookupdataConfigGeneratorExtension, platformObjectHelper,
			$translate, estimateCommonNavigationService, mainViewService, boqMainService) {
			var detailsOverload = {
				'grid': {
					formatter: function (row, cell, value) {
						if (angular.isUndefined(value) || value === null) {
							return '';
						}
						return _.toUpper(value);
					}
				},
				readonly: true
			};

			function navigateToAssembly(triggerFieldOption, entity) {
				triggerFieldOption.triggerModule = mainViewService.getCurrentModuleName();
				if(triggerFieldOption.triggerModule === 'estimate.main') {
					triggerFieldOption.ProjectFk = $injector.get('estimateMainService').getSelected().ProjectFk;
				}
				if(triggerFieldOption.triggerModule === moduleName) {
					triggerFieldOption.ProjectFk = boqMainService.getSelectedProjectId();
				}
				estimateCommonNavigationService.navigateToAssembly(triggerFieldOption, entity);
			}

			return {
				getWic2AssemblyListLayout: function (isReadOnly) {
					return {
						'fid': 'boq.main.assembly.list',
						'version': '1.0.2',
						'showGrouping': false,
						'addValidationAutomatically': true,
						'groups': [
							{
								'gid': 'basicData',
								'attributes': [
									'workcontentinfo', 'wic2assemblyquantity', 'wicestassembly2wicflagfk', 'estlineitemfk', 'estassemblycatfk', 'basuomfk', 'quantity', 'quantitydetail', 'quantitytotal', 'quantityunittarget',
									'costunit', 'costtotal', 'costunittarget', 'hourstotal', 'hoursunit', 'hoursunittarget', 'quantityfactordetail1', 'quantityfactordetail2',
									'quantityfactor1', 'quantityfactor2', 'quantityfactor3', 'quantityfactor4', 'productivityfactor', 'costfactordetail1', 'costfactordetail2',
									'costfactor1', 'costfactor2', 'estcostriskfk', 'islumpsum', 'isdisabled', 'commenttext'
								]
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							'workcontentinfo': {
								'readonly': isReadOnly,
								'grid': {
									'maxLength': 255,
									'width': 100
								}
							},
							'wic2assemblyquantity': {
								'readonly': isReadOnly
							},
							'wicestassembly2wicflagfk': angular.extend(basicsLookupdataConfigGenerator.provideGenericLookupConfig(
								'basics.lookup.takeovermode',
								'Description'), {readonly: isReadOnly}),
							'estlineitemfk': {
								'grid': {
									'navigator': {
										moduleName: $translate.instant('estimate.assemblies.assembly'),
										navFunc: function (triggerFieldOption, entity) {
											navigateToAssembly(triggerFieldOption, entity);
										}
									},
									'editor': 'directive',
									'editorOptions': {
										'directive': 'estimate-main-assembly-template-lookup',
										'usageContext': 'boqMainWic2AssemblyService',
										'lookupOptions': {
											'filterAssemblyKey': 'boq-main-wic2assembly-unique-assembly-filter'
										},
										'gridOptions': {
											'multiSelect': false
										}
									},
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'estassemblyfk',
										'displayMember': 'Code'
									}
								},
								'detail': {
									'type': 'directive',
									'directive': 'estimate-main-assembly-template-lookup',
									'options': {
										'lookupOptions': {
											'filterAssemblyKey': 'boq-main-wic2assembly-unique-assembly-filter'
										}
									}
								},
								'readonly': isReadOnly
							},
							'estassemblycatfk': {
								'grid': {
									'name': 'Assembly Category',
									'name$tr$': 'estimate.assemblies.estAssemblyCat',
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'estassemblycat',
										'displayMember': 'Code'
									}
								},
								'readonly': true
							},
							'basuomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								'dataServiceName': 'basicsUnitLookupDataService',
								'additionalColumns': false,
								'cacheEnable': true,
								'readonly': true,
								'sortable': true
							}),
							'quantity': {
								'readonly': true
							},
							'quantitydetail': detailsOverload,
							'quantitytotal': {
								'readonly': true
							},
							'quantityunittarget': {
								'readonly': true
							},
							'costunit': {
								'readonly': true
							},
							'costtotal': {
								'readonly': true
							},
							'costunittarget': {
								'readonly': true
							},
							'hourstotal': {
								'readonly': true
							},
							'hoursunit': {
								'readonly': true
							},
							'hoursunittarget': {
								'readonly': true
							},
							'quantityfactordetail1': detailsOverload,
							'quantityfactordetail2': detailsOverload,
							'quantityfactor1': {
								'readonly': true
							},
							'quantityfactor2': {
								'readonly': true
							},
							'quantityfactor3': {
								'readonly': true
							},
							'quantityfactor4': {
								'readonly': true
							},
							'productivityfactor': {
								'readonly': true
							},
							'costfactordetail1': {
								'readonly': true
							},
							'costfactordetail2': {
								'readonly': true
							},
							'costfactor1': {
								'readonly': true
							},
							'costfactor2': {
								'readonly': true
							},
							'estcostriskfk': angular.extend(basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('estimate.lookup.costrisk', 'Description'), {readonly: true}),
							'islumpsum': {
								'readonly': true
							},
							'isdisabled': {
								'readonly': true
							},
							'commenttext': {
								'readonly': true
							}

						},
						'addition': {
							'grid': platformObjectHelper.extendGrouping([
								{
									'afterId': 'estlineitemfk',
									'id': 'estassemblydescription',
									'field': 'EstLineItemFk',
									'name': 'Assembly Description',
									'name$tr$': 'boq.main.assemblyDescription',
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'estassemblyfk',
										'displayMember': 'DescriptionInfo.Translated'
									},
									'readonly': true,
									'sortable': true
								},
								{
									'afterId': 'estassemblycatfk',
									'id': 'estassemblycatfkdescription',
									'field': 'EstAssemblyCatFk',
									'name': 'Assembly Category Description',
									'name$tr$': 'estimate.assemblies.estAssemblyCatDescription',
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'estassemblycat',
										'displayMember': 'DescriptionInfo.Translated'
									},
									'readonly': true,
									'sortable': true
								}
							])
						}
					};
				}
			};
		}
	]);
})();
