(function () {
	/* global globals */
	'use strict';
	var moduleName = 'resource.requisition';

	/**
	 * @ngdoc service
	 * @name resourceRequisitionUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of resource entities
	 */
	angular.module(moduleName).factory('resourceRequisitionUIStandardService',
		['$injector', '$http', 'platformUIStandardConfigService', 'platformLayoutHelperService', 'resourceRequisitionTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator','resourceWotLookupConfigGenerator',


			function ($injector, $http, platformUIStandardConfigService, platformLayoutHelperService, resourceRequisitionTranslationService, platformSchemaService, basicsLookupdataConfigGenerator,resourceWotLookupConfigGenerator) {

				function createMainDetailLayout() {
					return {
						fid: 'resource.requisition.detailform',
						version: '1.0.0',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								'gid': 'baseGroup',
								'attributes': ['description', 'resourcefk', 'projectstockfk','requisitionfk','requisitionstatusfk', 'dispatchergroupfk', 'jobfk', 'typefk', 'quantity', 'uomfk', 'requestedfrom', 'requestedto', 'reservedfrom', 'reservedto',
									'commenttext', 'projectfk', 'activityfk', 'trsrequisitionfk', 'islinkedfixtoreservation', 'remark', 'materialfk','jobgroupfk','jobsitefk','requisitiontypefk','requisitiongroupfk','requisitionpriorityfk','clerkresponsiblefk','clerkownerfk','stockfk','preferredresourcesitefk','jobpreferredfk', 'companyfk',
									'projectchangefk', 'projectchangestatusfk', 'code','rubriccategoryfk','isbottleneck','skillfk','mdccontrollingunitfk','plannedstart','plannedend'
									,'typealternativefk','droppointfk','workoperationtypefk','execplanneritemfk','projecttimeslotfk']
							},
							{
								'gid': 'estimateGroup',
								'attributes': ['quantityfromestimate','istimeenhancement','isrequestbizpartner','isrequestprojectdoc','estimatequantity','workoperationtypefromestimatefk']
							},
							platformLayoutHelperService.getUserDefinedTextGroup(5, 'userDefTextGroup', 'userdefinedtext', '0'),
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						overloads: {
							projecttimeslotfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'resourceProjectTimeslotLookupDataService',
								filter: function (item) {
									return  item.ProjectFk;
								}
							}),
							workoperationtypefk:resourceWotLookupConfigGenerator.provideWotLookupOverloadFilteredByPlant(true),
							droppointfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'projectDropPointsLookupDataService',
								filter: function (item) {
									return  item.ProjectFk;
								}
							}),
							skillfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'resourceCommonSkillLookupDataService',
								filter: function (item) {
									return  item.TypeFk;
								}
							}),
							execplanneritemfk:basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'resourceProjectExecPlannerItemLookupDataService',
								filter: function (item) {
									return  {PKey1: item.ProjectFk};
								}
							}),
							workoperationtypefromestimatefk:resourceWotLookupConfigGenerator.provideWotLookupOverloadFilteredByPlant(true),
							typealternativefk:basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'resourceTypeLookupDataService'
							}),
							mdccontrollingunitfk: {
								'detail': {
									'model': 'MdcControllingUnitFk',
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'controlling-structure-dialog-lookup',
										descriptionMember: 'DescriptionInfo.Translated',
										lookupOptions: {
											filterKey: 'qto-main-controlling-unit-filter',
											showClearButton: true
										}
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'controlling-structure-dialog-lookup',
										lookupOptions: {
											showClearButton: true,
											filterKey: 'qto-main-controlling-unit-filter',   // 'est-controlling-unit-filter',
											'additionalColumns':true,
											'displayMember':'Code',
											'addGridColumns':[{
												id: 'Description',
												field: 'DescriptionInfo',
												name: 'Description',
												width: 300,
												formatter: 'translation',
												name$tr$: 'cloud.common.entityDescription'
											}]
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'Controllingunit',
										displayMember: 'Code'
									}
								}
							},
							istimeenhancement: {readonly: true},
							isrequestbizpartner: {readonly: true},
							isrequestprojectdoc: {readonly: true},
							estimatequantity: {readonly: true},
							rubriccategoryfk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
										lookupOptions: {
											filterKey: 'requisition-main-rubric-category-lookup-filter',
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: { 'lookupType': 'RubricCategoryByRubricAndCompany', 'displayMember': 'Description' },
									width: 125
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
										descriptionMember: 'Description',
										lookupOptions: {
											filterKey: 'requisition-main-rubric-category-lookup-filter',
											showClearButton: true
										}
									}
								}
							},
							reservedfrom: {readonly: true},
							reservedto: {readonly: true},
							requisitionfk: {
								navigator: {
									moduleName: 'resource.requisition'
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										lookupOptions: {
											lookupType: 'resourceRequisition',
											showClearButton: true,
											defaultFilter:{resourceFk: 'ResourceFk'}
										},
										directive: 'resource-requisition-lookup-dialog-new'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'resourceRequisition',
										version: 3,
										displayMember: 'Description'
									},
									width: 70
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'resource-requisition-lookup-dialog-new',
										descriptionMember: 'Description',
										displayMember: 'Code',
										showClearButton: true,
										lookupOptions:{
											defaultFilter:{resourceFk: 'ResourceFk'}
										}
									}
								}
							},
							projectchangefk: getChangeLookupOverload(),
							projectchangestatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.projectchangestatus', null, {
								showIcon: true,
								field: 'RubricCategoryFk',
								customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'
							}),
							companyfk: platformLayoutHelperService.provideCompanyLookupReadOnlyOverload(),
							resourcefk: platformLayoutHelperService.provideResourceLookupOverload({typeFk: 'TypeFk'}, 'resource-master-filter3'),
							requisitionstatusfk: basicsLookupdataConfigGenerator.getStatusLookupConfig('basics.customize.resrequisitionstatus'),
							jobfk: platformLayoutHelperService.provideJobLookupOverload({projectFk: 'ProjectFk'}),
							jobpreferredfk: platformLayoutHelperService.provideJobLookupOverload({projectFk: 'ProjectFk'}),

							typefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'resourceTypeLookupDataService',
								cacheEnable: true
							}),


							uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitLookupDataService',
								cacheEnable: true,
								additionalColumns: false
							}),
							projectstockfk: platformLayoutHelperService.provideProjectLookupReadOnlyOverload(),
							requisitiontypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resrequisitiontype'),
							requisitiongroupfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resourcerequisitiongroup'),
							requisitionpriorityfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resourcerequisitionpriority'),

							clerkresponsiblefk: {
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'cloud-clerk-clerk-dialog',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true
										}
									},
									requiredInErrorHandling: true
								},
								grid: {
									editor: 'lookup',
									directive: 'basics-lookupdata-lookup-composite',
									editorOptions: {
										lookupDirective: 'cloud-clerk-clerk-dialog',
										lookupOptions: {
											showClearButton: true,
											displayMember: 'Code',
											addGridColumns: [{
												id: 'Description',
												field: 'Description',
												name: 'Description',
												width: 200,
												formatter: 'description',
												name$tr$: 'cloud.common.entityDescription'
											}],
											additionalColumns: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'Clerk',
										displayMember: 'Code'
									}

								}
							},
							clerkownerfk: {
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'cloud-clerk-clerk-dialog',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true
										}
									},
									requiredInErrorHandling: true
								},
								grid: {
									editor: 'lookup',
									directive: 'basics-lookupdata-lookup-composite',
									editorOptions: {
										lookupDirective: 'cloud-clerk-clerk-dialog',
										lookupOptions: {
											showClearButton: true,
											displayMember: 'Code',
											addGridColumns: [{
												id: 'Description',
												field: 'Description',
												name: 'Description',
												width: 200,
												formatter: 'description',
												name$tr$: 'cloud.common.entityDescription'
											}],
											additionalColumns: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'Clerk',
										displayMember: 'Code'
									}

								}
							},
							jobgroupfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.jobgroup'),
							jobsitefk:platformLayoutHelperService.provideSiteLookupOverload(),
							preferredresourcesitefk: platformLayoutHelperService.provideSiteLookupOverload(),
							stockfk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										lookupOptions: {
											lookupType: 'ProjectStockNew',
											showClearButton: true,
										},
										directive: 'project-stock-dialog-lookup',
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'ProjectStockNew',
										version: 3,
										displayMember: 'Description'
									},
									width: 70
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'project-stock-dialog-lookup',
										descriptionMember: 'Description',
										displayMember: 'Code',
										showClearButton: true,
									}
								}
							},
							projectfk: platformLayoutHelperService.provideProjectLookupOverload(),
							activityfk: {
								'navigator': {
									moduleName: 'scheduling.main'
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'resource-requisition-activity-lookup-new',
										lookupOptions: {
											showClearButton: true,
											pageOptions: {
												enabled: true,
												size: 100
											}/* ,
											defaultFilter: {scheduleFk: 'ScheduleFk'} */
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'SchedulingActivityNew',
										displayMember: 'Code',
										filter: function (item) {
											return item.ScheduleFk;
										},
										version: 3
									}
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'resource-requisition-activity-lookup-new',
										lookupType: 'SchedulingActivityNew',
										displayMember: 'Code',
										version: 3,
										lookupOptions: {
											showClearButton: true,
											pageOptions: {
												enabled: true,
												size: 100
											}/* ,
											defaultFilter: {scheduleFk: 'ScheduleFk'} */
										}
									}
								}
							},
							trsrequisitionfk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										lookupOptions: {
											showClearButton: true
											// filterKey: 'transportplanning-bundle-trsRequisition-filter'
										},
										directive: 'transportplanning-requisition-lookup'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'TrsRequisition',
										displayMember: 'Code',
										version: 3
									},
									width: 70
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupOptions: {
											showClearButton: true
											// filterKey: 'transportplanning-bundle-trsRequisition-filter'
										},
										lookupDirective: 'transportplanning-requisition-lookup',
										displayMember: 'Code',
										descriptionMember: 'DescriptionInfo.Translated'
									}
								}
							},
							dispatchergroupfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.logisticsdispatchergroup'),
							materialfk: {
								navigator: {
									moduleName: 'basics.material'
								},
								grid: {
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'MaterialCommodity',
										displayMember: 'Code'
									},
									editor: 'lookup',
									editorOptions: {
										lookupOptions: {
											filterKey: 'resource-requisition-material-filter',
											showClearButton: true,
											additionalColumns: true,
											addGridColumns: [{
												id: 'Description',
												field: 'DescriptionInfo.Translated',
												width: 150,
												name: 'Description',
												formatter: 'description',
												name$tr$: 'cloud.common.entityDescription'
											}]
										},
										directive: 'basics-material-material-lookup'
									},
									width: 100
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupOptions: {
											showClearButton: true,
											filterKey: 'resource-requisition-material-filter',
										},
										lookupDirective: 'basics-material-material-lookup',
										displayMember: 'Code',
										descriptionMember: 'DescriptionInfo.Translated'
									}
								}
							}
						},
						addition: {
							grid: [
								{
									lookupDisplayColumn: true,
									field: 'ClerkFk',
									name$tr$: 'cloud.common.entityResponsibleDescription',
									width: 145
								}
							]
						}
					};
				}

				var resDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var resAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'RequisitionDto',
					moduleSubModule: 'Resource.Requisition'
				});
				resAttributeDomains = resAttributeDomains.properties;


				function UnitUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				function getChangeLookupOverload() {
					let lookupOptions = {
						additionalColumns: true,
						showClearButton: true,
						addGridColumns: [{
							id: 'description',
							field: 'Description',
							name: 'Description',
							name$tr$: 'cloud.common.entityDescription',
							formatter: 'description'
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
						},
						readonly: true
					};
				}
				UnitUIStandardService.prototype = Object.create(BaseService.prototype);
				UnitUIStandardService.prototype.constructor = UnitUIStandardService;

				var baseService = new BaseService(resDetailLayout, resAttributeDomains, resourceRequisitionTranslationService);
				baseService.getCreateMainLayout = function getCreateMainLayout() {
					return createMainDetailLayout();
				};
				return baseService;
			}
		]);
})();
