(function () {
	'use strict';

	var moduleName = 'procurement.rfq';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ ,moment */

	/**
	 * @ngdoc service
	 * @name procurementRfqRequisitionDetailLayout
	 * @function
	 * @requires []
	 *
	 * @description
	 * # ui layout service for entity RfqRequisition.
	 */
	angular.module(moduleName).factory('procurementRfqRequisitionDetailLayout', ['$injector','platformObjectHelper',
		function ($injector,platformObjectHelper ) {
			return {
				'fid': 'procurement.rfq.requisition.detail',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'baseGroup',
						'attributes': ['reqheaderfk', 'projectfk', 'packagefk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'overloads': {
					'reqheaderfk': {
						navigator: {
							moduleName: 'procurement.requisition',
							registerService: 'procurementRequisitionHeaderDataService'
						},
						detail: {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								descriptionMember: 'Description',
								lookupDirective: 'procurement-common-req-header-lookup-view-dialog',
								lookupOptions: {
									displayMember: 'Code',
									showClearButton: false,
									filterKey: 'procurement-rfq-requisition-requisition-filter-new',
									formContainerOptions: getFormContainerOptions(),
									title: {name: 'Assign Basis Requisition', name$tr$: 'procurement.common.rfqRequsitionLookup'}
								}
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'procurement-common-req-header-lookup-view-dialog',
								lookupOptions: {
									filterKey: 'procurement-rfq-requisition-requisition-filter-new',
									displayMember: 'Code',
									formContainerOptions: getFormContainerOptions(),
									title: {name: 'Assign Basis Requisition', name$tr$: 'procurement.common.rfqRequsitionLookup'}
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'reqheaderlookupview',
								displayMember: 'Code'
							}
						}
					},
					'projectfk': {
						'navigator': {
							moduleName: 'project.main'
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'label$tr$': 'cloud.common.entityProject',
							'options': {
								lookupDirective: 'basics-lookup-data-project-project-dialog',
								descriptionMember: 'ProjectName',
								readOnly: true
							},
							sortOrder: 5
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PrcProject',
								displayMember: 'ProjectNo'
							}
						},
						'readonly': true
					},
					'packagefk': {
						navigator: {
							moduleName: 'procurement.package'
						},
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'PrcPackage',
								'displayMember': 'Code'
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'label$tr$': 'cloud.common.entityPackage',
							'options': {
								'lookupDirective': 'procurement-common-package-lookup',
								'descriptionMember': 'Description',
								readOnly: true
							},
							sortOrder: 5
						},
						'readonly': true
					}
				},
				'addition': {
					'grid': [
						{
							lookupDisplayColumn: true,
							id: 'reqStatus',
							field: 'ReqHeaderFk',
							name: 'Status',
							name$tr$: 'cloud.common.entityStatus',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'reqheaderlookupview',
								imageSelector: 'platformStatusIconService',
								displayMember: 'StatusInfo.Translated'
							},
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'cloud.common.entityStatus',
								getter: 'ReqHeaderFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							lookupDisplayColumn: true,
							id: 'referenceDescription',
							field: 'ReqHeaderFk',
							name: 'Requisition Name',
							name$tr$: 'procurement.rfq.requisitionName',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'reqheaderlookupview',
								displayMember: 'Description'
							},
							width: 120,
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'procurement.rfq.requisitionName',
								getter: 'ReqHeaderFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							id: 'dateRequired',
							field: 'ReqHeaderFk',
							name: 'Required',
							name$tr$: 'cloud.common.entityRequired',
							formatter: function (row, cell, value, columnDef/* , dataContext */) {
								// TODO  format the date field
								var service = $injector.get('basicsLookupdataLookupDescriptorService');
								var targetData = null;
								var result = null;
								if (!_.isEmpty(service)) {
									targetData = service.getData(columnDef.formatterOptions.lookupType);
								}
								if (!_.isEmpty(targetData)) {
									var item = targetData[value];
									if (!_.isEmpty(item)) {
										result = platformObjectHelper.getValue(item, columnDef.formatterOptions.displayMember);
									}
								}
								if (!_.isNil(result)) {
									/* jshint -W117 */ // defined in global
									result = moment.utc(result);
									result = result.format('L');
								}
								return result;
							},
							formatterOptions: {
								lookupType: 'reqheaderlookupview',
								displayMember: 'DateRequired'
							},
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'cloud.common.entityRequired',
								getter: 'ReqHeaderFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							lookupDisplayColumn: true,
							id: 'companyName',
							field: 'ReqHeaderFk',
							name: 'Company',
							name$tr$: 'cloud.common.entityCompany',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'reqheaderlookupview',
								displayMember: 'CompanyName'
							},
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'cloud.common.entityCompany',
								getter: 'ReqHeaderFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							lookupDisplayColumn: true,
							id: 'companyCode',
							field: 'ReqHeaderFk',
							name: 'Company Code',
							name$tr$: 'cloud.common.entityCompanyCode',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'reqheaderlookupview',
								displayMember: 'CompanyCode'
							},
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'cloud.common.entityCompanyCode',
								getter: 'ReqHeaderFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							lookupDisplayColumn: true,
							id: 'projectName',
							field: 'ProjectFk',
							name: 'Project Name',
							name$tr$: 'cloud.common.entityProjectName',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'project',
								displayMember: 'ProjectName'
							},
							width: 100,
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'cloud.common.entityProjectName',
								getter: 'ProjectFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							lookupDisplayColumn: true,
							id: 'packageDescription',
							field: 'PackageFk',
							name: 'Package Description',
							name$tr$: 'cloud.common.entityPackageDescription',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PrcPackage',
								displayMember: 'Description'
							},
							width: 150,
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'cloud.common.entityPackageDescription',
								getter: 'PackageFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							lookupDisplayColumn: true,
							id: 'clerkReqCode',
							field: 'ReqHeaderFk',
							name: 'Requisition Owner',
							name$tr$: 'cloud.common.entityRequisitionOwner',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'reqheaderlookupview',
								displayMember: 'ClerkReqCode'
							},
							width: 150,
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'cloud.common.entityRequisitionOwner',
								getter: 'ReqHeaderFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							lookupDisplayColumn: true,
							id: 'clerkReqDescription',
							field: 'ReqHeaderFk',
							name: 'Requisition Owner Description',
							name$tr$: 'cloud.common.entityRequisitionOwnerDescription',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'reqheaderlookupview',
								displayMember: 'ClerkReqDescription'
							},
							width: 180,
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'cloud.common.entityRequisitionOwnerDescription',
								getter: 'ReqHeaderFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							lookupDisplayColumn: true,
							id: 'controllingUnitCode',
							field: 'ReqHeaderFk',
							name: 'Controlling Unit Code',
							name$tr$: 'cloud.common.entityControllingUnitCode',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'reqheaderlookupview',
								displayMember: 'ControllingUnitCode'
							},
							width: 130,
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'cloud.common.entityControllingUnitCode',
								getter: 'ReqHeaderFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							lookupDisplayColumn: true,
							id: 'controllingUnitDescription',
							field: 'ReqHeaderFk',
							name: 'Controlling Unit Description',
							name$tr$: 'cloud.common.entityControllingUnitDesc',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'reqheaderlookupview',
								displayMember: 'ControllingUnitDescription'
							},
							width: 180,
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'cloud.common.entityControllingUnitDesc',
								getter: 'ReqHeaderFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							lookupDisplayColumn: true,
							id: 'addressLine',
							field: 'ReqHeaderFk',
							name: 'Delivery Address',
							name$tr$: 'cloud.common.entityDeliveryAddress',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'reqheaderlookupview',
								displayMember: 'AddressLine'
							},
							width: 120,
							grouping: {
								// title: translationGrid.initial,
								title$tr$: 'cloud.common.entityDeliveryAddress',
								getter: 'ReqHeaderFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							'navigator': {
								moduleName: 'basics.procurementstructure'
							},
							'id': 'structure',
							'field': 'PrcHeaderEntity.StructureFk',
							'name$tr$': 'cloud.common.entityStructureCode',
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-procurementstructure-structure-dialog',
								'lookupOptions': {'showClearButton': true}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'prcstructure',
								'displayMember': 'Code'
							},
							'width': 100,
							'grouping': {
								'title': 'cloud.common.entityStructureCode',
								'getter': 'PrcHeaderEntity.StructureFk',
								'aggregators': [],
								'aggregateCollapsed': true
							}
						}, {
							'id': 'structureDescription',
							'field': 'PrcHeaderEntity.StructureFk',
							'name$tr$': 'cloud.common.entityStructureDescription',
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'prcstructure',
								'displayMember': 'DescriptionInfo.Translated'
							},
							'width': 150,
							'grouping': {
								'title': 'cloud.common.entityStructureDescription',
								'getter': 'PrcHeaderEntity.StructureFk',
								'aggregators': [],
								'aggregateCollapsed': true
							}
						}
					],
					'detail': [
						{
							lookupDisplayColumn: true,
							'gid': 'baseGroup',
							'rid': 'reqStatus',
							'model': 'ReqHeaderFk',
							'label': 'Status',
							'label$tr$': 'cloud.common.entityStatus',
							'type': 'directive',
							'directive': 'procurement-common-req-header-lookup-view-dialog',
							'options': {
								displayMember: 'StatusInfo.Translated',
								imageSelector: 'platformStatusIconService',
								readOnly: true
							},
							sortOrder: 2
						},
						{
							lookupDisplayColumn: true,
							'gid': 'baseGroup',
							'rid': 'dateRequired',
							'model': 'ReqHeaderFk',
							'label': 'Required',
							'label$tr$': 'cloud.common.entityRequired',
							'type': 'directive',
							'lookupDomain': 'date',
							'directive': 'procurement-common-req-header-lookup-view-dialog',
							'options': {
								displayMember: 'DateRequired',
								formatter: 'dateutc',
								readOnly: true
							},
							sortOrder: 3
						},
						{
							lookupDisplayColumn: true,
							'gid': 'baseGroup',
							'rid': 'companyName',
							'model': 'ReqHeaderFk',
							'label': 'Company',
							'label$tr$': 'cloud.common.entityCompany',
							'type': 'directive',
							'directive': 'procurement-common-req-header-lookup-view-dialog',
							'options': {
								displayMember: 'CompanyName',
								readOnly: true
							},
							sortOrder: 4
						},
						{
							lookupDisplayColumn: true,
							'gid': 'baseGroup',
							'rid': 'companyCode',
							'model': 'ReqHeaderFk',
							'label': 'Company Code',
							'label$tr$': 'cloud.common.entityCompanyCode',
							'type': 'directive',
							'directive': 'procurement-common-req-header-lookup-view-dialog',
							'options': {
								displayMember: 'CompanyCode',
								readOnly: true
							},
							sortOrder: 5
						},
						{
							lookupDisplayColumn: true,
							'gid': 'baseGroup',
							'rid': 'clerkReqFk',
							'model': 'ReqHeaderFk',
							'label': 'Requisition Owner',
							'label$tr$': 'cloud.common.entityRequisitionOwner',
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								descriptionMember: 'ClerkReqDescription',
								lookupDirective: 'procurement-common-req-header-lookup-view-dialog',
								lookupOptions: {
									displayMember: 'ClerkReqCode',
									readOnly: true
								}
							},
							sortOrder: 6
						},
						{
							lookupDisplayColumn: true,
							'gid': 'baseGroup',
							'rid': 'controllingUnitFk',
							'model': 'ReqHeaderFk',
							'label': 'Controlling Unit',
							'label$tr$': 'cloud.common.entityControllingUnit',
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								descriptionMember: 'ControllingUnitDescription',
								lookupDirective: 'procurement-common-req-header-lookup-view-dialog',
								lookupOptions: {
									displayMember: 'ControllingUnitCode',
									readOnly: true
								}
							},
							sortOrder: 7
						},
						{
							lookupDisplayColumn: true,
							'gid': 'baseGroup',
							'rid': 'addressLine',
							'model': 'ReqHeaderFk',
							'label': 'Delivery Address',
							'label$tr$': 'cloud.common.entityDeliveryAddress',
							'type': 'directive',
							'directive': 'procurement-common-req-header-lookup-view-dialog',
							'options': {
								displayMember: 'AddressLine',
								readOnly: true
							},
							sortOrder: 8
						},
						{
							'navigator': {
								moduleName: 'basics.procurementstructure'
							},
							'gid': 'baseGroup',
							'rid': 'PrcHeaderEntity.StructureFk',
							'label': 'Procurement Structure',
							'label$tr$': 'basics.common.entityPrcStructureFk',
							'model': 'PrcHeaderEntity.StructureFk',
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-procurementstructure-structure-dialog',
								descriptionField: 'StructureDescription',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									initValueField: 'StructureCode',
									showClearButton: true,
									readOnly: true
								},
							},
							sortOrder: 9
						}]
				}
			};

			function getFormContainerOptions() {
				return {
					title: 'cloud.common.advancedCriteria',
					entity: function entitySetting() {
						const mainItem = $injector.get('procurementRfqMainService').getSelected();
						let entity = {};
						if (mainItem) {
							entity.CompanyFk = mainItem.CompanyFk;
							entity.ProjectFk = mainItem.ProjectFk;
						}
						return entity;
					},
					formOptions: {
						configure: {
							showGrouping: false,
							groups: [{
								gid: 'baseGroup',
								isOpen: true
							}],
							rows: [{
								gid: 'baseGroup',
								rid: 'company',
								label$tr$: 'cloud.common.entityCompany',
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-assigned-company-lookup',
									descriptionMember: 'CompanyName',
									lookupOptions: {
										showClearButton: true,
										events: [
											{
												name: 'onSelectedItemChanged',
												handler: function onSelectedItemChangedHandler(e, args) {
													if (args && args.entity) {
														let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
														if (!args.selectedItem) {
															args.entity.ProjectFk = null;
															platformRuntimeDataService.readonly(args.entity, [{field: 'ProjectFk', readonly: true}]);
														} else {
															if (args.selectedItem.Id !== args.entity.CompanyFk) {
																args.entity.ProjectFk = null;
															}
															platformRuntimeDataService.readonly(args.entity, [{field: 'ProjectFk', readonly: false}]);
														}
													}
												}
											}
										]
									}
								},
								model: 'CompanyFk'
							}, {
								gid: 'baseGroup',
								rid: 'project',
								label$tr$: 'cloud.common.entityProject',
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'procurement-project-lookup-dialog',
									descriptionMember: 'ProjectName',
									lookupOptions: {
										lookupType: 'PrcProject',
										filterKey: 'project-main-project-for-rfq-requisition-filter',
										showClearButton: true
									}
								},
								model: 'ProjectFk',
								readonly: false
							}]
						}
					}
				};
			}
		}
	]);

	/**
	 * @ngdoc service
	 * @name procurementRfqRequisitionUIStandardService
	 * @function
	 * @requires platformUIStandardConfigService
	 *
	 * @description
	 * # ui standard service for entity RfqRequisition.
	 */
	angular.module(moduleName).factory('procurementRfqRequisitionUIStandardService',
		['platformUIStandardConfigService', 'platformSchemaService', 'procurementRfqTranslationService', 'procurementRfqRequisitionDetailLayout', 'platformUIStandardExtentService',
			function (platformUIStandardConfigService, platformSchemaService, translationService, layout, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'RfqRequisitionDto',
					moduleSubModule: 'Procurement.RfQ'
				});
				domainSchema = domainSchema.properties;

				function RfqUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				RfqUIStandardService.prototype = Object.create(BaseService.prototype);
				RfqUIStandardService.prototype.constructor = RfqUIStandardService;

				var service = new BaseService(layout, domainSchema, translationService);
				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

				return service;
			}
		]);

})();
