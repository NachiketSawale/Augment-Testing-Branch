/**
 * Created by lvi on 2014/9/11.
 */
(function (angular) {
	'use strict';

	/**
     * @ngdoc directive
     * @name procurement.requisition.directive:prcReqMilestonCombobox
     * @element div
     * @restrict A
     * @description
     * Strategy combobox.
     *
     */
	angular.module( 'basics.material' ).directive( 'basicsMaterialDocumentTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'DocumentType',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);

})(angular);
