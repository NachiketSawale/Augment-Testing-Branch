/**
 * Created by janas on 03.12.2014.
 */

/* jslint nomen:true */

(function (angular) {

	'use strict';
	var moduleName = 'controlling.structure';
	/**
	 * @ngdoc directive
	 * @name controlling-structure-group-lookup
	 * @requires  controllingStructureLookupService
	 * @description ComboBox to select the controlling unit group
	 */

	angular.module(moduleName).directive('controllingStructureGroupLookup', ['_', '$q', 'controllingStructureLookupService', 'BasicsLookupdataLookupDirectiveDefinition',
		function (_, $q, controllingStructureLookupService, BasicsLookupdataLookupDirectiveDefinition) {

			var defaults = {
				lookupType: 'controllingunitgroup',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				lookupTypesServiceName: 'controllingStructureLookupTypes',
				dataProvider: {
					getList: function () {
						var deferred = $q.defer();

						deferred.resolve(controllingStructureLookupService.getControllingUnitGroups());
						return deferred.promise;
					},

					getDefault: function () {
						var list = controllingStructureLookupService.getControllingUnitGroups();
						return $q.when(_.find(list, {IsDefault: true}));
					},

					getItemByKey: function (value) {
						var list = controllingStructureLookupService.getControllingUnitGroups();
						return $q.when(_.find(list, {Id: value}));
					},

					getSearchList: function () {
						return $q.when(controllingStructureLookupService.getControllingUnitGroups());
					}
				}
			});

		}]);
})(angular);
