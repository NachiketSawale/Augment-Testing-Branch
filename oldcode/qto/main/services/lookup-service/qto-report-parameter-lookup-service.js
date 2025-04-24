(function (angular) {
	'use strict';

	angular.module('qto.main').factory('qtoReportParameterLookupService', ['_', '$q', '$translate', 'platformTranslateService', 'qtoMainDetailService',
		function (_, $q, $translate, platformTranslateService, qtoMainDetailService) {

			var service = {};

			var QtoParamType = {
				sheetType: 1,
				lineType: 2,
				indexType: 3
			};

			service.getQtoParamType = function () {
				return QtoParamType;
			};

			service.getLookupdataProvider = function (qtoParamType) {

				function getDataList() {

					var dataList = qtoMainDetailService.getList();

					dataList = filterItem(dataList, qtoParamType === QtoParamType.sheetType ? 'PageNumber' : qtoParamType === QtoParamType.lineType ? 'LineReference' : qtoParamType === QtoParamType.indexType ? 'LineIndex' : '');

					return dataList;
				}

				function filterItem(list, field) {
					var dist = {};
					return _.filter(_.map(list, function (item) {
						if (item[field] !== null && item[field] !== '') {
							if (!Object.prototype.hasOwnProperty.call(dist, item[field])) {
								dist[item[field]] = item[field];
								return {Id: item[field], Code: item[field]};
							}
						}
					}));
				}

				return {
					getList: function () {
						var deferred = $q.defer();
						deferred.resolve(getDataList());
						return deferred.promise;
					},
					getItemByKey: function (value) {
						var item = _.find(getDataList(), {Id: value});
						var deferred = $q.defer();
						deferred.resolve(item);
						return deferred.promise;
					}
				};
			};

			service.getDefault = function (qtoParamType) {
				return {
					lookupOptions: {
						lookupType: qtoParamType === QtoParamType.sheetType ? 'qtoReportParamSheetLookup' : qtoParamType === QtoParamType.lineType ? 'qtoReportParamLineLookup' : qtoParamType === QtoParamType.indexType ? 'qtoReportParamIndexLookup' : '',
						valueMember: 'Id',
						displayMember: 'Code'
					}
				};
			};

			return service;
		}
	]);

	angular.module('qto.main').directive('qtoParamsSheetCombobox', ['BasicsLookupdataLookupDirectiveDefinition', 'qtoReportParameterLookupService',
		function (BasicsLookupdataLookupDirectiveDefinition, qtoReportParameterLookupService) {

			var opType = qtoReportParameterLookupService.getQtoParamType().sheetType;

			var defaults = qtoReportParameterLookupService.getDefault(opType);

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults.lookupOptions, {

				dataProvider: qtoReportParameterLookupService.getLookupdataProvider(opType)

			});

		}]);
	angular.module('qto.main').directive('qtoParamsLineCombobox', ['BasicsLookupdataLookupDirectiveDefinition', 'qtoReportParameterLookupService',
		function (BasicsLookupdataLookupDirectiveDefinition, qtoReportParameterLookupService) {

			var opType = qtoReportParameterLookupService.getQtoParamType().lineType;

			var defaults = qtoReportParameterLookupService.getDefault(opType);

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults.lookupOptions, {

				dataProvider: qtoReportParameterLookupService.getLookupdataProvider(opType)

			});

		}]);
	angular.module('qto.main').directive('qtoParamsIndexCombobox', ['BasicsLookupdataLookupDirectiveDefinition', 'qtoReportParameterLookupService',
		function (BasicsLookupdataLookupDirectiveDefinition, qtoReportParameterLookupService) {

			var opType = qtoReportParameterLookupService.getQtoParamType().indexType;

			var defaults = qtoReportParameterLookupService.getDefault(opType);

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults.lookupOptions, {

				dataProvider: qtoReportParameterLookupService.getLookupdataProvider(opType)

			});

		}]);

	angular.module('qto.main').directive('qtoParamsWipCombobox', ['_', '$q', '$translate', 'BasicsLookupdataLookupDirectiveDefinition', 'qtoMainDetailService', 'salesWipLookupDataService',
		function (_, $q, $translate, BasicsLookupdataLookupDirectiveDefinition, qtoMainDetailService, salesWipLookupDataService) {

			var defaults = {
				lookupOptions: {
					lookupType: 'qtoReportParamWipLookup',
					valueMember: 'Id',
					displayMember: 'Code'
				}
			};

			function filterItem(list, field) {
				var dist = {};
				return _.filter(_.map(list, function (item) {
					if (item[field] !== null && item[field] !== '') {
						if (!Object.prototype.hasOwnProperty.call(dist, item[field])) {
							dist[item[field]] = item[field];
							return {Id: item[field], Code: item[field]};
						}
					}
				}));
			}

			var dataList = [];

			function getList() {

				return salesWipLookupDataService.getSalesWipList().then(function (data) {

					var qtolists = qtoMainDetailService.getList();

					var wipLists = filterItem(qtolists, 'WipHeaderFk');

					_.forEach(wipLists, function (w) {
						var wip = _.find(data, {Id: w.Id});
						if (wip) {
							w.Code = wip.Code;
						}
					});

					dataList = wipLists;

					return wipLists;
				});
			}

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults.lookupOptions, {

				dataProvider: {
					getList: getList,
					getItemByKey: function (value) {
						var item = _.find(dataList, {Id: value});
						var deferred = $q.defer();
						deferred.resolve(item);
						return deferred.promise;
					}
				}

			});

		}]);
	angular.module('qto.main').directive('qtoParamsPesCombobox', ['_', '$q', '$translate', 'BasicsLookupdataLookupDirectiveDefinition', 'qtoMainDetailService', 'pesHeaderLookupDataService',
		function (_, $q, $translate, BasicsLookupdataLookupDirectiveDefinition, qtoMainDetailService, pesHeaderLookupDataService) {

			var defaults = {
				lookupOptions: {
					lookupType: 'qtoReportParamPesLookup',
					valueMember: 'Id',
					displayMember: 'Code'
				}
			};

			function filterItem(list, field) {
				var dist = {};
				return _.filter(_.map(list, function (item) {
					if (item[field] !== null && item[field] !== '') {
						if (!Object.prototype.hasOwnProperty.call(dist, item[field])) {
							dist[item[field]] = item[field];
							return {Id: item[field], Code: item[field]};
						}
					}
				}));
			}

			var dataList = [];

			function getList() {

				return pesHeaderLookupDataService.getList().then(function (data) {

					var qtolists = qtoMainDetailService.getList();

					var pesLists = filterItem(qtolists, 'PesHeaderFk');

					_.forEach(pesLists, function (p) {
						var pes = _.find(data, {Id: p.Id});
						if (pes) {
							p.Code = pes.Code;
						}
					});

					dataList = pesLists;

					return pesLists;
				});
			}

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults.lookupOptions, {
				dataProvider: {
					getList: getList,
					getItemByKey: function (value) {
						var item = _.find(dataList, {Id: value});
						var deferred = $q.defer();
						deferred.resolve(item);
						return deferred.promise;
					}
				}

			});

		}]);

})(angular);