(function (angular) {
	'use strict';
	const moduleName = 'procurement.quote';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc service
	 * @name basicsMaterialDocumentUIConfigurationService
	 * @function
	 *
	 * @description
	 * schedulingService is the data service for all scheduling data functions.
	 */
	angular.module(moduleName).factory('procurementQuoteRequisitionUIConfigurationService',
		['_', 'platformUIStandardConfigService', 'platformSchemaService', 'procurementQuoteTranslationService',
			'platformUIStandardExtentService',
			function (_, BaseService, platformSchemaService, translationService, extentService) {
				function createMainDetailLayout() {
					return {
						fid: 'procurement.quote.header.detail',
						version: '1.0.0',
						showGrouping: true,
						groups: [
							{
								'gid': 'baseGroup',
								'attributes': ['reqheaderfk', 'variantcode', 'variantdescription']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						overloads: {
							reqheaderfk: {
								detail: {
									'type': 'directive',
									'directive': 'procurement-common-req-header-lookup-view-dialog',
									'options': {
										displayMember: 'StatusInfo.Translated',
										imageSelector: 'platformStatusIconService',
										readOnly: true
									}
								},
								grid: {
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'reqheaderlookupview',
										imageSelector: 'platformStatusIconService',
										displayMember: 'StatusInfo.Translated'
									}
								}
							},
							'variantcode': {
								'readonly': true
							},
							variantdescription: {
								'readonly': true
							}
						},
						addition: {
							grid: getAdditionGrid(['Code', 'Description', 'CompanyName', 'DateRequired', 'ProjectNo', 'ProjectName', 'PackageCode', 'PackageDescription',
								'ClerkReqCode', 'ClerkReqDescription', 'ControllingunitCode', 'ControllingunitDescription', 'AddressLine', 'StructureCode', 'PrcStructureDescription']),
							detail: getAdditionDetail([
								{
									'model': 'ReqHeaderFk',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										descriptionMember: 'Description',
										lookupDirective: 'procurement-common-req-header-lookup-view-dialog',
										lookupOptions: {
											displayMember: 'Code',
											showClearButton: false,
											readOnly: true
										}
									},
									'navigator': {
										moduleName: 'procurement.requisition',
										registerService: 'procurementRequisitionHeaderDataService'
									}
								},
								{
									'model': 'ReqHeaderFk',
									'options': {
										displayMember: 'CompanyName',
										readOnly: true
									}
								},
								{
									'model': 'ReqHeaderFk',
									'lookupDomain': 'date',
									'options': {
										displayMember: 'DateRequired',
										formatter: 'dateutc',
										readOnly: true
									}
								},
								{
									'gid': 'baseGroup',
									'rid': 'projectFk',
									'lookupDisplayColumn': false,
									'model': 'ReqHeaderEntity.ProjectFk',
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'label$tr$': 'cloud.common.entityProject',
									'options': {
										lookupDirective: 'basics-lookup-data-project-project-dialog',
										displayMember: 'ProjectName',
										descriptionMember: 'ProjectName',
										readOnly: true
									},
									'navigator': {
										moduleName: 'project.main'
									}
								},
								{
									'gid': 'baseGroup',
									'rid': 'packageFk',
									'lookupDisplayColumn': false,
									'model': 'ReqHeaderEntity.PackageFk',
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'label$tr$': 'cloud.common.entityPackage',
									'options': {
										'lookupDirective': 'procurement-common-package-lookup',
										'displayMember': 'Description',
										'descriptionMember': 'Description',
										readOnly: true
									},
									navigator: {
										moduleName: 'procurement.package'
									}
								},
								{
									'model': 'ReqHeaderFk',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										descriptionMember: 'ClerkReqDescription',
										lookupDirective: 'procurement-common-req-header-lookup-view-dialog',
										lookupOptions: {
											displayMember: 'ClerkReqCode',
											readOnly: true
										}
									}
								},
								{
									'model': 'ReqHeaderFk',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										descriptionMember: 'ControllingUnitDescription',
										lookupDirective: 'procurement-common-req-header-lookup-view-dialog',
										lookupOptions: {
											displayMember: 'ControllingunitCode',
											readOnly: true
										}
									}
								},
								{
									'model': 'ReqHeaderFk',
									'options': {
										displayMember: 'AddressLine',
										readOnly: true
									}
								},
								{
									'options': {
										lookupOptions: {
											displayMember: 'StructureCode',
										}
									}
								}
							])
						}
					};

					function getTranslationKey(displayMember) {
						if (/.(Code|No)$/.test(displayMember)) {
							return displayMember.replace('Code', 'Fk').replace('No', 'Fk');
						} else {
							return displayMember;
						}
					}

					function getAdditionGrid(displayMembers) {
						return _.map(displayMembers, function (displayMember) {

							let displayFields = displayMember.split('$');
							let translationGrid = translationService.getTranslationInformation(getTranslationKey(displayFields[0]));

							let formatterOptions = {displayMember: displayFields[0]};
							if (displayFields[1]) {
								formatterOptions.imageSelector = displayFields[1];
							}
							if ('Code' === displayFields[0]) {
								formatterOptions.navigator = {
									moduleName: 'procurement.requisition',
									registerService: 'procurementRequisitionHeaderDataService'
								};
							}

							let result = {
								lookupDisplayColumn: true,
								field: 'ReqHeaderFk',
								name: translationGrid.initial,
								name$tr$: translationGrid.location + '.' + translationGrid.identifier,
								formatterOptions: formatterOptions,
								imageSelector: displayFields[1],
								width: 150,
								grouping: {
									title: translationGrid.initial,
									title$tr$: translationGrid.location + '.' + translationGrid.identifier,
									getter: 'ReqHeaderFk',
									aggregators: [],
									aggregateCollapsed: true
								}
							};

							if ('ProjectNo' === displayFields[0]) {
								result.lookupDisplayColumn = false;
								result.field = 'ReqHeaderEntity.ProjectFk';
								result.name = 'Project No.';
								result.name$tr$ = 'cloud.common.entityProjectNo';
								result.formatter = 'lookup';
								result.formatterOptions = {
									lookupType: 'project',
									displayMember: 'ProjectNo'
								};
								result.grouping.getter = 'ReqHeaderEntity.ProjectFk';
								result.navigator = {
									moduleName: 'project.main'
								};
							}

							if ('ProjectName' === displayFields[0]) {
								result.field = 'ReqHeaderEntity.ProjectFk';
								result.name = 'Project Name';
								result.name$tr$ = 'cloud.common.entityProjectName';
								result.formatter = 'lookup';
								result.formatterOptions = {
									lookupType: 'project',
									displayMember: 'ProjectName'
								};
								result.grouping.getter = 'ReqHeaderEntity.ProjectFk';
							}

							if ('PackageCode' === displayFields[0]) {
								result.lookupDisplayColumn = false;
								result.field = 'ReqHeaderEntity.PackageFk';
								result.name = 'Package Code';
								result.name$tr$ = 'cloud.common.entityPackageCode';
								result.formatter = 'lookup';
								result.formatterOptions = {
									lookupType: 'PrcPackage',
									displayMember: 'Code'
								};
								result.grouping.getter = 'ReqHeaderEntity.PackageFk';
								result.navigator = {
									moduleName: 'procurement.package'
								};
							}

							if ('PackageDescription' === displayFields[0]) {
								result.field = 'ReqHeaderEntity.PackageFk';
								result.name = 'Package Description';
								result.name$tr$ = 'cloud.common.entityPackageDescription';
								result.formatter = 'lookup';
								result.formatterOptions = {
									lookupType: 'PrcPackage',
									displayMember: 'Description'
								};
								result.grouping.getter = 'ReqHeaderEntity.PackageFk';
							}

							if ('DateRequired' === displayFields[0]) {
								result.lookupDisplayColumn = false;
								result.field = 'ReqHeaderEntity';
								result.formatter = 'dateutc';
							}

							if ('StructureCode' === displayFields[0]) {
								result.lookupDisplayColumn = false;
								result.field = 'PrcHeaderEntity.StructureFk';
								result.formatter = 'lookup';
								result.formatterOptions = {
									lookupType: 'prcstructure',
									displayMember: 'Code'
								};
								result.grouping.getter = 'PrcHeaderEntity.StructureFk';
								result.navigator = {
									moduleName: 'basics.procurementstructure'
								};
							}

							if ('PrcStructureDescription' === displayFields[0]) {
								result.field = 'PrcHeaderEntity.StructureFk';
								result.name = 'Structure Description';
								result.name$tr$ = 'cloud.common.entityStructureDescription';
								result.formatter = 'lookup';
								result.formatterOptions = {
									lookupType: 'prcstructure',
									displayMember: 'DescriptionInfo.Translated'
								};
								result.grouping.getter = 'PrcHeaderEntity.StructureFk';
							}

							return result;
						});
					}

					function getAdditionDetail(rows) {
						let order = 1;
						return _.map(rows, function (row) {
							let displayMemberDetail = (row.options ? (row.options.lookupOptions || row.options) : row).displayMember;

							if (displayMemberDetail === 'StructureCode') {
								return {
									'navigator': {
										moduleName: 'basics.procurementstructure'// ,
									},
									'afterid': '',
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
											readonly: true
										}
									},
									sortOrder: order++
								};
							}

							let translationDetail = translationService.getTranslationInformation(getTranslationKey(displayMemberDetail));
							return angular.extend(
								{
									lookupDisplayColumn: true,
									model: row.model,
									label: translationDetail.initial,
									label$tr$: translationDetail.location + '.' + translationDetail.identifier,
									options: {readOnly: true},
									width: 150,
									sortOrder: order++
								},
								row
							);
						});
					}
				}

				let companyClerkAttributeDomains = platformSchemaService.getSchemaFromCache({typeName: 'QuoteRequisitionDto', moduleSubModule: 'Procurement.Quote'});
				let layout = createMainDetailLayout();
				let uiService = new BaseService(layout, companyClerkAttributeDomains.properties, translationService);
				extentService.extend(uiService, layout.addition);
				return uiService;
			}]
	);
})(angular);

