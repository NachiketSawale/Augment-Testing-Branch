/**
 * Created by anl on 9/12/2017.
 */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name productionplanningMountingResRequisitionDataService
	 * @function
	 *
	 * @description
	 * productionplanningMountingResRequisitionDataService is the data service for all entities related functionality.
	 */
	var moduleName = 'productionplanning.mounting';
	var masterModule = angular.module(moduleName);

	masterModule.factory('productionplanningMountingResRequisitionDataService', ResRequisitionForActivityDataService);

	ResRequisitionForActivityDataService.$inject = ['basicsLookupdataLookupDescriptorService',
		'platformDataServiceFactory',
		'productionplanningMountingContainerInformationService',
		'basicsCommonMandatoryProcessor',
		'$injector',
		'productionplanningMountingResRequisitionProcessor',
		'productionplanningMountingRequisitionDataService',
		'$q',
		'basicsLookupdataLookupFilterService',
		'platformDataServiceProcessDatesBySchemeExtension',
		'productionplanningResourceRequisitionValidationServiceBase',
		'basicsCommonBaseDataServiceBasicExtension',
		'basicsCommonBaseDataServiceReferenceActionExtension',
		'$http',
		'PlatformMessenger',
	    'resourceRequisitionModifyProcessor',
		'productionplanningCommonActivityDateshiftService',
		'productionplanningCommonRequisitionProcessor'];
	function ResRequisitionForActivityDataService(basicsLookupdataLookupDescriptorService,
												  platformDataServiceFactory,
												  mountingContainerInformationService,
												  basicsCommonMandatoryProcessor,
												  $injector,
												  resRequisitionProcessor,
												  requisitionDataService,
												  $q,
												  basicsLookupdataLookupFilterService,
												  platformDataServiceProcessDatesBySchemeExtension,
												  productionplanningResourceRequisitionValidationServiceBase,
												  basicsCommonBaseDataServiceBasicExtension,
												  referenceActionExtension,
												  $http,
												  PlatformMessenger,
                                                  resourceRequisitionModifyProcessor,
                                                 activityDateshiftService,
		productionplanningCommonRequisitionProcessor) {

		var activityGUID = '3a37c9d82f4e45c28ccd650f1fd2bc1f';
		var dynamicActivityService = mountingContainerInformationService.getContainerInfoByGuid(activityGUID).dataServiceName;

		var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
			{typeName: 'RequisitionDto', moduleSubModule: 'Resource.Requisition'}
		);
		var serviceContainer;
		var systemOption = {
			flatLeafItem: {
				serviceName: 'productionplanningMountingResRequisitionDataService',
				entityNameTranslationID: 'productionplanning.activity.resRequisition.ListTitle',
				httpCreate: {
					route: globals.webApiBaseUrl + 'resource/requisition/'
				},
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/requisition/',
					endRead: 'listForMntActivity'
				},
				dataProcessor: [resRequisitionProcessor, dateProcessor, resourceRequisitionModifyProcessor,productionplanningCommonRequisitionProcessor],
				entityRole: {
					leaf: {
						itemName: 'ResRequisition',
						parentService: dynamicActivityService,
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
							var selectActivity = dynamicActivityService.getSelected();
							item.PpsEventFk = selectActivity.PpsEventFk;
							if (item.Version === 0) {//only set this when create item
								item.ProjectFk = requisitionDataService.getSelected().ProjectFk;
								item.JobFk = selectActivity.LgmJobFk;//set resRequisition's job by actitity's job
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

		var config = {
			bodyTemplateUrl: globals.appBaseUrl + 'basics.common/templates/container-dialog/single-grid-container.html',
			handler: 'basicsCommonContainerDialogSingleGridContainerHandler',
			mainDataService: 'activityDialogResRequisitionListService',
			serviceContainer: serviceContainer,
			uiConfig: {
				dialogTitle: 'productionplanning.activity.resRequisition.ListTitle',
				selectEntityText: 'productionplanning.activity.resRequisition.dialogEntity'
			},
			custom: {
				container: {
					dataService: 'activityDialogResRequisitionListService',
					uiService: 'activityDialogResRequisitionListUIService',
					gridId: 'c020bfa51ce941fa9a412a7a529b0d4d'
				},
				currentDataService: 'productionplanningMountingResRequisitionDataService',
				foreignKey: 'PpsEventFk'
			}
		};

		referenceActionExtension.addReferenceActions(serviceContainer, {
			createReference: true,
			deleteReference: true,
			referenceForeignKeyProperty: 'PpsEventFk'
		});

		serviceContainer.service.showReferencesSelectionDialog = function () {
			$injector.get('activityDialogResRequisitionListService').load();//refresh to avoid the dirty data
			$injector.get('basicsCommonContainerDialogService').showContainerDialog(config);
		};


		serviceContainer.data.setFilter = function (filter) {
			var parentItem = dynamicActivityService.getSelected();
			if (parentItem && angular.isDefined(parentItem.PpsEventFk)) {
				serviceContainer.data.filter = 'PpsEventId=' + parentItem.PpsEventFk;
			} else {
				serviceContainer.data.filter = filter;
			}
		};

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'RequisitionDto',
			moduleSubModule: 'Resource.Requisition',
			validationService: productionplanningResourceRequisitionValidationServiceBase.getRequisitionValidationService(
				serviceContainer.service),
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

		serviceContainer.data.referenceCreated = new PlatformMessenger();

		//synchronize ActResourceReservation
		serviceContainer.service.registerReferenceDeleted(function (e, deletedItem) {
			var reservationGUID = 'a9e90275f8de429db681448f6caefce3';
			var reservationDataService = mountingContainerInformationService
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
			var reservationGUID = 'a9e90275f8de429db681448f6caefce3';
			var reservationDataService = mountingContainerInformationService
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

		basicsCommonBaseDataServiceBasicExtension.addBasics(serviceContainer);

		//new virtual dateshift registration!
		activityDateshiftService.registerToVirtualDateshiftService(moduleName,serviceContainer, 'resource.requisition');

		return serviceContainer.service;
	}
})(angular);
