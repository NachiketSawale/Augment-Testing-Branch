/**
 * Created by lnb on 9/5/2014.
 */
/* global  */
(function (angular) {
	'use strict';
	var moduleName = 'defect.main';
	/**
	 * @ngdoc directive
	 * @name defect.main.directive:defectMainStatusCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * Strategy combobox.
	 *
	 */
	angular.module(moduleName).directive('defectMainStatusCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'DfmStatus',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				imageSelector: 'platformStatusIconService'
			};
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);

})(angular);
