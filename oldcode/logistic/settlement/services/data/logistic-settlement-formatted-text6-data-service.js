/**
 * Created by henkel
 */

(function (angular) {
	'use strict';

	var moduleName ='logistic.settlement';

	/**
	 * @ngdoc service
	 * @name logisticSettlementFormattedText6DataService
	 * @description provides methods to access, create and update logistic formatted text
	 */
	angular.module(moduleName).service('logisticSettlementFormattedText6DataService', LogisticSettlementFormattedTextDataService);

	LogisticSettlementFormattedTextDataService.$inject = ['$http', 'platformDataServiceFactory', 'logisticSettlementDataService' ];

	function LogisticSettlementFormattedTextDataService($http, platformDataServiceFactory, logisticSettlementDataService) {
		var factoryOptions = {
			flatLeafItem: {
				module: moduleName,
				actions: {delete: true, create: 'flat'},
				entityRole: {
					leaf: {itemName: 'FormattedText6', parentService: logisticSettlementDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
		var service = serviceContainer.service;


		serviceContainer.data.hasModifications = function hasModifications() {
			return modifiedFormattedText !== null;
		};

		//Create and save
		service.provideFormattedText6ChangesToUpdate = function provideFormattedText6ChangesToUpdate(updateData) {
			if (modifiedFormattedText) {
				updateData.FormattedText6ToSave = angular.copy(modifiedFormattedText);
				if (!updateData.EntitiesCount) {
					updateData.EntitiesCount = 1;
				}
				else {
					updateData.EntitiesCount += 1;
				}
				clearFormattedText();
			}
		};

		service.registerGetModificationCallback = function registerGetModificationCallback(callbackFn) {
			serviceContainer.data.getClobModificationCallback = callbackFn;
		};
		service.unregisterGetModificationCallback = function unregisterGetModificationCallback() {
			serviceContainer.data.getClobModificationCallback = null;
		};

		service.currentFormattedText6Changed = new Platform.Messenger();
		var modifiedFormattedText = null;
		var currentFormattedText6 = {
			Content: null,
			Id: 0,
			Version: 0
		};

		//loadFormattedTextById
		service.loadFormattedTextById = function loadFormattedTextById(args, data) {
			if (data && data.Clobs6Fk) {
				$http(
					{
						method: 'GET',
						url: globals.webApiBaseUrl + 'cloud/common/clob/getclobbyid?id=' + data.Clobs6Fk
					}
				).then(function (response) {
						// Load successful
						if (response && response.data) {
							currentFormattedText6 = angular.copy(response.data);
							service.currentFormattedText6Changed.fire(currentFormattedText6);
						}
						else{
							service.currentFormattedText6Changed.fire(null);
						}
					},
					function (/*error*/) {
						// Load failed
						clearFormattedText();
					});
			}
			else {
				clearFormattedText();
				service.currentFormattedText6Changed.fire(null);
			}
		};
		var clearFormattedText = function clearFormattedText() {
			modifiedFormattedText = null;
			currentFormattedText6.Content = null;
			currentFormattedText6.Id = 0;
			currentFormattedText6.Version = 0;
		};

		//@param {Object} formattedText : modified formatted text that's to be saved
		service.setFormattedTextAsModified = function setFormattedTextAsModified(formattedText) {
			modifiedFormattedText = formattedText;
		};
		//Value for Service-Update
		service.getModifiedFormattedText = function getModifiedFormattedText() {
			if (modifiedFormattedText !== null) {
				var copy = angular.copy(modifiedFormattedText);
				modifiedFormattedText = null;

				return copy;
			}
			else {
				return null;
			}
		};

		//Current
		/**
		 * @ngdoc function
		 * @name getCurrentFormattedText
		 * @function
		 * @description This function returns the current clearFormattedText coming form the currently selected mein service
		 * @returns {Object} returns object representing the current clearFormattedText
		 */
		service.getCurrentFormattedText = function getCurrentFormattedText() {
			return currentFormattedText6;
		};

		service.setCurrentFormattedText = function setCurrentFormattedText(formattedText) {
			if (currentFormattedText6 !== formattedText) {
				currentFormattedText6 = formattedText;
				service.currentFormattedText6Changed.fire(formattedText);
			}
		};

		return service;
	}
})(angular);
