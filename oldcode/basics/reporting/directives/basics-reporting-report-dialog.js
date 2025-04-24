/**
 * Created by sandu on 12.06.2017.
 */
(function (angular) {
	'use strict';
	angular.module('basics.reporting').directive('basicsReportingReportDialog', ['BasicsLookupdataLookupDirectiveDefinition','$translate',
		function (BasicsLookupdataLookupDirectiveDefinition, $translate) {
			var defaults = {
				lookupType: 'report',
				valueMember: 'Id',
				displayMember: 'Name.Translated',
				dialogUuid: '1c6d72a0bccd47d6809faa21f286feda',
				uuid: 'd43a8a561f29488eb88bab980e5c55ac',
				columns: [
					{ id: 'name', field: 'Name.Translated', name: 'Name', name$tr$: 'basics.reporting.name'},
					{ id: 'description', field: 'Description.Translated', name: 'Description', name$tr$: 'basics.reporting.description'},
					{ id: 'fileName', field: 'FileName', name: 'File Name', name$tr$: 'basics.reporting.reportFileName' },
					{ id: 'filePath', field: 'FilePath', name: 'File Path', name$tr$:'basics.reporting.reportFilePath' }
				],
				width: 500,
				height: 200,
				title: { name: $translate.instant('basics.reporting.dialogTitleReport')}
			};
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
	]);
})(angular);