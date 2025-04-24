/**
 * Created by bh on 22.09.2015.
 */
(function () {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	/**
     * @ngdoc service
     * @name procurementCommonCharacteristicDataService
     */
	angular.module('procurement.common').factory('procurementCommonCharacteristicDataService', ['$q', '$http', '$injector',
		function ($q, $http, $injector) {
			let service = {};
			service.getDefaultListForCreated = function (targetSectionId, configurationId, configurationSourceSectionId, structureSourceSectionId, newEntity) {
				let deferred = $q.defer();
				const mainItemId = newEntity.Id;
				const structureId = newEntity.StructureFk || newEntity.PrcStructureFk || undefined;

				$q.all([
					GetBasCharacteristicType(targetSectionId),
					GetCharacteristicByStructure(structureId, mainItemId, structureSourceSectionId, targetSectionId),
					GetCharacteristicByConfiguration(configurationId, mainItemId, configurationSourceSectionId, targetSectionId),
					GetDefaultList(targetSectionId, mainItemId)
				]).then(([basTypeRes, structureRes, configRes, defaultRes]) => {
					const basTypeIdRes = _.map(basTypeRes, 'Id');
					const filteredStructureRes = _.filter(structureRes, val => basTypeIdRes.indexOf(val.CharacteristicFk) !== -1);
					const filteredConfigRes = _.filter(configRes, val => basTypeIdRes.indexOf(val.CharacteristicFk) !== -1);
					const filteredDefaultRes = _.filter(defaultRes, val => basTypeIdRes.indexOf(val.CharacteristicFk) !== -1);
					const defaultList = _.uniqBy(
						_.concat(filteredStructureRes, filteredConfigRes, filteredDefaultRes),
						'CharacteristicFk'
					);

					deferred.resolve(defaultList);
				});
				return deferred.promise;
			};
			// take Characteristic By Basics Module(eq contract qtn ...)///remove old Characteristic,and add data from  basics|Characteristic
			service.takeCharacteristicByBasics = function (dataService, targetSectionId, newCharacteristic, value) {
				// characteristic
				let charDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(dataService, targetSectionId);
				let listData = charDataService.getUnfilteredList();
				charDataService.deleteEntities(listData);
				let newItem = newCharacteristic.map(function (item) {
					item.ObjectFk = value;
					item.IsComeBasics = true;
					item.Version = 0;
					return item;
				});
				charDataService.setList(newItem);
			};

			service.takeCharacteristicByStructure = function (dataService, targetSectionId, target2SectionId, newEntity, value) {
				const structureSourceSectionId = 9;// 9 is  CharacteristicByStructure
				const structureSource2SectionId = 54;// 54 is  Characteristic2ByStructure
				const processSectionData = (sectionId, sectionData) => {
					const charDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(dataService, sectionId);
					const listData = charDataService.getUnfilteredList();
					const newItems = sectionData.map(item => Object.assign({}, item, {ObjectFk: value}));

					const uniqueItems = _.uniqBy(_.concat(newItems, listData), 'CharacteristicFk');
					charDataService.setList(uniqueItems);
				};

				GetCharacteristicByStructure(newEntity.StructureFk, newEntity.Id, structureSourceSectionId, targetSectionId)
					.then(targetSectionData => processSectionData(targetSectionId, targetSectionData))
					.then(() => GetCharacteristicByStructure(newEntity.StructureFk, newEntity.Id, structureSource2SectionId, target2SectionId))
					.then(target2SectionData => processSectionData(target2SectionId, target2SectionData))
					.then(() => true) // Resolve with true after processing both sections
					.catch(error => console.error(error)); // Handle any error during the process
			};

			function GetBasCharacteristicType(targetSectionId) {
				return $http.get(globals.webApiBaseUrl + 'basics/characteristic/characteristic/getcharacteristicbysectionfk', {
					params: {
						sectionFk: targetSectionId
					}
				}).then(response => response.data);
			}

			function GetDefaultList(targetSectionId, mainItemId) {
				return $http.get(globals.webApiBaseUrl + 'basics/characteristic/data/defaultlist', {
					params: {
						sectionId: targetSectionId,
						mainItemId: mainItemId
					}
				}).then(response => response.data);
			}

			function GetCharacteristicByConfiguration(configurationId, mainItemId, configurationSourceSectionId, targetSectionId) {
				let deferred = $q.defer();
				if (configurationId) {
					$http.get(globals.webApiBaseUrl + 'basics/characteristic/data/getAndSetList', {
						params: {
							sourceHeaderId: configurationId,
							targetHeaderId: mainItemId,
							sourceSectionId: configurationSourceSectionId,
							targetSectionId: targetSectionId
						}
					}).then(response => {
						deferred.resolve(response.data);
					}).catch(error => {
						deferred.reject(error);
					});
				} else {
					deferred.resolve([]);
				}
				return deferred.promise;
			}

			function GetCharacteristicByStructure(structureId, mainItemId, structureSourceSectionId, targetSectionId) {
				let deferred = $q.defer();
				if (structureId) {
					$http.get(globals.webApiBaseUrl + 'basics/characteristic/data/getAndSetList', {
						params: {
							sourceHeaderId: structureId,
							targetHeaderId: mainItemId,
							sourceSectionId: structureSourceSectionId,
							targetSectionId: targetSectionId
						}
					}).then(response => {
						deferred.resolve(response.data);
					}).catch(error => {
						deferred.reject(error);
					});
				} else {
					deferred.resolve([]);
				}
				return deferred.promise;
			}

			return service;
		}
	]);
})();