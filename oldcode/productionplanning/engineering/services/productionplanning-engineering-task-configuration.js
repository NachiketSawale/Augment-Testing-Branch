/**
 * Created by las on 1/25/2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.engineering';
	var engtaskModule = angular.module(moduleName);

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

	function getProjectExtendedConfig(id, name, nameTr, width, disMember) {
		var conifg = {
			afterId: 'projectid',
			id: id,
			field: 'ProjectId',
			name: name,
			name$tr$: nameTr,
			formatter: 'lookup',
			formatterOptions: {
				displayMember: disMember,
				lookupType: 'project',
				version: 3
			},
			width: width,
			sortable: true
		};
		return conifg;
	}

	var projectZipCodeConfig = getProjectExtendedConfig('projectzipcode',
		'*Project Address Post Code',
		'productionplanning.common.projectZipCode',
		80,
		'AddressEntity.ZipCode');

	var projectCityConfig = getProjectExtendedConfig('projectcity',
		'*Project Address City',
		'productionplanning.common.projectCity',
		80,
		'AddressEntity.City');

	var projectAddressConfig = getProjectExtendedConfig('projectaddress',
		'*Project Address Street',
		'productionplanning.common.projectAddress',
		140,
		'AddressEntity.AddressLine');

	function getProjectExtendedDetailConfig(rid, name, nameTr, disMember) {
		var conifg = {
			afterId: 'mdcmaterialfk',
			lookupDisplayColumn: true,
			gid: 'contactsGroup',
			rid: rid,
			model: 'ProjectId',
			label: name,
			label$tr$: nameTr,
			type: 'directive',
			directive: 'basics-lookup-data-project-project-dialog',
			options: {
				displayMember: disMember,
				version: 3
			}
		};
		return conifg;
	}

	var projectCityDetailConfig = getProjectExtendedDetailConfig('projectcity', '*Project Address City', 'productionplanning.common.projectCity', 'AddressEntity.City');
	var	projectZipCodeDetailConfig = getProjectExtendedDetailConfig('projectzipcode', '*Project Address Post Code', 'productionplanning.common.projectZipCode', 'AddressEntity.ZipCode');
	var	projectAddressDetailConfig = getProjectExtendedDetailConfig('projectaddress', '*Project Address Street', 'productionplanning.common.projectAddress', 'AddressEntity.AddressLine');

	engtaskModule.factory('productionplanningEngineeringTaskLayoutConfig', ['$translate',
		function ($translate){
		var service = {};
		service.addition = {
			grid: extendGrouping([{
					afterId: 'clerkfk',
					id: 'clerkdesc',
					field: 'ClerkFk',
					name: 'Clerk Description',
					name$tr$: 'basics.clerk.clerkdesc',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'clerk',
						displayMember: 'Description',
						version: 3
					},
					width: 140
				},
				projectCityConfig,
				projectZipCodeConfig,
				projectAddressConfig,
				{
					afterId: 'prjlocationfk',
					id: 'branchpath',
					field: 'PrjLocationFk',
					name: '*Location Full Description',
					name$tr$: 'productionplanning.common.branchPath',
					formatter: 'select',
					formatterOptions: {
						serviceName: 'productionplanningCommonLocationInfoService',
						valueMember: 'Id',
						displayMember: 'BranchPath'
					},
					readonly: true
				}, {
					afterId: 'ppsitemstatusfk',
					id: 'BackgroundColor',
					field: 'Backgroundcolor',
					name: '*Color',
					name$tr$: 'productionplanning.common.statusBackgroundColor',
					readonly: true,
					formatter: 'color'
				}
			]),
			detail: [
					projectCityDetailConfig,
					projectZipCodeDetailConfig,
					projectAddressDetailConfig,
					{
					gid: 'itemproduction',
					rid: 'branchpath',
					model: 'PrjLocationFk',
					label: $translate.instant('productionplanning.common.branchPath'),
					type: 'select',
					options: {
						serviceName: 'productionplanningCommonLocationInfoService',
						valueMember: 'Id',
						displayMember: 'BranchPath'
					},
					readonly: true
					},
				{
					gid: 'baseGroup',
					rid: 'BackgroundColor',
					model: 'Backgroundcolor',
					label: '*Color',
					label$tr$: 'productionplanning.common.statusBackgroundColor',
					readonly: true,
					type: 'color'
				}
			]};

			return service;
	}]);

	engtaskModule.factory('productionplanningEngineeringTaskDetailLayout', PpsEngtaskDetailLayout);
	PpsEngtaskDetailLayout.$inject = ['basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService', 'platformLayoutHelperService', 'productionplanningDrawingtypeLookupOverloadProvider',
		'productionplanningCommonLayoutHelperService', '$injector', 'ppsCommonCustomColumnsServiceFactory'];
	function PpsEngtaskDetailLayout(basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, platformLayoutHelperService, drawingtypeLookupOverloadProvider,
	                                ppsCommonLayoutHelperService, $injector, customColumnsServiceFactory) {

		// var clerkRoleConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
		// 	dataServiceName: 'basicsCustomClerkRoleLookupDataService',
		// 	cacheEnable: true
		// });

		// register lookup filters
		var filters = [{
				key: 'productionplanning-engineering-task-eventtype-filter',
				fn: function (item) {
					if (item) {
						return item.PpsEntityFk !== null && item.PpsEntityFk === 5;
						//"PpsEntityFK === 5" maps engtask pps entity type
					}
					return false;
				}
		}];
		_.each(filters,function (filter) {
			if (!basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
				basicsLookupdataLookupFilterService.registerFilter(filter);
			}
		});

		// function getProjectId(entity) {
		// 	var projectId = -1;
		// 	if (entity.ProjectId) {
		// 		projectId = entity.ProjectId;
		// 	} else if (entity.ProjectFk) {
		// 		projectId = entity.ProjectFk;
		// 	}
		// 	return projectId;
		// }

		var layout = {
			'fid': 'productionplanning.engineering',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'change': function (entity, field) {
				var dataService = $injector.get('productionplanningEngineeringMainService');
				dataService.onEntityPropertyChanged(entity, field);
			},
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['engtaskstatusfk', 'code', 'description', 'clerkfk', 'loginclerkroles', 'eventtypefk', 'engheaderfk',
						'lgmjobfk', 'engdrawingfk', 'engdrawingtypefk', 'siteinfo', 'ppsitemmaterialcodes', 'remark', 'islive', 'isupstreamdefined']
				},
				{
					gid: 'projectInfoGroup',
					attributes: ['projectid', 'businesspartnerfk']
				},
				{
					gid: 'Assignment',
					attributes: ['prjlocationfk', 'mdccontrollingunitfk','ppsitemfk']
				},
				{
					gid: 'planningInfoGroup',
					attributes: ['quantity', 'actualquantity', 'remainingquantity', 'basuomfk', 'actualstart', 'actualfinish',
						'plannedstart', 'plannedfinish', 'earlieststart', 'lateststart', 'earliestfinish', 'latestfinish',
						'dateshiftmode']
				},
				{
					gid: 'userDefTextGroup',
					isUserDefText: true,
					attCount: 5,
					attName: 'userdefined',
					noInfix: true
				},
				{
					gid: 'contactsGroup',
					attributes: ['businesspartnerorderfk', 'materialgroupfk','mdcmaterialfk']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			overloads: {
				islive: {readonly: true},
				engtaskstatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.engineeringtaskstatus', null, {
					showIcon: true,
					imageSelectorService: 'platformStatusSvgIconService',
					svgBackgroundColor: 'Backgroundcolor',
					backgroundColorType: 'dec',
					backgroundColorLayer: [1, 2, 3, 4, 5, 6]
				}),
				engheaderfk: {
					//readonly: true,
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							directive: 'productionplanning-engineering-header-dialog-lookup',
							lookupOptions: {
								additionalColumns: true,
								addGridColumns: [{
									id: 'Description',
									field: 'Description',
									name: 'Description',
									width: 300,
									formatter: 'description',
									name$tr$: 'cloud.common.entityDescription'
									//remark:engHeader doesn't have description tranlation
								}],
								defaultFilter: {projectId: 'ProjectId'},
								displayMember: 'Code'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							version: 3,
							lookupType: 'EngHeader',
							displayMember: 'Code'
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'productionplanning-engineering-header-dialog-lookup',
							lookupOptions: {
								defaultFilter: {projectId: 'ProjectId'}
							},
							descriptionMember: 'Description'
						}
					}
				},
				clerkfk: {
					grid: {
						name$tr$: 'cloud.common.entityClerk',
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
						label$tr$: 'cloud.common.entityClerk',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {showClearButton: true},
							lookupDirective: 'cloud-clerk-clerk-dialog',
							descriptionMember: 'Description'
						}
					}
				},
				loginclerkroles: {readonly: true},
				eventtypefk: ppsCommonLayoutHelperService.provideEventTypeLookupOverload('productionplanning-engineering-task-eventtype-filter'),
				mdccontrollingunitfk: ppsCommonLayoutHelperService.providePrjControllingUnitLookupOverload(),
				lgmjobfk: ppsCommonLayoutHelperService.provideJobExtensionLookupOverload({projectFk: 'ProjectId'}),
				prjlocationfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'projectLocationLookupDataService',
					cacheEnable: true,
					additionalColumns: true,
					filter: function (item) {
						return _.isNil(item.ProjectId) ? -1 : item.ProjectId;
					},
					showClearButton: true
				}),
				engdrawingfk: {
					navigator: {
						moduleName: 'productionplanning.drawing'
					},
					//readonly: true,
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
								defaultFilter: {projectId: 'ProjectId', ppsItemId: 'PPSItemFk'}
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
								defaultFilter: {projectId: 'ProjectId', ppsItemId: 'PPSItemFk'}
							}
						}
					}
				},
				engdrawingtypefk: drawingtypeLookupOverloadProvider.provideDrawingtypeLookupOverload(true),
				basuomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					filterKey: '',
					cacheEnable: true,
					showClearButton: false
				}),
				projectid: (function () {
					var overload = platformLayoutHelperService.provideProjectLookupOverload(null, 'ProjectId');
					overload.readonly = true;
					return overload;
				})(),
				// sitefk: {
				// 	readonly: true,
				// 	grid: {
				// 		editor: 'lookup',
				// 		editorOptions: {
				// 			lookupOptions: {showClearButton: true},
				// 			directive: 'basics-site-site-lookup'
				// 		},
				// 		formatter: 'lookup',
				// 		formatterOptions: {
				// 			lookupType: 'Site',
				// 			displayMember: 'Code'
				// 		},
				// 		width: 70
				// 	},
				// 	detail: {
				// 		type: 'directive',
				// 		directive: 'basics-lookupdata-lookup-composite',
				// 		options: {
				// 			lookupOptions: {showClearButton: true},
				// 			lookupDirective: 'basics-site-site-lookup',
				// 			descriptionMember: 'DescriptionInfo.Translated'
				// 		}
				// 	}
				// },
				siteinfo:{
					readonly: true
				},
				businesspartnerfk: {
					readonly: true,
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
							directive: 'business-partner-main-business-partner-dialog'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BusinessPartner',
							displayMember: 'BusinessPartnerName1'
						}
					}
				},
				businesspartnerorderfk:{
					readonly: true,
					detail:{
						type: 'directive',
						directive: 'business-partner-main-business-partner-dialog',
						options: {
							initValueField: 'BusinesspartnerBpName1',
							showClearButton: true
						}
					},
					grid:{
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BusinessPartner',
							displayMember: 'BusinessPartnerName1'
						}
					}},
				materialgroupfk: {
				 readonly: true,
				 detail:{
					 type: 'directive',
					 directive: 'basics-material-material-group-lookup',
					 options: {
						 initValueField: 'Code',
						 showClearButton: true
					 }
				 },
				 grid:{
					 formatter: 'lookup',
					 formatterOptions: {
						 lookupType: 'MaterialGroup',
						 displayMember: 'Code'
					 }
				 }},
				mdcmaterialfk: {
					readonly: true,
					detail:{
						type: 'directive',
						directive: 'basics-material-material-lookup',
						options: {
							initValueField: 'Code',
							showClearButton: true
						}
					},
					grid:{
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialCommodity',
							displayMember: 'Code'
						}
					}},
				ppsitemfk: {
					navigator: {
						moduleName: 'productionplanning.item'
					},
					readonly: true,
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							directive: 'productionplanning-item-item-lookup-dialog',
							lookupOptions: {
								additionalColumns: true,
								addGridColumns: [{
									id: 'Description',
									field: 'DescriptionInfo',
									name: 'Description',
									width: 300,
									formatter: 'translation',
									name$tr$: 'cloud.common.entityDescription'
								}],
								displayMember: 'Code'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							version: 3,
							lookupType: 'PPSItem',
							displayMember: 'Code'
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'productionplanning-item-item-lookup-dialog',
							descriptionMember: 'DescriptionInfo.Translated'
						}
					}
				},
				dateshiftmode: {
					grid: {
						formatter: 'select',
						formatterOptions: {
							serviceName : 'productionplanningCommonDateShiftModeService',
							valueMember: 'Id',
							displayMember: 'Description'
						},
						editor: 'select',
						editorOptions: {
							serviceName : 'productionplanningCommonDateShiftModeService',
							valueMember: 'Id',
							displayMember: 'Description'
						},
						readonly: true
					},
					detail: {
						type: 'select',
						required: false,
						options: {
							serviceName : 'productionplanningCommonDateShiftModeService',
							valueMember: 'Id',
							displayMember: 'Description'
						}
					}
				},
				ppsitemmaterialcodes: {readonly: true},
				actualquantity : {
					readonly : true
				},
				remainingquantity : {
					readonly : true
				},
				isupstreamdefined:{
					readonly: true,
					grid: {
						formatter: 'image',
						formatterOptions: {
							imageSelector: 'ppsItemUpstreamStateIconService',
							tooltip: true
						}
					},
					detail: {
						type: 'imageselect',
						options: {
							useLocalIcons: true,
							items: $injector.get('ppsItemUpstreamStateIconService').getIcons()
						}
					}
				}
			}
		};

		var customColumnService = customColumnsServiceFactory.getService(moduleName);
		customColumnService.setEventTypeConfig(layout, 'productionplanning.common.item.event');
		customColumnService.setClerkRoleConfig(layout);

		return layout;
	}

})(angular);

