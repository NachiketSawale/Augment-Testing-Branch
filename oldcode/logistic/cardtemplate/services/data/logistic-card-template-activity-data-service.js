/**
 * Created by baf on 19.03.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.cardtemplate');

	/**
	 * @ngdoc service
	 * @name logisticCardTemplateActivityDataService
	 * @description pprovides methods to access, create and update logistic cardTemplate activity entities
	 */
	myModule.service('logisticCardTemplateActivityDataService', LogisticCardTemplateActivityDataService);

	LogisticCardTemplateActivityDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticCardTemplateConstantValues', 'logisticCardTemplateDataService'];

	function LogisticCardTemplateActivityDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, logisticCardTemplateConstantValues, logisticCardTemplateDataService) {
		var self = this;
		var logisticCardTemplateActivityServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'logisticCardTemplateActivityDataService',
				entityNameTranslationID: 'logistic.common.activityEntity',
				httpCreate: {route: globals.webApiBaseUrl + 'logistic/cardtemplate/activitytemplate/'},
				httpRead: {
					route: globals.webApiBaseUrl + 'logistic/cardtemplate/activitytemplate/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticCardTemplateDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					logisticCardTemplateConstantValues.schemes.cardTemplateActivity)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticCardTemplateDataService.getSelected();
							creationData.PKey1 = selected.Id;
						},
						handleCreateSucceeded: function handleCreateSucceeded(newItem, data) {
							if (newItem && data.itemList.length > 0) {
								let record = _.find(data.itemList, function (item) {
									let newCode = parseInt(item.Code);
									let newItemCode = parseInt(newItem.Code);
									if(!_.isNaN(newCode) && !_.isNaN(newItemCode))
										return newItemCode === newCode;
								});
								if (record) {
									let list = _.filter(data.itemList, function (item){
										let newCode = parseInt(item.Code);
										if(!_.isNaN(newCode)){
											return newCode;
										}
									});
									let newList = _.sortBy(list, function (item) {
										return parseInt(item.Code);
									});
									let lastItem = _.last(newList);
									if (lastItem) {
										let itemCode = parseInt(lastItem.Code);
										newItem.Code = parseInt(newItem.Code);
										newItem.Code = itemCode + 10;
									}
								}
							}
						}
					}
				},
				entityRole: {
					node: {itemName: 'ActivityTemplates', parentService: logisticCardTemplateDataService}
				},
				translation: {
					uid: 'logisticCardTemplateActivityDataService',
					title: 'logistic.cardtemplate.cardTemplateActivityListTitle',
					columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
					dtoScheme: logisticCardTemplateConstantValues.schemes.cardTemplateActivity
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticCardTemplateActivityServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticCardTemplateActivityValidationService'
		}, logisticCardTemplateConstantValues.schemes.cardTemplateActivity));
	}
})(angular);
