/**
 * Created by janas on 12.11.2014
 */


(function () {
	'use strict';
	var moduleName = 'controlling.structure';

	/**
	 * @ngdoc service
	 * @name controllingStructureUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module(moduleName).factory('controllingStructureUIStandardService',
		['_', 'platformUIStandardConfigService', 'platformSchemaService', 'controllingStructureTranslationService', 'basicsLookupdataConfigGenerator', 'controllingStructureDynamicAssignmentsService',
			function (_, platformUIStandardConfigService, platformSchemaService, controllingStructureTranslationService, basicsLookupdataConfigGenerator, controllingStructureDynamicAssignmentsService) {

				function createDetailLayout() {
					return {
						fid: 'controlling.structure.detailform',
						version: '1.4.0',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								gid: 'basicData',
								attributes: [
									'code', 'descriptioninfo', 'controllingcatfk', 'controllingunitstatusfk','contrformulapropdeffk',
									'quantity', 'uomfk',
									'stockfk',
									'clerkfk',
									'isbillingelement', 'isaccountingelement', 'isplanningelement', 'istimekeepingelement',
									'isassetmanagement', 'isstockmanagement', 'isplantmanagement', 'isintercompany',
									'companyfk', 'companyresponsiblefk',
									'plannedstart', 'plannedend', 'plannedduration', 'commenttext', 'budget', 'isfixedbudget', 'isdefault', 'budgetdifference', 'estimatecost', 'budgetcostdiff'
								]
							},
							{
								gid: 'assignments',
								attributes: [
									'assignment01', 'assignment02', 'assignment03', 'assignment04', 'assignment05',
									'assignment06', 'assignment07', 'assignment08', 'assignment09', 'assignment10'
								]
							},
							{
								gid: 'userDefTextGroup',
								isUserDefText: true,
								attCount: 5,
								attName: 'userdefined',
								noInfix: true
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							code: {
								detail: {
									type: 'directive',
									model: 'Code',
									directive: 'basics-common-limit-input',
									options: {
										validKeys: {
											regular: '^(.{0,32})?$'
										}
									}
								},
								grid: {
									editor: 'directive',
									editorOptions: {
										directive: 'basics-common-limit-input',
										validKeys: {
											regular: '^(.{0,32})?$'
										}
									}
								}
							},
							controllingcatfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.controllingcat'),
							controllingunitstatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.contrunitstatus', null, {
								showIcon: true
							}),
							uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitLookupDataService',
								cacheEnable: true
							}
							),
							stockfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'projectStockLookupDataService',
								filter: function (cunit) {
									var prj = {
										PKey1: cunit ? cunit.ProjectFk : null,
										PKey2: null,
										PKey3: null
									};
									return prj;
								}
							}),
							clerkfk: {
								navigator: {
									moduleName: 'basics.clerk'
								},
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
							companyfk: {
								readonly: true,
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
									options: {
										lookupDirective: 'basics-company-company-lookup',
										descriptionMember: 'CompanyName',
										lookupOptions: {}
									}
								}
							},
							companyresponsiblefk: {
								readonly: false,
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
									options: {
										lookupDirective: 'basics-company-company-lookup',
										descriptionMember: 'CompanyName',
										lookupOptions: {}
									}
								}
							},
							contrformulapropdeffk:{
								'detail': {
									'type': 'directive',
									'directive': 'controlling-structure-contr-formula-prop-def-lookup',
									options: {
										filterKey: 'controlling-structure-contr-formula-prop-def-lookup-filter'
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'controlling-structure-contr-formula-prop-def-lookup',
										lookupOptions: {
											filterKey: 'controlling-structure-contr-formula-prop-def-lookup-filter'
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'contrFormulaPropDef',
										displayMember: 'Code',
										version:3
									}
								}
							},
							plannedstart: {
								editor: 'dateutc',
								formatter: 'dateutc'
							},
							plannedend: {
								editor: 'dateutc',
								formatter: 'dateutc'
							}
						}
					};
				}
				var layout = createDetailLayout();

				// dynamic assignment01-10 overloads (optional lookups)
				var assignmentAttributes = _.get(_.find(layout.groups, {'gid': 'assignments'}), 'attributes');
				controllingStructureDynamicAssignmentsService.setAssignmentOverloads(assignmentAttributes, layout.overloads);

				var BaseService = platformUIStandardConfigService,
					controllingUnitAttributeDomains = platformSchemaService.getSchemaFromCache({
						typeName: 'ControllingUnitDto',
						moduleSubModule: 'Controlling.Structure'
					});

				if (controllingUnitAttributeDomains) {
					controllingUnitAttributeDomains = controllingUnitAttributeDomains.properties;
				}

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				return new StructureUIStandardService(layout, controllingUnitAttributeDomains, controllingStructureTranslationService);
			}]);
})();
