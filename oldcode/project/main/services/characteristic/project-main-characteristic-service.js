
(function(angular) {
	'use strict';

	var moduleName = 'project.main';

	angular.module(moduleName).factory('projectMainCharacteristicService', [
		'$http', 'basicsCharacteristicPopupGroupService', '$injector', 'globals', 'cloudCommonGridService', '$log', '_', '$q',
		function ($http, basicsCharacteristicPopupGroupService, $injector, globals, cloudCommonGridService, $log, _, $q) {
			var service = {};
			var CharacteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory');

			service.getCharacterService = function getCharacterService(parentService, sectionId){
				return CharacteristicDataService.getService(parentService, sectionId);
			};

			service.unregisterCreateAll = function getCharacterService(parentService){
				CharacteristicDataService.getService(parentService, 1).registerParentsEntityCreated();
				CharacteristicDataService.getService(parentService, 40).registerParentsEntityCreated();
			};

			function createEntity (sectionId, mainItemId, parentService){

				var deffered = $q.defer();

				basicsCharacteristicPopupGroupService.loadData(sectionId).then(function(){
					$http.get(globals.webApiBaseUrl + 'basics/characteristic/data/defaultlist?sectionId=' + sectionId + '&mainItemId=' + mainItemId).then(function(response) {
						var _defaultList = response.data;
						//defaultListNotModified=response.data;

						var groups = [];
						var groupsIds = [];
						cloudCommonGridService.flatten(basicsCharacteristicPopupGroupService.getList(), groups, 'Groups');
						groupsIds  = _.map(groups, 'Id');

						_defaultList = _.filter(_defaultList, function(item){
							return groupsIds.indexOf(item.CharacteristicGroupFk) >= 0;
						});
						//Only add ToSave
						var characterService =  CharacteristicDataService.getService(parentService, sectionId);
						characterService.markEntitiesAsModified(_defaultList);
						characterService.setList(_defaultList);
						deffered.resolve();

					}, function(error) {
						$log.warn('Error ' + error + ' while reading default characteristic list from the server!');
						deffered.resolve();

					});
				});
				return deffered.promise;

			}
			service.onEntityCreated = function onEntityCreated(parentService, newEntity) {

				var mainItemId = newEntity.Id;

				basicsCharacteristicPopupGroupService.setSelected(null);

				createEntity(1, mainItemId, parentService).then(function() {
					basicsCharacteristicPopupGroupService.setSelected(null);
					createEntity(40, mainItemId, parentService);
				});
			};

			return service;

		}]);
})(angular);