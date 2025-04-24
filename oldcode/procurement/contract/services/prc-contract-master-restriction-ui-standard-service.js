/**
 * Created by lvy on 3/5/2019.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.contract';
	var boqWicModule = 'boq.wic';
	var basicsMaterialModule = 'basics.material';
	var prcCommonModule = 'procurement.common';
	var cloudCommonModule = 'cloud.common';

	angular.module(moduleName).factory('procurementContractMasterRestrictionLayout', ['basicsLookupdataConfigGenerator',
		'$injector', 'procurementCommonVisibilityOption', 'procurementCommonMasterRestrictionCopyType', 'platformLayoutHelperService',
		function (basicsLookupdataConfigGenerator, $injector, procurementCommonVisibilityOption, procurementCommonMasterRestrictionCopyType, platformLayoutHelperService) {
			let config = {
				'fid': 'contract.masterrestriction.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'translationInfos': {
					'extraModules': [moduleName, boqWicModule, basicsMaterialModule, prcCommonModule, 'estimate.main'],
					'extraWords': {
						'BoqWicCatFk': {
							'location': moduleName,
							'identifier': 'entityBoqWicCatFk',
							'initial': 'WIC Group'
						},
						'MdcMaterialCatalogFk': {
							'location': 'basics.material',
							'identifier': 'materialCatalog',
							'initial': 'Material Catalog'
						},
						'PackageBoqHeaderFk': {
							'location': prcCommonModule,
							'identifier': 'entityPackageBoqHeaderFk',
							'initial': 'Package BoQ'
						},
						'ConHeaderBoqFk': {
							'location': moduleName,
							'identifier': 'entityConHeaderFk',
							'initial': 'Procurement Contract'
						},
						'ConBoqHeaderFk': {
							'location': 'procurement.common',
							'identifier': 'entityConBoqHeaderFk',
							'initial': 'Contract BoQ'
						},
						'Visibility': {
							location: prcCommonModule,
							identifier: 'visibility',
							initial: 'Visibility'
						},
						'CopyType': {
							location: prcCommonModule,
							identifier: 'entityCopyType',
							initial: 'Copy Type'
						},
						'CopyTypeWicBoq': {
							location: prcCommonModule,
							identifier: 'copyTypeWicBoq',
							initial: 'WIC BoQ'
						},
						'CopyTypePrjBoq': {
							location: prcCommonModule,
							identifier: 'copyTypePrjBoq',
							initial: 'Project BoQ'
						},
						'CopyTypePacBoq': {
							location: prcCommonModule,
							identifier: 'copyTypePacBoq',
							initial: 'Package BoQ'
						},
						'CopyTypeMaterial': {
							location: prcCommonModule,
							identifier: 'copyTypeMaterial',
							initial: 'Material'
						},
						'ProjectFk': {
							'location': cloudCommonModule,
							'identifier': 'entityProjectNo',
							'initial': 'Project No'
						},
						'PackageFk': {
							'location': cloudCommonModule,
							'identifier': 'entityPackageCode',
							'initial': 'entityPackageCode'
						},
						'PrjBoqFk': {
							location: prcCommonModule,
							identifier: 'entityPrjBoqFk',
							initial: 'Project BoQ'
						}
					}
				},
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['mdcmaterialcatalogfk', 'boqwiccatfk', 'conheaderboqfk', 'conboqheaderfk', 'visibility',
							'copytype', 'projectfk', 'prjboqfk', 'packagefk', 'packageboqheaderfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'overloads': {
					'mdcmaterialcatalogfk': {
						navigator: {
							moduleName: 'basics.materialcatalog'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-material-material-catalog-lookup',
								'lookupOptions': {
									'filterKey': 'prc-con-master-restriction-material-catalog-filter',
									'showClearButton': true,
									'title': {name: 'Material Catalog', name$tr$: 'basics.material.materialCatalog'}
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'MaterialCatalog', 'displayMember': 'Code'},
							'width': 150
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-material-material-catalog-lookup',
								'descriptionMember': 'DescriptionInfo.Translated',
								'lookupOptions': {
									'showClearButton': true,
									'filterKey': 'prc-con-master-restriction-material-catalog-filter',
									'title': {name: 'Material Catalog', name$tr$: 'basics.material.materialCatalog'}
								}
							}
						}
					},
					'boqwiccatfk': basicsLookupdataConfigGenerator.provideTreeDataServiceLookupConfig({
						moduleQualifier: 'estimateAssembliesWicGroupLookupDataService',
						dataServiceName: 'estimateAssembliesWicGroupLookupDataService',
						enableCache: true,
						valMember: 'Id',
						dispMember: 'Code'
					}),
					'conheaderboqfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'prc-con-header-dialog',
								'lookupOptions': {
									'filterKey': 'con-master-restriction-contract-filter',
									'showClearButton': true
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'conheaderview', 'displayMember': 'Code'},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'prc-con-header-dialog',
								'descriptionMember': 'Description',
								'lookupOptions': {
									'showClearButton': true,
									'filterKey': 'con-master-restriction-contract-filter'
								}
							}
						}
					},
					'conboqheaderfk': (function () {
						let obj = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							moduleQualifier: 'procurementCommonMasterRestrictionContractBoqHeaderService',
							dataServiceName: 'procurementCommonMasterRestrictionContractBoqHeaderService',
							enableCache: true,
							showClearButton: true,
							isComposite: true,
							dispMember: 'BoqNumber',
							valMember: 'BoqHeaderFk',
							name: 'Contract BoQ',
							name$tr$: 'procurement.common.entityConBoqHeaderFk',
							columns: [
								{
									id: 'BoqNumber',
									field: 'BoqNumber',
									name: 'BoqNumber',
									formatter: 'code',
									name$tr$: 'boq.main.boqNumber'
								},
								{
									id: 'Description',
									field: 'Description',
									name: 'Description',
									formatter: 'description',
									name$tr$: 'cloud.common.entityDescription'
								}
							]
						});

						obj.detail.options.lookupOptions.getCustomLookupFilter = getCustomLookupFilter;
						obj.grid.editorOptions.lookupOptions.getCustomLookupFilter = getCustomLookupFilter;
						obj.grid.formatterOptions.getCustomLookupFilter = getCustomLookupFilter;

						function getCustomLookupFilter() {
							let dataService = $injector.get('procurementContractMasterRestrictionDataService');
							let contractIds = [];
							if (dataService) {
								let selectedItem = dataService.getSelected();
								if (selectedItem && selectedItem.ConHeaderBoqFk) {
									contractIds.push(selectedItem.ConHeaderBoqFk);
								}
							}
							if (contractIds.length === 0) {
								contractIds.push(-1);
							}
							return {
								boqType: 7,
								contractIds: contractIds
							};
						}

						return obj;
					})(),
					'visibility': {
						grid: {
							formatter: 'select',
							formatterOptions: {
								displayMember: 'description',
								valueMember: 'Id',
								items: procurementCommonVisibilityOption
							},
							editor: 'select',
							editorOptions: {
								displayMember: 'description',
								valueMember: 'Id',
								items: procurementCommonVisibilityOption
							},
							width: 190
						},
						detail: {
							type: 'select',
							options: {
								displayMember: 'description',
								valueMember: 'Id',
								items: procurementCommonVisibilityOption
							}
						}
					},
					'copytype': {
						'detail': {
							type: 'select',
							options: {
								items: procurementCommonMasterRestrictionCopyType,
								valueMember: 'Id',
								displayMember: 'Description',
								modelIsObject: false
							}
						},
						'grid': {
							formatter: 'select',
							formatterOptions: {
								items: procurementCommonMasterRestrictionCopyType,
								valueMember: 'Id',
								displayMember: 'Description'
							},
							editor: 'select',
							editorOptions: {
								items: procurementCommonMasterRestrictionCopyType,
								valueMember: 'Id',
								displayMember: 'Description'
							}
						}
					},
					'projectfk': platformLayoutHelperService.provideProjectLookupOverload(null, 'ProjectFk'),
					'packagefk': {
						'navigator': {
							'moduleName': 'procurement.package'
						},
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'PrcPackage',
								displayMember: 'Code'
							},
							'editor': 'lookup',
							'editorOptions': {
								directive: 'procurement-common-package-lookup',
								lookupOptions: {
									filterKey: 'master-restriction-package-filter',
									showClearButton: true
								}
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'procurement-common-package-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									filterKey: 'master-restriction-package-filter'
								}
							}
						}
					},
					'prjboqfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({ // todo chi: check whether it will be cross over with package
						moduleQualifier: 'procurementCommonMasterRestrictionPrjBoqLookupDataService',
						dataServiceName: 'procurementCommonMasterRestrictionPrjBoqLookupDataService',
						enableCache: true,
						showClearButton: true,
						isComposite: true,
						dispMember: 'BoqRootItem.Reference',
						desMember: 'BoqRootItem.BriefInfo.Translated',
						name: 'Project Boq',
						name$tr$: 'qto.main.PrcBoq',
						filter: function (entity) {
							return entity.ProjectFk || -1;
						},
						columns: [
							{
								id: 'reference',
								field: 'BoqRootItem.Reference',
								name: 'Reference',
								formatter: 'description',
								name$tr$: 'cloud.common.entityReference'
							},
							{
								id: 'briefInfoTranslated',
								field: 'BoqRootItem.BriefInfo.Translated',
								name: 'Description',
								formatter: 'description',
								name$tr$: 'cloud.common.entityDescription'
							}
						]
					}),
					'packageboqheaderfk': (function () {
						let obj = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							moduleQualifier: 'procurementCommonMasterRestrictionBoqHeaderLookupDataService',
							dataServiceName: 'procurementCommonMasterRestrictionBoqHeaderLookupDataService',
							enableCache: true,
							showClearButton: true,
							isComposite: true,
							dispMember: 'BoqNumber',
							valMember: 'BoqHeaderFk',
							name: 'Package BoQ',
							name$tr$: 'procurement.common.entityPackageBoqHeaderFk',
							columns: [
								{
									id: 'BoqNumber',
									field: 'BoqNumber',
									name: 'BoqNumber',
									formatter: 'code',
									name$tr$: 'boq.main.boqNumber'
								},
								{
									id: 'Description',
									field: 'Description',
									name: 'Description',
									formatter: 'description',
									name$tr$: 'cloud.common.entityDescription'
								}
							]
						});

						obj.detail.options.lookupOptions.getCustomLookupFilter = getCustomLookupFilter;
						obj.grid.editorOptions.lookupOptions.getCustomLookupFilter = getCustomLookupFilter;
						obj.grid.formatterOptions.getCustomLookupFilter = getCustomLookupFilter;

						function getCustomLookupFilter() {
							let dataService = $injector.get('procurementContractMasterRestrictionDataService');
							let packageIds = [];
							if (dataService) {
								let selectedItem = dataService.getSelected();
								if (selectedItem && selectedItem.PackageFk) {
									packageIds.push(selectedItem.PackageFk);
								}
							}
							if (packageIds.length === 0) {
								packageIds.push(-1);
							}
							return {
								boqType: 4,
								packageIds: packageIds
							};
						}

						return obj;
					})()
				},
				'addition': {
					grid: [
						{
							lookupDisplayColumn: true,
							field: 'MdcMaterialCatalogFk',
							name$tr$: 'documents.project.materialCatalogDescription',
							displayMember: 'DescriptionInfo.Translated'
						},
						{
							'afterId': 'MdcMaterialCatalogFk',
							'id': 'boqItemFk',
							'field': 'BoqItemFk',
							'name': 'WIC BoQ',
							'name$tr$': 'procurement.common.boq.wicBoq',
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-lookup-data-by-custom-data-service',
								'lookupOptions': {
									'valueMember': 'Id',
									'displayMember': 'Reference',
									'lookupModuleQualifier': 'procurementCommonWicBoqLookupService',
									'dataServiceName': 'procurementCommonWicBoqLookupService',
									'showClearButton': true,
									'lookupType': 'procurementCommonWicBoqLookupService',
									'filterKey': 'master-restriction-boq-item-filter',
									'columns': [
										{
											id: 'Reference',
											field: 'Reference',
											name: 'Reference',
											name$tr$: 'cloud.common.entityReference'
										},
										{
											id: 'BriefInfo',
											field: 'BriefInfo.Translated',
											name: 'Brief',
											name$tr$: 'cloud.common.entityBrief'
										}
									],
									'uuid': '02ee9896d0ab4eab8c50170440d1fc10',
									'filter': function (entity) {
										return entity.BoqWicCatFk || -1;
									},
									'enableCache': true
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'procurementCommonWicBoqLookupService',
								'displayMember': 'Reference',
								'dataServiceName': 'procurementCommonWicBoqLookupService',
								'filter': function (entity) {
									return entity.BoqWicCatFk || -1;
								}
							},
							'width': 150
						},
						{
							'id': 'boqItemFkBriefInfo',
							'field': 'BoqItemFk',
							'name': 'WIC BoQ Description',
							'name$tr$': 'procurement.common.boq.wicBoqDescription',
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'procurementCommonWicBoqLookupService',
								'displayMember': 'BriefInfo.Translated',
								'dataServiceName': 'procurementCommonWicBoqLookupService',
								'readonly': true
							},
							'width': 150,
							'readonly': true
						}, {
							lookupDisplayColumn: true,
							field: 'ConHeaderBoqFk',
							name$tr$: 'procurement.common.entityConHeaderDesc',
							displayMember: 'Description'
						}],
					detail: [
						{
							afterId: 'BoqWicCatFk',
							gid: 'basicData',
							rid: 'BoqItemFk',
							label: 'WIC BoQ',
							label$tr$: 'procurement.common.boq.wicBoq',
							type: 'directive',
							model: 'BoqItemFk',
							directive: 'basics-lookupdata-lookup-composite',
							dataServiceName: 'procurementCommonWicBoqLookupService',
							options: {
								lookupDirective: 'basics-lookup-data-by-custom-data-service',
								descriptionMember: 'Description',
								dataServiceName: 'procurementCommonWicBoqLookupService',
								lookupOptions: {
									'valueMember': 'Id',
									'displayMember': 'Reference',
									'lookupModuleQualifier': 'procurementCommonWicBoqLookupService',
									'dataServiceName': 'procurementCommonWicBoqLookupService',
									'showClearButton': true,
									'lookupType': 'procurementCommonWicBoqLookupService',
									'filterKey': 'master-restriction-boq-item-filter',
									'columns': [
										{
											id: 'Reference',
											field: 'Reference',
											name: 'Reference',
											name$tr$: 'cloud.common.entityReference'
										},
										{
											id: 'BriefInfo',
											field: 'BriefInfo.Translated',
											name: 'Brief',
											name$tr$: 'cloud.common.entityBrief'
										}
									],
									'filter': function (entity) {
										return entity.BoqWicCatFk || -1;
									},
									'isClientSearch': true,
									'enableCache': true
								}
							}
						}
					]
				}
			};

			return config;
		}]);

	angular.module(moduleName).factory('procurementContractMasterRestrictionUIStandardService',
		['platformUIStandardConfigService', 'procurementContractTranslationService',
			'procurementContractMasterRestrictionLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				var attributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'ConMasterRestrictionDto',
					moduleSubModule: 'Procurement.Contract'
				});

				attributeDomains = attributeDomains.properties;

				var service;
				service = new StructureUIStandardService(layout, attributeDomains, translationService);
				platformUIStandardExtentService.extend(service, layout.addition, attributeDomains);
				return service;
			}
		]);
})(angular);