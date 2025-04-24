(function (angular) {
	'use strict';

	var moduleName = 'basics.userform';
	angular.module(moduleName).directive('basicsUserFormFieldLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'UserFormField',
				valueMember: 'Id',
				displayMember: 'FieldName',
				uuid: '1329f351edde4b78afc28f58ab5166fc',
				columns: [
					{ id: 'FieldName', field: 'FieldName', name: 'Field Name', width: 100,name$tr$: 'basics.userform.entityFieldName' },
					{ id: 'VisibleName', field: 'VisibleName', name: 'Visible Name', width: 150,name$tr$: 'basics.userform.entityVisibleName' },
					{ id: 'ProcessingTypeDecription', field: 'ProcessingTypeDecription', name: 'Processing Type', width: 150,name$tr$: 'basics.userform.entityProcessingType' }
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults,{
				processData: function (dataList) {
					for (var i = 0; i < dataList.length; ++i) {
						var data = dataList[i];

						// todo: please use basicsUserformProcessingTypeService to get processing type values!

						if (data.ProcessingType === 0) {
							data.ProcessingTypeDecription = 'IN';
						} else if (data.ProcessingType === 1) {
							data.ProcessingTypeDecription = 'OUT';
						} else {
							data.ProcessingTypeDecription = 'IN/OUT';// todo:not supported in userForm module now , latter may be change.
						}
					}
					return dataList;
				}
			});


		}
	]);

})(angular);