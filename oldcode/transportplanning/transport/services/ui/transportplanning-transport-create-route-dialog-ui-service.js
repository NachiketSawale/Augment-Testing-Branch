/**
 * Created by lav on 2/19/2019.
 */
(function (angular) {
	'use strict';
	/*global moment, _*/
	var moduleName = 'transportplanning.transport';
	/**
	 * @ngdoc service
	 * @name transportplanningTransportCreateRouteDialogUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of transport entities
	 */
	angular.module(moduleName).factory('transportplanningTransportCreateRouteDialogUIStandardService', UIStandardService);

	UIStandardService.$inject = ['$http',
		'transportplanningTransportValidationService',
		'platformTranslateService',
		'platformRuntimeDataService',
		'platformDataValidationService',
		'transportplanningTransportMainService',
		'platformLayoutHelperService',
		'basicsLookupdataLookupFilterService',
		'basicsLookupdataConfigGenerator',
		'$injector',
		'productionplanningCommonLayoutHelperService'];

	function UIStandardService(
		$http,
		transportValidationService,
		platformTranslateService,
		platformRuntimeDataService,
		platformDataValidationService,
		transportMainService,
		platformLayoutHelperService,
		basicsLookupdataLookupFilterService,
		basicsLookupdataConfigGenerator,
		$injector,
		ppsCommonLayoutHelperService) {

		var service = {};

		service.getFormOptions = function (getEntityFn, forRelocated) {
			var filters = [
				{
					key: 'transportplanning-transport-route-eventtype-filter',
					fn: function (item) {
						if (item) {
							return item.PpsEntityFk !== null && item.PpsEntityFk === 2;
						}
						return false;
					}
				}
			];
			basicsLookupdataLookupFilterService.registerFilter(filters);

			var formConfig = {
				fid: 'transportplanning.transport.createTrsRouteModal',
				showGrouping: false,
				addValidationAutomatically: true,
				groups: [
					{
						gid: 'baseGroup'
					}
				],
				rows: [
					{
						gid: 'baseGroup',
						rid: 'code',
						label$tr$: 'cloud.common.entityCode',
						label: 'Code',
						model: 'Code',
						type: 'code',
						required: true,
						sortOrder: 2
					},
					{
						gid: 'baseGroup',
						rid: 'eventtypefk',
						model: 'EventTypeFk',
						sortOrder: 4,
						label$tr$: 'transportplanning.transport.entityEventTypeFk',
						label: 'Event Type',
						type: 'directive',
						required: true,
						directive: 'productionplanning-common-event-type-lookup',
						options: {
							filterKey: 'transportplanning-transport-route-eventtype-filter'
						},
						change: function (entity) {
							updateRoute(entity);
						}
					},
					{
						gid: 'baseGroup',
						rid: 'projectfk',
						model: 'ProjectFk',
						sortOrder: 5,
						label$tr$: 'cloud.common.entityProject',
						label: 'Project',
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
											service.validateAll(args.entity, ['LgmJobFk']);
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
						label: 'Job',
						type: 'directive',
						required: true,
						directive: 'basics-lookupdata-lookup-composite',
						// change: function () {
						// 	updatePreselectionSite();
						// },
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
											platformRuntimeDataService.applyValidationResult(true, args.entity, 'ProjectFk');
										}
									}
								]
							}
						},
						validator: function (entity, value, model) {
							return platformDataValidationService.validateMandatory(entity, value, model, transportValidationService, transportMainService);
						},
					},
					{
						gid: 'baseGroup',
						rid: 'projectdeffk',
						model: 'ProjectDefFk',
						readonly: true,
						sortOrder: 7,
						label$tr$: 'transportplanning.transport.entityProjectDefFk',
						label: 'Default Client Project',
						type: 'directive',
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
											args.entity.JobDefFk = null;
											service.updatePlannedDelivery(args.entity);
										}
									}
								]
							}
						}
					},
					(function () {
						let jobType = forRelocated ? 'internal': 'external';
						let setting = ppsCommonLayoutHelperService.provideJobExtensionLookupOverload({
							projectFk: 'ProjectDefFk',
							jobType: jobType
						});

						let lable = forRelocated? '*Relocate To' : '*Default Client Job';
						let lableStr = forRelocated? 'transportplanning.transport.relocateTo' : 'transportplanning.transport.entityJobDefFk';
						setting = _.extend(setting.detail,
							{
								gid: 'baseGroup',
								rid: 'jobdeffk',
								model: 'JobDefFk',
								required: true,
								sortOrder: 8,
								label$tr$: lableStr,
								label: lable,
								validator: function (entity, value, model) {
									return platformDataValidationService.validateMandatory(entity, value, model, transportValidationService, transportMainService);
								},
								change: function (entity) {
									entity.ProjectDefFk = entity.SelectedProjectDef ? entity.SelectedProjectDef.ProjectFk : null;
									service.updatePlannedDelivery(entity);
								}
							}
						);
						setting.options.descriptionMember = 'Address.Address';
						// setting.options.lookupOptions.disablePopupSearch = true;
						// setting.options.lookupOptions.autoSearch = false;
						setting.options.lookupOptions.events = [
							{
								name: 'onSelectedItemChanged',
								handler: function (e, args) {
									args.entity.SelectedProjectDef = args.selectedItem;
								}
							}
						];
						setting.options.lookupOptions.additionalFilters = (function () {
							var defualtClientJobFilters = [{
								getAdditionalEntity: function () {
									let entity = angular.isFunction(getEntityFn) ? getEntityFn() : null;
									return {
										projectFk: entity ? entity.ProjectDefFk : undefined
									};
								},
								projectFk: 'projectFk',
							}, {
								//required for popup!
								getAdditionalEntity: function () {
									return { jobType: jobType };
								},
								//required for dialog!
								jobType: 'jobType',
							}, {
								//required for popup!
								getAdditionalEntity: function () {
									return {activeJob: true};
								},
								//required for dialog!
								activeJob: 'activeJob',
							}];
							return defualtClientJobFilters;
						})();
						return setting;
					})(),
					{
						gid: 'baseGroup',
						rid: 'planneddelivery',
						label$tr$: 'transportplanning.transport.plannedDelivery',
						label: '*Planned Delivery Time',
						model: 'PlannedDelivery',
						type: 'datetimeutc',
						sortOrder: 11
					},
					{
						gid: 'baseGroup',
						rid: 'commenttext',
						label$tr$: 'cloud.common.entityComment',
						label: 'Comments',
						model: 'CommentText',
						type: 'comment',
						sortOrder: 12
					}

				]
			};

			if(forRelocated){
				formConfig.rows.push({
					gid: 'baseGroup',
					rid: 'clientjobfk',
					model: 'ClientJobFk',
					sortOrder: 13,
					label$tr$: 'transportplanning.transport.clientJob',
					label: '*Client Job',
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'logistic-job-paging-extension-lookup',
						displayMember: 'Code',
						descriptionMember: 'Address.Address',
						lookupOptions: {
							defaultFilter: { activeJob: true, jobType: 'external' },
							showClearButton: true,
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										$injector.get('logisticJobDialogLookupPagingExtensionDataService').setSelected(args.selectedItem);
									}
								}
							]
						}
					}
				});
			}

			_.forEach(formConfig.rows, function (row) {
				var rowModel = row.model.replace(/\./g, '$');
				var syncName = 'validate' + rowModel;
				if (!row.validator && transportValidationService[syncName]) {
					row.validator = transportValidationService[syncName];
				}
			});

			service.validateAll = function (entity, fieldNames) {
				if (!fieldNames) {
					_.forEach(formConfig.rows, function (row) {
						if (row && row.validator) {
							platformRuntimeDataService.applyValidationResult(row.validator(entity, entity[row.model], row.model), entity, row.model);
						}
					});
				} else {
					_.forEach(fieldNames, function (fieldName) {
						var row = _.find(formConfig.rows, {model: fieldName});
						if (row && row.validator) {
							platformRuntimeDataService.applyValidationResult(row.validator(entity, entity[fieldName], fieldName), entity, fieldName);
						}
					});
				}
			};

			return {configure: platformTranslateService.translateFormConfig(formConfig)};
		};

		service.getCreateRouteFromOptions = function (getEntityFn) {
			var BPContactDetail = BusinessPartnerFilteredContact().detail;
			var formConfig = {
				fid: 'transportplanning.transport.createRouteForDispatchHeader',
				showGrouping: false,
				addValidationAutomatically: true,
				groups: [
					{
						gid: 'baseGroup'
					}
				],
				rows: [
					{
						gid: 'baseGroup',
						rid: 'code',
						label$tr$: 'cloud.common.entityCode',
						label: 'Code',
						model: 'Code',
						type: 'code',
						required: true,
						sortOrder: 1
					},
					{
						gid: 'baseGroup',
						rid: 'eventtypefk',
						model: 'EventTypeFk',
						sortOrder: 2,
						label$tr$: 'transportplanning.transport.entityEventTypeFk',
						label: 'Event Type',
						type: 'directive',
						required: true,
						directive: 'productionplanning-common-event-type-lookup',
						options: {
							filterKey: 'transportplanning-transport-route-eventtype-filter'
						},
						change: function (entity) {
							updateRoute(entity);
						}
					},
					basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.jobcardstatus', '', {
						gid: 'baseGroup',
						rid: 'status',
						label: 'Status',
						label$tr$: 'cluod.common.entityState',
						type: 'integer',
						model: 'TrsRteStatusFk',
						sortOrder: 3
					}, false, {showIcon:true, required: false}),
					{
						gid: 'baseGroup',
						rid: 'projectfk',
						model: 'ProjectFk',
						sortOrder: 4,
						label$tr$: 'cloud.common.entityProject',
						label: 'Project',
						type: 'directive',
						required: true,
						readonly: true,
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-lookup-data-project-project-dialog',
							displayMember: 'Code',
							descriptionMember: 'ProjectName'
						}
					},
					{
						gid: 'baseGroup',
						rid: 'lgmjobfk',
						model: 'LgmJobFk',
						sortOrder: 5,
						label$tr$: 'logistic.job.entityJob',
						label: 'Job',
						type: 'directive',
						required: true,
						readonly: true,
						directive: 'basics-lookupdata-lookup-composite',
						// change: function () {
						// 	updatePreselectionSite();
						// },
						options: {
							lookupDirective: 'logistic-job-paging-extension-lookup',
							displayMember: 'Code',
							descriptionMember: 'Address.Address'
						}
					},
					{
						gid: 'baseGroup',
						rid: 'projectdeffk',
						model: 'ProjectDefFk',
						readonly: true,
						sortOrder: 6,
						label$tr$: 'transportplanning.transport.entityProjectDefFk',
						label: 'Default Client Project',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-lookup-data-project-project-dialog',
							displayMember: 'Code',
							descriptionMember: 'ProjectName'
						}
					},{
						gid: 'baseGroup',
						rid: 'deliveryAddressContactFk',
						model: 'DeliveryAddressContactFk',
						sortOrder: 7,
						readonly: true,
						label$tr$: 'transportplanning.transport.entityProjectDefFk',
						label: 'Delivery Address contact',
						type: 'directive',
						directive: BPContactDetail.directive,
						options: BPContactDetail.options
					},{
						gid: 'baseGroup',
						rid: 'businesspartnerfk',
						model: 'BusinessPartnerFk',
						sortOrder: 8,
						readonly: true,
						label$tr$: 'cloud.common.entityBusinessPartner',
						type: 'directive',
						directive: 'business-partner-main-business-partner-dialog',
						options: {
							showClearButton: true
						}
					},{
						gid: 'baseGroup',
						rid: 'planneddelivery',
						readonly: true,
						label$tr$: 'transportplanning.transport.plannedDelivery',
						label: '*Planned Delivery Time',
						model: 'PlannedDelivery',
						type: 'datetimeutc',
						sortOrder: 9
					}
				]
			};
			return {configure: platformTranslateService.translateFormConfig(formConfig)};
		};

		service.updatePlannedDelivery = function (entity) {
			entity.HasDefaultDstWaypoint = !!entity.JobDefFk;
			if (!entity.HasDefaultDstWaypoint) {
				service.validateAll(entity, ['PlannedDelivery']);
			} else if (!entity.PlannedDelivery) {
				entity.PlannedDelivery = moment.utc(_.clone(entity.PlannedFinish));
				service.validateAll(entity, ['PlannedDelivery']);
			}
		};

		function BusinessPartnerFilteredContact(){
			var settings = platformLayoutHelperService.provideBusinessPartnerFilteredContactLookupOverload(
				'logistic-job-business-partner-contact-filter'
			);
			settings.detail.options.showDetailButton = settings.grid.editorOptions.lookupOptions.showDetailButton = true;
			settings.detail.options.detailOptions = settings.grid.editorOptions.lookupOptions.detailOptions = $injector.get('businessPartnerContactDetailOptions');
			return settings;
		}

		function updateRoute(entity) {
			$http.get(globals.webApiBaseUrl + 'transportplanning/transport/route/updateroute?PpsEventTypeFk=' + entity.EventTypeFk+ '&jobFk=' + (entity.JobDefFk || null) +'&projectFk=' + (entity.ProjectDefFk || null)).then(function (respond) {
				if (respond.data) {
					var route = respond.data;
					entity.Code = route.Code || entity.Code;
					entity.PlannedStart = route.PlannedStart;
					entity.PlannedFinish = route.PlannedFinish;
					entity.LatestStart = route.LatestStart;
					entity.LatestFinish = route.LatestFinish;
					entity.EarliestStart = route.EarliestStart;
					entity.EarliestFinish = route.EarliestFinish;
					service.validateAll(entity, ['Code', 'PlannedDelivery']);
				}
			});
		}

		return service;
	}
})(angular);
