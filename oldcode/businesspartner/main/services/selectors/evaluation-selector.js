/**
 * Created by sus on 2015/6/2.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	angular.module('businesspartner.main').factory('businessPartnerEvaluationImageSelector', [function () {
		var baseUrl = globals.appBaseUrl + '/cloud.style/content/images/control-icons.svg#';
		var getIcon = function (icon) {
			return 'ico-indicator' + Math.floor((icon + 2) / 3) + '-' + (icon + 2) % 3;
		};

		return {
			getIcon: getIcon,
			select: function (dataItem) {
				return dataItem && dataItem.Icon ? (baseUrl + getIcon(dataItem.Icon)) : null;
			}
		};

	}]);

})(angular);