(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'resource.plantestimate';
	angular.module(moduleName).service('resourcePlantEstimatePlantWizardService', ResourcePlantEstimatePlantWizardService);

	ResourcePlantEstimatePlantWizardService.$inject = ['_', '$http', '$translate', 'platformModalService', 'platformSidebarWizardCommonTasksService',
		'platformTranslateService', 'platformModalFormConfigService',
		'basicsCommonChangeStatusService', 'basicsLookupdataLookupFilterService', 'basicsLookupdataConfigGenerator',
		'resourceCommonContextService', 'resourceTypeLookupDataService', 'resourcePlantEstimateEquipmentDataService'];

	function ResourcePlantEstimatePlantWizardService(_, $http, $translate, platformModalService, platformSidebarWizardCommonTasksService,
		platformTranslateService, platformModalFormConfigService,
		basicsCommonChangeStatusService, basicsLookupdataLookupFilterService, basicsLookupdataConfigGenerator,
		resourceCommonContextService, resourceTypeLookupDataService, resourcePlantEstimateEquipmentDataService) {

		const disablePlant = function disablePlant() {
			return platformSidebarWizardCommonTasksService.provideDisableInstance(resourcePlantEstimateEquipmentDataService, 'Disable Record', 'cloud.common.disableRecord', 'Code',
				'resource.equipment.disableDone', 'resource.equipment.alreadyDisabled', 'code', 1);
		};
		this.disablePlant = disablePlant().fn;

		const enablePlant = function enablePlant() {
			return platformSidebarWizardCommonTasksService.provideEnableInstance(resourcePlantEstimateEquipmentDataService, 'Enable Record', 'cloud.common.enableRecord', 'Code',
				'resource.equipment.enableDone', 'resource.equipment.alreadyEnabled', 'code', 2);
		};
		this.enablePlant = enablePlant().fn;

		const setPlantStatus = function setPlantStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					mainService: resourcePlantEstimateEquipmentDataService,
					statusField: 'PlantStatusFk',
					codeField: 'Code',
					descField: 'DescriptionInfo.Translated',
					projectField: '',
					title: 'basics.customize.plantstatus',
					statusName: 'equipmentstatus',
					updateUrl: 'resource/equipment/plant/changestatus',
					id: 3
				}
			);
		};
		this.setPlantStatus = setPlantStatus().fn;

		/***********************/
		// Filters
		let dataItem = {
			plantFk: null,
			siteFk: null,
			kindFk: null,
			typeFk: null,
			groupFk: null,
			uomTimeFk: 1
		};

		const filters = [
			{
				key: 'filter-by-resource-context-login-company',
				fn: filterResourceContextLoginCompany
			},
			{
				key: 'filter-kindfk-by-default-value',
				fn: function (e) {
					if (e && e.isDefault === true && e.Description === 'Default Kind') {
						dataItem.kindFk = e.Id;
					}
					return true;
				}
			}
		];

		let contextInitialized = false;
		resourceCommonContextService.init()
			.then(function () {
				contextInitialized = true;
			});

		function filterResourceContextLoginCompany(item) {
			console.log(item);
			return contextInitialized && (item.ResourceContextFk === resourceCommonContextService.getResourceContextFk());
		}

		basicsLookupdataLookupFilterService.registerFilter(filters);

		this.createNewResourceFromPlant = function createNewResourceFromPlant() {
			resourceTypeLookupDataService.getList({}).then(function (list) {
				let types = list.filter(function (e) {
					return e && e.IsPlant && filterResourceContextLoginCompany(e);
				});
				if (types.length > 0) {
					dataItem.typeFk = types[0].Id;
				}
			});

			let currentPlantItems = resourcePlantEstimateEquipmentDataService.getSelectedEntities();
			let plantStatusFks = _.uniq(currentPlantItems.map(function (e) {
				return e.PlantStatusFk;
			}));

			let statusToIsPlannable = {};
			let promises = plantStatusFks.map(function (plantStatusFk) {
				return $http.post(globals.webApiBaseUrl + 'basics/customize/plantstatus/instance', {Id: plantStatusFk})
					.then(function (response) {
						statusToIsPlannable[plantStatusFk] = response && response.data.Isplannable === true;
					});
			});

			Promise.all(promises).then(function () {
				let plantItemPlannables = currentPlantItems.map(function (e) {
					return {
						plantItemId: e.Id,
						isPlannable: statusToIsPlannable[e.PlantStatusFk]
					};
				});

				var notPlannablePlantItemsIds = plantItemPlannables.filter(function (e) {
					return !e.isPlannable;
				}).map(function (e) {
					return e.plantItemId;
				});

				if (notPlannablePlantItemsIds.length === 0) {
					// All statuses are plannable
					// Calling 'resource/listbyparent' to check if there are plants with existing resources

					let plantItemResourcesPromises = plantItemPlannables.map(function (e) {
						return $http.get(globals.webApiBaseUrl + 'resource/master/resource/listbyplant?plantId=' + e.plantItemId)
							.then(function (response) {
								return {
									plantItemId: e.plantItemId,
									resources: response && response.data ? response.data : []
								};
							});
					});

					Promise.all(plantItemResourcesPromises).then(function (plantItemResources) {
						let plantItemsWithResources = plantItemResources.filter(function (e) {
							return !!e.resources.length;
						});

						if (plantItemsWithResources.length === 0) {
							let modalCreateConfig = {
								title: $translate.instant('resource.equipment.createResourceFromPlant'),
								dataItem: dataItem,
								formConfiguration: {
									fid: 'resource.equipment.wizardCreate',
									version: '1.0.0',
									showGrouping: false,
									groups: [
										{
											gid: 'selectionfilter',
											isOpen: true,
											visible: true,
											sortOrder: 1
										}
									],
									rows: [{
										gid: 'selectionfilter',
										rid: 'site',
										label: 'Site',
										label$tr$: 'resource.master.SiteFk',
										type: 'directive',
										directive: 'basics-lookupdata-lookup-composite',
										options: {
											lookupOptions: {
												showClearButton: true,
												filterKey: 'filter-by-resource-context-login-company'
											},
											lookupDirective: 'basics-site-site-lookup',
											descriptionMember: 'DescriptionInfo.Translated'
										},
										model: 'siteFk',
										required: true,
										sortOrder: 1
									},
										basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.resourcekind', '',
											{
												gid: 'selectionfilter',
												rid: 'kind',
												label: 'Kind',
												label$tr$: 'resource.master.KindFk',
												type: 'integer',
												model: 'kindFk',
												sortOrder: 2
											}, false, {
												required: false,
												filterKey: 'filter-kindfk-by-default-value'
											}),
										basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.resourcegroup', '',
											{
												gid: 'selectionfilter',
												rid: 'group',
												label: 'Group',
												label$tr$: 'resource.master.GroupFk',
												type: 'integer',
												model: 'groupFk',
												sortOrder: 3
											}, false, {
												required: false
											}),
										basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
											dataServiceName: 'resourceTypeLookupDataService',
											cacheEnable: true,
											additionalColumns: false,
											showClearButton: true,
											// filterKey: 'fllter-type-by-isplant',
										},	{
											gid: 'selectionfilter',
											rid: 'type',
											label: 'Type',
											label$tr$: 'resource.master.TypeFk',
											type: 'integer',
											model: 'typeFk',
											required: true,
											sortOrder: 4
										}),
										basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
											dataServiceName: 'basicsUnitLookupDataService',
											cacheEnable: true,
											additionalColumns: false,
											showClearButton: true
										}, {
											gid: 'selectionfilter',
											rid: 'uomTime',
											label: 'Uom Time',
											label$tr$: 'resource.master.uomTimeFk',
											type: 'integer',
											model: 'uomTimeFk',
											sortOrder: 5
										})]
								},
								handleOK: function handleOK(result) {
									let data = {
										PlantIds: _.map(resourcePlantEstimateEquipmentDataService.getSelectedEntities(), 'Id'),
										SiteId: result.data.siteFk,
										ResKindId: result.data.kindFk,
										ResGroupId: result.data.groupFk,
										ResTypeId: result.data.typeFk,
										UomTimeId: result.data.uomTimeFk
									};

									$http.post(globals.webApiBaseUrl + 'resource/master/resource/createdresourcefromplant', data).then(function (result) {
										if (result.data.length > 0) {
											var modalOptions = {
												headerTextKey: 'resource.equipment.createResourceFromPlant',
												bodyTextKey: result.data,
												showOkButton: true,
												showCancelButton: true,
												resizeable: true,
												height: '500px',
												iconClass: 'info'
											};

											platformModalService.showDialog(modalOptions);
										} else {
											platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(modalCreateConfig.title);
										}
									});
								}
							};

							platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);
							platformModalFormConfigService.showDialog(modalCreateConfig);
						} else {
							let resourceCodes = plantItemsWithResources.map(function (e) {
								return `plantId: ${e.plantItemId}, resourceCodes: ${e.resources.map(({Code}) => Code)}`;
							});

							let modalOptions = {
								showGrouping: true,
								headerText: $translate.instant('resource.equipment.createResourceFromPlant'),
								bodyText: 'Some plant items already have resources (' + resourceCodes + ')',
								iconClass: 'ico-info'
							};

							platformModalService.showDialog(modalOptions);
						}
					});

				} else {
					let modalOptions = {
						showGrouping: true,
						headerText: $translate.instant('resource.equipment.createResourceFromPlant'),
						bodyText: `Some selected plants have a state that marks it as not plannable (ids: ${notPlannablePlantItemsIds}). Therefore no resource can be created for these plants.`,
						iconClass: 'ico-info'
					};

					platformModalService.showDialog(modalOptions);
				}

			});
		};
	}
})(angular);
