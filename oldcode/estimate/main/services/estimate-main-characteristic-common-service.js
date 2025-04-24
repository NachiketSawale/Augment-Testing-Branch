/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name estimateMainCharacteristicCommonService
	 * @description copy characters from assembly to line item
	 */

	estimateMainModule.factory('estimateMainCharacteristicCommonService', ['$injector', '$http',
		function ($injector, $http) {

			let service = {};

			function copyCharacter(sourceSectionId, sourceMainItemId, destSectionId, destMainItemId){
				let copyData = {
					sourceSectionId: sourceSectionId,
					sourceMainItemId: sourceMainItemId,
					destSectionId: destSectionId,
					destMainItemId: destMainItemId
				};
				return $http.post(globals.webApiBaseUrl + 'basics/characteristic/data/copy', copyData).then(function(response) {
					return response.data;
				});
			}

			function copyCharacter2AssemblyToLineItem(dataService, assembly, lineItemEntity){
				let characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(dataService, 28, null, 'EstHeaderFk');
				copyCharacter(30, assembly.Id, 28, lineItemEntity.Id).then(function(data){
					if(data && data !== null) {
						let characterList = characteristicDataService.getList();
						let characters = _.filter(characterList, function(character){
							let item = _.find(data, {'Id': character.Id});
							return item ? false : true;
						});
						let characterData = data.concat(characters);
						characteristicDataService.setList(characterData);
						angular.forEach(data, function (item) {
							characteristicDataService.fireItemModified(item);
							characteristicDataService.fireItemValueUpdate(item);
						});
					}
				});
			}

			function copyCharacter1AssemblyToLineItem(dataService, assembly, lineItemEntity){
				let characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(dataService, 27, null, 'EstHeaderFk');
				copyCharacter(29, assembly.Id, 27, lineItemEntity.Id).then(function(data){
					if(data && data !== null) {
						let characterList = characteristicDataService.getList();
						let characters = _.filter(characterList, function(character){
							let item = _.find(data, {'Id': character.Id});
							return item ? false : true;
						});
						let characterData = data.concat(characters);
						characteristicDataService.setList(characterData);
						angular.forEach(data, function (item) {
							characteristicDataService.fireItemModified(item);
						});
					}
				});
			}

			angular.extend(service, {
				copyCharacter2AssemblyToLineItem: copyCharacter2AssemblyToLineItem,
				copyCharacter1AssemblyToLineItem: copyCharacter1AssemblyToLineItem
			});

			return service;
		}
	]);

})(angular);
