/* global ,  _ , moment */
(function (angular) {
	'use strict';

	var moduleName = 'defect.main';

	angular.module(moduleName).directive('defectMainObjectSetLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		'modelMainObjectSetConfigurationService','defectMainObjectSetDataLookupService',
		function (BasicsLookupdataLookupDirectiveDefinition,modelMainObjectSetConfigurationService,defectMainObjectSetDataLookupService) {
			var defaults = {
				lookupType: 'objectSetLookup',
				// ObjectSetKey
				valueMember: 'ObjectSetKey',
				// valueMember: 'Id',
				displayMember: 'Name',
				uuid:'0D4141F270DD405EB492C68053D0ECE4',
				columns: getGridCloumn(),
				title: {
					name: 'Assign Object Set',
					name$tr$: 'defect.main.objectSetLookupDialogueTitle'
				},

				buildSearchString:function(searchValue){
					return searchValue;
				}
			};

			function getGridCloumn() {
				var columns = angular.copy(modelMainObjectSetConfigurationService.getStandardConfigForListView().columns);
				if (columns && columns.length > 0) {
					for (var i = columns.length; i > 0; i--) {
						var c = columns[i - 1];
						if (c.editor) {
							delete c.editor;
						}
					}
				}
				return columns;
			}


			var dataService={
				dataProvider: {

					getList: function () {
						return defectMainObjectSetDataLookupService.getList();
					},

					getItemByKey: function (value) {
						return defectMainObjectSetDataLookupService.getItemByKey(value);
					},

					getDisplayItem: function (value) {
						return defectMainObjectSetDataLookupService.getDisplayItem(value);
					},

					getSearchList: function (value) {
						return defectMainObjectSetDataLookupService.getSearchList(value);
					}
				},
				processData:function(datalist){
					_.forEach(datalist,function(item){
						item.DueDate=moment.utc(item.DueDate);
					});
					return datalist;
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults,dataService);
		}]);

})(angular);