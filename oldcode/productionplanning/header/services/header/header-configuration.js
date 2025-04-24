(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.header';
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

	angular.module(moduleName).value('productionplanningHeaderLayoutConfig', {
		addition: {
			grid: extendGrouping([
				{
					afterId: 'headergroupfk',
					id: 'gourpDesc',
					field: 'HeaderGroupFk',
					name: 'PPS Group Description',
					name$tr$: 'productionplanning.common.header.headerGroupDes',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'HeaderGroup',
						displayMember: 'DescriptionInfo.Description',
						width: 140
					}
				},
				{
					afterId: 'prjprojectfk',
					id: 'projectname',
					field: 'PrjProjectFk',
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
					afterId: 'clerkprpfk',
					id: 'clerkDesc',
					field: 'BasClerkPrpFk',
					name: 'Clerk Description',
					name$tr$: 'basics.clerk.clerkdesc',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Clerk',
						displayMember: 'Description',
						width: 140,
						version: 3
					}
				},
				{
					afterId: 'bassitefk',
					id: 'siteDesc',
					field: 'BasSiteFk',
					name: 'Site Description',
					name$tr$: 'basics.site.entityDesc',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'SiteNew',
						displayMember: 'DescriptionInfo.Description',
						width: 140,
						version: 3
					}
				}
			])
		}
	});

	//master Layout
	angular.module(moduleName).factory('productionplanningHeaderDetailLayout', ProductionplanningCommonHeaderLayout);
	ProductionplanningCommonHeaderLayout.$inject = ['basicsLookupdataConfigGenerator', 'platformLayoutHelperService', 'productionplanningCommonLayoutHelperService'];
	function ProductionplanningCommonHeaderLayout(basicsLookupdataConfigGenerator, platformLayoutHelperService, ppsCommonLayoutHelperService) {
		var config = {
			'fid': 'productionplanning.header.headerlayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'header',
					attributes: ['headerstatusfk', 'code', 'descriptioninfo', 'basclerkprpfk', 'prjprojectfk', 'engheaderfk', 'lgmjobfk', 'estheaderfk',
						'ordheaderfk', 'mdlmodelfk', 'headertypefk', 'headergroupfk', 'islive', 'engdrawingfk', 'color', 'probability', 'threshold']
				},
				{
					gid: 'production',
					attributes: ['bassitefk', 'prjlocationfk']
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
			'overloads': {
				color: {
					editor: 'color',
					editorOptions: {
						showClearButton: true
					}
				},
				code: {
					navigator: {
						moduleName: 'productionplanning.item'
					}
				},
				headerstatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ppsheaderstatus', null, {
					showIcon: true,
					imageSelectorService: 'platformStatusSvgIconService',
					svgBackgroundColor: 'BackgroundColor',
					backgroundColorType: 'dec',
					backgroundColorLayer: [1, 2, 3, 4, 5, 6]
				}),
				headertypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ppsheadertype', null, {
					showIcon: true,
					customBoolProperty: 'ISFORPRELIMINARY'
				}),
				headergroupfk: {
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {showClearButton: true},
							directive: 'productionplanning-common-header-group-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'HeaderGroup',
							displayMember: 'Code'
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'productionplanning',
						options: {
							lookupOptions: {showclearButton: true},
							lookupDirective: 'productionplanning',
							descriptionMember: 'DescriptionInfo.Description'
						}
					}
				},
				prjprojectfk: {
					navigator: {
						moduleName: 'project.main'
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
					}
				},
				basclerkprpfk: {
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
							displayMember: 'Code',
							width: 80,
							version: 3
						}
					}
				},
				estheaderfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'estimateMainHeaderLookupDataService',
					moduleQualifier: 'estimateMainHeaderLookupDataService',
					desMember: 'Code',
					additionalColumns: true,
					addGridColumns: [{
						id: 'estHeaderDescription',
						field: 'DescriptionInfo.Translated',
						name: 'Estimate Header Description',
						width: 200,
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}],
					filter: function (item) {
						return item && item.PrjProjectFk ? item.PrjProjectFk : -1;
					},
					navigator: {
						moduleName: 'estimate.main'
					}
				}),
				ordheaderfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'salesCommonContractLookupDataService',
					moduleQualifier: 'salesCommonContractLookupDataService',
					desMember: 'Code',
					additionalColumns: true,
					addGridColumns: [{
						id: 'ordHeaderDescription',
						field: 'DescriptionInfo.Translated',
						name: 'Order Header Description',
						width: 200,
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}],
					filter: function (item) {
						return item && item.PrjProjectFk ? item.PrjProjectFk : -1;
					},
					navigator: {
						moduleName: 'sales.contract'
					}
				}),
				mdlmodelfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'modelProjectModelLookupDataService',
					desMember: 'Description',
					filter: function (item) {
						return item && item.PrjProjectFk ? item.PrjProjectFk : -1;
					},
					additionalColumns: false,
					navigator: {
						moduleName: 'model.main'
					}
				}),
				bassitefk: {
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {showClearButton: true},
							directive: 'basics-site-site-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'SiteNew',
							displayMember: 'Code',
							version: 3
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {showclearButton: true},
							lookupDirective: 'basics-site-site-lookup',
							descriptionMember: 'DescriptionInfo.Description'
						}
					}
				},
				prjlocationfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'projectLocationLookupDataService',
					cacheEnable: true,
					additionalColumns: true,
					filter: function (item) {
						return item && item.PrjProjectFk ? item.PrjProjectFk : -1;
					},
					showClearButton: true
				}),
				//lgmjobfk: ppsCommonLayoutHelperService.provideJobExtensionLookupOverload({projectFk: 'PrjProjectFk'}),
				lgmjobfk: {
					navigator: {
						moduleName: 'logistic.job'
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'logistic-job-paging-extension-lookup',
							lookupOptions: {
								displayMember: 'Code',
								showClearButton: true,
								additionalColumns: true,
								addGridColumns: [{
									field: 'Address.Address',
									id: 'address',
									name: 'Address',
									name$tr$: 'basics.common.entityAddress',
									width: 150,
									formatter: 'description'
								}],
								defaultFilter: {activeJob: true, projectFk: 'PrjProjectFk'}
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'logisticJobEx',
							displayMember: 'Code',
							version: 3
						}
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'logistic-job-paging-extension-lookup',
							displayMember: 'Code',
							descriptionMember: 'Address.Address',
							showClearButton: true,
							lookupOptions: {
								defaultFilter: {activeJob: true, projectFk: 'PrjProjectFk'},
							}
						}
					}
				},
				engheaderfk: {
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							directive: 'productionplanning-engineering-header-lookup',
							lookupOptions: {
								additionalColumns: true,
								addGridColumns: [{
									id: 'Description',
									field: 'Description',
									name: 'Description',
									width: 300,
									formatter: 'description',
									name$tr$: 'cloud.common.entityDescription'
								}],
								displayMember: 'Code',
								filterKey: 'productionplanning-common-header-engheader-filter'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'EngHeader',
							displayMember: 'Code',
							version: 3
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'productionplanning-engineering-header-lookup',
							descriptionMember: 'Description',
							lookupOptions: {
								filterKey: 'productionplanning-common-header-engheader-filter'
							}
						}
					}
				},
				engdrawingfk: {
					navigator: {
						moduleName: 'productionplanning.drawing'
					},
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							directive: 'productionplanning-drawing-dialog-lookup',
							lookupOptions: {
								additionalColumns: true,
								addGridColumns: [{
									id: 'Description',
									field: 'Description',
									name: 'Description',
									width: 300,
									formatter: 'description',
									name$tr$: 'cloud.common.entityDescription'
								}],
								displayMember: 'Code',
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							version: 3,
							lookupType: 'EngDrawing',
							displayMember: 'Code'
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'productionplanning-drawing-dialog-lookup',
							descriptionMember: 'Description',
							lookupOptions: {
								defaultFilter: { projectId: 'PrjProjectFk'}
							}
						}
					}
				}
			}
		};

		return config;
	}
})(angular);