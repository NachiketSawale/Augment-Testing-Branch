/**
 * Created by waz on 2/22/2018.
 */
(function (angular) {
	'use strict';

	const moduleName = 'basics.common';
	const module = angular.module(moduleName);
	module.service('basicsCommonBaseDataServiceModificationMonitorExtension', BasicsCommonBaseDataServiceModificationMonitorExtension);

	BasicsCommonBaseDataServiceModificationMonitorExtension.$inject = ['$injector', '_'];

	function BasicsCommonBaseDataServiceModificationMonitorExtension($injector, _) {

		const self = this;

		this.addModificationMonitor = function (container, mointorOptions) {
			if (mointorOptions) {
				this.addListening(container, mointorOptions.listen);
				this.addNotifying(container, mointorOptions.notify);
			}
		};

		this.addListening = function (container, listenOptions) {
			_.forEach(listenOptions, function (config) {
				self.listen(container.service, config.service, config);
			});
		};

		this.addNotifying = function (container, notifyOptions) {
			_.forEach(notifyOptions, function (config) {
				self.listen(config.service, container.service, config);
			});
		};

		this.listen = function (listener, listenable, config) {
			if (config.syncSameItem) {
				self.syncSameItem(listener, listenable);
			} else {
				if (config.onPropertyChanged) {
					self.listenPropertyChanged(config.property, listener, listenable, config.onPropertyChanged);
				}
				if (config.onEntityCreated) {
					self.listenEntityCreated(listener, listenable, config.onEntityCreated);
				}
				if (config.onEntityDeleted) {
					self.listenEntityDeleted(listener, listenable, config.onEntityDeleted);
				}
				if (config.onEntityAssigned) {
					self.listenEntitiyAssigned(listener, listenable, config.onEntityAssigned);
				}
				if (config.onEntityRemoveAssigned) {
					self.listenEntityRemoveAssigned(listener, listenable, config.onEntityRemoveAssigned);
				}
				if (config.onItemModified) {
					self.listenItemModified(listener, listenable, config.onItemModified);
				}
			}
		};

		this.syncSameItem = function (listener, listenable) {
			self.listenItemModified(listener, listenable, function (item, listener) {
				listener.updateLoadedItem(item);
			});
		};

		this.listenItemModified = function (listener, listenable, callback) {
			listenable = getService(listenable);
			listenable.registerItemModified(function (e, item) {
				listener = getService(listener);
				callback.call(self, item, listener, listenable);
			});
		};

		this.listenPropertyChanged = function (property, listener, listenable, callback) {
			listenable = getService(listenable);
			listenable.registerPropertyChanged(property, function (e, result) {
				listener = getService(listener);
				callback.call(self, result, listener, listenable);
			});
		};

		this.listenEntityCreated = function (listener, listenable, callback) {
			listenable = getService(listenable);
			listenable.registerEntityCreated(function (e, item) {
				listener = getService(listener);
				callback.call(self, item, listener, listenable);
			});
		};

		this.listenEntityDeleted = function (listener, listenable, callback) {
			listenable = getService(listenable);
			listenable.registerEntityDeleted(function (e, item) {
				listener = getService(listener);
				callback.call(self, item, listener, listenable);
			});
		};

		this.listenEntitiyAssigned = function (listener, listenable, callback) {
			listenable = getService(listenable);
			listenable.registerEntityAssigned(function (e, items) {
				listener = getService(listener);
				callback.call(self, items, listener, listenable);
			});
		};

		this.listenEntityRemoveAssigned = function (listener, listenable, callback) {
			listenable = getService(listenable);
			listenable.registerEntityRemoveAssigned(function (e, items) {
				listener = getService(listener);
				callback.call(self, items, listener, listenable);
			});
		};

		function getService(service) {
			return _.isObject(service) ? service : $injector.get(service);
		}
	}
})(angular);