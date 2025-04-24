/**
 * Created by lav on 11/19/2018.
 */
(function () {
	'use strict';
	/*global moment*/
	var moduleName = 'transportplanning.transport';
	/**
	 * @ngdoc service
	 * @name transportplanningTransportUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of transport entities
	 */
	angular.module(moduleName).factory('transportplanningTransportReturnResourcesUIService', UIStandardService);

	UIStandardService.$inject = ['$http',
		'transportplanningTransportValidationService',
		'platformTranslateService',
		'platformRuntimeDataService',
		'platformDataValidationService',
		'basicsLookupdataConfigGenerator',
		'transportplanningTransportMainService',
		'$injector',
		'basicsLookupdataLookupFilterService',
		'platformLayoutHelperService',
		'platformStatusIconService',
		'transportplanningTransportRouteStatusLookupService',
		'productionplanningCommonLayoutHelperService'];

	function UIStandardService($http,
							   transportValidationService,
							   platformTranslateService,
							   platformRuntimeDataService,
							   platformDataValidationService,
							   basicsLookupdataConfigGenerator,
							   transportMainService,
							   $injector,
							   basicsLookupdataLookupFilterService,
							   platformLayoutHelperService,
							   platformStatusIconService,
		routeStatusLookupService,
		ppsCommonLayoutHelperService) {

		var service = {};

		service.applyValidation = function (entity, fields, validationService) {
			if (!validationService) {
				validationService = transportValidationService;
			}
			_.forEach(fields, function (field) {
				var validateMethod = validationService['validate' + field] || service['validate' + field];
				if (validateMethod) {
					platformRuntimeDataService.applyValidationResult(validateMethod(entity, entity[field], field), entity, field);
				}
			});
		};

		service.validatePlannedPickUp = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, transportValidationService, transportMainService);
		};

		service.getFilterFormOptionsPlants = function () {
			//register filters
			var filters = [{
				key: 'transportplanning-transport-stockyard-sitefk-filter',
				serverSide: true,
				fn: function () {
					return {IsStockyard: true};
				}
			}];
			basicsLookupdataLookupFilterService.registerFilter(filters);

			var filterFormConfig = {
				fid: 'transportplanning.transport.returnResoursesModal',
				showGrouping: false,
				groups: [
					{
						gid: 'baseGroup'
					}
				],
				rows: [
					{
						gid: 'baseGroup',
						rid: 'projectfk',
						model: 'ProjectFk',
						sortOrder: 1,
						label$tr$: 'cloud.common.entityProject',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-lookup-data-project-project-dialog',
							displayMember: 'Code',
							descriptionMember: 'ProjectName',
							lookupOptions: {
								showClearButton: true
							}
						}
					},
					{
						gid: 'baseGroup',
						rid: 'businesspartnerfk',
						model: 'BusinessPartnerFk',
						sortOrder: 3,
						label$tr$: 'cloud.common.entityBusinessPartner',
						type: 'directive',
						directive: 'business-partner-main-business-partner-dialog',
						options: {
							showClearButton: true
						}
					},
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
						{
							dataServiceName: 'resourceEquipmentGroupLookupDataService',
							cacheEnable: true,
							additionalColumns: false,
							showClearButton: true
						},
						{
							gid: 'baseGroup',
							rid: 'plantgroup',
							label: 'Equipment Group',
							label$tr$: 'resource.equipmentgroup.entityResourceEquipmentGroup',
							type: 'integer',
							model: 'PlantGroupFk',
							sortOrder: 3
						}),
					basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.planttype', '', {
						gid: 'baseGroup',
						rid: 'planttype',
						model: 'PlantTypeFk',
						sortOrder: 5,
						label$tr$: 'basics.customize.planttype'
					}, false, {}),
					{
						gid: 'baseGroup',
						rid: 'sitefk',
						model: 'SiteFk',
						sortOrder: 2,
						label$tr$: 'basics.site.entitySite',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {
								showClearButton: true,
								filterKey: 'transportplanning-transport-stockyard-sitefk-filter'
							},
							lookupDirective: 'basics-site-site-isstockyard-lookup',
							descriptionMember: 'DescriptionInfo.Translated'
						}
					},
					{
						gid: 'baseGroup',
						rid: 'deadline',
						type: 'datetimeutc',
						label$tr$: 'logistic.job.labelDeadlineSetup',
						model: 'Deadline',
						sortOrder: 6
					},
					{
						gid: 'baseGroup',
						rid: 'hasremainingquantity',
						type: 'boolean',
						label$tr$: 'transportplanning.transport.wizard.remainingQuantityBigZero',
						model: 'HasRemainingQuantity',
						sortOrder: 7
					}
				]
			};
			return {configure: platformTranslateService.translateFormConfig(filterFormConfig)};
		};

		service.getFilterFormOptions = function () {
			//register filters
			var filters = [{
				key: 'transportplanning-transport-stockyard-sitefk-filter',
				serverSide: true,
				fn: function () {
					return {IsStockyard: true};
				}
			}];
			basicsLookupdataLookupFilterService.registerFilter(filters);

			var filterFormConfig = {
				fid: 'transportplanning.transport.returnResoursesModal',
				showGrouping: false,
				groups: [
					{
						gid: 'baseGroup'
					}
				],
				rows: [
					{
						gid: 'baseGroup',
						rid: 'projectfk',
						model: 'ProjectFk',
						sortOrder: 1,
						label$tr$: 'cloud.common.entityProject',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-lookup-data-project-project-dialog',
							displayMember: 'Code',
							descriptionMember: 'ProjectName',
							lookupOptions: {
								showClearButton: true
							}
						}
					},
					{
						gid: 'baseGroup',
						rid: 'businesspartnerfk',
						model: 'BusinessPartnerFk',
						sortOrder: 3,
						label$tr$: 'cloud.common.entityBusinessPartner',
						type: 'directive',
						directive: 'business-partner-main-business-partner-dialog',
						options: {
							showClearButton: true
						}
					},
					basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.resourcegroup', '', {
						gid: 'baseGroup',
						rid: 'resourcegroupfk',
						model: 'ResourceGroupFk',
						sortOrder: 4,
						label$tr$: 'basics.customize.resourcegroup'
					}, false, {}),
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'resourceTypeLookupDataService',
						showClearButton: true
					}, {
						gid: 'baseGroup',
						rid: 'resourcetypefk',
						model: 'ResourceTypeFk',
						sortOrder: 5,
						label$tr$: 'productionplanning.common.event.resTypeFk'
					}),
					{
						gid: 'baseGroup',
						rid: 'sitefk',
						model: 'SiteFk',
						sortOrder: 2,
						label$tr$: 'basics.site.entitySite',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {
								showClearButton: true,
								filterKey: 'transportplanning-transport-stockyard-sitefk-filter'
							},
							lookupDirective: 'basics-site-site-isstockyard-lookup',
							descriptionMember: 'DescriptionInfo.Translated'
						}
					},
					{
						gid: 'baseGroup',
						rid: 'hasremainingquantity',
						type: 'boolean',
						label$tr$: 'transportplanning.transport.wizard.remainingQuantityBigZero',
						model: 'HasRemainingQuantity',
						sortOrder: 6
					}
				]
			};
			return {configure: platformTranslateService.translateFormConfig(filterFormConfig)};
		};

		service.getFilterFormOptions1 = function () {
			var filters = [{
				key: 'transportplanning-transport-stockyard-sitefk-filter',
				serverSide: true,
				fn: function () {
					return {IsStockyard: true};
				}
			}];
			basicsLookupdataLookupFilterService.registerFilter(filters);
			var filterFormConfig = {
				fid: 'transportplanning.transport.returnResoursesModal',
				showGrouping: false,
				groups: [
					{
						gid: 'baseGroup'
					}
				],
				rows: [
					{
						gid: 'baseGroup',
						rid: 'zipCode',
						type: 'description',
						label$tr$: 'platform.portal.zipCode',
						model: 'ZipCode',
						sortOrder: 1
					},
					{
						gid: 'baseGroup',
						rid: 'startDate',
						type: 'datetimeutc',
						label$tr$: 'basics.common.changeStatus.from',
						model: 'StartDate',
						sortOrder: 2
					},
					{
						gid: 'baseGroup',
						rid: 'endDate',
						type: 'datetimeutc',
						label$tr$: 'basics.common.changeStatus.to',
						model: 'EndDate',
						sortOrder: 3
					},
					{
						gid: 'baseGroup',
						rid: 'siteFk',
						sortOrder: 4,
						model: 'SiteFk',
						label: '*Handled By',
						label$tr$: 'transportplanning.requisition.entitySite',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {
								showClearButton: true,
								filterKey: 'transportplanning-transport-sitefk-filter'
							},
							lookupDirective: 'basics-site-site-isdisp-lookup',
							descriptionMember: 'DescriptionInfo.Translated'
						}
					},
					{
						gid: 'baseGroup',
						rid: 'trsRteStatusFks',
						label$tr$: 'cloud.common.entityStatus',
						sortOrder: 5,
						model: 'TrsRteStatusFks',
						type: 'directive',
						directive: 'productionplanning-common-custom-filter-value-list',
						dropboxOptions: {
							items: routeStatusLookupService.getList(),
							valueMember: 'Id',
							displayMember: 'DescriptionInfo.Translated'//do not support
						},
						templateOptions: {
							type: 'status',
							displayMember: 'DescriptionInfo.Translated'
						}
					}
				]
			};
			return {configure: platformTranslateService.translateFormConfig(filterFormConfig)};
		};

		service.getRouteFormOptions = function () {
			var routeFormConfig = {
				fid: 'transportplanning.transport.createTrsRouteModal',
				showGrouping: false,
				groups: [
					{
						gid: 'baseGroup'
					}
				],
				rows: [
					(function () {
						var setting = ppsCommonLayoutHelperService.provideJobExtensionLookupOverload({
							jobType: 'internal'
						});
						setting = _.extend(setting.detail,
							{
								gid: 'baseGroup',
								rid: 'dstjobfk',
								model: 'DstJobFk',
								sortOrder: 1,
								required: true,
								label$tr$: 'transportplanning.package.entityLgmJobDstFk'
							}
						);
						setting.options.descriptionMember = 'Address.Address';
						setting.options.lookupOptions.events = [
							{
								name: 'onSelectedItemChanged',
								handler: function (e, args) {
									args.entity.JobDefFk = args.selectedItem ? args.selectedItem.Id : null;
									args.entity.ProjectDefFk = args.selectedItem ? args.selectedItem.ProjectFk : null;
								}
							}
						];
						setting.validator = function (entity, value, model) {
							return platformDataValidationService.validateMandatory(entity, value, model, transportValidationService, transportMainService);
						};
						return setting;
					})(),
					{
						gid: 'baseGroup',
						rid: 'code',
						label$tr$: 'cloud.common.entityCode',
						model: 'Code',
						type: 'code',
						required: true,
						sortOrder: 2
					},
					{
						gid: 'baseGroup',
						rid: 'Description',
						label$tr$: 'cloud.common.entityDescription',
						model: 'DescriptionInfo',
						type: 'translation',
						sortOrder: 3
					},
					{
						gid: 'baseGroup',
						rid: 'eventtypefk',
						model: 'EventTypeFk',
						sortOrder: 4,
						label$tr$: 'transportplanning.transport.entityEventTypeFk',
						type: 'directive',
						required: true,
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {
								filterKey: 'transportplanning-transport-route-eventtype-filter',
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											$http.get(globals.webApiBaseUrl + 'transportplanning/transport/route/updateroute?PpsEventTypeFk=' + args.selectedItem.Id + '&jobFk=' + args.selectedItem.LgmJobFk +'&projectFk' + args.selectedItem.ProjectFk).then(function (respond) {
												if (respond.data) {
													var route = respond.data;
													args.entity.Code = route.Code;
													if (!args.entity.PlannedPickUp) {
														args.entity.PlannedPickUp = moment.utc(route.PlannedStart);
													}
													service.applyValidation(args.entity, ['Code', 'PlannedPickUp']);
												}
											});
										}
									}
								]
							},
							lookupDirective: 'productionplanning-common-event-type-lookup',
							descriptionMember: 'DescriptionInfo.Translated'
						}
					},
					{
						gid: 'baseGroup',
						rid: 'projectfk',
						model: 'ProjectFk',
						sortOrder: 5,
						label$tr$: 'cloud.common.entityProject',
						type: 'directive',
						required: true,
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-lookup-data-project-project-dialog',
							displayMember: 'Code',
							descriptionMember: 'ProjectName',
							lookupOptions: {
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											args.entity.LgmJobFk = null;
										}
									}
								]
							}
						}
					},
					{
						gid: 'baseGroup',
						rid: 'lgmjobfk',
						model: 'LgmJobFk',
						sortOrder: 6,
						label$tr$: 'logistic.job.entityJob',
						type: 'directive',
						required: true,
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'logistic-job-paging-extension-lookup',
							displayMember: 'Code',
							descriptionMember: 'Address.Address',
							lookupOptions: {
								defaultFilter: {projectFk: 'ProjectFk'},
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											args.entity.ProjectFk = args.selectedItem.ProjectFk;
											platformDataValidationService.removeFromErrorList(args.entity, 'ProjectFk', transportValidationService, transportMainService);
											platformRuntimeDataService.applyValidationResult(args, args.entity, 'ProjectFk');
										}
									}
								]
							}
						}
					},
					{
						gid: 'baseGroup',
						rid: 'planneddelivery',
						label$tr$: 'transportplanning.transport.plannedPickUp',
						label: '*Planned PickUp Time',
						model: 'PlannedPickUp',
						type: 'datetimeutc',
						required: true,
						sortOrder: 9,
						validator: service.validatePlannedPickUp
					}
				]
			};
			_.forEach(routeFormConfig.rows, function (row) {
				var rowModel = row.model.replace(/\./g, '$');
				var syncName = 'validate' + rowModel;
				if (!row.validator && transportValidationService[syncName]) {
					row.validator = transportValidationService[syncName];
				}
			});
			return {configure: platformTranslateService.translateFormConfig(routeFormConfig)};
		};

		service.getRouteFormOptions1 = function (forUnplanned) {
			var routeFormConfig = {
				fid: 'transportplanning.transport.createTrsRouteModal',
				showGrouping: false,
				groups: [
					{
						gid: 'baseGroup'
					}
				],
				rows: [
					(function () {
						var tmp = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'transportplanningTransportReturnResourceWaypointLookupDataService',
							filter: function (entity) {
								return entity;
							}
						}, {
							gid: 'baseGroup',
							rid: 'dstwpfk',
							model: 'DstWPFk',
							required: true,
							sortOrder: 3,
							label$tr$: 'transportplanning.package.entityTrsWaypointDstFk',
							validator: function (entity, value, model) {
								return platformDataValidationService.validateMandatory(entity, value, model, null, transportMainService);
							}
						});
						tmp.options.lookupOptions.showAddButton = true;
						tmp.options.lookupOptions.createOptions = _.clone($injector.get('transportplanningTransportWaypointCreateOptions'));
						tmp.options.lookupOptions.createOptions.creationData = function () {
							return {'PKey1': $injector.get('transportplanningTransportReturnResourcesRouteSettingService').getResult().routeEntity.Id};
						};
						tmp.options.lookupOptions.events = [
							{
								name: 'onSelectedItemChanged',
								handler: function (e, args) {
									args.entity.waypointEntity = args.selectedItem;
								}
							}];
						return tmp;
					})()
				]
			};
			if (forUnplanned) {
				routeFormConfig.rows.splice(1);
			}
			return {configure: platformTranslateService.translateFormConfig(routeFormConfig)};
		};

		service.getSelectOptions = function (dataService, forPlants) {
			var options = {
				jobGrid: {
					state: '2530C2D55D6146A0AC950BD7274DFC9B',
					columns: [
						{
							field: 'Checked',
							formatter: 'boolean',
							id: 'checked1',
							width: 20,
							pinned: true
						},
						{
							id: 'code',
							field: 'Code',
							name$tr$: 'cloud.common.entityCode',
							width: 70,
							sortable: true,
							formatter: 'code'
						},
						{
							id: 'total',
							field: 'RemainingQuantity',
							formatter: 'quantity',
							name$tr$: 'transportplanning.transport.wizard.remainingQuantity',
							width: 70,
							sortable: true,
							searchable: true
						},
						{
							id: 'description',
							field: 'Description',
							name$tr$: 'cloud.common.entityDescription',
							width: 100,
							sortable: true,
							formatter: 'description'
						},
						{
							id: 'address',
							formatter: 'description',
							field: 'Address',
							name$tr$: 'cloud.common.entityDeliveryAddress',
							width: 100,
							sortable: true,
							formatterOptions: {
								displayMember: 'Address'
							}
						},
						{
							id: 'contactname',
							field: 'ContactName',
							name$tr$: 'transportplanning.transport.wizard.contactName',
							width: 70,
							sortable: true,
							formatter: 'description'
						},
						{
							id: 'contactPhone',
							field: 'ContactPhone',
							name$tr$: 'transportplanning.transport.wizard.contactPhone',
							width: 100,
							sortable: true,
							formatter: 'description'
						}
					]
				},
				resourceGrid: {
					idProperty: 'OriginalId',
					state: '3530C2D43D6146A0AC950BD7274DFC9B',
					columns: [
						{
							editor: 'boolean',
							field: 'Checked',
							formatter: 'boolean',
							id: 'checked',
							width: 80,
							pinned: true,
							headerChkbox: true,
							name$tr$: 'cloud.common.entitySelected'
						},
						{
							id: 'code',
							field: 'Code',
							name$tr$: 'cloud.common.entityCode',
							width: 60,
							sortable: true,
							formatter: 'code'
						},
						{
							id: 'description',
							field: 'Description',
							name$tr$: 'cloud.common.entityDescription',
							width: 90,
							formatter: 'description'
						},
						(function () {
							var column = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
								dataServiceName: 'resourceTypeLookupDataService'
							}, {
								id: 'resourcetype',
								field: 'ResourceType',
								name$tr$: 'cloud.common.entityType',
								width: 80,
								sortable: true
							});
							column.editor = null;
							return column;
						})(),
						{
							id: 'remainingquantity',
							field: 'RemainingQuantity',
							name$tr$: 'transportplanning.transport.wizard.remainingQuantity',
							formatter: 'quantity',
							width: 110,
							sortable: true,
							searchable: true
						}
					]
				},
				resourcePlanGrid: {
					state: '4530C2D55D6146A0AC950BD7274DFC9B',
					columns: [
						{
							id: 'transporttype',
							field: 'TransportType',
							name$tr$: 'transportplanning.transport.wizard.transportType',
							width: 90,
							sortable: true,
							formatter: 'description'
						},
						{
							id: 'transportdate',
							field: 'TransportDate',
							name$tr$: 'cloud.common.entityDate',
							width: 140,
							sortable: true,
							formatter: 'datetimeutc'
						},
						{
							id: 'transportquantity',
							field: 'TransportQuantity',
							name$tr$: 'cloud.common.entityQuantity',
							formatter: 'quantity',
							width: 100,
							sortable: true,
							searchable: true
						},
						{
							id: 'remainingquantity1',
							field: 'RemainingQuantity',
							name$tr$: 'transportplanning.transport.wizard.remainingQuantity',
							formatter: 'quantity',
							width: 140,
							sortable: true,
							searchable: true
						},
						{
							id: 'remark',
							field: 'Remark',
							name$tr$: 'cloud.common.entityRemark',
							formatter: 'remark',
							width: 140,
							sortable: true,
							searchable: true
						}
					]
				}
			};
			if (forPlants) {
				options.resourceGrid = {
					idProperty: 'OriginalId',
					state: '3530C2D43D6146A0AC950BD7274DFC9C',
					columns: [
						{
							editor: 'boolean',
							field: 'Checked',
							formatter: 'boolean',
							id: 'checked',
							width: 80,
							pinned: true,
							headerChkbox: true,
							name$tr$: 'cloud.common.entitySelected'
						},
						{
							id: 'code',
							field: 'Code',
							name$tr$: 'cloud.common.entityCode',
							width: 60,
							sortable: true,
							formatter: 'code'
						},
						{
							id: 'description',
							field: 'Description',
							name$tr$: 'cloud.common.entityDescription',
							width: 90,
							formatter: 'description'
						},
						(function () {
							var column = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.plantstatus', null, {
								showIcon: true,
								imageSelectorService: 'platformStatusIconService'
							}).grid;
							_.extend(column, {
								id: 'plantStatus',
								field: 'PlantStatus',
								name$tr$: 'basics.customize.plantstatus',
								width: 80,
								sortable: true
							});
							column.editor = null;
							return column;
						})(),
						(function () {
							var column = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.planttype').grid;
							_.extend(column, {
								id: 'plantType',
								field: 'PlantType',
								name$tr$: 'cloud.common.entityType',
								width: 80,
								sortable: true
							});
							column.editor = null;
							return column;
						})(),
						{
							id: 'remainingquantity',
							field: 'RemainingQuantity',
							name$tr$: 'transportplanning.transport.wizard.remainingQuantity',
							formatter: 'quantity',
							width: 110,
							sortable: true,
							searchable: true
						}
					]
				};
			}
			if (dataService) {
				options.resourceGrid.columns.push(
					{
						id: 'transportquantity1',
						field: 'TransportQuantity',
						name$tr$: 'cloud.common.entityQuantity',
						disallowNegative: true,
						editor: 'quantity',
						formatter: 'quantity',
						width: 70,
						sortable: true,
						validator: function (entity, value, model) {
							if (value === null || value === undefined) {
								return platformDataValidationService.validateMandatory(entity, value, model, null, dataService);
							} else {
								if (value <= 0) {
									var errObj = platformDataValidationService.createErrorObject('transportplanning.transport.wizard.errorQtyInput', {}, true);
									return platformDataValidationService.finishWithError(errObj, entity, value, model, null, dataService);
								} else {
									platformDataValidationService.removeFromErrorList(entity, model, null, dataService);
									return true;
								}
							}
						}
					}
				);
			}
			return options;
		};

		service.getResourcesOptions = function (dataService, forPlants) {
			var result = {
				jobGrid: {
					state: '6530C2D55D6146A0AC950BD7274DFC96',
					columns: [
						{
							id: 'code',
							field: 'Code',
							name$tr$: 'cloud.common.entityCode',
							width: 100,
							sortable: true,
							formatter: 'code'
						},
						{
							id: 'description',
							field: 'Description',
							name$tr$: 'cloud.common.entityDescription',
							width: 120,
							sortable: true,
							formatter: 'description'
						},
						{
							id: 'address',
							formatter: 'description',
							field: 'Address',
							name$tr$: 'cloud.common.entityDeliveryAddress',
							width: 300,
							sortable: true,
							formatterOptions: {
								displayMember: 'Address'
							}
						},
						(function () {
							var column = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
								dataServiceName: 'transportplanningTransportReturnResourceWaypointLookupDataService'
							}, {
								id: 'sourcewaypointfk',
								field: 'SourceWaypoint.Id',
								name$tr$: 'transportplanning.package.entityTrsWaypointSrcFk',
								width: 120,
								sortable: true
							});
							column.editor = null;
							return column;
						})(),
						{
							id: 'plannedtime',
							formatter: 'datetimeutc',
							editor: 'datetimeutc',
							field: 'PlannedTime',
							name$tr$: 'transportplanning.transport.entityPlannedTime',
							width: 140,
							sortable: true,
							validator: function (entity, value, model) {
								return platformDataValidationService.validateMandatory(entity, value, model, null, dataService);
							}
						}
					]
				},
				resourceGrid: {
					state: '5530C2D55D6146A0AC950BD7274DFC9B',
					columns: [
						{
							id: 'code',
							field: 'Code',
							name$tr$: 'cloud.common.entityCode',
							width: 100,
							sortable: true,
							formatter: 'code'
						},
						{
							id: 'description',
							field: 'Description',
							name$tr$: 'cloud.common.entityDescription',
							width: 160,
							sortable: true,
							formatter: 'description'
						},
						(function () {
							var column = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
								dataServiceName: 'resourceTypeLookupDataService'
							}, {
								id: 'resourcetype',
								field: 'ResourceType',
								name$tr$: 'cloud.common.entityType',
								width: 140,
								sortable: true
							});
							column.editor = null;
							return column;
						})(),
						{
							id: 'remainingquantity',
							field: 'RemainingQuantity',
							formatter: 'quantity',
							name$tr$: 'transportplanning.transport.wizard.remainingQuantity',
							width: 140,
							sortable: true,
							searchable: true
						},
						{
							id: 'jobFk',
							field: 'Job.Id',
							formatter: 'lookup',
							name$tr$: 'project.costcodes.lgmJobFk',
							width: 140,
							sortable: true,
							formatterOptions: {
								lookupType: 'logisticJobEx',
								displayMember: 'Code',
								version: 3
							}
						},
						{
							id: 'transportquantity',
							field: 'TransportQuantity',
							name$tr$: 'cloud.common.entityQuantity',
							disallowNegative: true,
							editor: 'quantity',
							formatter: 'quantity',
							width: 100,
							sortable: true,
							searchable: true,
							validator: function (entity, value, model) {
								if (value === null || value === undefined) {
									return platformDataValidationService.validateMandatory(entity, value, model, null, dataService);
								} else {
									if (value <= 0) {
										var errObj = platformDataValidationService.createErrorObject('transportplanning.transport.wizard.errorQtyInput', {}, true);
										return platformDataValidationService.finishWithError(errObj, entity, value, model, null, dataService);
									} else {
										platformDataValidationService.removeFromErrorList(entity, model, null, dataService);
										return true;
									}
								}
							}
						}
					]
				}
			};
			if (forPlants) {
				result.resourceGrid = {
					state: '5530C2D55D6146A0AC950BD7274DFC9B',
					columns: [
						{
							id: 'code',
							field: 'Code',
							name$tr$: 'cloud.common.entityCode',
							width: 100,
							sortable: true,
							formatter: 'code'
						},
						(function () {
							var column = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.plantstatus', null, {
								showIcon: true,
								imageSelectorService: 'platformStatusIconService'
							}).grid;
							_.extend(column, {
								id: 'plantStatus',
								field: 'PlantStatus',
								name$tr$: 'basics.customize.plantstatus',
								width: 80,
								sortable: true
							});
							column.editor = null;
							return column;
						})(),
						(function () {
							var column = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.planttype').grid;
							_.extend(column, {
								id: 'plantType',
								field: 'PlantType',
								name$tr$: 'cloud.common.entityType',
								width: 80,
								sortable: true
							});
							column.editor = null;
							return column;
						})(),
						{
							id: 'remainingquantity',
							field: 'RemainingQuantity',
							formatter: 'quantity',
							name$tr$: 'transportplanning.transport.wizard.remainingQuantity',
							width: 140,
							sortable: true,
							searchable: true
						},
						{
							id: 'jobFk',
							field: 'Job.Id',
							formatter: 'lookup',
							name$tr$: 'project.costcodes.lgmJobFk',
							width: 140,
							sortable: true,
							formatterOptions: {
								lookupType: 'logisticJobEx',
								displayMember: 'Code',
								version: 3
							}
						},
						{
							id: 'transportquantity',
							field: 'TransportQuantity',
							name$tr$: 'cloud.common.entityQuantity',
							disallowNegative: true,
							editor: 'quantity',
							formatter: 'quantity',
							width: 100,
							sortable: true,
							searchable: true,
							validator: function (entity, value, model) {
								if (value === null || value === undefined) {
									return platformDataValidationService.validateMandatory(entity, value, model, null, dataService);
								} else {
									if (value <= 0) {
										var errObj = platformDataValidationService.createErrorObject('transportplanning.transport.wizard.errorQtyInput', {}, true);
										return platformDataValidationService.finishWithError(errObj, entity, value, model, null, dataService);
									} else {
										platformDataValidationService.removeFromErrorList(entity, model, null, dataService);
										return true;
									}
								}
							}
						}
					]
				};
			}
			return result;
		};

		return service;
	}
})();
