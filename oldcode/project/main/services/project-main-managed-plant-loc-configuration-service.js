/**
 * Created by Nikhil Tajanpure on 14.04.2023.
 */
(function () {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainManagedPlantLocConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers defined in project main module
	 */
	angular.module(moduleName).factory('projectMainManagedPlantLocConfigurationService',

		['platformLayoutHelperService', 'platformUIStandardConfigService', 'projectMainTranslationService', 'basicsLookupdataConfigGenerator',
			'platformSchemaService', 'basicsCommonComplexFormatter', 'logisticCommonLayoutOverloadService',

			function (platformLayoutHelperService, platformUIStandardConfigService, projectMainTranslationService, basicsLookupdataConfigGenerator,
				platformSchemaService, basicsCommonComplexFormatter, logisticCommonLayoutOverloadService) {

				var BaseService = platformUIStandardConfigService;

				function provideManagedPlantLayout() {
					return {
						fid: 'project.managedplant.detailform',
						version: '0.2.4',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: [ 'plantfk', 'quantity', 'workoperationtypefk', 'jobfk', 'dispatchheaderinfk', 'serialnumber', 'trafficlightfk',  'planttypefk', 'plantcomponenttypefk','plantgroupfk' ]
							},
							{
								gid: 'entityHistory',
								isHistory: false
							}
						],
						overloads: {
							jobfk: platformLayoutHelperService.provideJobLookupOverload(),
							workoperationtypefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'resourceWorkOperationTypeLookupDataService',
								readonly: true
							}),
							dispatchheaderinfk: logisticCommonLayoutOverloadService.getDispatchHeaderLookupOverload('DispatchHeaderInFk', true),
							plantfk: platformLayoutHelperService.providePlantLookupOverload(),
							planttypefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCustomizePantTypeLookupDataService'
							}),
							'trafficlightfk':
								basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.resourcestrafficlight', null, {
									showIcon: true,
									imageSelectorService: 'platformStatusIconService',
								}),
							plantcomponenttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('resource.componenttype.plantcomponenttype'),
							homeprojectfk: platformLayoutHelperService.provideProjectLookupOverload(),
							projectlocationfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'projectLocationLookupDataService',
								filter: function (item) {
									let prj;
									if (item) {
										prj = item.HomeProjectFk;
									}
									return prj;
								}
							}),
							'plantgroupfk':
								 {
									grid: {
										editor: 'lookup',
										editorOptions: {
											directive: 'resource-equipment-group-lookup-dialog',
											lookupOptions: {
												additionalColumns: true,
												showClearButton: true,
												addGridColumns: [
													{
														id: 'description',
														field: 'DescriptionInfo',
														name: 'Description',
														name$tr$: 'cloud.common.entityDescription',
														formatter: 'translation',
														readonly: true,
													},
												],
											},
										},
										formatter: 'lookup',
										formatterOptions: {
											lookupType: 'equipmentGroup',
											displayMember: 'Code',
											version: 3
										},
									},
									detail: {
										type: 'directive',
										directive: 'basics-lookupdata-lookup-composite',
										options: {
											lookupDirective: 'resource-equipment-group-lookup-dialog',
											displayMember: 'Code',
											descriptionMember: 'Description',
											showClearButton: true,
											lookupOptions: {
												showClearButton: true,
											},
										},
									},
								}

						}
					};
				}

				var projectManagedPlantDetailLayout = provideManagedPlantLayout();

				var projectManagedPlantDomains = platformSchemaService.getSchemaFromCache({ typeName: 'ManagedPlantLocVDto', moduleSubModule: 'Project.Main' });
				if (projectManagedPlantDomains) {
					projectManagedPlantDomains = projectManagedPlantDomains.properties;
				}

				function ManagedPlantUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ManagedPlantUIStandardService.prototype = Object.create(BaseService.prototype);
				ManagedPlantUIStandardService.prototype.constructor = ManagedPlantUIStandardService;

				return new BaseService(projectManagedPlantDetailLayout, projectManagedPlantDomains, projectMainTranslationService);
			}
		]);
})();
