/**
 * Created by chk on 11/28/2016.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).directive('basicsImportFromExcelCombobox', ['$q','BasicsLookupdataLookupDirectiveDefinition','basicsMaterialLookUpItems',

		function ($q,BasicsLookupdataLookupDirectiveDefinition,basicsMaterialLookUpItems) {
			var defaults = {
				lookupType: 'BasicsImportFromExcel',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {

				dataProvider: {

					getList: function () {

						return $q.when(basicsMaterialLookUpItems.importSetting);
					},

					getItemByKey: function (value) {
						var res = _.find(basicsMaterialLookUpItems.importSetting,function(item){
							return item.Id === value;
						});
						return $q.when(res);
					}
				}
			});

		}
	]);

})(angular);