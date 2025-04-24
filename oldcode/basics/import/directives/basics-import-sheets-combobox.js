(function (angular) {

	'use strict';

	var moduleName = 'basics.import';

	angular.module(moduleName).directive('basicsImportSheetsCombobox', ['_', '$q', 'basicsImportService', 'BasicsLookupdataLookupDirectiveDefinition',
		function (_, $q, importService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'BasicsImportSheets',
				valueMember: 'Id',
				displayMember: 'Description',
				disableDataCaching: true
			};
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {
					getList: function () {
						var result = importService.getImportFileSheetNames();
						if (result === null) {
							return [];
						}
						var names = [];
						return result.then(function (res) {
							if(!_.isNil(res)){
								for (var i = 0; i < res.length; i++) {
									names.push({
										Id: res[i],
										Description: res[i]
									});
								}
							}

							return names;
						});

					},
					getItemByKey: function (key) {

						let result = importService.getImportFileSheetNames();
						if (result === null) {
							return '';
						}
						return result.then(function (res) {
							return _.find(res, function (item){ return item === key;});
						});
					}
				}
			});
		}
	]);

})(angular);
