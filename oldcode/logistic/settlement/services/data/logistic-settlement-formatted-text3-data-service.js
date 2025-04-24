/**
 * Created by henkel
 */

(function (angular) {
	'use strict';

	var moduleName ='logistic.settlement';

	/**
	 * @ngdoc service
	 * @name logisticSettlementFormattedText3DataService
	 * @description provides methods to access, create and update logistic formatted text
	 */
	angular.module(moduleName).service('logisticSettlementFormattedText3DataService', LogisticSettlementFormattedTextDataService);

	LogisticSettlementFormattedTextDataService.$inject = ['$http', 'platformDataServiceFactory', 'logisticSettlementDataService' ];

	function LogisticSettlementFormattedTextDataService($http, platformDataServiceFactory, logisticSettlementDataService) {
		var factoryOptions = {
			flatLeafItem: {
				module: moduleName,
				actions: {delete: true, create: 'flat'},
				entityRole: {
					leaf: {itemName: 'FormattedText3', parentService: logisticSettlementDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
		var service = serviceContainer.service;


		serviceContainer.data.hasModifications = function hasModifications() {
			return modifiedFormattedText !== null;
		};

		//Create and save
		service.provideFormattedText3ChangesToUpdate = function provideFormattedText3ChangesToUpdate(updateData) {
			if (modifiedFormattedText) {
				updateData.FormattedText3ToSave = angular.copy(modifiedFormattedText);
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

		service.currentFormattedText3Changed = new Platform.Messenger();
		var modifiedFormattedText = null;
		var currentFormattedText3 = {
			Content: null,
			Id: 0,
			Version: 0
		};

		//loadFormattedTextById
		service.loadFormattedTextById = function loadFormattedTextById(args, data) {
			if (data && data.Clobs3Fk) {
				$http(
					{
						method: 'GET',
						url: globals.webApiBaseUrl + 'cloud/common/clob/getclobbyid?id=' + data.Clobs3Fk
					}
				).then(function (response) {
						// Load successful
						if (response && response.data) {
							currentFormattedText3 = angular.copy(response.data);
							service.currentFormattedText3Changed.fire(currentFormattedText3);
						}
						else{
							service.currentFormattedText3Changed.fire(null);
						}
					},
					function (/*error*/) {
						// Load failed
						clearFormattedText();
					});
			}
			else {
				clearFormattedText();
				service.currentFormattedText3Changed.fire(null);
			}
		};
		var clearFormattedText = function clearFormattedText() {
			modifiedFormattedText = null;
			currentFormattedText3.Content = null;
			currentFormattedText3.Id = 0;
			currentFormattedText3.Version = 0;
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
			return currentFormattedText3;
		};

		service.setCurrentFormattedText = function setCurrentFormattedText(formattedText) {
			if (currentFormattedText3 !== formattedText) {
				currentFormattedText3 = formattedText;
				service.currentFormattedText3Changed.fire(formattedText);
			}
		};

		return service;
	}
})(angular);
