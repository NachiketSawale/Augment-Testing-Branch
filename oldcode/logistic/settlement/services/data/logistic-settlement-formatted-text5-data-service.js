/**
 * Created by henkel
 */

(function (angular) {
	'use strict';

	var moduleName ='logistic.settlement';

	/**
	 * @ngdoc service
	 * @name logisticSettlementFormattedText5DataService
	 * @description provides methods to access, create and update logistic formatted text
	 */
	angular.module(moduleName).service('logisticSettlementFormattedText5DataService', LogisticSettlementFormattedTextDataService);

	LogisticSettlementFormattedTextDataService.$inject = ['$http', 'platformDataServiceFactory', 'logisticSettlementDataService' ];

	function LogisticSettlementFormattedTextDataService($http, platformDataServiceFactory, logisticSettlementDataService) {
		var factoryOptions = {
			flatLeafItem: {
				module: moduleName,
				actions: {delete: true, create: 'flat'},
				entityRole: {
					leaf: {itemName: 'FormattedText5', parentService: logisticSettlementDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
		var service = serviceContainer.service;


		serviceContainer.data.hasModifications = function hasModifications() {
			return modifiedFormattedText !== null;
		};

		//Create and save
		service.provideFormattedText5ChangesToUpdate = function provideFormattedText5ChangesToUpdate(updateData) {
			if (modifiedFormattedText) {
				updateData.FormattedText5ToSave = angular.copy(modifiedFormattedText);
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

		service.currentFormattedText5Changed = new Platform.Messenger();
		var modifiedFormattedText = null;
		var currentFormattedText5 = {
			Content: null,
			Id: 0,
			Version: 0
		};

		//loadFormattedTextById
		service.loadFormattedTextById = function loadFormattedTextById(args, data) {
			if (data && data.Clobs5Fk) {
				$http(
					{
						method: 'GET',
						url: globals.webApiBaseUrl + 'cloud/common/clob/getclobbyid?id=' + data.Clobs5Fk
					}
				).then(function (response) {
						// Load successful
						if (response && response.data) {
							currentFormattedText5 = angular.copy(response.data);
							service.currentFormattedText5Changed.fire(currentFormattedText5);
						}
						else{
							service.currentFormattedText5Changed.fire(null);
						}
					},
					function (/*error*/) {
						// Load failed
						clearFormattedText();
					});
			}
			else {
				clearFormattedText();
				service.currentFormattedText5Changed.fire(null);
			}
		};
		var clearFormattedText = function clearFormattedText() {
			modifiedFormattedText = null;
			currentFormattedText5.Content = null;
			currentFormattedText5.Id = 0;
			currentFormattedText5.Version = 0;
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
			return currentFormattedText5;
		};

		service.setCurrentFormattedText = function setCurrentFormattedText(formattedText) {
			if (currentFormattedText5 !== formattedText) {
				currentFormattedText5 = formattedText;
				service.currentFormattedText5Changed.fire(formattedText);
			}
		};

		return service;
	}
})(angular);
