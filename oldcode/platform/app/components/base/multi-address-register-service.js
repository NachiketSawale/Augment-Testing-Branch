/**
 * Created by balkanci on 06.08.2016.
 */
(function () {
	'use strict';

	angular.module('platform').service('platformMultiAddressService', MultiAddressService);

	function MultiAddressService() {

		var self = this;
		self.entitiesDictionary = new Platform.Lookup.Dictionary(true);
		self.enititiesAdded = new Platform.Messenger();

		self.setAddressEntities = function setAddressEntities(entities, module) {
			self.entitiesDictionary.update(module, entities);
			self.enititiesAdded.fire(entities);
		};

		self.getAddressEntities = function getAddressEntities(moduleName) {
			if (moduleName) {
				return self.entitiesDictionary.get(moduleName);
			}
		};

		self.registerOnEntitiesAdded = function registerOnEntitiesAdded(callbackFn) {
			self.enititiesAdded.register(callbackFn);
		};

		self.unregisterOnEntitiesAdded = function unregisterOnEntitiesAdded(callbackFn) {
			self.enititiesAdded.unregister(callbackFn);
		};
	}
})();
