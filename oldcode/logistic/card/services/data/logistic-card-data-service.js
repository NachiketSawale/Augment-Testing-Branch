/**
 * Created by baf on 18.03.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.card');

	/**
	 * @ngdoc service
	 * @name logisticCardDataService
	 * @description provides methods to access, create and update logistic card  entities
	 */
	myModule.service('logisticCardDataService', LogisticCardDataService);

	LogisticCardDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'platformRuntimeDataService',
		'basicsCommonMandatoryProcessor', 'logisticCardConstantValues', 'logisticCardReadOnlyProcessor',];

	function LogisticCardDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, platformRuntimeDataService,
		basicsCommonMandatoryProcessor, logisticCardConstantValues, logisticCardReadOnlyProcessor) {
		var self = this;
		var logisticCardServiceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'logisticCardDataService',
				entityNameTranslationID: 'logistic.common.cardEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/card/card/',
					usePostForRead: true,
					endRead: 'filtered',
					endDelete: 'multidelete'
				},
				actions: {delete: true, create: 'flat', canDeleteCallBackFunc: canDeleteSelectedJobCard },
				dataProcessor: [
					platformDataServiceProcessDatesBySchemeExtension.createProcessor(logisticCardConstantValues.schemes.card),
					logisticCardReadOnlyProcessor,
				],
				entityRole: {root: {itemName: 'Cards', moduleName: 'cloud.desktop.moduleDisplayNameLogisticCard'}},
				entitySelection: {supportsMultiSelection: true},
				presenter: {list: {}},
				sidebarSearch: {
					options: {
						moduleName: 'logistic.card',
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						useCurrentClient: null,
						includeNonActiveItems: null,
						showOptions: false,
						showProjectContext: false,
						withExecutionHints: true
					}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticCardServiceOption, self);
		var service = serviceContainer.service;
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticCardValidationService'
		}, logisticCardConstantValues.schemes.card));

		service.takeOverFromCreateDispatchingJobCardWizard =  function takeOverFromCreateDispatchingJobCardWizard (response) {
			_.forEach(response, function (changedCard) {
				var viewCard = serviceContainer.service.getItemById(changedCard.Id);
				if(viewCard){
					viewCard.DispatchHeaderFk = changedCard.DispatchHeaderFk;
					viewCard.JobCardStatusFk = changedCard.JobCardStatusFk;
					service.fireItemModified(viewCard);
				}
			});
		};

		service.setEntityToReadonlyIfRootEntityIs = function setEntityToReadonlyIfRootEntityIs(entity){
			var selected = service.getSelected();
			if(selected && selected.IsReadonlyStatus){
				platformRuntimeDataService.readonly(entity, true);
			}
		};

		service.canCreateOrDelete = function canCreateOrDelete(){
			var result = true;
			var selected = service.getSelected();
			if(selected && selected.IsReadonlyStatus){
				result = false;
			}
			return result;
		};

		// private function
		function canDeleteSelectedJobCard(selected) {
			var result = true;
			if(selected && selected.IsReadonlyStatus){
				result = false;
			}
			return result;
		}
	}

})(angular);
