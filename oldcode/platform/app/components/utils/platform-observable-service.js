/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform.platformObservableService
	 * @function
	 *
	 * @description Provides values that issue change notifications.
	 */
	angular.module('platform').factory('platformObservableService',
		platformObservableService);

	platformObservableService.$inject = ['PlatformMessenger', '_'];

	function platformObservableService(PlatformMessenger, _) {
		const service = {};

		service.createObservableValue = function (config) {
			const actualConfig = _.assign({}, _.isObject(config) ? config : {});

			const privateState = {
				onChanged: new PlatformMessenger(),
				normalizeValue: _.isFunction(actualConfig.normalizeValue) ? actualConfig.normalizeValue : function (v) {
					return v;
				},
				valuesEqual: _.isFunction(actualConfig.valuesEqual) ? actualConfig.valuesEqual : function (v1, v2) {
					return v1 === v2;
				}
			};

			privateState.currentValue = privateState.normalizeValue(actualConfig.initialValue);

			const result = {
				setValue: function (newValue) {
					const nv = privateState.normalizeValue(newValue);
					if (!privateState.valuesEqual(privateState.currentValue, nv)) {
						const oldValue = privateState.currentValue;
						privateState.currentValue = nv;
						privateState.onChanged.fire(nv, oldValue);
					}
				},
				getValue: function () {
					return privateState.currentValue;
				},
				registerValueChanged: function (handler) {
					privateState.onChanged.register(handler);
				},
				unregisterValueChanged: function (handler) {
					privateState.onChanged.unregister(handler);
				}
			};

			result.getReadOnlyFacade = function () {
				return {
					getValue: result.getValue,
					registerValueChanged: result.registerValueChanged,
					unregisterValueChanged: result.unregisterValueChanged
				};
			};

			return result;
		};

		service.createObservableBoolean = function (config) {
			return service.createObservableValue(_.assign({
				normalizeValue: function (v) {
					return !!v;
				}
			}, _.isObject(config) ? config : {}));
		};

		return service;
	}
})(angular);
