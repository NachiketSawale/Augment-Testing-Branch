/**
 * Created by waz on 11/15/2017.
 */

(function (angular) {
	'use strict';

	var module = 'transportplanning.requisition';
	angular.module(module).factory('transportplanningRequisitionResRequisitionDataService', TransportplanningRequisitionResRequisitionDataService);

	TransportplanningRequisitionResRequisitionDataService.$inject = [
		'$injector',
		'basicsCommonContainerDialogService',
		'basicsLookupdataLookupDescriptorService',
		'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'transportplanningRequisitionMainService',
		'basicsCommonMandatoryProcessor',
		'productionplanningResourceRequisitionValidationServiceBase',
		'basicsCommonBaseDataServiceReferenceActionExtension',
		'productionplanningCommonActivityDateshiftService',
		'productionplanningCommonRequisitionProcessor'];
	function TransportplanningRequisitionResRequisitionDataService($injector, dialogDataService,
																   basicsLookupdataLookupDescriptorService,
																   platformDataServiceFactory,
																   platformDataServiceProcessDatesBySchemeExtension,
																   parentService,
																   basicsCommonMandatoryProcessor,
																   productionplanningResourceRequisitionValidationServiceBase,
																   referenceActionExtension,
																                  activityDateshiftService,
		productionplanningCommonRequisitionProcessor) {
		var serviceContainer;
		var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
			{typeName: 'RequisitionDto', moduleSubModule: 'Resource.Requisition'}
		);
		var serviceOption = {
			flatLeafItem: {
				serviceName: 'transportplanningRequisitionResRequisitionDataService',
				entityNameTranslationID: 'transportplanning.requisition.resource.requisition.listTitle',
				httpCreate: {route: globals.webApiBaseUrl + 'resource/requisition/'},
				httpRead: {
					route: globals.webApiBaseUrl + 'transportplanning/requisition/trsgoods/',
					endRead: 'listResRequisition'
				},
				dataProcessor: [dateProcessor,productionplanningCommonRequisitionProcessor],
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
							return serviceContainer.data.handleReadSucceeded(result, data);
						},
						handleCreateSucceeded: function (item) {//set the TrsRequisitionFk when created
							item.TrsRequisitionFk = parentService.getSelected().Id;
							if (item.Version === 0) {
								var parentItem = parentService.getSelected();
								item.ProjectFk = parentItem.ProjectFk;
								item.JobFk = parentItem.LgmJobFk;
							}
						}
					}
				},
				actions: {
					create: 'flat',
					delete: false
					/*canDeleteCallback: function () {
					 return parentService.getSelected() && !parentService.isSelectedItemAccepted();
					 }*/
				}
			}
		};

		serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

		function canCreateOrDeleteReference() {
			return parentService.getSelected() && !parentService.isSelectedItemAccepted();
		}

		referenceActionExtension.addReferenceActions(serviceContainer, {
			createReference: true,
			deleteReference: true,
			referenceForeignKeyProperty: 'TrsRequisitionFk',
			canCreateReference: canCreateOrDeleteReference,
			canDeleteReference: canCreateOrDeleteReference
		});


		var dialogServiceName = 'transportplanningRequisitionResRequisitionDialogResRequisitionDataService';

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
				currentDataService: 'transportplanningRequisitionResRequisitionDataService',
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

		serviceContainer.service.canCreate = function () {
			return parentService.getSelected() && !parentService.isSelectedItemAccepted();
		};

		serviceContainer.service.showReferencesSelectionDialog = function () {
			$injector.get(dialogServiceName).load();//refresh to avoid the dirty data
			dialogDataService.showContainerDialog(config);
		};

		/*serviceContainer.service.registerEntityDeleted(function (e, deletedItems) {
		 _.forEach(deletedItems, function (item) {
		 item.TrsRequisitionFk = null;
		 });
		 });*/

		//new virtual dateshift registration!
		activityDateshiftService.registerToVirtualDateshiftService(module,serviceContainer, 'resource.requisition');

		return serviceContainer.service;
	}
})(angular);
