(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	// eslint-disable-next-line no-unused-vars
	angular.module('businesspartner.evaluationschema').factory('businessPartnerEvaluationSchemaIconProcessor', ['globals',function (globals) {
		return {
			select: function (lookupItem) {
				if (!lookupItem) {
					return '';
				}
				return 'control-icons ico-' + lookupItem.Name;
			},
			isCss: function () {
				return true;
			},
			getIconType: function () {
				return 'css';
			}
		};
	}]);
})(angular);