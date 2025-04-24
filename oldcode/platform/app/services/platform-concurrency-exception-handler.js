/*
 * $Id: platform-concurrency-exception-handler.js
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';
	/**
	 * @ngdoc service
	 * @name platform:platformSsoService
	 * @function
	 * @requires _
	 * @description
	 * platformSsoService provides support for single sign on services
	 */
	angular.module('platform').service('platformConcurrencyExceptionHandler', PlatformConcurrencyExceptionHandler);

	PlatformConcurrencyExceptionHandler.$inject = ['_', '$injector', 'platformTranslateService', 'platformDialogService', 'platformDataServiceModificationTrackingExtension'];

	function PlatformConcurrencyExceptionHandler(_, $injector, platformTranslateService, platformDialogService, platformDataServiceModificationTrackingExtension) { // jshint ignore:line
		var data = {
			concurrencyExceptionHandler: new Platform.Messenger(),
			count: 0,
			customConcurrencyConfig: null
		};

		function showConcurrencyExceptionWithAlternatives(rejection) {
			var msgBoxOptions = {
				bodyText: rejection.data.UserInfo + platformTranslateService.instant('platform.concurrencyExceptionAlternatives', undefined, true),
				headerText: platformTranslateService.instant('platform.concurrencyExceptionHeader', undefined, true),
				iconClass: 'ico-info',
				windowClass: 'msgbox',
				bodyMarginLarge: true,
				buttons: [{
					id: 'reload',
					caption$tr$: 'platform.concurrencyReload',
					autoClose: true,
					fn: function () {
						let dto = JSON.parse(rejection.data.Dto);
						data.concurrencyExceptionHandler.fire(dto);
					}
				}, {
					id: 'cancel',
					caption$tr$: 'platform.cancelBtn'
				}]
			};

			return platformDialogService.showDialog(msgBoxOptions).then(function () {
				rejection.userHasStartedDataReload = true;
				return rejection;
			}, function () {
				rejection.userHasStartedDataReload = false;
				return rejection;
			});
		}

		function showConcurrencyExceptionOnlyCancel(rejection) {
			var msgBoxOptions = {
				bodyText: rejection.statusText + platformTranslateService.instant('platform.concurrencyExceptionOnlyCancel', undefined, true),
				headerText: platformTranslateService.instant('platform.concurrencyExceptionHeader', undefined, true),
				iconClass: 'ico-info',
				windowClass: 'msgbox',
				bodyMarginLarge: true,
				buttons: [{
					id: 'cancel',
					caption$tr$: 'platform.cancelBtn'
				}]
			};

			return platformDialogService.showDialog(msgBoxOptions).then(function () {
				rejection.userHasStartedDataReload = false;
				return rejection;
			}, function () {
				rejection.userHasStartedDataReload = false;
				return rejection;
			});
		}

		this.handleException = function handleException(rejection) {
			let dto = JSON.parse(rejection.data.Dto);
			if (data.customConcurrencyConfig && dto.ConflictType && dto.ModificationId && platformDataServiceModificationTrackingExtension.getModificationFromHistory(dto.ModificationId)) {
				return $injector.get('basicsCommonConflictHandlerService').showConflictResolveDialog(data.customConcurrencyConfig, dto, function(){
					data.concurrencyExceptionHandler.fire(dto);
				});
			}else{
				if (data.count > 0) {
					return showConcurrencyExceptionWithAlternatives(rejection);
				} else {
					return showConcurrencyExceptionOnlyCancel(rejection);
				}
			}
		};

		this.registerConcurrencyExceptionHandler = function registerConcurrencyExceptionHandler(callBackFn) {
			data.concurrencyExceptionHandler.register(callBackFn);
			data.count += 1;
		};

		this.unregisterConcurrencyExceptionHandler = function unregisterConcurrencyExceptionHandler(callBackFn) {
			data.concurrencyExceptionHandler.unregister(callBackFn);
			if (data.count > 0) {
				data.count -= 1;
			}
		};

		this.addCustomConcurrencyConfig = function addCustomConcurrencyConfig(customConfig) {
			data.customConcurrencyConfig = customConfig;
		};

		this.removeCustomConcurrencyConfig = function removeCustomConcurrencyConfig(customHandlers) {
			data.customConcurrencyConfig = null;
		};
	}
})();
