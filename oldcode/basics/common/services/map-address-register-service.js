/**
 * Created by las on 10/15/2018.
 */
/* global Platform */

(function () {
	'use strict';

	angular.module('basics.common').service('basicsCommonMapAddressRegisterService', MapAddressRegisterService);

	function MapAddressRegisterService() {

		const self = this;

		self.showRoutes = new Platform.Messenger();
		self.calculateDist = new Platform.Messenger();

		self.setShowRoutes = function setShowRoutes(entities) {

			self.showRoutes.fire(entities);
		};

		self.registerOnShowRoutes = function registerOnShowRoutes(callbackFn) {
			self.showRoutes.register(callbackFn);
		};

		self.unregisterOnShowRoutes = function unregisterOnShowRoutes(callbackFn) {
			self.showRoutes.unregister(callbackFn);
		};

		self.setCalculateDist = function setCalculateDist(entities) {

			self.calculateDist.fire(entities);
		};

		self.registerOnCalculateDist = function registerOnCalculateDist(callbackFn) {
			self.calculateDist.register(callbackFn);
		};

		self.unregisterOnCalculateDist = function unregisterOnCalculateDist(callbackFn) {
			self.calculateDist.unregister(callbackFn);
		};
	}
})();