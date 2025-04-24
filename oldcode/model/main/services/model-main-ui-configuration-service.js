/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'model.main';

	/**
	 * @ngdoc service
	 * @name schedulingMainEventConfigurationService
	 * @function
	 *
	 * @description
	 * schedulingService is the data service for all scheduling data functions.
	 */
	angular.module(moduleName).service('modelMainUIConfigurationService', ModelMainUIConfigurationService);

	ModelMainUIConfigurationService.$inject = ['_', 'basicsLookupdataConfigGenerator',
		'modelProjectModelReadonlyDataService', 'basicsCustomizeModelValueTypeUtilityService',
		'basicsCommonConfigLocationListService'];

	function ModelMainUIConfigurationService(_, basicsLookupdataConfigGenerator,
											 modelProjectModelReadonlyDataService, basicsCustomizeModelValueTypeUtilityService,
											 basicsCommonConfigLocationListService) {

		const accessScopes = basicsCommonConfigLocationListService.createItems({
			user: true,
			role: true,
			system: true
		});

		function getProjectId(item) {
			let prjId = -1;
			if (item) {
				const items = modelProjectModelReadonlyDataService.getList();
				const model = _.find(items, {Id: item.ModelFk});
				if (model) {
					prjId = model.ProjectFk;
				}
			}
			return prjId;
		}

		// The object itself - main entity in the model main module
		this.getModelObjectDetailLayout = function getModelObjectDetailLayout() {
			return {
				fid: 'model.main.modelobjectdetailform',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['objectfk', 'modelfk', 'description', 'meshid', 'cpiid', 'cadidint', 'isnegative', 'iscomposite', 'isdeleted']
					},
					{
						'gid': 'referenceGroup',
						'attributes': ['controllingunitfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				overloads: {
					cpiid: {
						readonly: true
					},
					meshid: {
						readonly: true
					},
					isnegative: {
						readonly: true
					},
					iscomposite: {
						readonly: true
					},
					isdeleted: {
						readonly: true
					},
					objectfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelMainObjectLookupDataService',
						enableCache: true,
						filter: function (item) {
							return item.ModelFk;
						},
						additionalColumns: true
					}, {
						displayName$tr$: 'model.main.parentObject'
					}),
					modelfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelProjectModelTreeLookupDataService',
						enableCache: true,
						filter: function (item) {
							return getProjectId(item);
						},
						readonly: true
					}),
					controllingunitfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'controllingStructureUnitLookupDataService',
						filter: function (item) {
							return getProjectId(item);
						},
						enableCache: true
					})
				}
			};
		};

		// Property is a sub entity - it contains the property instances related to an object in the geometrical data
		this.getModelPropertyDetailLayout = function getModelPropertyDetailLayout() {
			return {
				fid: 'model.main.modelpropertydetailform',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['isinherited', 'propertykeyfk', 'value', 'uom', 'uomfk', 'iscustom']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				overloads: {
					// objectfk: {readonly: true},
					isinherited: {
						readonly: true
					},
					iscustom: {
						readonly: true
					},
					value: {
						formatter: 'dynamic',
						editor: 'dynamic',
						domain: function (item) {
							let domain;

							if (item) {
								const vtInfo = basicsCustomizeModelValueTypeUtilityService.getValueTypeInfo(item.ValueType);
								if (vtInfo) {
									domain = vtInfo.domain;
									item.Value = item['PropertyValue' + vtInfo.typeSuffix];
								} else {
									item.Value = null;
								}
							}

							return domain || 'description';
						}
					},
					modelfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelProjectModelTreeLookupDataService',
						enableCache: true,
						filter: function (item) {
							return getProjectId(item);
						},
						readonly: true
					}),
					propertykeyfk: {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'model-main-property-key-dialog'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PropertyKey',
								displayMember: 'PropertyName',
								version: 3
							},
							width: 100
						},
						detail: {
							type: 'directive',
							directive: 'model-main-property-key-dialog',
							options: {
								descriptionMember: 'PropertyName'
							}
						}
					},
					uom: {
						readonly: true
					},
					uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true,
						additionalColumns: false
					})
				}
			};
		};

		this.getModelObjectInfoLayout = function () {
			return {
				fid: 'model.main.modelobjectinfoform',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['name', 'formattedvalue', 'origin', 'kind']
					}
				],
				overloads: {
					name: {
						formatter: 'text',
						readonly: true,
						grid: {
							field: 'Name'
						}
					},
					formattedvalue: {
						formatter: 'text',
						readonly: true,
						grid: {
							field: 'FormattedValue'
						}
					},
					origin: {
						formatter: 'text',
						readonly: true,
						grid: {
							field: 'Origin'
						}
					},
					kind: {
						formatter: 'text',
						readonly: true,
						grid: {
							field: 'Kind'
						}
					}
				}
			};
		};
		this.getEstLineItem2ObjectDetailLayout = function () {
			function getEstProjectId(item) {
				let prjId = -1;
				if (item) {
					const items = modelProjectModelReadonlyDataService.getList();
					const model = _.find(items, {Id: item.MdlModelFk});
					if (model) {
						prjId = model.ProjectFk;
					}
				}
				return prjId;
			}

			return {
				fid: 'model.main.estLineItem2Object.detailform',
				version: '1.0.1',
				showGrouping: true,
				addValidationAutomatically: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['estlineitemfk', 'estheaderfk', 'mdlmodelfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],

				overloads: {
					mdlmodelfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelProjectModelTreeLookupDataService',
						enableCache: true,
						filter: function (item) {
							return getEstProjectId(item);
						},
						additionalColumns: false,
						readonly: true
					}),
					estheaderfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'estimateMainHeaderLookupDataService',
						moduleQualifier: 'estimateMainHeaderLookupDataService',
						desMember: 'DescriptionInfo.Translated',
						readonly: true,
						additionalColumns: true,
						filter: function (item) {
							return getEstProjectId(item);
						}
					}),
					estlineitemfk: {
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'modelEstLineItem',
								dataServiceName: 'modelEstLineItemLookupDataService',
								filter: function (item) {
									return item.EstHeaderFk;
								},
								disableDataCaching: true,
								displayMember: 'Code',
								imageSelector: 'platformStatusIconService'
							},
							editor: 'lookup',
							directive: 'basics-lookupdata-lookup-composite',
							editorOptions: {
								lookupDirective: 'model-est-line-item-dialog-lookup',
								lookupOptions: {
									filter: function (item) {
										return item.EstHeaderFk;
									},
									showClearButton: true,
									displayMember: 'Code',
									lookupType: 'modelEstLineItem',
									additionalColumns: true,
									addGridColumns: [{
										id: 'Description',
										field: 'DescriptionInfo',
										name: 'Description',
										width: 300,
										formatter: 'translation',
										name$tr$: 'cloud.common.entityDescription'
									}]
								}
							}
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'model-est-line-item-dialog-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filter: function (item) {
										return item.EstHeaderFk;
									},
									showClearButton: true,
									lookupType: 'modelEstLineItem',
									imageSelector: 'platformStatusIconService'
								}
							}
						}

					}
				}
			};
		};
		this.getModelObjectSetLayout = function () {
			return {
				fid: 'model.main.modelobjectsetform',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['projectfk', 'name', 'duedate', 'objectsetstatusfk', 'objectsettypefk', 'remark', 'clerkfk', 'businesspartnerfk', 'reportfk', 'formfk'/* , 'workflowtemplatefk' */]
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				overloads: {
					projectfk: {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookup-data-project-project-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'project',
								displayMember: 'ProjectNo'
							}
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookup-data-project-project-dialog',
								descriptionMember: 'ProjectName',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						readonly: true
					},
					clerkfk: {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						grid: {
							editor: 'lookup',
							directive: 'basics-lookupdata-lookup-composite',
							editorOptions: {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Clerk',
								displayMember: 'Description'
							}
						}
					},
					businesspartnerfk: {
						detail: {
							type: 'directive',
							directive: 'business-partner-main-business-partner-dialog',
							options: {
								initValueField: 'BusinesspartnerBpName1',
								showClearButton: true
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-business-partner-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'BusinessPartner',
								displayMember: 'BusinessPartnerName1'
							}
						}
					},
					formfk: {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookup-data-by-custom-data-service-grid-less',
								lookupOptions: {
									lookupModuleQualifier: 'basicsUserFormLookupService',
									lookupType: 'basicsUserFormLookupService',
									dataServiceName: 'basicsUserFormLookupService',
									valueMember: 'Id',
									displayMember: 'DescriptionInfo.Description',
									filter: function () {
										return 61;
									},
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'basicsUserFormLookupService',
								dataServiceName: 'basicsUserFormLookupService',
								displayMember: 'DescriptionInfo.Description'
							},
							width: 150
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookup-data-by-custom-data-service-grid-less',
							options: {
								lookupModuleQualifier: 'basicsUserFormLookupService',
								lookupType: 'basicsUserFormLookupService',
								dataServiceName: 'basicsUserFormLookupService',
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Description',
								filter: function () {
									return 61;
								},
								showClearButton: true
							}
						}
					},
					reportfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'mainModelReportingLookupService'}),
					objectsetstatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.objectsetstatus', null, {showIcon: true}),
					objectsettypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.objectsettype')
					/*
										workflowtemplatefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'basicsCustomWorkflowTemplateLookupDataService',
											filter: function () {
												return 'ObjectSet';
											}
										})
					*/
				}
			};
		};
		this.getModelObjectSet2ObjectLayout = function () {
			return {
				fid: 'model.main.modelobjectset2objectform',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['projectfk', 'objectfk', 'modelfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				overloads: {
					projectfk: {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookup-data-project-project-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'project',
								displayMember: 'ProjectNo'
							}
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookup-data-project-project-dialog',
								descriptionMember: 'ProjectName',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						readonly: true
					},
					modelfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelProjectModelTreeLookupDataService',
						enableCache: true,
						filter: function (item) {
							// return getProjectId(item);
							return item.ProjectFk;
						},
						additionalColumns: false,
						readonly: true
					}),
					objectfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelMainObjectLookupDataService',
						enableCache: true,
						filter: function (item) {
							return item.ModelFk;
						},
						additionalColumns: true
					})
				}
			};
		};
		this.getModelObject2ObjectSetLayout = function () {
			return {
				fid: 'model.main.modelobject2objectsetform',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['projectfk', 'modelfk', 'objectsetfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				overloads: {
					projectfk: {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookup-data-project-project-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'project',
								displayMember: 'ProjectNo'
							}
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookup-data-project-project-dialog',
								descriptionMember: 'ProjectName',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						readonly: true
					},
					modelfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelProjectModelTreeLookupDataService',
						enableCache: true,
						filter: function (item) {
							return item.ProjectFk;
							// return getProjectId(item);
						},
						additionalColumns: false,
						readonly: true
					}),
					objectsetfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelMainObjectSetLookupDataService',
						enableCache: true,
						filter: function (item) {
							return item.ProjectFk;
						},
						additionalColumns: true
					})
				}
			};
		};
		// Container is a super entity. It is a ordering strcuture inside an model. All objects are owned by container
		this.getModelObjectHierarchicalDetailLayout = function getModelObjectHierarchicalDetailLayout() {
			return {
				fid: 'model.main.getModelObjectHierarchicalDetailLayout',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['description', 'cpiid', 'iscomposite']
					}
				],
				overloads: {
					cpiid: {readonly: true},
					iscomposite: {readonly: true},
					description: {readonly: true}
				}
			};
		};
		this.getModelViewerLegendLayout = function () {
			return {
				fid: 'model.main.viewerLegendform',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['color', 'description', 'meshcount']
					}
				],
				overloads: {
					color: {
						formatter: 'color',
						readonly: true
					},
					description: {
						formatter: 'remark',
						readonly: true,
						grid: {
							field: 'Text'
						},
						detail: {
							model: 'Text'
						}
					},
					meshcount: {
						readonly: true,
						formatter: 'dynamic',
						editor: 'dynamic',
						domain: function (item) {
							if (item && _.isNumber(item.MeshCount)) {
								return 'integer';
							} else {
								return 'description';
							}
						}
					}
				}
			};
		};

		this.getModelObject2LocationDetailLayout = function () {
			return {
				fid: 'model.main.modelobject2locationdetailform',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['locationfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				overloads: {
					locationfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectLocationLookupDataService',
						filter: function (item) {
							return getProjectId(item);
						},
						enableCache: true
					})
				}
			};
		};

		this.getModelViewpointDetailLayout = function () {
			return {
				fid: 'model.main.modelviewpointform',
				version: '1.0.0',
				showGrouping: false,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['code', 'description', 'showinviewer', 'scope', 'modelfk', 'viewpointtypefk', 'isimportant']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				overloads: {
					viewpointtypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.modelviewpointtype'),
					modelfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelProjectAllVersionedModelLookupDataService',
						enableCache: true,
						filter: item => _.isInteger(item.ProjectFk) ? item.ProjectFk : 0,
						readonly: true
					}),
					scope: {
						detail: {
							type: 'select',
							options: {
								items: accessScopes,
								valueMember: 'id',
								displayMember: 'name',
								modelIsObject: false
							}
						},
						grid: {
							formatter: 'select',
							formatterOptions: {
								items: accessScopes,
								valueMember: 'id',
								displayMember: 'name'
							},
							editor: 'select',
							editorOptions: {
								items: accessScopes,
								valueMember: 'id',
								displayMember: 'name'
							}
						}
					}
				}
			};
		};
	}
})(angular);
