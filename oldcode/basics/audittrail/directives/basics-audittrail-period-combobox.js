(function (angular) {

	'use strict';

	var moduleName = 'basics.audittrail';

	angular.module(moduleName).directive('basicsAudittrailPeriodCombobox',
		['$q',
			'basicsAudittrailHelperService',
			'BasicsLookupdataLookupDirectiveDefinition',

			function ($q,
				basicsAudittrailHelperService,
				BasicsLookupdataLookupDirectiveDefinition) {

				var defaults = {
					lookupType: 'basicsAudittrailPeriodCombobox',
					valueMember: 'Id',
					displayMember: 'Description'
				};

				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
					dataProvider: {

						getList: function () {
							return basicsAudittrailHelperService.getPeriodList();
						},

						getItemByKey: function (value) {
							return basicsAudittrailHelperService.getPeriodByKey(value);
						}
					}
				});

			}
		]);

})(angular);