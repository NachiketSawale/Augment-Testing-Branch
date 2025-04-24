/**
 * Created by uestuenel on 14.06.2016.
 */

(function (angular) {

	'use strict';

	var moduleName = 'basics.userform';

	angular.module(moduleName).directive('basicsUserformLookup', [
		'globals',
		'BasicsLookupdataLookupDirectiveDefinition',
		'$q',
		'$http',
		function (
			globals,
			BasicsLookupdataLookupDirectiveDefinition,
			$q,
			$http) {

			var list = [];
			var defaults = {
				lookupType: 'basicsuserformform',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Description',
				uuid: '443e1b2056874ee0a636b83c7a152a35',
				columns: [
					{id: 'descriptioninfo', field: 'DescriptionInfo.Description', name: 'Description', width: 300, name$tr$: 'basics.common.Description'}
				]
			};

			function getList() {
				return $http.get(globals.webApiBaseUrl + 'basics/userform/list').then(function (response) {
					list = response.data;
					return list;
				});
			}

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {
					getList: getList,

					getItemByKey: function (value) {
						if (list.length < 1) {
							return getList().then(function (response) {
								list = response;
								for (var i = 0; i < list.length; i++) {
									if (list[i].Id === value) {
										return list[i];
									}
								}
							});
						}
					}
				}
			});
		}
	]);

})(angular);
