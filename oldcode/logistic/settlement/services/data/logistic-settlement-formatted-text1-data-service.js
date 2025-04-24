/**
 * Created by henkel
 */

(function (angular) {
	'use strict';

	var moduleName ='logistic.settlement';

	/**
	 * @ngdoc service
	 * @name logisticSettlementFormattedText1DataService
	 * @description provides methods to access, create and update logistic formatted text
	 */
	angular.module(moduleName).service('logisticSettlementFormattedText1DataService', LogisticSettlementFormattedTextDataService);

	LogisticSettlementFormattedTextDataService.$inject = ['$http', 'platformDataServiceFactory', 'logisticSettlementDataService' ];

	function LogisticSettlementFormattedTextDataService($http, platformDataServiceFactory, logisticSettlementDataService) {
		var factoryOptions = {
			flatLeafItem: {
				module: moduleName,
				actions: {delete: true, create: 'flat'},
				entityRole: {
					leaf: {itemName: 'FormattedText1', parentService: logisticSettlementDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
		var service = serviceContainer.service;


		serviceContainer.data.hasModifications = function hasModifications() {
			return modifiedFormattedText !== null;
		};

		//Create and save
		service.provideFormattedText2ChangesToUpdate = function provideFormattedText2ChangesToUpdate(updateData) {
			if (modifiedFormattedText) {
				updateData.FormattedText1ToSave = angular.copy(modifiedFormattedText);
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

		service.currentFormattedText1Changed = new Platform.Messenger();
		var modifiedFormattedText = null;
		var currentFormattedText1 = {
			Content: null,
			Id: 0,
			Version: 0
		};

		//loadFormattedTextById
		service.loadFormattedTextById = function loadFormattedTextById(args, data) {
			if (data && data.Clobs1Fk) {
				$http(
					{
						method: 'GET',
						url: globals.webApiBaseUrl + 'cloud/common/clob/getclobbyid?id=' + data.Clobs1Fk
					}
				).then(function (response) {
						// Load successful
						if (response && response.data) {
							currentFormattedText1 = angular.copy(response.data);
							service.currentFormattedText1Changed.fire(currentFormattedText1);
						}
						else{
							service.currentFormattedText1Changed.fire(null);
						}
					},
					function (/*error*/) {
						// Load failed
						clearFormattedText();
					});
			}
			else {
				clearFormattedText();
				service.currentFormattedText1Changed.fire(null);
			}
		};
		var clearFormattedText = function clearFormattedText() {
			modifiedFormattedText = null;
			currentFormattedText1.Content = null;
			currentFormattedText1.Id = 0;
			currentFormattedText1.Version = 0;
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
			return currentFormattedText1;
		};

		service.setCurrentFormattedText = function setCurrentFormattedText(formattedText) {
			if (currentFormattedText1 !== formattedText) {
				currentFormattedText1 = formattedText;
				service.currentFormattedText1Changed.fire(formattedText);
			}
		};

		return service;
	}
})(angular);
