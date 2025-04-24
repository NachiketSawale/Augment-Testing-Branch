/**
 * Created by lcn on 5/18/2018.
 */
(function (angular) { // jshint ignore:line
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).directive('basicsLookupdataMessagesEverityCombobox',['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'MessagesEverity',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				imageSelector: 'platformStatusIconService',
				width: 80,
				height: 200
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);

})(angular);