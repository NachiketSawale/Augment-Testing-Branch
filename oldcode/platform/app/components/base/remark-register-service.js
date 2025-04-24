/**
 * Created by balkanci on 13.05.2015.
 */
(function () {
	'use strict';

	angular.module('platform').service('platformLongTextRegisterService', PlatformLongTextRegisterService);

	function PlatformLongTextRegisterService() {

		var self = this;
		self.entityRefCache = new Platform.Lookup.Dictionary(true);
		self.enitityAdded = new Platform.Messenger();
		self.lastAddedEntityByModule = new Map();

		self.setRemarkEntity = function setRemarkEntity(entity, service) {
			var serviceObject = {entity: entity, service: service};
			self.entityRefCache.update(service.getItemName(), serviceObject);
			self.enitityAdded.fire(serviceObject);
			self.lastAddedEntityByModule.set(serviceObject.service.getModule().name, serviceObject);
		};

		self.getRemarkEntity = function getRemarkEntity(moduleName) {
			if (moduleName) {
				return self.entityRefCache.get(moduleName);
			}
		};

		self.registerOnEntityAdded = function registerOnEntityAdded(callbackFn) {
			self.enitityAdded.register(callbackFn);
		};

		self.unregisterOnEntityAdded = function unregisterOnEntityAdded(callbackFn) {
			self.enitityAdded.unregister(callbackFn);
		};

		self.getLastAddedEntityByModule = function getLastAddedEntityByModule(moduleName) {
			return self.lastAddedEntityByModule.get(moduleName);
		};

		self.clear = function clear(moduleName) {
			return self.lastAddedEntityByModule.set(moduleName, null);
		};

	}
})();
