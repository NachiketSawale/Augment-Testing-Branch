/**
 * Created by benny on 03.11.2017.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	let moduleName = 'basics.common';

	angular.module(moduleName).directive('estimateMainModifyResourceSpecifyType', ['BasicsLookupdataLookupDirectiveDefinition', 'estimateMainModifyResourceSpecifyTypeService', '$q', '_',
		function (BasicsLookupdataLookupDirectiveDefinition, configService, $q, _) {
			let lookupOptions = {
				lookupType: 'specifytype',
				valueMember: 'Id',
				displayMember: 'Description',
				showClearButton: true
			};

			let baseOptions = {
				dataProvider: {
					getList: function () {
						return configService.getList();
					},
					getItemByKey: function (id) {
						return configService.getList().then(function (items) {
							return _.find(items, function (item) {
								return item.Id === id;
							});
						});
					},
					getSearchList: null,
					getDefault: null
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', lookupOptions, baseOptions);
		}]);

})(angular);
