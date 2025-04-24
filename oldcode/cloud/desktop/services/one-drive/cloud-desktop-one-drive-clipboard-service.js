/**
 * Created by lst on 6/7/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'cloud.desktop';

	angular.module(moduleName).factory('cloudDesktopOneDriveClipboardService',
		['cloudDesktopDragDropServiceFactory',
			function (cloudDesktopDragDropServiceFactory) {
				var service = {};

				var dragOptions = {
					type: 'oneDrive',
					canDrag: function (/* type */) {
						return true;
					},
					targets: [
						{
							type: 'modelMainObjectDataService',
							canPaste: function (/* type */) {
								return true;
							},
							paste: function () {
								console.log('test paste cosMainInstance');
							}
						},
						{
							type: 'documentRevision',
							// canPaste: function (type) {
							// 	return true;
							// },
							paste: function () {
								console.log('test paste cosMainInstance2Object');
							}
						}
					]
				};

				service = cloudDesktopDragDropServiceFactory.create(dragOptions);

				return service;
			}]);

	/**
	 * @ngdoc service
	 * @name cloudDesktopDragDropServiceFactory
	 * @function
	 * @requires $q
	 *
	 * @description
	 * #
	 *
	 */
	angular.module(moduleName).factory('cloudDesktopDragDropServiceFactory', ['PlatformMessenger',
		function (PlatformMessenger) {

			function create(options/* ,services */) {
				var clipboard = {type: null, data: null, cut: false, dataFlattened: null};
				var service = {};

				service.injectServices = [].slice.call(arguments, 1);

				service.type = options.type;
				if (options.canDrag && angular.isFunction(options.canDrag)) {
					service.canDrag = options.canDrag;
				}

				service.targets = options.targets;

				service.clipboardStateChanged = new PlatformMessenger();
				service.onDragStart = new PlatformMessenger();
				service.onDragEnd = new PlatformMessenger();
				service.onDrag = new PlatformMessenger();
				service.onPostClipboardError = new PlatformMessenger();
				service.objectSelectedList = new PlatformMessenger();

				service.setClipboardMode = function (clipboardMode) {
					clipboard.cut = clipboardMode;
				};

				service.getClipboard = function () {
					return clipboard;
				};

				service.canDrag = function (type) {
					var result = false;

					if (angular.isDefined(type)) {
						result = true;
					}

					return result;
				};

				service.canPaste = function (dropType) {
					if (clipboard.type !== service.type) {
						return false;
					}

					var targetIndex = service.targets.findIndex(function (item) {
						return item.type === dropType;
					});
					if (targetIndex < 0) {
						return false;
					}

					var target = service.targets[targetIndex];

					if (target.canPaste && angular.isFunction(target.canPaste)) {
						return target.canPaste();
					}

					return true;
				};

				service.cut = function (items, type) {
					if (items) {
						clipboard.data = angular.copy(items);
						clipboard.type = type;
					}
				};

				service.copy = function (items, type) {
					clipboard.type = type;
					clipboard.data = angular.copy(items);
					clipboard.dataFlattened = [];
					service.clipboardStateChanged.fire();

					clipboard.cut = false;
				};

				service.paste = function (itemOnDragEnd, dropType, fn, itemService) {// dest type

					if (!service.canPaste(dropType)) {
						return;
					}

					var target = service.targets.find(function (item) {
						return item.type === dropType;
					});

					if (!target) {
						return;
					}

					if (target.canPaste && !target.canPaste(dropType)) {
						return;
					}

					if (target.paste) {
						var args = [];
						for (var i = service.injectServices.length; i > 0; i--) {
							args.push(service.injectServices[i - 1]);
						}
						args.push(itemService);
						args.push(itemOnDragEnd);
						target.paste.apply(target.paste, args.reverse());

						// target.paste(itemOnDragEnd, itemService, service.injectServices)
					}

					clearClipboard();
				};

				service.fireOnDragStart = function () {
					service.onDragStart.fire();
				};

				service.fireOnDragEnd = function (e, arg) {
					service.onDragEnd.fire(e, arg);
				};

				service.fireOnDrag = function (e, arg) {
					service.onDrag.fire(e, arg);
				};

				service.clearClipboard = function () {
					clearClipboard();
				};

				service.clipboardHasData = function () {
					return clipboard.data !== null;
				};

				function clearClipboard() {
					clipboard.type = null;
					clipboard.data = null;
					clipboard.dataFlattened = null;

					service.clipboardStateChanged.fire();
				}

				return service;
			}

			var serviceFactory = {
				create: create
			};
			return serviceFactory;
		}
	]);

})(angular);