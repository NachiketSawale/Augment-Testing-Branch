(function (angular) {

	'use strict';

	const moduleName = 'basics.common';

	/** @namespace $scope.currentItem.AddressModified */
	/** @namespace item.Recordstate */
	/* jshint -W072 */ // too many parameters.
	angular.module(moduleName).directive('basicsCommonLocationDialog',
		['basicsCommonInputDialogDirectiveFactory',
			'basicsCommonAddressDialogOption',
			'basicsCommonAddressDialogHandler',
			'basicsCommonMapKeyService',
			function (createDirective,
				basicsCommonAddressDialogOption,
				basicsCommonAddressDialogHandler,
				basicsCommonMapKeyService) {

				let defaults = basicsCommonAddressDialogOption.getOptions();
				defaults.dialogTemplateId = 'locationSearch.template';
				defaults.rows.map(row => {
					if(row.model !== 'Address') {
						row.visible = false;
					} else {
						row.visible = true;
						// set properties of 'Address' row for the location dialog
						delete row.label;
						delete row.label$tr$;
						row.type = 'description';
						row.options = {
							isLocationSearchDialog: true
						}
					}
				});
				defaults.dialogWidth = '800px';
				defaults.skipConfiguration = true;

				return createDirective(defaults, basicsCommonAddressDialogHandler.handler);
			}
		]);

})(angular);