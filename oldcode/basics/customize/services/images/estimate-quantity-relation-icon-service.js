/**
 * Created by Michael Alisch on 12/08/2015.
 */
(function () {
	/* global globals */
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsEstimateQuantityRelationIconService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('basicsEstimateQuantityRelationIconService', BasicsEstimateQuantityRelationIconService);

	BasicsEstimateQuantityRelationIconService.$inject = ['_', '$http', 'platformIconBasisService'];

	function BasicsEstimateQuantityRelationIconService(_, $http, platformIconBasisService) {
		platformIconBasisService.setBasicPath('');

		var service = this;
		var icons = [];
		platformIconBasisService.extend(icons, service);

		$http.post(globals.webApiBaseUrl + 'basics/customize/EstQuantityRel/list').then(function (result) {
			if(result && result.data)
			{
				var itemList = _.filter(result.data, function (item) {
					return item.IsLive;
				});

				_.each(itemList, function (item) {
					var iconStr = item.Icon + '';
					if(item.Icon && item.Icon < 10)
					{
						iconStr = '0' + item.Icon;
					}
					icons.push(platformIconBasisService.createCssIconWithId(item.Id, item.DescriptionInfo.Translated, 'status-icons ico-status' + iconStr));
				});
			}

			platformIconBasisService.extend(icons, service);
		});
	}
})();
