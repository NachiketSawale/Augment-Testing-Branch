/**
 * Created by wui on 5/10/2019.
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonBusinessDecorator', ['PlatformMessenger', 'platformContainerCreateDeleteButtonService',
		function (PlatformMessenger, platformContainerCreateDeleteButtonService) {
			function decorateService(service, options) {
				// attach function 'deleteAll'
				service.deleteAllEntities = function () {
					const list = service.getList();
					service.deleteEntities(list);
				};

				let readonly = false;
				const canDelete = service.canDelete;

				service.canDelete = function () {
					let result = canDelete.apply(service, arguments);

					if (angular.isFunction(options.readonlyCallback)) {
						result = result && !options.readonlyCallback();
					}

					return result && !readonly;
				};

				const canCreate = service.canCreate;

				service.canCreate = function () {
					let result = canCreate.apply(service, arguments);

					if (angular.isFunction(options.readonlyCallback)) {
						result = result && !options.readonlyCallback();
					}

					return result && !readonly;
				};

				const isReadonly = service.isReadonly;

				service.isReadonly = function () {
					let result = isReadonly.apply(service, arguments);

					if (angular.isFunction(options.readonlyCallback)) {
						result = result && !options.readonlyCallback();
					}

					return result && !readonly;
				};

				service.readonly = function (value) {
					readonly = value;
				};

				service.updateToolsMessage = new PlatformMessenger();

				return service;
			}

			function decorateContainer(container, options) {
				decorateService(container.service, options || {});
				decorateData(container.data, {service: container.service});

				return container;
			}

			function decorateData(data, options) {
				options.service.addEntity = function (entity) {
					data.onCreateSucceeded(entity, data);
				};

				options.service.addEntities = function (entities) {
					entities.forEach(function (entity) {
						options.service.addEntity(entity);
					});
				};

				return data;
			}

			function decorateGrid(scope, service, options) {
				const unregisterUpdateToolsMessage = angular.noop;

				if (service.updateToolsMessage) {
					registerUpdateToolsMessage();
				}

				scope.updateToolsState = function () {
					platformContainerCreateDeleteButtonService.toggleButtons(scope.containerButtonConfig, service);
					scope.updateTools();
				};

				function registerUpdateToolsMessage() {
					service.updateToolsMessage.register(onUpdateTools);

					function onUpdateTools() {
						scope.updateToolsState();
					}

					return function () {
						return service.updateToolsMessage.unregister(onUpdateTools);
					};
				}

				scope.$on('$destroy', function () {
					unregisterUpdateToolsMessage();
				});
			}

			return {
				'decorateService': decorateService,
				'decorateContainer': decorateContainer,
				'decorateData': decorateData,
				'decorateGrid': decorateGrid
			};
		}
	]);

})(angular);