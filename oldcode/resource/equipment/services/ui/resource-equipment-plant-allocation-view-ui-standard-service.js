(function () {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantAllocationViewUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers
	 */
	angular.module(moduleName).factory('resourceEquipmentPlantAllocationViewUIStandardService',
		['platformUIStandardConfigService', 'platformLayoutHelperService', 'resourceEquipmentTranslationService',
			'platformSchemaService', 'basicsLookupdataConfigGenerator', 'logisticCommonLayoutOverloadService',

			function (platformUIStandardConfigService, platformLayoutHelperService, resourceEquipmentTranslationService,
				platformSchemaService, basicsLookupdataConfigGenerator, logisticCommonLayoutOverloadService) {

				function createMainDetailLayout() {
					return {
						fid: 'resource.equipment.resourceequipmentplantallocationview',
						version: '1.0.0',
						addValidationAutomatically: true,
						addAdditionalColumns: true,
						showGrouping: true,
						groups: [
							{
								'gid': 'basicData',
								'attributes': [ 'jobfk', 'jobcode', 'projectname', 'projectno', 'companyresponsiblefk', 'companyincode', 'companyinname', 'companyoutcode', 'companyoutname',
									'allocatedfrom', 'allocatedto', 'plantfk', 'planttypefk', 'isbulk', 'plantkindfk', 'quantity', 'uomfk', 'workoperationtypefk', 'controllingunitfk', 'reservationfk', 'dispatchheaderinfk', 'dispatchheaderoutfk', 'projectchangefk', 'projectchangestatusfk']
							}
						],
						overloads: {
							uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitLookupDataService',
								cacheEnable: true,
								additionalColumns: false
							}),
							projectchangefk: getChangeLookupOverload(),
							plantfk: platformLayoutHelperService.providePlantLookupOverload(),
							plantkindfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.plantkind'),
							planttypefk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.planttype'),
							workoperationtypefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'resourceWorkOperationTypeLookupDataService'
							}),
							jobfk: platformLayoutHelperService.provideJobLookupOverload(),
							companyresponsiblefk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-company-company-lookup'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'company',
										displayMember: 'Code'
									},
									width: 140
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									model: 'CompanyResponsibleFk',
									options: {
										lookupDirective: 'basics-company-company-lookup',
										descriptionMember: 'CompanyName'
									},
									change: 'formOptions.onPropertyChanged'
								}
							},
							controllingunitfk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										lookupDirective: 'controlling-structure-dialog-lookup',
										lookupOptions: {
											filterKey: 'prc-con-controlling-by-prj-filter',
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'ControllingUnit', 'displayMember': 'Code'
									},
									width: 80
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'controlling-structure-dialog-lookup',
										descriptionMember: 'DescriptionInfo.Translated',
										lookupOptions: {
											filterKey: 'prc-con-controlling-by-prj-filter',
											showClearButton: true
										}
									}
								}
							},
							reservationfk: logisticCommonLayoutOverloadService.getResourceReservationLookupOverload('ReservationFk', false, true),
						//	dispatchheaderinfk: logisticCommonLayoutOverloadService.getDispatchHeaderLookupOverload('DispatchHeaderInFk', true),
							dispatchheaderinfk: logisticCommonLayoutOverloadService.getDispatchHeaderLookupOverload('DispatchHeaderInFk', true),
							dispatchheaderoutfk: logisticCommonLayoutOverloadService.getDispatchHeaderLookupOverload('DispatchHeaderOutFk', true)
						}
					};
				}

				var resourceEquipmentPlantAllocationViewDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var resourceEquipmentPlantAllocationViewAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'PlantAllocVDto',
					moduleSubModule: 'Resource.Equipment'
				});
				resourceEquipmentPlantAllocationViewAttributeDomains = resourceEquipmentPlantAllocationViewAttributeDomains.properties;

				function getChangeLookupOverload() {
					var lookupOptions = {
						additionalColumns: true,
						showClearButton: true,
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
				function ResourceEquipmentPlantEurolistUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ResourceEquipmentPlantEurolistUIStandardService.prototype = Object.create(BaseService.prototype);
				ResourceEquipmentPlantEurolistUIStandardService.prototype.constructor = ResourceEquipmentPlantEurolistUIStandardService;

				return new BaseService(resourceEquipmentPlantAllocationViewDetailLayout, resourceEquipmentPlantAllocationViewAttributeDomains, resourceEquipmentTranslationService);
			}
		]);
})();
