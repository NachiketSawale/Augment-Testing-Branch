/*
 * $Id: platform-grid-lookup-domain-formatter-service.js 616514 2020-12-09 16:21:45Z saa\mik $
 * Copyright (c) RIB Software GmbH
 */

// eslint-disable-next-line func-names
(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platformGrid:platformGridDomainService
	 * @function
	 * @requires $injector, platformObjectHelper
	 * @description
	 * platformGridDomainService provides formatter and editor for RIB domain types for platformGrid
	 */
	angular.module('platform').service('platformGridLookupDomainFormatterService', PlatformGridLookupDomainFormatterService);

	PlatformGridLookupDomainFormatterService.$inject = ['_', '$injector', 'platformObjectHelper', '$translate'];

	function PlatformGridLookupDomainFormatterService(_, $injector, platformObjectHelper, $translate) { // jshint ignore:line
		var self = this;

		this.evaluateServiceAndType = function evaluateServiceAndType(columnDef) {
			var res = {
				service: null,
				type: -1
			};

			res.service = $injector.get(columnDef.formatterOptions.dataServiceName ? columnDef.formatterOptions.dataServiceName : columnDef.formatterOptions.lookupSimpleLookup ? 'basicsLookupdataSimpleLookupService' : 'basicsLookupdataLookupDescriptorService');
			if (res.service) {
				res.type = columnDef.formatterOptions.dataServiceName ? 1 : columnDef.formatterOptions.lookupSimpleLookup ? 2 : 3;
			}

			return res;
		};

		this.formatNamedDataServiceLookup = function formatNamedDataServiceLookup(row, cell, value, columnDef, dataContext, plainText, uniqueId, options, service, formatLookupFunc, applyAsyncFormatterMarkupFunc) {
			var formatterOptions = [columnDef.formatterOptions];
			value = platformObjectHelper.isSet(value) ? value : platformObjectHelper.getValue(dataContext, columnDef.field);
			var evalData = {result: '', item: null};

			if (platformObjectHelper.isSet(value)) {
				value = platformObjectHelper.getValue(dataContext, columnDef.field, value);

				if (service.setFilter && columnDef.formatterOptions.filter) {
					service.setFilter(columnDef.formatterOptions.filter(dataContext));
				}

				// Try to get data in sync
				evalData.item = service.getItemById(value, columnDef.formatterOptions);

				if (evalData.item) {
					var result = platformObjectHelper.getValue(evalData.item, columnDef.formatterOptions.displayMember);
					evalData.result = platformObjectHelper.isSet(result) ? result : '';
					evalData.result = columnDef.formatterOptions.translate ? $translate.instant(evalData.result) : evalData.result;
				} else {
					var promise = service.getItemByIdAsync(value, columnDef.formatterOptions)
						.then(function (data) {
							if (data) {
								// save current and restore old formatterOptions (can be already changed when using dynamic domain type
								formatterOptions.unshift(columnDef.formatterOptions);
								columnDef.formatterOptions = formatterOptions.pop();

								result = platformObjectHelper.getValue(data, columnDef.formatterOptions.displayMember);
								result = platformObjectHelper.isSet(result) ? result : '';
								evalData.result = plainText ? result : formatLookupFunc(dataContext, columnDef, _.escape(result), data);
								evalData.result = columnDef.formatterOptions.translate ? $translate.instant(evalData.result) : evalData.result;
								applyAsyncFormatterMarkupFunc(uniqueId, evalData.result);

								// restore current
								columnDef.formatterOptions = formatterOptions.pop();
							}
							if (options && (options.grouping || options.filter)) {
								return {columnid: columnDef.id, id: value, val: evalData.result};
							}
							return evalData;
						});

					if (options && options.promise) {
						return promise;
					}
				}
			}

			return evalData;
		};

		this.formatSimpleLookupService = function formatSimpleLookupService(row, cell, value, columnDef, dataContext, plainText, uniqueId, options, service, formatLookupFunc, applyAsyncFormatterMarkupFunc) {
			var formatterOptions = [columnDef.formatterOptions];
			value = platformObjectHelper.isSet(value) ? value : platformObjectHelper.getValue(dataContext, columnDef.field);
			var evalData = {result: '', item: null};

			if (platformObjectHelper.isSet(value)) {
				// try to get data sync
				evalData.item = service.getItemByIdSync(value, columnDef.formatterOptions);

				if (evalData.item) {
					evalData.result = platformObjectHelper.getValue(evalData.item, columnDef.formatterOptions.displayMember) || '';
				} else {
					var promise = service.getItemById(value, columnDef.formatterOptions)
						.then(function (item) {
							if (item && platformObjectHelper.isSet(item.Id) && !_.isEmpty(item)) {
								evalData.item = item;
								// save current and restore old formatterOptions (can be already changed when using dynamic domain type
								formatterOptions.unshift(columnDef.formatterOptions);
								columnDef.formatterOptions = formatterOptions.pop();

								var result = platformObjectHelper.getValue(item, columnDef.formatterOptions.displayMember) || '';
								evalData.result = plainText ? result : formatLookupFunc(dataContext, columnDef, _.escape(result), item);
								applyAsyncFormatterMarkupFunc(uniqueId, evalData.result, true);

								// restore current
								columnDef.formatterOptions = formatterOptions.pop();
							}

							return evalData;
						});

					if (options && options.promise) {
						return promise;
					}
				}
			}

			return evalData;
		};

		this.formatLookupDescriptorService = function formatLookupDescriptorService(row, cell, value, columnDef, dataContext, plainText, uniqueId, options, service, formatLookupFunc, applyAsyncFormatterMarkupFunc) {
			var formatterOptions = [columnDef.formatterOptions];
			var targetData = service.getData(columnDef.formatterOptions.lookupType);

			value = platformObjectHelper.getValue(dataContext, columnDef.field);
			var evalData = {result: '', item: null};

			if (!_.isEmpty(targetData)) {
				evalData.item = targetData[value];

				if (!_.isEmpty(evalData.item)) {
					evalData.result = platformObjectHelper.getValue(evalData.item, columnDef.formatterOptions.displayMember);
				}
			}
			// subItem dto in main Dto, get data from there
			if (_.isObject(value)) {
				evalData.result = platformObjectHelper.getValue(value, columnDef.formatterOptions.displayMember);
			}

			// load Items async when they are not already in the client cache
			if (_.isEmpty(evalData.result) && platformObjectHelper.isSet(value) && !platformObjectHelper.isSet(evalData.item)) {
				service = $injector.get('basicsLookupdataLookupDescriptorService');
				var identification = value;
				var keyService;
				if (columnDef.formatterOptions.pKeyMaps) {
					keyService = $injector.get('basicsLookupdataLookupKeyService');
					identification = keyService.getIdentification(value, dataContext, columnDef.formatterOptions, false);
				}
				evalData.item = service.getItemByIdSync(identification, columnDef.formatterOptions);

				if (evalData.item) {
					evalData.result = platformObjectHelper.getValue(evalData.item, columnDef.formatterOptions.displayMember) || '';
				} else {
					identification = value;
					if (columnDef.formatterOptions.pKeyMaps && keyService) {
						identification = keyService.getIdentificationData(value, dataContext, columnDef.formatterOptions, false);
					}
					var promise = service.getItemByKey(columnDef.formatterOptions.lookupType, identification, columnDef.formatterOptions, null)
						.then(function (item) {
							if (item && platformObjectHelper.isSet(item.Id)) {
								evalData.item = item;
								// save current and restore old formatterOptions (can be already changed when using dynamic domain type
								formatterOptions.unshift(columnDef.formatterOptions);
								columnDef.formatterOptions = formatterOptions.pop();

								service.updateData(columnDef.formatterOptions.lookupType, [item]);
								var result = platformObjectHelper.getValue(item, columnDef.formatterOptions.displayMember) || '';

								evalData.result = plainText ? result : formatLookupFunc(dataContext, columnDef, _.escape(result), item);
								applyAsyncFormatterMarkupFunc(uniqueId, evalData.result, true);

								// restore current
								columnDef.formatterOptions = formatterOptions.pop();

								if (options && (options.grouping || options.filter)) {
									return {columnid: columnDef.id, id: value, val: result};
								}
							}

							return evalData;
						});

					if (options && options.promise) {
						return promise;
					}
				}
			}

			return evalData;
		};

		this.formatLookupMainColumn = function formatLookupMainColumn(row, cell, value, columnDef, dataContext, plainText, uniqueId, options, formatLookupFunc, applyAsyncFormatterMarkupFunc) { // jshint ignore:line
			var evalData = null;

			if (columnDef.formatterOptions) {
				var lookupInfo = self.evaluateServiceAndType(columnDef);

				if (lookupInfo.service) {
					switch (lookupInfo.type) {
						case 1: // named data service
							evalData = self.formatNamedDataServiceLookup(row, cell, value, columnDef, dataContext, plainText, uniqueId, options, lookupInfo.service, formatLookupFunc, applyAsyncFormatterMarkupFunc);
							break;

						case 2: // basicsLookupdataSimpleLookupService
							evalData = self.formatSimpleLookupService(row, cell, value, columnDef, dataContext, plainText, uniqueId, options, lookupInfo.service, formatLookupFunc, applyAsyncFormatterMarkupFunc);
							break;

						default: // basicsLookupdataLookupDescriptorService
							evalData = self.formatLookupDescriptorService(row, cell, value, columnDef, dataContext, plainText, uniqueId, options, lookupInfo.service, formatLookupFunc, applyAsyncFormatterMarkupFunc);
							break;
					}

					if (evalData && evalData.$$state && options && options.promise) {
						return evalData;
					}

					return plainText ? evalData.result : formatLookupFunc(dataContext, columnDef, _.escape(evalData.result), evalData.item);
				}
			}
		};

		function provideFormatter(formatterDesc, gridDomainService) {
			if (_.isFunction(formatterDesc)) {
				return formatterDesc;
			}

			return gridDomainService.formatter(formatterDesc || 'description');
		}

		this.formatNamedDataServiceLookupAdditionalColumn = function formatNamedDataServiceLookupAdditionalColumn(row, cell, value, columnDef, dataContext, plainText, uniqueId, options, service, gridDomainService, applyAsyncFormatterMarkupFunc) {
			if (value) {

				// #120127: filter needs to be set for additional column as well if main column is not visible!
				if (service.setFilter && columnDef.formatterOptions.filter) {
					service.setFilter(columnDef.formatterOptions.filter(dataContext));
				}

				var item = service.getItemById(value, columnDef.formatterOptions);
				var addColumn = columnDef.additionalColumn;
				var formatter = provideFormatter(addColumn.formatter, gridDomainService);

				if (item) {
					return formatter(row, cell, undefined, addColumn, item, plainText, uniqueId, options);
				} else {
					var promise = service.getItemByIdAsync(value, columnDef.formatterOptions)
						.then(function (data) {
							if (data) {
								var result = formatter(row, cell, undefined, addColumn, data, plainText, uniqueId, options);
								applyAsyncFormatterMarkupFunc(uniqueId, result);
								if (options && (options.grouping || options.filter)) {
									return {columnid: columnDef.id, id: value, val: result};
								}
							}
							return '';

						});

					if (options && options.promise) {
						return promise;
					}
				}
			}

			return '';
		};

		this.formatLookupDescriptorServiceAdditionalColumn = function formatLookupDescriptorServiceAdditionalColumn(row, cell, value, columnDef, dataContext, plainText, uniqueId, options, service, gridDomainService, applyAsyncFormatterMarkupFunc) {
			if (value) {
				var targetData = service.getData(columnDef.formatterOptions.lookupType);
				var addColumn = columnDef.additionalColumn;
				var formatter = provideFormatter(addColumn.formatter, gridDomainService);
				var item;

				value = platformObjectHelper.getValue(dataContext, columnDef.field);
				if (!_.isEmpty(targetData)) {
					item = targetData[value];

					if (!_.isEmpty(item)) {
						return formatter(row, cell, undefined, addColumn, item, plainText, uniqueId, options);
					}
				}
				// subItem dto in main Dto, get data from there
				if (_.isObject(value)) {
					return formatter(row, cell, undefined, addColumn, value, plainText, uniqueId, options);
				}

				if (platformObjectHelper.isSet(value) && !platformObjectHelper.isSet(item)) {
					service = $injector.get('basicsLookupdataLookupDescriptorService');
					var identification = value;
					var keyService;
					if (columnDef.formatterOptions.pKeyMaps) {
						keyService = $injector.get('basicsLookupdataLookupKeyService');
						identification = keyService.getIdentification(value, dataContext, columnDef.formatterOptions, false);
					}
					item = service.getItemByIdSync(identification, columnDef.formatterOptions);

					if (item) {
						return formatter(row, cell, undefined, addColumn, item, plainText, uniqueId, options);
					}

					identification = value;
					if (columnDef.formatterOptions.pKeyMaps && keyService) {
						identification = keyService.getIdentificationData(value, dataContext, columnDef.formatterOptions, false);
					}
					var promise = service.getItemByKey(columnDef.formatterOptions.lookupType, identification, columnDef.formatterOptions, null)
						.then(function (item) {
							if (item && platformObjectHelper.isSet(item.Id)) {
								var result = formatter(row, cell, undefined, addColumn, item, plainText, uniqueId, options);
								applyAsyncFormatterMarkupFunc(uniqueId, result);
								if (options && (options.grouping || options.filter)) {
									return {columnid: columnDef.id, id: value, val: result};
								}
							}

							return '';
						});

					if (options && options.promise) {
						return promise;
					}
				}
			}

			return '';
		};

		this.formatLookupAdditionalColumn = function formatLookupAdditionalColumn(row, cell, value, columnDef, dataContext, plainText, uniqueId, options, gridDomainService, applyAsyncFormatterMarkupFunc) {
			var result = '';

			if (columnDef.formatterOptions) {
				var lookupInfo = self.evaluateServiceAndType(columnDef);
				var service = lookupInfo.service;

				if (service) {
					var type = lookupInfo.type;

					switch (type) {
						case 1: // named data service
							result = self.formatNamedDataServiceLookupAdditionalColumn(row, cell, value, columnDef, dataContext, plainText, uniqueId, options, service, gridDomainService, applyAsyncFormatterMarkupFunc);
							break;

						case 2: // basicsLookupdataSimpleLookupService - should not happen
							result = '';
							break;

						default: // basicsLookupdataLookupDescriptorService
							result = self.formatLookupDescriptorServiceAdditionalColumn(row, cell, value, columnDef, dataContext, plainText, uniqueId, options, service, gridDomainService, applyAsyncFormatterMarkupFunc);
							break;
					}
				}
			}
			return result;
		};
	}

})();
