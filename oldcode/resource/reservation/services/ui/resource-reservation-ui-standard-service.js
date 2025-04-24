(function () {
	'use strict';
	var moduleName = 'resource.reservation';

	/**
	 * @ngdoc service
	 * @name resourceReservationUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of resource entities
	 */
	angular.module(moduleName).factory('resourceReservationUIStandardService',
		['$injector', 'platformUIStandardConfigService', 'platformLayoutHelperService', 'resourceReservationTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator',

			function ($injector, platformUIStandardConfigService, platformLayoutHelperService, resourceReservationTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

				function createMainDetailLayout() {

					return {
						fid: 'resource.reservation.detailform',
						version: '1.0.0',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								'gid': 'baseGroup',
								'attributes': ['description', 'resourcefk', 'typefk', 'reservationstatusfk', 'dispatchergroupfk', 'reservationtypefk',
									'requisitionfk', 'reservedfrom', 'reservedto', 'quantity', 'uomfk', 'comment', 'projectfk', 'workingdays', 'calendardays',
									'jobfk', 'jobgroupfk', 'companyfk', 'jobpreferredfk', 'isworkonweekend', 'instructionsofdriver', 'projectchangefk', 'projectchangestatusfk','code']
							},
							platformLayoutHelperService.getUserDefinedTextGroup(5, 'userDefTextGroup', 'userdefinedtext', '0'),
							platformLayoutHelperService.getUserDefinedDateGroup(5, 'userDefDateGroup', 'userdefineddate', '0'),
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						overloads: {
							companyfk: platformLayoutHelperService.provideCompanyLookupReadOnlyOverload(),
							projectchangefk: getChangeLookupOverload(),
							projectchangestatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.projectchangestatus', null, {
								showIcon: true,
								field: 'RubricCategoryFk',
								customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'
							}),
							resourcefk: {
								navigator: {
									moduleName: 'resource.master'
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'resource-master-resource-lookup-dialog-new',
										lookupOptions: {
											showClearButton: true,
											displayMember: 'Code',
											additionalColumns: true,
											addGridColumns: [{
												id: 'description',
												field: 'DescriptionInfo',
												name: 'Description',
												name$tr$: 'cloud.common.entityDescription',
												formatter: 'translation',
												readonly: true
											}]
										}
									},
									formatter: function getResourceFormatted(row, cell, value, model, item) {
										if(model.id === 'resourcefkdescription') {
											return item.ResourceDescription;
										}
										return item.ResourceCode;
									},
									formatterOptions: {
										lookupType: 'ResourceMasterResource',
										version: 3,
										displayMember: 'Code'
									}
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										//filterKey: filterKey,
										lookupDirective: 'resource-master-resource-lookup-dialog-new',
										descriptionMember: 'DescriptionInfo.Translated',
										displayMember: 'Code',
										showClearButton: true,
										lookupOptions: {
										//	defaultFilter: filter
										}
									}
								}
							}, // platformLayoutHelperService.provideResourceLookupOverload({typeFk: 'TypeFk'}),
							reservationstatusfk: basicsLookupdataConfigGenerator.getStatusLookupConfig('basics.customize.resreservationstatus'),
							reservationtypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resourcereservationtype', '', {
								filterKey: 'resource-requisition-type-filter'
							}),
							jobpreferredfk: platformLayoutHelperService.provideJobLookupOverload({projectFk: 'ProjectFk'}),
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
											defaultFilter: {resourceFk: 'ResourceFk'}
										},
										directive: 'resource-requisition-lookup-dialog-new'
									},
									formatter: function getRequisitionDescription(row, cell, value, model, item) {
										return (item && item.Requisition) ? item.Requisition.Description : '';
									},
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
										lookupOptions: {
											defaultFilter: {resourceFk: 'ResourceFk'}
										}
									}
								}
							},
							uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitLookupDataService',
								cacheEnable: true,
								additionalColumns: false
							}),
							dispatchergroupfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.logisticsdispatchergroup'),
							typefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'resourceTypeLookupDataService',
								cacheEnable: true
							}),
							projectfk: platformLayoutHelperService.provideProjectLookupOverload(),

							jobfk: platformLayoutHelperService.provideJobLookupReadOnlyOverload(),

							jobgroupfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.jobgroup'),
						}
					};
				}

				var resDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var resAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'ReservationDto',
					moduleSubModule: 'Resource.Reservation'
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

				return new BaseService(resDetailLayout, resAttributeDomains, resourceReservationTranslationService);
			}
		]);
})();
