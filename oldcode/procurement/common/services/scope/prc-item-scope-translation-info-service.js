/**
 * Created by wui on 10/23/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('prcItemScopeTranslationInfoService', [
		function () {
			return {
				translationInfos: {
					'extraModules': [moduleName],
					'extraWords': {
						IsSelected: {location: moduleName, identifier: 'entityIsSelected', initial: 'Is Selected'},
						TotalQuantity: {location: moduleName, identifier: 'deliveryScheduleTotalQuantity', initial: 'Total Quantity'}
					}
				}
			};
		}
	]);

})(angular);