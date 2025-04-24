/**
 * Created by waz on 8/1/2017.
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name productionplanningMountingTrsRequisitionDataService
	 * @function
	 *
	 * @description
	 * productionplanningMountingTrsRequisitionDataService is the data service for all entities related functionality.
	 */
	var moduleName = 'productionplanning.activity';
	angular.module(moduleName).factory('productionplanningActivityTrsRequisitionDataService', productionplanningActivityTrsRequisitionDataService);

	productionplanningActivityTrsRequisitionDataService.$inject = [
		'basicsCommonContainerDialogService',
		'basicsLookupdataLookupDescriptorService',
		'transportplanningRequisitionReferenceDataServiceBuilder',
		'transportplanningRequisitionDataProcessorService',
		'productionplanningActivityTrsRequisitionDataServiceCreationExtension',
		'productionplanningActivityActivityDataService',
		'$http',
		'platformDataServiceDataProcessorExtension',
		'platformDataServiceSelectionExtension',
		'platformDataServiceActionExtension',
		'productionplanningActivityActivityBundleDataService',
		'$q',
		'basicsLookupdataLookupFilterService'];
	function productionplanningActivityTrsRequisitionDataService(containerDialogService,
																 basicsLookupdataLookupDescriptorService,
																 DataServiceBuilder,
																 dataProcessorService,
																 dataServiceCreationExtension,
																 parentService,
																 $http,
																 platformDataServiceDataProcessorExtension,
																 platformDataServiceSelectionExtension,
																 platformDataServiceActionExtension,
																 actBundleDataService,
																 $q,
																 basicsLookupdataLookupFilterService) {
		var serviceInfo = {
			module: angular.module(moduleName),
			serviceName: 'productionplanningActivityTrsRequisitionDataService'
		};
		var validationService = 'productionplanningActivityTrsRequisitionValidationService';
		var httpResource = {
			endRead: 'listForMntActivity'
		};
		var entityRole = {
			node: {
				itemName: 'TrsRequisition',
				parentService: parentService,
				parentFilter: 'mntActivityId'
			}
		};
		var presenter = {
			list: {
				handleCreateSucceeded: function (item, data) {
					dataServiceCreationExtension.handleCreateSucceeded(item, data, parentService);
				}
			}
		};
		var actions = {
			create: 'flat',
			delete: true,
			createReference: true,
			deleteReference: true,
			referenceForeignKeyProperty: 'MntActivityFk'
		};

		var builder = new DataServiceBuilder('flatNodeItem');
		var serviceContainer = builder
			.setServiceInfo(serviceInfo)
			.setValidationService(validationService)
			.setHttpResource(httpResource)
			.setPresenter(presenter)
			.setEntityRole(entityRole)
			.setActions(actions)
			.setDataProcessor(dataProcessorService.getDataProcessors())
			.build();

		//"override" function handleOnCreateSucceeded, to avoid do newEntityValidator for the situation about "create" existed item from transport-requisition-dialog
		serviceContainer.data.handleOnCreateSucceeded = function handleOnCreateSucceeded(newItem, data) {
			platformDataServiceDataProcessorExtension.doProcessItem(newItem, data);
			data.itemList.push(newItem);
			platformDataServiceActionExtension.fireEntityCreated(data, newItem);

			return platformDataServiceSelectionExtension.doSelect(newItem, data).then(
				function () {
					if (newItem.Version === 0 && data.newEntityValidator) {
						data.newEntityValidator.validate(newItem, serviceContainer.service);
					}
					data.markItemAsModified(newItem, data);
					return newItem;
				},
				function () {
					data.markItemAsModified(newItem, data);
					return newItem;
				}
			);
		};

		serviceContainer.service.showReferencesSelectionDialog = function () {
			var config = {
				bodyTemplateUrl: globals.appBaseUrl + 'basics.common/templates/container-dialog/two-grid-container.html',
				handler: 'basicsCommonContainerDialogTwoGridContainerHandler',
				mainDataService: 'productionplanningActivityTrsRequisitionDialogRequisitionDataService',
				uiConfig: {
					dialogTitle: 'productionplanning.activity.trsRequisition.dialogTitle',
					selectEntityText: 'productionplanning.activity.trsRequisition.entity'
				},
				custom: {
					parentContainer: {
						title: 'productionplanning.activity.trsRequisition.dialogContainerTitle',
						dataService: 'productionplanningActivityTrsRequisitionDialogRequisitionDataService',
						uiService: 'productionplanningMountingTrsRequisitionDialogRequisitionUiService',
						gridId: 'cab6d2137970464c819fb89f9e93a5f7'
					},
					childContainer: {
						title: 'productionplanning.activity.trsRequisition.bundle.dialogContainerTitle',
						dataService: 'productionplanningActivityTrsRequisitionDialogBundleDataService',
						uiService: 'transportplanningBundleUIStandardService',
						gridId: '5939cf3146d942ee9d3581503bd71460'
					},
					currentDataService: 'productionplanningActivityTrsRequisitionDataService',
					foreignKey: 'MntActivityFk'
				}
			};
			containerDialogService.showContainerDialog(config);
		};

		serviceContainer.service.updateGrid = function (assignBundles) {
			var bundleIds = [];
			var unassignBundleIds = [];
			_.each(assignBundles, function (bundle) {
				bundleIds.push(bundle.Id);
				if (bundle.TrsRequisitionFk === null) {
					unassignBundleIds.push(bundle.Id);
				}
			});

			var request = {BundleIds: bundleIds, HasNew: unassignBundleIds.length > 0};

			$http.post(globals.webApiBaseUrl + 'transportplanning/requisition/getByBundleIds', request)
				.then(function (respond) {

					var items = respond.data.Main;
					_.forEach(serviceContainer.service.getList(), function (item) {
						_.remove(items, {'Id': item.Id});
					});
					var mainItemId = serviceContainer.data.parentService.getSelected().Id;
					_.each(items, function (item) {
						item.MntActivityFk = mainItemId;
						serviceContainer.data.onCreateSucceeded(item, serviceContainer.data);

						/**
						 * Set unassignBundles's TrsRequisitionFk=item.Id
						 */
						if (item.Version === 0) {
							_.each(unassignBundleIds, function (id) {
								var bundle = actBundleDataService.getItemById(id);
								bundle.TrsRequisitionFk = item.Id;
							});
						}
					});
				});
		};

		/**
		 * Add filterKey to trsRequisition field**/
		var trsRequisitionList = {};
		serviceContainer.service.loadTrsRequisition = function () {
			if (parentService.getSelected()) {
				serviceContainer.service.setFilter('mntActivityId=' + parentService.getSelected().Id);
				$q.when(serviceContainer.service.load()).then(function (result) {
					trsRequisitionList = result;
					basicsLookupdataLookupDescriptorService.updateData('TrsRequisition', trsRequisitionList);
				});
			}
		};

		serviceContainer.service.getTrsRequisitionList = function () {
			trsRequisitionList = serviceContainer.service.getList();
			return trsRequisitionList;
		};

		serviceContainer.service.isSelectedItemAccepted = function () {
			if (!serviceContainer.service.getSelected()) {
				return false;
			}
			var status = basicsLookupdataLookupDescriptorService.getLookupItem('TrsRequisitionStatus', serviceContainer.service.getSelected().TrsReqStatusFk);
			return status && status.IsAccepted;
		};

		serviceContainer.service.canPaste = function (item) {
			var status = basicsLookupdataLookupDescriptorService.getLookupItem('TrsRequisitionStatus', item.TrsReqStatusFk);
			return status && !status.IsAccepted;
		};

		var filters = [
			{
				key: 'resource-requisition-trsrequisition-filter',
				fn: function (item) {
					var result = false;
					if (item) {
						_.find(trsRequisitionList, function (requisition) {
							if (item.Id === requisition.Id) {
								result = true;
							}
						});
					}
					return result;
				}
			}];

		serviceContainer.service.registerFilter = function () {
			basicsLookupdataLookupFilterService.registerFilter(filters);
		};

		serviceContainer.service.unregisterFilter = function () {
			basicsLookupdataLookupFilterService.unregisterFilter(filters);
		};

		serviceContainer.data.provideUpdateData = function (updateData) {
			if (serviceContainer.service.getSelected() && updateData.TrsRequisitionToSave !== null) {
				_.forEach(updateData.TrsRequisitionToSave, function (trsRequisiton) {
					trsRequisiton.ProjectId = serviceContainer.service.getSelected().ProjectFk;
				});
			}
		};


		return serviceContainer.service;
	}
})(angular);