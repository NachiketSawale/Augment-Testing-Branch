/**
 * Created by pel on 09.09.2020.
 */
(function(angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W061 */ // eval can be harmful

	var moduleName = 'basics.characteristic';

	angular.module(moduleName).factory('basicsCommonCharacteristicService', [
		'$http', '$q', '$injector', 'globals', 'platformGridAPI', 'platformTranslateService',
		'basicsLookupdataLookupDescriptorService', 'mainViewService',
		'_','basicsCharacteristicPopupGroupService','cloudCommonGridService','$log',
		function ($http, $q, $injector, globals, platformGridAPI, platformTranslateService,
			basicsLookupdataLookupDescriptorService, mainViewService,
			_,basicsCharacteristicPopupGroupService,cloudCommonGridService,$log) {
			var serviceCache = [];

			var service = {};
			var characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory');
			service.getCharacterService = function getCharacterService(parentService, sectionId){
				return characteristicDataService.getService(parentService, sectionId);
			};
			service.unregisterCreateAll = function getCharacterService(parentService, ch1SectionId, ch2SectionId){
				characteristicDataService.getService(parentService, ch1SectionId).registerParentsEntityCreated();
				characteristicDataService.getService(parentService, ch2SectionId).registerParentsEntityCreated();
			};

			function createEntity (sectionId, mainItemId, configrationSectionId,structureSectionId, parentService,newEntity){

				var deffered = $q.defer();
				var _defaultList = null;
				var characterService =  characteristicDataService.getService(parentService, sectionId);
				if(angular.isFunction(parentService.getDefaultListForCreated))
				{
					parentService.getDefaultListForCreated(sectionId,configrationSectionId,structureSectionId,newEntity).then(function (_defaultList) {
						// assign list to container.
						characterService.setList(_defaultList);
						characterService.markEntitiesAsModified(_defaultList);
						// update dynamic columns
						_defaultList.forEach(function (item) {
							characterService.fireItemValueUpdate(item);
						});
						deffered.resolve();
					},function (error) {
						$log.warn('Error ' + error + ' while reading default characteristic list from the server!');
						deffered.resolve();
					});
				}
				else{
					basicsCharacteristicPopupGroupService.loadData(sectionId).then(function(){
						$http.get(globals.webApiBaseUrl + 'basics/characteristic/data/defaultlist?sectionId=' + sectionId + '&mainItemId=' + mainItemId).then(function(response) {
							_defaultList = response.data;
							var groups = [];
							var groupsIds = [];
							cloudCommonGridService.flatten(basicsCharacteristicPopupGroupService.getList(), groups, 'Groups');
							groupsIds  = _.map(groups, 'Id');

							_defaultList = _.filter(_defaultList, function(item){
								return groupsIds.indexOf(item.CharacteristicGroupFk) >= 0;
							});

							// assign list to container.
							characterService.setList(_defaultList);
							characterService.markEntitiesAsModified(_defaultList);
							// update dynamic columns
							_defaultList.forEach(function (item) {
								characterService.fireItemValueUpdate(item);
							});

							deffered.resolve();
						}, function(error) {
							$log.warn('Error ' + error + ' while reading default characteristic list from the server!');
							deffered.resolve();
						});
					});
				}

				return deffered.promise;

			}

			service.onEntityCreated = function onEntityCreated(parentService, newEntity, ch1SectionId, ch2SectionId, config1SectionId, config2SectionId, structure1SectionId, structure2SectionId) {
				// #125512
				var deferred = $q.defer();
				var mainItemId = newEntity.Id === undefined ? newEntity.main.Id : newEntity.Id;
				basicsCharacteristicPopupGroupService.setSelected(null);
				createEntity(ch1SectionId, mainItemId, config1SectionId, structure1SectionId, parentService, newEntity).then(function () {
					basicsCharacteristicPopupGroupService.setSelected(null);
					createEntity(ch2SectionId, mainItemId, config2SectionId, structure2SectionId, parentService, newEntity).then(function () {
						deferred.resolve();
					});
				});
				return deferred.promise;
			};

			return service;


			// function getService (parentService, sectionId) {
			//     var cacheKey = sectionId;
			//     var serviceName = parentService.getServiceName();
			//     if(serviceName) {
			//         cacheKey = serviceName + sectionId;
			//     }
			//     if (!serviceCache[cacheKey]) {
			//         serviceCache[cacheKey] = createService(parentService, sectionId);
			//     }
			//     return serviceCache[cacheKey];
			// }
			//
			// return {
			//     getService: getService
			// };
		}]);
})(angular);