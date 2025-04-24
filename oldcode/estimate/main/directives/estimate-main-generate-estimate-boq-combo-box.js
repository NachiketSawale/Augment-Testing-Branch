/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('boq.main').directive('estimateMainGenerateEstimateBoqCombobox', ['$q', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q, BasicsLookupdataLookupDirectiveDefinition) {

			var defaults = {
				'lookupType': 'boqMainCopyHeaderLookupDataService',
				'valueMember': 'Id',
				'displayMember': 'BoqNumber'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: 'boqMainCopyHeaderLookupDataService'
			});
		}]);

})(angular);
