(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.engineering';
	var cloudCommonModule = 'cloud.common';

	function extendGrouping(gridColumns) {
		angular.forEach(gridColumns, function (column) {
			angular.extend(column, {
				grouping: {
					title: column.name$tr$,
					getter: column.field,
					aggregators: [],
					aggregateCollapsed: true
				}
			});
		});
		return gridColumns;
	}

	//engineering header Layout Config
	angular.module(moduleName).value('productionplanningEngineeringHeaderLayoutConfig', {
		'addition': {
			'grid': extendGrouping([
				{
					afterId: 'projectfk',
					id: 'projectname',
					field: 'ProjectFk',
					name$tr$: cloudCommonModule + '.entityProjectName',
					sortable: true,
					width: 140,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'project',
						displayMember: 'ProjectName'
					}
				},
				{
					afterId: 'clerkfk',
					id: 'clerkDesc',
					field: 'ClerkFk',
					name: 'Clerk Description',
					name$tr$: 'productionplanning.engineering.entityClerkDesc',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Clerk',
						displayMember: 'Description',
						width: 140,
						version: 3
					}
				},
				/*{
				 afterId: 'engtypefk',
				 id: 'engtypefkDesc',
				 field: 'EngTypeFk',
				 name: 'Engineeering Type Description',
				 name$tr$: 'productionplanning.engineering.entityEngTypeFkDesc',
				 formatter: 'lookup',
				 formatterOptions: {
				 lookupType: '?',
				 displayMember: 'Description',
				 width: 140
				 }
				 },*/
			])
		}
	});

	//header Layout
	angular.module(moduleName).factory('productionplanningEngineeringHeaderLayout', productionplanningEngineeringHeaderLayout);
	productionplanningEngineeringHeaderLayout.$inject = ['basicsLookupdataConfigGenerator', 'platformLayoutHelperService', 'productionplanningCommonLayoutHelperService'];
	function productionplanningEngineeringHeaderLayout(basicsLookupdataConfigGenerator, platformLayoutHelperService, ppsCommonLayoutHelperService) {
		return {
			'fid': 'productionplanning.engineering.headerLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: [
						'engstatusfk', 'code', 'description', 'projectfk', 'engtypefk', 'lgmjobfk', 'remark', 'islive'
					]
				},
				{
					gid: 'planningInfoGroup',
					attributes: [
						'clerkfk', 'modelfk'
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
				islive:{readonly:true},
				code: {
					navigator: {
						moduleName: 'productionplanning.engineering'
					}
				},
				engstatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.engineeringstatus', null, {
					showIcon: true
				}),
				engtypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.engineeringtype'),
				projectfk: {
					navigator: {
						moduleName: 'project.main'
					},
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
							descriptionField: 'ProjectName',
							descriptionMember: 'ProjectName',
							lookupOptions: {
								initValueField: 'ProjectNo'
							}

						}
					}
				},
				clerkfk: {
					grid: {
						name$tr$: 'productionplanning.engineering.entityClerkFk',
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							lookupOptions: {showClearButton: true},
							directive: 'cloud-clerk-clerk-dialog'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Clerk',
							displayMember: 'Code',
							version: 3
						},
						width: 70
					},
					detail: {
						label$tr$: 'productionplanning.engineering.entityClerkFk',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {showClearButton: true},
							lookupDirective: 'cloud-clerk-clerk-dialog',
							descriptionMember: 'Description'
						}
					}
				},
				modelfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'modelProjectModelLookupDataService',
					desMember: 'Description',
					//enableCache: true,
					filter: function (engHeader) {
						return engHeader && engHeader.ProjectFk ? engHeader.ProjectFk : -1;
					},
					additionalColumns: true,
					navigator: {
						moduleName: 'model.main'
					}
				}),
				lgmjobfk: ppsCommonLayoutHelperService.provideJobExtensionLookupOverload({projectFk: 'ProjectFk'})
			}
		};
	}

})(angular);