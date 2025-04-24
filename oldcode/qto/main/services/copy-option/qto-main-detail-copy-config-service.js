(function (angular) {
	/* global globals, _ */
	'use strict';

	let moduleName = 'qto.main';

	/**
	 * @ngdoc service
	 * @name qtoMainDetailCopyConfigService
	 * @function
	 * @requires $q
	 *
	 * @description
	 * #
	 * qtoMainDetailCopyConfigService
	 */
	/* jshint -W072 */
	angular.module(moduleName).service('qtoMainDetailCopyConfigService', [
		'$q', '$http', '$translate', 'platformModalService', 'PlatformMessenger',
		function ($q, $http, $translate, platformModalService, PlatformMessenger) {
			let service = {};
			let groupKey = 'qto.main.qtoDetailCopy';
			let appId = '1840b2391ae9454cad1a053b773f84d5';
			let procurementCommonUrl = globals.webApiBaseUrl + 'procurement/common/option/';
			let copyOptions = null;
			let profile= null;

			service.onCopyOptionDialogClosed = new PlatformMessenger();

			service.registerDialogClosed = function(func){
				if (angular.isFunction(func)) {
					service.onCopyOptionDialogClosed.register(func);
				}
			}

			service.unregisterDialogClosed = function(func){
				service.onCopyOptionDialogClosed.unregister(func);
			}

			function getCopyOptions(){
				return copyOptions;
			}

			function getProfile() {
				return $http.get(procurementCommonUrl + 'getprofile?groupKey=' + groupKey + '&appId=' + appId).then(function (response){
					if(response.data && response.data.length > 0){
						profile = _.find(response.data, {'ProfileAccessLevel': 'User'});
						if(profile){
							copyOptions = JSON.parse(profile.PropertyConfig);
						}
					}

					if(!profile){
						profile= {};
						profile.ProfileName= 'Qto Detail Copy';
						profile.ProfileAccessLevel = 'User';
						profile.GroupKey = groupKey;
						profile.AppId = appId;
						profile.IsDefault = true;
					}

					if(!copyOptions) {
						copyOptions = {
							optionProfile : 'Qto Detail Copy(System)',
							CopyPriority : 1
						};
					}
				});
			}

			function updateProfile(){
				if(!profile || !copyOptions){
					return;
				}
				profile.PropertyConfig = JSON.stringify(copyOptions);
				$http.post(procurementCommonUrl + 'saveprofile',profile).then(function (response){
					if(response && response.data){
						profile = response.data;
						copyOptions = JSON.parse(profile.PropertyConfig);
					}
				});
			}

			// show the dialog
			function showDialog() {
				let defer = $q.defer();

				getProfile().then(() => {
					if(!copyOptions){
						copyOptions = {
							optionProfile : 'Qto Detail Copy(System)',
							CopyPriority : 1
						};
					}

					if(!_.isNumber(copyOptions.CopyPriority)){
						copyOptions.CopyPriority = 1;
					}

					let defaultOptions = {
						headerText: $translate.instant('boq.main.copyOptions'),
						templateUrl: globals.appBaseUrl + 'qto.main/templates/qto-main-detail-copy-config.html',
						currentItem: copyOptions
					};

					platformModalService.showDialog(defaultOptions).then(function (options) {
						if(!!options){
							copyOptions = options;
							updateProfile();
						}
						service.onCopyOptionDialogClosed.fire(copyOptions && copyOptions.IsActivate);
						defer.resolve(options);
					});
				})

				return defer.promise;
			}

			_.extend(service, {
				showDialog: showDialog,
				getCopyOptions: getCopyOptions,
				getProfile: getProfile,
				updateProfile: updateProfile
			});

			return service;
		}
	]);
})(angular);

