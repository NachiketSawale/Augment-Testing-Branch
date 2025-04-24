/**
 * Created by lnt on 10/10/2023.
 */
(function (angular) {
	/* global globals, _ */
	'use strict';

	let moduleName = 'qto.main';

	/**
	 * @ngdoc service
	 * @name qtoMainSourceDetailConfigService
	 * @function
	 * @requires $q
	 *
	 * @description
	 * #
	 * qtoMainSourceDetailConfigService
	 */
	/* jshint -W072 */
	angular.module(moduleName).service('qtoMainSourceDetailConfigService', [
		'$q', '$http', '$translate', 'platformModalService',
		function ($q, $http, $translate,  platformModalService) {

			return {
				showDialog: showDialog
			};

			// show the dialog
			function showDialog() {
				let defer = $q.defer();

				let currentItem = {
					IsLocation: true,
					IsAssetMaster: true,
					IsControllingUnit: true,
					IsSortCode: true,
					IsCostGroup: true,
					IsPrc: true,
					IsBillTo: true,
					IsContract: true
				};

				let groupKey = 'qto.main.sourceLinesCopy';
				let appId = '1840b2391ae9454cad1a053b773f84d5';

				$http.get(globals.webApiBaseUrl + 'procurement/common/option/getprofile?groupKey=' + groupKey + '&appId=' + appId).then(function (response){
					let data = response.data;
					if (data && data.length > 0) {
						let config = _.find(data, {'ProfileAccessLevel': 'User'});
						if (config) {
							let profile = JSON.parse(config.PropertyConfig);
							currentItem = {
								IsLocation: !!profile.IsLocation,
								IsAssetMaster: !!profile.IsAssetMaster,
								IsControllingUnit: !!profile.IsControllingUnit,
								IsSortCode: !!profile.IsSortCode,
								IsCostGroup: !!profile.IsCostGroup,
								IsPrc: !!profile.IsPrc,
								IsBillTo: !!profile.IsBillTo,
								IsContract: !!profile.IsContract
							};
						}
					}

					let defaultOptions = {
						headerText: $translate.instant('boq.main.copyOptions'),
						templateUrl: globals.appBaseUrl + 'qto.main/templates/qto-main-source-detail-config.html',
						width: '800px',
						maxWidth: '1000px',
						currentItem: currentItem
					};

					platformModalService.showDialog(defaultOptions).then(function (result) {
						defer.resolve(result);
					});
				});

				return defer.promise;
			}
		}
	]);
})(angular);

