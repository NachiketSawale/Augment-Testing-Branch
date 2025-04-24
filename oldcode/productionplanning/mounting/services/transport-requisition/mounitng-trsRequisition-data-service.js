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
	var moduleName = 'productionplanning.mounting';
	angular.module(moduleName).factory('productionplanningMountingTrsRequisitionDataService', ProductionplanningMountingTrsRequisitionDataService);

	ProductionplanningMountingTrsRequisitionDataService.$inject = [
		'$http',
		'basicsCommonContainerDialogService',
		'basicsLookupdataLookupDescriptorService',
		'transportplanningRequisitionReferenceDataServiceBuilder',
		'productionplanningActivityTrsRequisitionDataServiceCreationExtension',
		'transportplanningRequisitionDataProcessorService',
		'platformDataServiceDataProcessorExtension',
		'platformDataServiceSelectionExtension',
		'platformDataServiceActionExtension',
		'$q',
		'basicsLookupdataLookupFilterService',
		'productionplanningMountingContainerInformationService',
		'productionplanningCommonActivityDateshiftService'];

	function ProductionplanningMountingTrsRequisitionDataService($http, containerDialogService,
																 basicsLookupdataLookupDescriptorService,
																 DataServiceBuilder,
																 dataServiceCreationExtension,
																 dataProcessorService,
																 platformDataServiceDataProcessorExtension,
																 platformDataServiceSelectionExtension,
																 platformDataServiceActionExtension,
																 $q,
																 basicsLookupdataLookupFilterService,
																 mountingContainerInformationService,
																 ppsActivityDateshiftService) {
		var activityGUID = '3a37c9d82f4e45c28ccd650f1fd2bc1f';
		var dynamicActivityService = mountingContainerInformationService.getContainerInfoByGuid(activityGUID).dataServiceName;

		var serviceInfo = {
			module: angular.module(moduleName),
			serviceName: 'productionplanningMountingTrsRequisitionDataService'
		};
		var validationService = 'productionplanningMountingTrsRequisitionValidationService';
		var httpResource = {
			endRead: 'listForMntActivity'
		};
		var entityRole = {
			node: {
				itemName: 'TrsRequisition',
				parentService: dynamicActivityService,
				parentFilter: 'mntActivityId'
			}
		};
		var presenter = {
			list: {
				handleCreateSucceeded: function (item, data) {
					dataServiceCreationExtension.handleCreateSucceeded(item, data, dynamicActivityService);
					//add new item as subitem of the activity
					changeMntActivityAssignment([item]);
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
				mainDataService: 'productionplanningMountingTrsRequisitionDialogRequisitionDataService',
				uiConfig: {
					dialogTitle: 'productionplanning.activity.trsRequisition.dialogTitle',
					selectEntityText: 'productionplanning.activity.trsRequisition.entity'
				},
				custom: {
					parentContainer: {
						title: 'productionplanning.activity.trsRequisition.dialogContainerTitle',
						dataService: 'productionplanningMountingTrsRequisitionDialogRequisitionDataService',
						uiService: 'productionplanningMountingTrsRequisitionDialogRequisitionUiService',
						gridId: 'cab6d2137970464c819fb89f9e93a5f7'
					},
					childContainer: {
						title: 'productionplanning.activity.trsRequisition.bundle.dialogContainerTitle',
						dataService: 'productionplanningMountingTrsRequisitionDialogBundleDataService',
						uiService: 'transportplanningBundleUIStandardService',
						gridId: '5939cf3146d942ee9d3581503bd71460'
					},
					currentDataService: 'productionplanningMountingTrsRequisitionDataService',
					foreignKey: 'MntActivityFk',
					onOkFinish: changeMntActivityAssignment
				}
			};
			containerDialogService.showContainerDialog(config);
		};

		function changeMntActivityAssignment(trsRequisitions, add = true) {
			let subEvents = _.cloneDeep(trsRequisitions);
			let activity = dynamicActivityService.getSelected();
			if (!_.isNil(activity)) {
				if (add === true) {
					virtualDateshiftService.changeSpecialzedEvents(subEvents, null, activity);
				} else if (add === false) {
					virtualDateshiftService.changeSpecialzedEvents(subEvents, activity, null);
				}
			}
		}

		function removeMntActivityAssignment(redundantParam, removedTrsRequisitions) {
			changeMntActivityAssignment(removedTrsRequisitions, false);
		}
		serviceContainer.service.registerReferenceDeleted(removeMntActivityAssignment);

		/**
		 * Add filterKey to trsRequisition field**/
		var trsRequisitionList = {};
		serviceContainer.service.loadTrsRequisition = function () {
			if (dynamicActivityService.getSelected()) {
				serviceContainer.service.setFilter('mntActivityId=' + dynamicActivityService.getSelected().Id);
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
			if (serviceContainer.service.getSelected()){
				if (updateData.ActivityToSave !== null){
					_.forEach(updateData.ActivityToSave, function (Activity) {
						if(Activity.TrsRequisitionToSave !== null){
							_.forEach(Activity.TrsRequisitionToSave, function (trsRequisiton) {
								trsRequisiton.ProjectId = serviceContainer.service.getSelected().ProjectFk;
							});
						}
					});
				}
			}
		};

		var virtualDateshiftService = ppsActivityDateshiftService.registerToVirtualDateshiftService(moduleName, serviceContainer, 'transportplanning.requisition');

		return serviceContainer.service;
	}
})(angular);
