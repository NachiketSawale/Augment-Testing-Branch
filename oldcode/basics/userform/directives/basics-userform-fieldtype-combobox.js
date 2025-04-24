/**
 * Created by alm on 4/29/2021.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.userform';

	angular.module(moduleName).directive('basicsUserformFieldtypeCombobox', [
		'_',
		'$q',
		'BasicsLookupdataLookupDirectiveDefinition',
		function (
			_,
			$q,
			BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'basicsUserformFieldTypeLookup',
				valueMember: 'Id',
				displayMember: 'Description',
				disableInput: true
			};

			var options = [
				{Id: 0, SortIndx: 1, Value: 0, Description: 'Normal'},
				{Id: 1, SortIndx: 2, Value: 1, Description: 'Json'}
			];

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {
					getList: function () {
						return $q.when(options);
					},
					getItemByKey: function (key) {
						var item = _.find(options, {Id: key});
						return $q.when(item);
					}
				}
			});
		}]);

})(angular);
