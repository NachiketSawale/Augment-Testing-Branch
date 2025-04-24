/**
 * Created by chi on 11/3/2021.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.rfq';

	angular.module(moduleName).value('procurementRfqBpContactExcludeModelValue', [
		'Id', 'BusinessPartnerFk', 'FirstName', 'FamilyName',
		'InsertedAt', 'InsertedBy', 'UpdatedAt', 'UpdatedBy', 'Version'
	]);
})(angular);