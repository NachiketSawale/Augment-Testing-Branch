/**
 * Created by janas on 20.02.2018.
 */


(function () {
	'use strict';
	var controllingStructureModule = angular.module('controlling.structure');

	/**
	 * @ngdoc service
	 * @name controllingStructureWizardGenerateControllingGroupsService
	 * @function
	 *
	 * @description
	 * controllingStructureWizardGenerateControllingGroupsService is the data service for managing ControllingGroups.
	 */
	controllingStructureModule.factory('controllingStructureWizardGenerateControllingGroupsService',
		['globals', '_', '$http', function (globals, _, $http) {

			var ControllingGroups = [];

			var service = {
				init: function () {
					return $http.get(globals.webApiBaseUrl + 'controlling/structure/lookup/controllinggroupcomplete')
						.then(function (response) {
							var groups = response.data;

							ControllingGroups.length = 0;
							_.each(groups, function (group) {
								ControllingGroups.push({
									name: group.Code,
									details: group.ControllinggroupdetailEntities
								});
							});
							return ControllingGroups;
						});
				},
				getControllingGroups: function () {
					return ControllingGroups;
				}
			};

			return service;
		}]);
})();
