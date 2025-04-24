/**
 * Created by leo on 07.05.2019.
 */
(function (angular) {
	'use strict';
	var myModule = angular.module('platform');

	/**
	 * @ngdoc service
	 * @name platformRecordArticleDataService
	 * @description provides methods to access, create and update logistic dispatching record item entity
	 */
	myModule.factory('platformRecordArticleDataService', PlatformRecordArticleDataService);

	PlatformRecordArticleDataService.$inject = ['_', '$q', '$injector', 'platformDataServiceSelectionExtension', 'platformDataProcessExtensionHistoryCreator'];

	function PlatformRecordArticleDataService(_, $q, $injector, platformDataServiceSelectionExtension, platformDataProcessExtensionHistoryCreator) {
		// private code
		var service = {};

		function create(container) {
			container.data.itemList = [];

			container.data.cache = [];

			service.selectedItem = '';
			container.data.selectionChanged = new Platform.Messenger();

			container.service.registerSelectionChanged = function (callBackFn) {
				container.data.selectionChanged.register(callBackFn);
			};

			container.service.unregisterSelectionChanged = function (callBackFn) {
				container.data.selectionChanged.unregister(callBackFn);
			};

			function doSetSelection(item, options, container) {
				if (options.processor && options.processor.processItem) {
					options.processor.processItem(item);
					platformDataProcessExtensionHistoryCreator.processItem(item);
				}
				container.service.selectedItem = item;
				container.data.itemList.push(item);
				container.data.selectionChanged.fire(null, item);
				var cache = container.data.cache[options.lookupType];
				var existItem = _.find(cache, {id: item.Id});
				if (!existItem) {
					if (!cache) {
						cache = [];
					}
					cache.push(item);
					container.data.cache[options.lookupType] = cache;
				}
			}

			container.service.setSelected = function (value, options) {
				container.service.selectedItem = null;
				container.data.itemList = [];
				var item = null;
				var promise = null;
				if (!value) {
					container.data.selectionChanged.fire(null, item);
				} else {
					var dataService = $injector.get(options.dataServiceName ? options.dataServiceName : options.lookupSimpleLookup ? 'basicsLookupdataSimpleLookupService' : 'basicsLookupdataLookupDescriptorService');

					if (container.data.cache && container.data.cache[options.lookupType]) {
						var cache = container.data.cache[options.lookupType];
						var existItem = _.find(cache, {Id: value});
						if (existItem) {
							doSetSelection(existItem, options, container);
							return;
						}
					}
					if (dataService) {
						if (options.dataServiceName) {
							// Try to get data in sync
							item = dataService.getItemById(value, options);

							if (item) {
								doSetSelection(item, options, container);
							} else {
								if (dataService && dataService.getUnfilteredList) {
									var list = dataService.getUnfilteredList();
									if (list.length <= 0 && dataService.read) {
										promise = dataService.read().then(function (response) {
											if (response) {
												item = _.find(response, {Id: value});
												if (item) {
													doSetSelection(item, options, container);
												}
											}
										});
									} else {
										item = _.find(list, {Id: value});
										if (item) { // jshint ignore:line
											doSetSelection(item, options, container);
										}
									}
								} else {
									promise = dataService.getItemByIdAsync(value, options)
										.then(function (record) {
											if (record) {
												doSetSelection(record, options, container);
											}
										});

								}
							}
						} else { // basicsLookupdataLookupDescriptorService
							var targetData = dataService.getData(options.lookupType);

							if (!_.isEmpty(targetData)) {
								item = targetData[value];

								if (!_.isEmpty(item)) {
									doSetSelection(item, options, container);
								}
							}

							// load Items async when they are not already in the client cache
							if (_.isEmpty(item)) {
								dataService = $injector.get('basicsLookupdataLookupDescriptorService');
								item = dataService.getItemByIdSync(value, options);

								if (item) {
									doSetSelection(item, options, container);
								} else {
									promise = dataService.getItemByKey(options.lookupType, value, options, null)
										// promise = service.getItemByKey(columnDef.formatterOptions.lookupType, value, columnDef.formatterOptions, null)
										.then(function (item) {
											if (item) {
												doSetSelection(item, options, container);
											}
										});
								}
							}
						}
					}
				}
			};

			container.service.getSelected = function getSelected() {
				return container.service.selectedItem;
			};

			container.service.isSubItemService = function isSubItem() {
				return false;
			};

			function goto() {
				if (container.data.itemList.length > 0) {
					platformDataServiceSelectionExtension.doSelect(container.data.itemList[0], container.data);
				}
			}

			container.service.markCurrentItemAsModified = function () {
				_.noop();
			};

			container.service.clearCache = function () {
				container.data.cache = [];
			};

			container.service.goToNext = goto;
			container.service.goToPrev = goto;
			container.service.goToLast = goto;
			container.service.goToFirst = goto;

			return container;
		}

		service.createDataService = function createDataService() {
			var container = {data: {}, service: {}};
			return create(container);
		};

		return service;
	}
})(angular);
