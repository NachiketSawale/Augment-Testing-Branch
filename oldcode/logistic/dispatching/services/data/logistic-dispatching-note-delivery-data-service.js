/**
 * Created by henkel 29/09/2023
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('logistic.dispatching');

	/**
	 * @ngdoc service
	 * @name logisticNoteDeliveryDataService
	 * @description provides methods to access, create and update logistic NoteDelivery entities
	 */
	myModule.service('logisticDispatchingNoteDeliveryDataService', LogisticDispatchingNoteDeliveryDataService);

	LogisticDispatchingNoteDeliveryDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticDispatchingConstantValues', 'logisticDispatchingHeaderDataService',
		];

	function LogisticDispatchingNoteDeliveryDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, logisticDispatchingConstantValues, logisticDispatchingHeaderDataService
		){
		let self = this;
		let logisticDispatchingNoteDeliveryServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticDispatchingNoteDeliveryDataService',
				entityNameTranslationID: 'logistic.dispatching.notedelivery',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/dispatching/notedelivery/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticDispatchingHeaderDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [
					platformDataServiceProcessDatesBySchemeExtension.createProcessor(logisticDispatchingConstantValues.schemes.noteDelivery)
				],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticDispatchingHeaderDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'NoteDeliveries', parentService: logisticDispatchingHeaderDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(logisticDispatchingNoteDeliveryServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticDispatchingNoteDeliveryValidationService'
		}, logisticDispatchingConstantValues.schemes.noteDelivery));

		serviceContainer.service.canCreate= function canCreate() {
			if(logisticDispatchingHeaderDataService.getSelected() !== null){
				let item = this.getList();
				return item.length < 1;
			}else{
				return false;
			}

		};

	}
})(angular);
