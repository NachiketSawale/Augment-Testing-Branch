/* global moment, _, angular */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

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

	//transport Layout Config
	angular.module(moduleName).value('transportplanningTransportLayoutConfig', {
		'addition': {
			'grid': extendGrouping([])
		}
	});

	//transport Layout
	angular.module(moduleName).factory('transportplanningTransportLayout', transportplanningTransportLayout);
	transportplanningTransportLayout.$inject = ['basicsLookupdataConfigGenerator', '$injector', 'platformLayoutHelperService','platformGridDomainService',
		'basicsLookupdataLookupFilterService', 'transportplanningTransportMainService', 'basicsLookupdataLookupDescriptorService',
		'ppsUIUtilService', 'ppsCommonCustomColumnsServiceFactory', 'productionplanningCommonLayoutHelperService'];

	function transportplanningTransportLayout(basicsLookupdataConfigGenerator, $injector, platformLayoutHelperService,platformGridDomainService,
											  basicsLookupdataLookupFilterService, transportMainService, lookupDescriptorService,
		ppsUIUtilService, customColumnsServiceFactory, ppsCommonLayoutHelperService) {

		//register filters
		var filters = [{
			key: 'transportplanning-transport-sitefk-filter',
			serverSide: true,
			fn: function () {
				return {Isdisp: true};
			}
		}, {
			key: 'transportplanning-transport-controlling-unit-filter',
			serverSide: true,
			serverKey: 'controlling.structure.prjcontrollingunit.filterkey',
			fn: function (entity) {
				return 'ProjectFk=' + getProjectId(entity);
			}
		}, {
			key: 'trs-waypoint-distance-uomfk-filter',
			fn: function (item) {
				return item.LengthDimension !== null && item.LengthDimension === 1;
			}
		}, {
			key: 'trs-waypoint-weight-uomfk-filter',
			fn: function (item) {
				return item.MassDimension > 0;
			}
		}, {
			key: 'route-truck-type-filter',
			fn: function (item) {
				return item.IsTruck;
			}
		}];
		basicsLookupdataLookupFilterService.registerFilter(filters);

		function getProjectId(entity) {
			var projectId = -1;
			if (entity.ProjectId) {
				projectId = entity.ProjectId;
			} else if (entity.ProjectFk) {
				projectId = entity.ProjectFk;
			}
			return projectId;
		}

		function summaryFormatter(row, cell, value, columnDef, dataContext, flag) {
			var format = '';
			if (dataContext) {
				if (flag) {
					return dataContext.GoodIsCancelled;
				}
				switch (dataContext.GoodIsCancelled) {
					case true:
						format += ppsUIUtilService.getIcon('type-icons ico-warning20', 'transportplanning.package.hasCancelledGood');
						break;
				}
			}
			return format;
		}

		var addColumns = [{
			id: 'Description',
			field: 'DescriptionInfo',
			name: 'Description',
			width: 300,
			formatter: 'translation',
			name$tr$: 'cloud.common.entityDescription'
		}];

		var requisitionCodesConfig = {
			id: 'requisitionCodes',
			field: 'RequisitionsInfo.Codes',
			name: '*Transport Requisitions',
			name$tr$: 'transportplanning.requisition.listRequisitionTitle',
			sortable: true,
			editor: null,
			formatter: 'description',
			readonly: true,
			navigator: {
				moduleName: 'transportplanning.requisition'
			}
		};

		var requisitionCodesDetailConfig = {
			rid: 'routeCodes',
			gid: 'deliveryGroup',
			model: 'RequisitionsInfo.Codes',
			label: '*Transport Requisitions',
			label$tr$: 'requisition.listRequisitionTitle',
			type: 'description',
			readonly: true,
			navigator: {
				moduleName: 'transportplanning.requisition'
			}
		};

		var truckDescConfig = {
			afterId: 'truckfk',
			id: 'truckdesc',
			field: 'TruckFk',
			name: '*Truck-Description',
			name$tr$: 'transportplanning.transport.truckDesc',
			formatter: 'lookup',
			formatterOptions: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'resourceSimpleLookupDataService'
			}).grid.formatterOptions,
			width: 140
		};
		truckDescConfig.formatterOptions.displayMember = 'DescriptionInfo.Translated';

		var driverDescConfig = {
			afterId: 'driverfk',
			id: 'driverdesc',
			name: '*Driver-Description',
			name$tr$: 'transportplanning.transport.driverDesc',
			field: 'DriverFk',
			formatter: 'lookup',
			formatterOptions: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'resourceSimpleLookupDataService'
			}).grid.formatterOptions,
			width: 140
		};
		driverDescConfig.formatterOptions.displayMember = 'DescriptionInfo.Translated';

		var trsStatusColor = {
			afterId: 'driverdesc',
			id: 'BackgroundColor',
			field: 'BackgroundColor',
			name: '*Color',
			name$tr$: 'transportplanning.transport.backgroundColor',
			readonly: true,
			formatter: 'color'
		};

		function getJobDefExtendedConfig(id, name, nameTr, width, disMember) {
			var conifg = {
				afterId: 'jobdeffk',
				id: id,
				field: 'JobDefFk',
				name: name,
				name$tr$: nameTr,
				formatter: 'lookup',
				formatterOptions: {
					displayMember: disMember,
					lookupType: 'logisticJobEx',
					version: 3
				},
				width: width,
				sortable: true
			};
			conifg.formatterOptions.displayMember = disMember;
			return conifg;
		}

		var jobDefDescConfig = getJobDefExtendedConfig('jobdefdesc',
			'*Default Client Job Description',
			'transportplanning.transport.jobDefDesc',
			140,
			'DescriptionInfo.Translated');

		var jobDefZipCodeConfig = getJobDefExtendedConfig('jobdefzipcode',
			'*Default Client Job Zip Code',
			'transportplanning.transport.jobDefZipCode',
			80,
			'Address.ZipCode');

		var jobDefCityConfig = getJobDefExtendedConfig('jobdefcity',
			'*Default Client Job City',
			'transportplanning.transport.jobDefCity',
			80,
			'Address.City');

		var jobDefAddressConfig = getJobDefExtendedConfig('jobdefaddress',
			'*Default Client Job Address',
			'transportplanning.transport.jobDefAddress',
			140,
			'Address.AddressLine');

		function getJobDefExtendedDetailConfig(rid, name, nameTr, disMember) {
			var conifg = {
				afterId: '',
				gid: 'contactsGroup',
				rid: rid,
				model: 'JobDefFk',
				label: name,
				label$tr$: nameTr,
				type: 'directive',
				directive: 'logistic-job-paging-extension-lookup',
				options: {
					displayMember: disMember,
					version: 3,
					readOnly: true
				}
			};
			return conifg;
		}

		var jobDefDescDetailConfig = getJobDefExtendedDetailConfig('jobdefdesc', '*Default Client Job Description', 'transportplanning.transport.jobDefDesc', 'DescriptionInfo.Translated');
		var jobDefCityDetailConfig = getJobDefExtendedDetailConfig('jobdefcity', '*Default Client Job City', 'transportplanning.transport.jobDefCity', 'Address.City');
		var jobDefZipCodeDetailConfig = getJobDefExtendedDetailConfig('jobdefzipcode', '*Default Client Job Zip Code', 'transportplanning.transport.jobDefZipCode', 'Address.ZipCode');
		var jobDefAddressDetailConfig = getJobDefExtendedDetailConfig('jobdefaddress', '*Default Client Job Address', 'transportplanning.transport.jobDefAddress', 'Address.AddressLine');


		function getProjectExtendedConfig(id, field, name, nameTr, width, disMember) {
			var conifg = {
				afterId: 'projectfk',
				id: id,
				field: field,
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
			conifg.formatterOptions.displayMember = disMember;
			return conifg;
		}

		let projectNameConfig = getProjectExtendedConfig(
			'projectName',
			'ProjectFk',
			'*Project Name',
			'cloud.common.entityProjectName',
			80,
			'ProjectName');

		var projectName2Config = getProjectExtendedConfig(
			'projectName2',
			'ProjectFk',
			'*Project Name2',
			'cloud.common.entityProjectName2',
			80,
			'ProjectName2');

		var defProjectName2Config = getProjectExtendedConfig(
			'defProjectName2',
			'ProjectDefFk',
			'*Default Project Name2',
			'cloud.common.entityDefProjectName2',
			80,
			'ProjectName2');


		function getTimefromDateExtendedConfig(
			afterID,
			id,
			field,
			name,
			nameTr,
			formatter,
			editor,
			width,
			basedOnField
		) {
			return {
				afterId: afterID,
				id: id,
				field: field,
				name: name,
				name$tr$: nameTr,
				width: width,
				sortable: true,
				readonly: false,
				editor: editor,
				formatter: formatter,
				basedOnField: basedOnField,
			};
		}

		var plannedDeliveryTimeConfig = getTimefromDateExtendedConfig(
			'planneddelivery',
			'planTimeHour',
			'PlannedDeliveryTime',
			'*Planned Delivery Hour',
			'transportplanning.transport.entityPlannedDeliveryTime',
			'timeutc',
			'timeutc',
			80,
			'PlannedDelivery');
		// for support showing time with format of am/pm when using English(US) as the language(#133740) by zwz on 2022/8/10
		plannedDeliveryTimeConfig.formatter = function (row, cell, value, columnDef, dataContext) {
			if (value && value._locale && (value._locale._abbr === 'en' || value._locale._abbr === 'en-us')) {
				return value.format('LT');
			} else {
				return platformGridDomainService.formatter('timeutc')(row, cell, value, columnDef, dataContext);
			}
		};

		var plannedDeliveryDateConfig = getTimefromDateExtendedConfig(
			'planneddelivery',
			'planTimeDate',
			'PlannedDeliveryDate',
			'*Planned Delivery Date',
			'transportplanning.transport.entityPlannedDeliveryDate',
			'dateutc',
			'dateutc',
			80,
			'PlannedDelivery');

		var plannedDeliveryDayConfig = {
			afterId: 'planneddelivery',
			id: 'planTimeDay',
			field: 'PlannedDeliveryDay',
			name: '*Planned Time Day',
			name$tr$: 'transportplanning.transport.plannedTimeDay',
			sortable: true,
			editor: 'datetimeutc',
			formatter: 'datetimeutc',
			formatterOptions: {
				showWeekday: true
			},
			readonly: true,
			grouping: {
				title: 'transportplanning.requisition.planTime',
				getter: 'PlannedTime',
				aggregators: [],
				aggregateCollapsed: true
			}
		};

		var layout = {
			'fid': 'transportplanning.transport.transportLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'change': function (entity, field) {
				transportMainService.handleFieldChanged(entity, field);
			},
			'groups': [{
				gid: 'baseGroup',
				attributes: ['summary', 'trsrtestatusfk', 'code', 'descriptioninfo', 'eventtypefk', 'projectfk', 'lgmjobfk', 'commenttext',
					'projectdeffk', 'jobdeffk', 'businesspartnerfk', 'deliveryaddresscontactfk', 'contacttelephone', 'islive', 'projectno', 'defsrcwaypointjobfk', 'defdstwaypointjobfk']
			}, {
				gid: 'resources',
				attributes: ['truckfk', 'trucktypefk', 'actualtrucktypefk', 'driverfk']
			}, {
				gid: 'planningInfoGroup',
				attributes: ['plannedstart', 'planneddelivery', 'plannedfinish', 'earlieststart', 'lateststart', 'earliestfinish', 'latestfinish',
					'actualstart', 'actualdelivery', 'actualfinish', 'dateshiftmode']
			}, {
				gid: 'Assignment',
				attributes: ['prjlocationfk', 'mdccontrollingunitfk', 'sitefk']
			}, {
				gid: 'routeInfo',
				attributes: ['sumdistance', 'sumactualdistance', 'uomfk', 'sumexpenses', 'currencyfk', 'sumpackagesweight', 'basuomweightfk', 'sumproductsactualweight']
			}, {
				gid: 'goodsInfo',
				attributes: ['sumbundlesinfo']
			}, {
				gid: 'userDefTextGroup',
				isUserDefText: true,
				attCount: 9,
				attName: 'userdefined',
				noInfix: true
			}, {
				gid: 'contactsGroup',
				attributes: []
			}, {
				gid: 'entityHistory',
				isHistory: true
			}
			],
			'overloads': {
				summary: {
					readonly: true,
					grid: {
						formatter: summaryFormatter
					}, detail: {
						type: 'directive',
						directive: 'productionplanning-common-html-directive',
						options: {
							formatter: summaryFormatter
						}
					}
				},
				code: {
					navigator: {
						moduleName: 'transportplanning.transport'
					}
				},
				trsrtestatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.transportrtestatus', null, {
					showIcon: true,
					imageSelectorService: 'platformStatusSvgIconService',
					svgBackgroundColor: 'BackgroundColor',
					backgroundColorType: 'dec',
					backgroundColorLayer: [1, 2, 3, 4, 5, 6]
				}),
				eventtypefk: {
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'EventType',
							displayMember: 'DescriptionInfo.Translated',
							version: 3
						},
						editor: 'lookup',
						editorOptions: {
							lookupField: 'EventType',
							directive: 'productionplanning-common-event-type-lookup',
							lookupOptions: {
								showClearButton: true,
								filterKey: 'transportplanning-transport-route-eventtype-filter'
							}
						},
						width: 90
					},
					detail: {
						type: 'directive',
						directive: 'productionplanning-common-event-type-lookup',
						options: {
							filterKey: 'transportplanning-transport-route-eventtype-filter'
						},
						change: function (entity, field) {
							if (entity.Version === 0) {
								var dataServ = $injector.get('transportplanningTransportMainService');
								dataServ.handleFieldChanged(entity, field);
							}
						}
					}
				},
				projectfk: {
					navigator: {
						moduleName: 'project.main'
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						change: function (entity, field) {
							if (entity.Version === 0) {
								var dataServ = $injector.get('transportplanningTransportMainService');
								dataServ.handleFieldChanged(entity, field);
							}
						},
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
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Project',
							displayMember: 'ProjectNo'
						},
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								initValueField: 'ProjectNo'
							},
							'displayMember': 'ProjectName',
							directive: 'basics-lookup-data-project-project-dialog'
						}
					}
				},
				lgmjobfk: (function () {
					var jobSetting = ppsCommonLayoutHelperService.provideJobExtensionLookupOverload({
						projectFk: 'ProjectFk'
					});
					jobSetting.grid.editorOptions.lookupOptions.events = [
						{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								args.entity.selectedJob = args.selectedItem;
							}
						}
					];
					jobSetting.detail.options.lookupOptions.events = [
						{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								args.entity.selectedJob = args.selectedItem;
							}
						}
					];
					jobSetting.detail.change = function (entity, field) {
						$injector.get('transportplanningTransportMainService').handleFieldChanged(entity, field);
					};
					return jobSetting;
				})(),

				defsrcwaypointjobfk: ppsCommonLayoutHelperService.provideJobExtensionLookupOverload(),
				defdstwaypointjobfk: ppsCommonLayoutHelperService.provideJobExtensionLookupOverload(),
				sitefk: {
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								showClearButton: true,
								filterKey: 'transportplanning-transport-sitefk-filter',
								version: 3
							},
							directive: 'basics-site-site-isdisp-lookup'
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
							lookupOptions: {
								showClearButton: true,
								filterKey: 'transportplanning-transport-sitefk-filter',
								version: 3
							},
							lookupDirective: 'basics-site-site-isdisp-lookup',
							descriptionMember: 'DescriptionInfo.Translated'
						}
					}
				},
				prjlocationfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'projectLocationLookupDataService',
					cacheEnable: true,
					additionalColumns: true,
					filter: getProjectId,
					showClearButton: true
				}),
				'mdccontrollingunitfk': {
					navigator: {
						moduleName: 'controlling.structure'
					},
					'detail': {
						'type': 'directive',
						'directive': 'controlling-Structure-Prj-Controlling-Unit-Lookup',

						'options': {
							'eagerLoad': true,
							'showClearButton': true,
							'filterKey': 'transportplanning-transport-controlling-unit-filter',
							'additionalColumns': true,
							'displayMember': 'Code',
							'addGridColumns': addColumns
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'controlling-Structure-Prj-Controlling-Unit-Lookup',
							lookupOptions: {
								showClearButton: true,
								filterKey: 'transportplanning-transport-controlling-unit-filter',
								'additionalColumns': true,
								'displayMember': 'Code',
								'addGridColumns': addColumns
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'controllingunit',
							displayMember: 'Code'
						}
					}
				},
				currencyfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsCurrencyLookupDataService',
					enableCache: true,
					readonly: false,
					additionalColumns: false
				}),
				uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					filterKey: 'trs-waypoint-distance-uomfk-filter',
					cacheEnable: true,
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: function UpdateDistance(e, args) {
								transportMainService.setRouteDistanceUom('route', args.selectedItem);
								if (args.selectedItem) {
									transportMainService.updateSumInfo('Distance');
									transportMainService.updateSumInfo('ActualDistance');
								} else {
									args.entity.SumDistance = 0;
									args.entity.SumActualDistance = 0;
								}
							}
						}]
				}),
				basuomweightfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					filterKey: 'trs-waypoint-weight-uomfk-filter'
				}),
				projectno: {
					readonly: true
				},
				projectname: {
					readonly: true
				},
				defprojectname: {
					readonly: true
				},
				planneddelivery: {
					change: function (entity, field) {
						var dataServ = $injector.get('transportplanningTransportMainService');
						dataServ.handleFieldChanged(entity, field);
					}
				},
				actualdelivery: {
					change: function (entity, field) {
						var dataServ = $injector.get('transportplanningTransportMainService');
						dataServ.handleFieldChanged(entity, field);
					}
				},
				sumdistance: {
					grouping: {
						generic: false
					},
					readonly: true
				},
				sumactualdistance: {
					grouping: {
						generic: false
					},
					readonly: true
				},
				sumexpenses: {
					grouping: {
						generic: false
					},
					readonly: true
				},
				sumpackagesweight: {
					grouping: {
						generic: false
					},
					readonly: true
				},
				sumbundlesinfo: {
					grouping: {
						generic: false
					},
					readonly: true
				},
				sumproductsactualweight: {
					grouping: {
						generic: false
					},
					readonly: true
				},
				projectdeffk: {
					navigator: {
						moduleName: 'project.main'
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						change: function (entity, model) {
							$injector.get('transportplanningTransportMainService').handleFieldChanged(entity, model);
						},
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
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Project',
							displayMember: 'ProjectNo'
						},
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								initValueField: 'ProjectNo'
							},
							'displayMember': 'ProjectName',
							directive: 'basics-lookup-data-project-project-dialog'

						}
					}

				},
				jobdeffk: (function () {
					var setting = ppsCommonLayoutHelperService.provideJobExtensionLookupOverload({
						projectFk: 'ProjectDefFk',
						jobType: 'external'
					});
					setting.grid.editorOptions.lookupOptions.events = [
						{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								args.entity.selectedJobDef = args.selectedItem;
							}
						}
					];
					setting.detail.options.lookupOptions.events = [
						{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								args.entity.selectedJobDef = args.selectedItem;
							}
						}
					];
					setting.detail.change = function (entity, field) {
						$injector.get('transportplanningTransportMainService').handleFieldChanged(entity, field);
					};
					return setting;
				})(),
				trucktypefk: (function () {
					let lookupConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'resourceTypeLookupDataService',
						filterKey: 'route-truck-type-filter',
						// events: [
						// 	{
						// 		name: 'onSelectedItemChanged',
						// 		handler: function TruckTypeChanged(e, args) {
						// 			args.entity.TruckTypeFk = args.selectedItem ? args.selectedItem.Id : null;
						// 			transportMainService.handleResourceInfo(args.entity, args.previousItem, args.selectedItem, 'TruckType');
						// 		}
						// 	}]
					});
					lookupConfig.grid.editorOptions.lookupOptions.disableDataCaching = false;
					return lookupConfig;
				})(),
				actualtrucktypefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'resourceTypeLookupDataService',
					readonly: true
				}),
				truckfk: {
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'transport-resource-lookup-dialog',
							lookupOptions: {
								resourceType: 'Truck',
								showClearButton: true,
								displayMember: 'Code',
								additionalColumns: true,
								// events: [{
								// 	name: 'onSelectedItemChanged',
								// 	handler: function DriverTypeChanged(e, args) {
								// 		args.entity.TruckFk = args.selectedItem ? args.selectedItem.Id : null;
								// 		transportMainService.handleResourceInfo(args.entity, args.previousItem, args.selectedItem, 'Truck');
								// 	}
								// }]
							}
						},
						formatter: 'lookup',
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
							lookupDirective: 'transport-resource-lookup-dialog',
							descriptionMember: 'DescriptionInfo.Translated',
							displayMember: 'Code',
							showClearButton: true,
							lookupOptions: {
								resourceType: 'Truck',
								events: [{
									name: 'onSelectedItemChanged',
									handler: function DriverTypeChanged(e, args) {
										args.entity.TruckFk = args.selectedItem ? args.selectedItem.Id : null;
										transportMainService.handleResourceInfo(args.entity, args.previousItem, args.selectedItem, 'Truck');
									}
								}]
							}
						}
					}
				},
				driverfk: {
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'transport-resource-lookup-dialog',
							lookupOptions: {
								resourceType: 'Driver',
								showClearButton: true,
								displayMember: 'Code',
								additionalColumns: true,
								// events: [{
								// 	name: 'onSelectedItemChanged',
								// 	handler: function DriverTypeChanged(e, args) {
								// 		args.entity.DriverFk = args.selectedItem ? args.selectedItem.Id : null;
								// 		transportMainService.handleResourceInfo(args.entity, args.previousItem, args.selectedItem, 'Driver');
								// 	}
								// }]
							}
						},
						formatter: 'lookup',
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
							lookupDirective: 'transport-resource-lookup-dialog',
							descriptionMember: 'DescriptionInfo.Translated',
							displayMember: 'Code',
							showClearButton: true,
							lookupOptions: {
								resourceType: 'Driver',
								events: [{
									name: 'onSelectedItemChanged',
									handler: function DriverTypeChanged(e, args) {
										args.entity.DriverFk = args.selectedItem ? args.selectedItem.Id : null;
										transportMainService.handleResourceInfo(args.entity, args.previousItem, args.selectedItem, 'Driver');
									}
								}]
							}
						}
					}
				},
				businesspartnerfk: platformLayoutHelperService.provideBusinessPartnerLookupOverload(),
				deliveryaddresscontactfk: (function () {
					var settings = platformLayoutHelperService.provideBusinessPartnerFilteredContactLookupOverload(
						'logistic-job-business-partner-contact-filter'
					);
					settings.detail.options.showDetailButton = settings.grid.editorOptions.lookupOptions.showDetailButton = true;
					settings.detail.options.detailOptions = settings.grid.editorOptions.lookupOptions.detailOptions = $injector.get('businessPartnerContactDetailOptions');
					settings.detail.options.detailOptions.onOk = function (result) {
						var telephone = '';
						if (!_.isNil(result.TelephoneNumberDescriptor)) {
							telephone = result.TelephoneNumberDescriptor.Telephone;
						}
						var selectedItem = transportMainService.getSelected();
						if (!_.isNil(selectedItem) && selectedItem.ContactTelephone !== telephone) {
							selectedItem.ContactTelephone = telephone;
							transportMainService.refreshSelectedRow();
						}

						var newFullName = result.FirstName + ' ' + result.FamilyName;
						if (newFullName !== result.FullName) {
							result.FullName = newFullName;
							lookupDescriptorService.updateData('contact', [result]);
						}
					};

					settings.detail.options.showAddButton = settings.grid.editorOptions.lookupOptions.showAddButton = true;
					var contactCreateOptions = _.clone($injector.get('businessPartnerContactCreateOptions'));//use the copy
					contactCreateOptions.creationData = function () {
						var selectedItem = $injector.get('transportplanningTransportMainService').getSelected();
						if (selectedItem) {
							return {mainItemId: selectedItem.BusinessPartnerFk};
						}
					};
					settings.detail.options.createOptions = settings.grid.editorOptions.lookupOptions.createOptions = contactCreateOptions;
					return settings;
				})(),
				contacttelephone: {readonly: true},
				islive: {readonly: true},
				dateshiftmode: {
					grid: {
						formatter: 'select',
						formatterOptions: {
							serviceName: 'productionplanningCommonDateShiftModeService',
							valueMember: 'Id',
							displayMember: 'Description'
						},
						editor: 'select',
						editorOptions: {
							serviceName: 'productionplanningCommonDateShiftModeService',
							valueMember: 'Id',
							displayMember: 'Description'
						},
						readonly: true
					},
					detail: {
						type: 'select',
						required: false,
						options: {
							serviceName: 'productionplanningCommonDateShiftModeService',
							valueMember: 'Id',
							displayMember: 'Description'
						}
					}
				}
			},
			'addition': {
				'grid': extendGrouping([
					truckDescConfig,
					driverDescConfig,
					jobDefDescConfig,
					jobDefAddressConfig,
					jobDefZipCodeConfig,
					jobDefCityConfig,
					trsStatusColor,
					projectNameConfig,
					projectName2Config,
					defProjectName2Config,
					plannedDeliveryTimeConfig,
					plannedDeliveryDateConfig,
					plannedDeliveryDayConfig,
					requisitionCodesConfig
				]),
				'detail': [jobDefDescDetailConfig,
					jobDefCityDetailConfig,
					jobDefZipCodeDetailConfig,
					jobDefAddressDetailConfig,
					requisitionCodesDetailConfig
				]
			}
		};

		for (var i = 1; i <= 5; i++) {
			layout.overloads['prjcostgroup' + i + 'fk'] = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'projectCostGroup' + i + 'LookupDataService',
				showClearButton: true,
				filter: getProjectId
			});
			layout.overloads['liccostgroup' + i + 'fk'] = basicsLookupdataConfigGenerator.provideTreeDataServiceLookupConfig({
				moduleQualifier: 'estLicCostGroups' + i + 'LookupDataService',
				dataServiceName: 'basicsCostGroups' + i + 'LookupDataService',
				valMember: 'Id',
				dispMember: 'Code'
			});
		}

		var customColumnService = customColumnsServiceFactory.getService(moduleName);
		customColumnService.setClerkRoleConfig(layout);

		return layout;
	}
})(angular);
