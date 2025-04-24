(function (angular) {
	'use strict';
	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).directive('basicsLookupdataCustomDataDialog', ['$q','BasicsLookupdataLookupDirectiveDefinition',
		function ($q, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'CustomData',
				valueMember: 'Id',
				displayMember: 'Description',
				disableDataCaching: true
			};

			return new BasicsLookupdataLookupDirectiveDefinition('custom-dialog', defaults, {

				dataProvider: {

					getList: function (lookupOptions) {
						return $q.when(lookupOptions.getList());
					},

					getItemByKey: function (value, lookupOptions) {
						var res = _.find(lookupOptions.getList(),function(item){
							return item.Id === value;
						});
						return $q.when(res);
					},
					getSearchList:function(serverSearchString,displayMember,scope,getSearchListSettings){
						var list = scope.options.getList();
						var inputString = getSearchListSettings.searchString;
						var filteredData = _.filter(list, function (item) {
							return ((!!item[displayMember])&& ((item[displayMember]+'').toLowerCase().indexOf((inputString+'').toLowerCase())!==-1));
						});
						return $q.when(filteredData);
					}
				}
			});

		}]);
})(angular);
