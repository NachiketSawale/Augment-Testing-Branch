/**
 * Created by reimer on 03.03.2015.
 */

(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'basics.characteristic';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('basicsCharacteristicCodeLookupService', [
		'$q',
		'$http',
		'_',
		function ($q,
					 $http,
					 _) {

			var data = [];      // cached object list (one list for all sections!)

			var service = {};

			service.getlookupType = function () {
				return 'basicsCharacteristicCodeLookup';
			};

			service.loadData = function (sectionId) {

				var deffered = $q.defer();

				if (isSectionLoaded(sectionId) || sectionId === -1) {
					deffered.resolve();
				} else {

					$http.get(globals.webApiBaseUrl + 'basics/characteristic/characteristic/lookup?sectionId=' + sectionId).then(function (response) {
						// data = []; --> list will be extended bei new section!
						if (!isSectionLoaded(sectionId)) {  // maybe multiply calls are active!
							angular.forEach(response.data, function (value) {
								value.sectionId = sectionId;  // append sectionId to entity
								data.push(value);
							});
						}
						// update cached data
						// basicsLookupdataLookupDescriptorService.updateData(service.getlookupType(), data);  //--> seems to be unnecessary?
						deffered.resolve();
					});
				}

				return deffered.promise;
			};

			function isSectionLoaded(sectionId) {
				return data && _.findIndex(data, {sectionId: sectionId}) !== -1;
			}

			service.refresh = function (sectionId) {

				var deffered = $q.defer();
				data = [];

				service.loadData(sectionId).then(function () {
					deffered.resolve();
				}
				);

				return deffered.promise;
			};

			// returns a list of all codes (section must be filtered by a lookupOptions filterKey !)
			service.getList = function () {
				return data;
			};

			service.getListBySection = function (sectionId) {
				return _.filter(data, function (item) {
					return item.sectionId === sectionId;
				});
			};

			var getUsedCharacteristicIds = function (characteristicDataService) {

				if (characteristicDataService) {
					var list = characteristicDataService.getUnfilteredList ? characteristicDataService.getUnfilteredList() : characteristicDataService.getList();
					if (list) {
						return _.map(list, 'CharacteristicFk');
					}
				}
				return null;
			};

			service.getListForLookup = function (sectionId, removeUsed, characteristicDataService) {

				var deffered = $q.defer();

				service.loadData(sectionId).then(function () {

					var result = [];
					var listBySection = service.getListBySection(sectionId);
					if (listBySection) {

						var characteristicIds2Remove = null;
						if (removeUsed) {
							characteristicIds2Remove = getUsedCharacteristicIds(characteristicDataService);
						}

						for (var i = 0; i < listBySection.length; i++) {
							var used = characteristicIds2Remove ? characteristicIds2Remove.indexOf(listBySection[i].Id) : -1;
							if (listBySection[i].IsReadonly === false && used === -1) {
								result.push(listBySection[i]);
							}
						}
					}
					deffered.resolve(result);
				}
				);

				return deffered.promise;
			};

			service.getItemById = function (id) {

				if (data) {
					for (var i = 0; i < data.length; i++) {
						if (data[i].Id === id) {
							return data[i];
						}
					}
				}
				return null;
			};

			service.loadItemsAndGetById = function (sectionId, id) {

				var deffered = $q.defer();

				service.loadData(sectionId).then(function () {
					deffered.resolve(service.getItemById(id));
				});

				return deffered.promise;
			};

			// region used by basicsCharacteristicCodeLookup directive

			service.getListByGroup = function (groupId, id2Remove) {

				return $http.get(globals.webApiBaseUrl + 'basics/characteristic/characteristic/lookupbygroup?groupId=' + groupId).then(function (response) {
					return _.filter(response.data, function (item) {
						return item.Id !== id2Remove;
					});   // remove selected characteristic
				});
			};

			service.getById = function (id) {

				return $http.get(globals.webApiBaseUrl + 'basics/characteristic/characteristic/lookupbykey?id=' + id).then(function (response) {
					return response.data;
				});
			};

			service.loadDataByContextId = function (sectionId, contextId) {
				const endPoint = 'list';
				if (contextId && sectionId) {
					return $http.get(globals.webApiBaseUrl + 'basics/characteristic/data/' + endPoint + '?sectionId=' + sectionId + '&mainItemId=' + contextId)
						.then(function (response) {
							return response.data;
						});
				}
			};

			// region passing settings (workaround only used for popup controller

			/**
			 * @ngdoc
			 * @name
			 * @function
			 *
			 * @description
			 * get/set context section id
			 */
			var _sectionId = null;
			service.sectionId = {
				get value() {
					return _sectionId;
				},
				set value(sectionId) {
					_sectionId = sectionId;
				}
			};

			var _removeUsed = false;
			service.removeUsed = {
				get value() {
					return _removeUsed;
				},
				set value(removeUsed) {
					_removeUsed = removeUsed;
				}
			};

			var _characteristicDataService = null;
			service.characteristicDataService = {
				get value() {
					return _characteristicDataService;
				},
				set value(characteristicDataService) {
					_characteristicDataService = characteristicDataService;
				}
			};

			return service;

		}
	]);
})(angular);
