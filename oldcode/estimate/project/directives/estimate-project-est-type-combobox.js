/**
 * Created by joshi on 11.05.2017.
 */

(function () {
	'use strict';

	/**
     * @ngdoc directive
     * @name estimateProjectEstType
     * @requires BasicsLookupdataLookupDirectiveDefinition
     * @description
     */
	angular.module('estimate.project').directive('estimateProjectEstTypeCombobox', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			let defaults = {
				lookupType: 'esttype',
				valueMember: 'Id',
				displayMember: 'Description',
				uuid : 'd0dceaafb3464f2ba2e279e4c18afb2b',
				selectableCallback: function (lookupItem) {
					return lookupItem.IsLive; }
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider : 'estimateProjectEstTypeService'

			});
		}]);
})();
