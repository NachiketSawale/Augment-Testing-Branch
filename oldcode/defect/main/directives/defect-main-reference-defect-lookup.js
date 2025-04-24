/* global  */
(function (angular) {
	'use strict';

	var moduleName = 'defect.main';

	angular.module(moduleName).directive('defectMainReferenceDefectLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		'defectMainHeaderUIStandardService',
		function (BasicsLookupdataLookupDirectiveDefinition,defectMainHeaderUIStandardService) {
			var defaults = {
				lookupType: 'referenceDefectLookup',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid:'1D8D068D6C354C318D5BD14BBA812C1D',
				columns: getGridCloumn(),
				title: {
					name: 'Assign Reference Defect',
					name$tr$: 'defect.main.referenceDefectLookupDialogueTitle'
				},
				buildSearchString:function(searchValue){
					if(!searchValue){
						return '';
					}
					var searchString='(Code!=null and Code.ToString().Contains("%SEARCH%"))' +
						' or (Description!=null and Description.ToString().Contains("%SEARCH%"))';
					return searchString.replace(/%SEARCH%/g,searchValue);
				}
			};

			function getGridCloumn() {
				var columns = angular.copy(defectMainHeaderUIStandardService.getStandardConfigForListView().columns);
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

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}]);

})(angular);