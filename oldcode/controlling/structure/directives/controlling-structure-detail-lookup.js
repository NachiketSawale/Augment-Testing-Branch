/**
 * Created by janas on 03.12.2014.
 */

/* jslint nomen:true */

(function (angular) {

	'use strict';
	var moduleName = 'controlling.structure';
	/**
	 * @ngdoc directive
	 * @name controlling-structure-detail-lookup
	 * @requires  controllingStructureLookupService
	 * @description ComboBox to select the controlling unit detail
	 */

	angular.module(moduleName).directive('controllingStructureDetailLookup', ['_', '$q', 'controllingStructureLookupService', 'controllingStructureUnitgroupService', 'BasicsLookupdataLookupDirectiveDefinition',
		function (_, $q, controllingStructureLookupService, controllingStructureUnitgroupService, BasicsLookupdataLookupDirectiveDefinition) {

			var defaults = {
				lookupType: 'controllingunitdetail',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				lookupTypesServiceName: 'controllingStructureLookupTypes',
				dataProvider: {
					getList: function () {
						var deferred = $q.defer(),
							curSelected = controllingStructureUnitgroupService.getSelected();
						deferred.resolve(controllingStructureLookupService.getControllingUnitDetails(curSelected.ControllinggroupFk));
						return deferred.promise;
					},

					getDefault: function () {
						var list = controllingStructureLookupService.getControllingUnitDetails();
						return $q.when(_.find(list, {IsDefault: true}));
					},

					getItemByKey: function (value) {
						var list = controllingStructureLookupService.getControllingUnitDetails();
						return $q.when(_.find(list, {Id: value}));
					},

					getSearchList: function () {
						return $q.when(controllingStructureLookupService.getControllingUnitDetails());
					}
				}
			});

		}]);
})(angular);
