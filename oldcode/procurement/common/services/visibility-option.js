/**
 * Created by chi on 8/12/2021.
 */
(function (angular) {
	'use strict';

	let moduleName = 'procurement.common';
	angular.module(moduleName).factory('procurementCommonVisibilityOption', procurementCommonVisibilityOption);

	procurementCommonVisibilityOption.$inject = ['$translate'];

	function procurementCommonVisibilityOption($translate) {
		let visibilities = [
			{
				Id: 1,
				description: 'Visible in Standard',
				description$tr$: 'procurement.common.visibilityOption.standardOnly'
			},
			{
				Id: 2,
				description: 'Visible in Portal',
				description$tr$: 'procurement.common.visibilityOption.portalOnly'
			},
			{
				Id: 3,
				description: 'Visible in Standard&Portal',
				description$tr$: 'procurement.common.visibilityOption.standardPortal'
			}
		];

		angular.forEach(visibilities, function (item) {
			let translation = $translate.instant(item.description$tr$);
			if (translation !== item.description$tr$) {
				item.description = translation;
			}
		});

		return visibilities;
	}
})(angular);