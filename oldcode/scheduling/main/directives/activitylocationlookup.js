/**
 * Created by leo on 14.10.2014.
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name scheduling-main-activity-location-lookup
	 * @requires  projectLocationMainService
	 * @description ComboBox to select a activity
	 */

	angular.module('scheduling.main').directive('schedulingMainActivityLocationLookup', ['$q', 'projectLocationMainService','schedulingMainService', 'basicsLookupdataLookupDescriptorService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q, projectLocationMainService,schedulingMainService, basicsLookupdataLookupDescriptorService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'activitylocation',
				valueMember: 'Id',
				displayMember: 'Code'
			};

			var lastProjectId;// Filter to reduce number of calls
			var flatList = [];// Data we got from last call for lastProjectId

			function flatten (input, data){
				for (var i= 0; i<input.length; i++){
					data.push(input[i]);
					if(input[i].HasChildren){
						flatten (input[i].Locations, data);
					}
				}
				return data;
			}

			function getFlatList(){
				var deferred = $q.defer();
				var selectedProjectId = schedulingMainService.getSelectedProjectId();

				if(lastProjectId !== selectedProjectId) {
					lastProjectId = selectedProjectId;

					if(!selectedProjectId || selectedProjectId === 0) {
						flatList.length = 0;
						deferred.resolve(flatList);
					}
					else {
						projectLocationMainService.getLocationStructure(selectedProjectId)
							.then(function(ret){
								flatList.length = 0;
								flatten(ret.data, flatList);
								deferred.resolve(flatList);
							});

					}
				}
				else {
					deferred.resolve(flatList);
				}

				return deferred.promise;
			}

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				lookupTypesServiceName: 'schedulingMainLookupTypes',
				dataProvider: {
					myUniqueIdentifier: 'schedulingMainActivityLocationLookupDataHandler',

					getList: function () {
						var deferred = $q.defer();

						getFlatList().then(function (data) {
							basicsLookupdataLookupDescriptorService.updateData('activitylocation', data);
							deferred.resolve(data);
						});

						return deferred.promise;
					},

					getDefault: function () {
						var item = {};
						var list = getFlatList();
						for (var i = 0; i < list.length; i++) {
							if (list[i].IsDefault === true) {
								item = list[i];
								break;
							}
						}
						return item;
					},

					getItemByKey: function (value) {
						var item = {};
						var deferred = $q.defer();
						var list = getFlatList();
						for (var i = 0; i < list.length; i++) {
							if (list[i].Id === value) {
								item = list[i];
								deferred.resolve(item);
								break;
							}
						}
						return deferred.promise;
					},

					getSearchList: function () {
						return getFlatList();
					}
				}
			});
		}
	]);
})(angular);
