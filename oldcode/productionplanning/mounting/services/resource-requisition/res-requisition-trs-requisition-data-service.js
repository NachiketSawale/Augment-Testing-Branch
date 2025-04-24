/**
 * Created by waz on 11/15/2017.
 */

(function (angular) {
	'use strict';

	var module = 'productionplanning.mounting';
	angular.module(module).factory('productionplanningMountingTrsRequisitionResRequisitionDataService', TrsRequisitionResRequisitionDataService);

	TrsRequisitionResRequisitionDataService.$inject = ['$injector',
		'basicsCommonContainerDialogService',
		'basicsLookupdataLookupDescriptorService',
		'platformDataServiceFactory',
		'productionplanningMountingTrsRequisitionDataService',
		'platformDataServiceProcessDatesBySchemeExtension',
		'productionplanningMountingResRequisitionProcessor',
		'basicsCommonMandatoryProcessor',
		'productionplanningResourceRequisitionValidationServiceBase',
		'basicsCommonBaseDataServiceBasicExtension',
		'basicsCommonBaseDataServiceReferenceActionExtension',
		'$http',
		'PlatformMessenger',
		'productionplanningMountingContainerInformationService',
	    'resourceRequisitionModifyProcessor',
		'productionplanningCommonActivityDateshiftService',
	'productionplanningCommonRequisitionProcessor'];

	function TrsRequisitionResRequisitionDataService($injector, dialogDataService,
													 basicsLookupdataLookupDescriptorService,
													 platformDataServiceFactory,
													 parentService,
													 platformDataServiceProcessDatesBySchemeExtension,
													 resRequisitionProcessor,
													 basicsCommonMandatoryProcessor,
													 productionplanningResourceRequisitionValidationServiceBase,
													 basicsCommonBaseDataServiceBasicExtension,
													 referenceActionExtension,
													 $http,
													 PlatformMessenger,
													 mountingContainerInformationService,
                                                     resourceRequisitionModifyProcessor,
													 activityDateshiftService,
		productionplanningCommonRequisitionProcessor) {

		var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
			{typeName: 'RequisitionDto', moduleSubModule: 'Resource.Requisition'});
		var serviceContainer;
		var serviceOption = {
			flatLeafItem: {
				serviceName: 'productionplanningMountingTrsRequisitionResRequisitionDataService',
				entityNameTranslationID: 'productionplanning.activity.trsRequisition.resRequisitonListTitle',
				httpCreate: {route: globals.webApiBaseUrl + 'resource/requisition/'},
				httpRead: {
					route: globals.webApiBaseUrl + 'transportplanning/requisition/trsgoods/',
					endRead: 'listResRequisition'
				},
				dataProcessor: [resRequisitionProcessor, dateProcessor, resourceRequisitionModifyProcessor, productionplanningCommonRequisitionProcessor],
				entityRole: {
					leaf: {
						itemName: 'ResRequisition',
						parentService: parentService,
						parentFilter: 'trsRequisitionId'
					}
				},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							var result = {
								FilterResult: readData.FilterResult,
								dtos: readData || []
							};
							basicsLookupdataLookupDescriptorService.attachData(readData);
							var dataRead = serviceContainer.data.handleReadSucceeded(result, data);
							serviceContainer.service.onDataReaded();
							return dataRead;
						},
						handleCreateSucceeded: function (item) {//set the TrsRequisitionFk when created
							var parentItem = parentService.getSelected();
							item.TrsRequisitionFk = parentItem.Id;
							if (item.Version === 0) {//only set this when create item
								item.JobFk = parentItem.LgmJobFk;//set resRequisition's job by trsRequisition's job
								var selectActivity = parentService.parentService().getSelected();
								item.RequestedFrom = selectActivity.PlannedStart;
								item.RequestedTo = selectActivity.PlannedFinish;
								item.ProjectFk = selectActivity.ProjectId;
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

		serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

		serviceContainer.service.dateshiftId = 'trs.resource.requisition';

		var dialogServiceName = 'productionplanningMountingResRequisitionDialogDataService';

		var config = {
			bodyTemplateUrl: globals.appBaseUrl + 'basics.common/templates/container-dialog/single-grid-container.html',
			handler: 'basicsCommonContainerDialogSingleGridContainerHandler',
			mainDataService: dialogServiceName,
			serviceContainer: serviceContainer,
			uiConfig: {
				dialogTitle: 'transportplanning.requisition.resource.requisition.dialogTitle',
				selectEntityText: 'transportplanning.requisition.resource.requisition.entity'
			},
			custom: {
				container: {
					dataService: dialogServiceName,
					uiService: 'activityDialogResRequisitionListUIService',
					gridId: 'c30d62ac8d014643a7d04eac389459ac'
				},
				currentDataService: 'productionplanningMountingTrsRequisitionResRequisitionDataService',
				foreignKey: 'TrsRequisitionFk'
			}
		};

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'RequisitionDto',
			moduleSubModule: 'Resource.Requisition',
			validationService: productionplanningResourceRequisitionValidationServiceBase.getRequisitionValidationService(
				serviceContainer.service),
			mustValidateFields: ['UomFk', 'JobFk']
		});

		referenceActionExtension.addReferenceActions(serviceContainer, {
			createReference: true,
			deleteReference: true,
			referenceForeignKeyProperty: 'TrsRequisitionFk'
		});

		serviceContainer.service.showReferencesSelectionDialog = function () {
			$injector.get(dialogServiceName).load();//refresh to avoid the dirty data
			dialogDataService.showContainerDialog(config);
		};

		//synchronize TrsResourceReservation
		serviceContainer.service.registerReferenceDeleted(function (e, deletedItem) {
			var reservationGUID = 'cce4e1d048ca486da12d36d97ffedca7';
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

		serviceContainer.data.referenceCreated = new PlatformMessenger();

		serviceContainer.data.referenceCreated.register(registerReferenceCreated);
		function registerReferenceCreated(createdItem) {
			var reservationGUID = 'cce4e1d048ca486da12d36d97ffedca7';
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

		serviceContainer.service.canCreate = function () {
			var hlp = parentService.getSelected() && !parentService.isSelectedItemAccepted();
			return _.isNil(hlp) ? false : hlp;
		};

		serviceContainer.service.canDelete = function () {
			var hlp = serviceContainer.service.getSelected() && parentService.getSelected() && !parentService.isSelectedItemAccepted();
			return _.isNil(hlp) ? false : hlp;
		};

		serviceContainer.service.onDataReaded = function () {
		};

		basicsCommonBaseDataServiceBasicExtension.addBasics(serviceContainer);

		//new virtual dateshift registration!
		activityDateshiftService.registerToVirtualDateshiftService(module,serviceContainer, 'resource.requisition');

		return serviceContainer.service;
	}
})(angular);