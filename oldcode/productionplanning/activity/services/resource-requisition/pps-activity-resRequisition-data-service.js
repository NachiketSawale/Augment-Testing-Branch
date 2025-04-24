/**
 * Created by anl on 9/12/2017.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name productionplanningActivityResRequisitionDataService
	 * @function
	 *
	 * @description
	 * productionplanningActivityResRequisitionDataService is the data service for all entities related functionality.
	 */
	var moduleName = 'productionplanning.activity';
	var masterModule = angular.module(moduleName);

	masterModule.factory('productionplanningActivityResRequisitionDataService', ResRequisitionForActivityDataService);

	ResRequisitionForActivityDataService.$inject = [
		'basicsLookupdataLookupDescriptorService',
		'platformDataServiceFactory',
		'productionplanningActivityActivityDataService',
		'basicsCommonMandatoryProcessor',
		'$injector',
		'productionplanningMountingResRequisitionProcessor',
		'$q',
		'basicsLookupdataLookupFilterService',
		'platformDataServiceProcessDatesBySchemeExtension',
		'productionplanningResourceRequisitionValidationServiceBase',
		'basicsCommonBaseDataServiceBasicExtension',
		'basicsCommonBaseDataServiceReferenceActionExtension',
		'productionplanningActivityContainerInformationService',
		'$http',
		'PlatformMessenger',
	    'resourceRequisitionModifyProcessor',
		'productionplanningCommonRequisitionProcessor'];

	function ResRequisitionForActivityDataService(basicsLookupdataLookupDescriptorService, platformDataServiceFactory,
												  parentService, basicsCommonMandatoryProcessor,
												  $injector, resRequisitionProcessor,
												  $q, basicsLookupdataLookupFilterService,
												  platformDataServiceProcessDatesBySchemeExtension,
												  productionplanningResourceRequisitionValidationServiceBase,
												  basicsCommonBaseDataServiceBasicExtension,
												  referenceActionExtension,
												  activityContainerInformationService,
												  $http,
												  PlatformMessenger,
                                                  resourceRequisitionModifyProcessor,
		productionplanningCommonRequisitionProcessor) {

		var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
			{typeName: 'RequisitionDto', moduleSubModule: 'Resource.Requisition'}
		);
		var serviceContainer;
		var systemOption = {
			flatLeafItem: {
				serviceName: 'productionplanningActivityResRequisitionDataService',
				entityNameTranslationID: 'productionplanning.activity.resRequisition.ListTitle',
				httpCreate: {
					route: globals.webApiBaseUrl + 'resource/requisition/'
				},
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/requisition/',
					endRead: 'listForMntActivity'
					// ,
					// initReadData: function (readData) {
					// 	var activityService = $injector.get('productionplanningActivityActivityDataService');
					// 	readData.filter = '?PpsEventId=' + activityService.getSelected().PpsEventFk;
					// }
				},
				dataProcessor: [resRequisitionProcessor, dateProcessor, resourceRequisitionModifyProcessor, productionplanningCommonRequisitionProcessor],
				entityRole: {
					leaf: {
						itemName: 'ResRequisition',
						parentService: parentService,
						parentFilter: 'PpsEventId'
					}
				},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							basicsLookupdataLookupDescriptorService.attachData(readData);
							var result = readData.Main ? {
								FilterResult: readData.FilterResult,
								dtos: readData.Main || []
							} : readData;

							initRequisitionList(readData);

							var dataRead = serviceContainer.data.handleReadSucceeded(result, data);
							serviceContainer.service.onDataReaded();
							return dataRead;
						},
						handleCreateSucceeded: function (item) {
							var selectActivity = parentService.getSelected();
							item.PpsEventFk = selectActivity.PpsEventFk;
							if (item.Version === 0) {//only set this when create item
								item.ProjectFk = selectActivity.ProjectId;
								item.JobFk = selectActivity.LgmJobFk;//set resRequisition's job by activity's job

								item.RequestedFrom = selectActivity.PlannedStart;
								item.RequestedTo = selectActivity.PlannedFinish;
							}
							else {
								serviceContainer.data.referenceCreated.fire(item);
							}
						}
					}
				},
				actions: {
					create: 'flat',
					delete: false
				}
			}
		};

		serviceContainer = platformDataServiceFactory.createNewComplete(systemOption);

		referenceActionExtension.addReferenceActions(serviceContainer, {
			createReference: true,
			deleteReference: true,
			referenceForeignKeyProperty: 'PpsEventFk'
		});

		var dialogService = $injector.get('productionplanningActivityDialogResRequisitionListService').createService(parentService);

		var config = {
			bodyTemplateUrl: globals.appBaseUrl + 'basics.common/templates/container-dialog/single-grid-container.html',
			handler: 'basicsCommonContainerDialogSingleGridContainerHandler',
			mainDataService: dialogService,
			serviceContainer: serviceContainer,
			uiConfig: {
				dialogTitle: 'productionplanning.activity.resRequisition.ListTitle',
				selectEntityText: 'productionplanning.activity.resRequisition.dialogEntity'
			},
			custom: {
				container: {
					dataService: dialogService,
					uiService: 'activityDialogResRequisitionListUIService',
					gridId: 'c020bfa51ce941fa9a412a7a529b0d4d'
				},
				currentDataService: 'productionplanningActivityResRequisitionDataService',
				foreignKey: 'PpsEventFk'
			}
		};
		serviceContainer.service.showReferencesSelectionDialog = function () {
			dialogService.load();//refresh to avoid the dirty data
			$injector.get('basicsCommonContainerDialogService').showContainerDialog(config);
		};

		serviceContainer.data.referenceCreated = new PlatformMessenger();

		serviceContainer.data.setFilter = function (filter) {
			var parentItem = parentService.getSelected();
			if (parentItem && angular.isDefined(parentItem.PpsEventFk)) {
				serviceContainer.data.filter = 'PpsEventId=' + parentItem.PpsEventFk;
			} else {
				serviceContainer.data.filter = filter;
			}
		};

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'RequisitionDto',
			moduleSubModule: 'Resource.Requisition',
			validationService: productionplanningResourceRequisitionValidationServiceBase.getRequisitionValidationService(serviceContainer.service),
			mustValidateFields: ['UomFk', 'JobFk']
		});

		var requisitionList = {};

		function initRequisitionList(dataList) {
			requisitionList = dataList;
			//basicsLookupdataLookupDescriptorService.updateData('resourceRequisitionLookupDataService', requisitionList);
		}

		//----------------------------
		serviceContainer.service.loadResRequisition = function (PpsEventFk) {
			serviceContainer.service.setFilter('PpsEventId=' + PpsEventFk);
			$q.when(serviceContainer.service.load()).then(function (result) {
				initRequisitionList(result);
			});

		};

		serviceContainer.service.getReqList = function () {
			return requisitionList;
		};

		var filters = [
			{
				key: 'mounting-resource-requisition-filter',
				fn: function (item) {
					var result = false;
					if (item) {
						_.find(requisitionList, function (requisition) {
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

		//synchronize ActResourceReservation
		serviceContainer.service.registerReferenceDeleted(function (e, deletedItem) {
			var reservationGUID = 'ff65929c43634e1791dba161302d98c6';
			var reservationDataService = activityContainerInformationService
				.getContainerInfoByGuid(reservationGUID).dataServiceName;

			if (reservationDataService) {
				//var deletedIds = _.map(deletedItems, 'Id');
				var reservationList = reservationDataService.getList();
				reservationList = _.filter(reservationList, function (reservation) {
					return reservation.RequisitionFk !== deletedItem[0].Id;
					// _.find(deletedIds, {Id: reservation.RequisitionFk});
				});
				reservationDataService.setList(reservationList);
				reservationDataService.clearModifications(reservationList);
			}
		});

		serviceContainer.data.referenceCreated.register(registerReferenceCreated);
		function registerReferenceCreated(createdItem) {
			var reservationGUID = 'ff65929c43634e1791dba161302d98c6';
			var reservationDataService = activityContainerInformationService
				.getContainerInfoByGuid(reservationGUID).dataServiceName;

			if (reservationDataService) {
				//var deletedIds = _.map(deletedItems, 'Id');
				var reservationList = reservationDataService.getList();
				$http.get(globals.webApiBaseUrl + 'resource/reservation/getForResRequisition?resRequisitionId=' + createdItem.Id).then(function (reservations) {
					reservationList = _.concat(reservationList, reservations.data);
					reservationDataService.setList(reservationList);
					reservationList = _.filter(reservationList, function (reservation) {
						return reservation.Version !== 0;
					});
					reservationDataService.clearModifications(reservationList);
				});
			}
		}

		serviceContainer.service.onDataReaded = function () {
		};

		//syc data
		basicsCommonBaseDataServiceBasicExtension.addBasics(serviceContainer);

		return serviceContainer.service;
	}
})(angular);