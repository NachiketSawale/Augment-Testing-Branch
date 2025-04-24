(function (angular) {
	'use strict';

	angular.module('model.wdeviewer').factory('modelWdeViewerLayoutLookupServiceFactory', ['$http', '$q',
		function ($http, $q) {
			return {
				create: function () {
					var service = {
						list: [],
						model: null,
						drawingIdField: ''
					};

					service.setContext = function (model, drawingIdField) {
						service.model = model;
						service.drawingIdField = drawingIdField;
					};

					service.getDrawingId = function () {
						return service.model[service.drawingIdField];
					};

					service.getList = function () {
						var drawingId = service.getDrawingId();

						if (!drawingId) {
							return $q.when([]);
						}

						var url = globals.webApiBaseUrl + 'model/igeviewer/drawing/' + drawingId;

						return $http.get(url).then(function (res) {
							service.list = res.data.layouts;
							return service.list;
						});
					};

					service.getItemByKey = function (key) {
						return service.getList().then(function (list) {
							return _.find(list, {id: key});
						});
					};

					return service;
				}
			};
		}
	]);

	angular.module('model.wdeviewer').factory('modelWdeViewerBaseLayoutLookupService', ['modelWdeViewerLayoutLookupServiceFactory',
		function (modelWdeViewerLayoutLookupServiceFactory) {
			return modelWdeViewerLayoutLookupServiceFactory.create();
		}
	]);

	angular.module('model.wdeviewer').factory('modelWdeViewerRefLayoutLookupService', ['modelWdeViewerLayoutLookupServiceFactory',
		function (modelWdeViewerLayoutLookupServiceFactory) {
			return modelWdeViewerLayoutLookupServiceFactory.create();
		}
	]);

	angular.module('model.wdeviewer').factory('modelWdeViewerModelLayoutLookupService', ['$http', '$q', '$injector',
		function ($http, $q, $injector) {
			var service = {
				list: [],
				model: null,
				modelIdField: ''
			};

			service.setContext = function (model, modelIdField, drawingIdField) {
				service.model = model;
				service.modelIdField = modelIdField;
				service.drawingIdField = drawingIdField;
			};

			service.getModelId = function () {
				return service.model[service.modelIdField];
			};

			service.getDrawingId = function () {
				service.model[service.drawingIdField] = null;

				var modelId = service.getModelId();

				if (!modelId) {
					$q.when(null);
				}

				let modelUrl = $injector.get('modelWdeViewerIgeService').getModelInfoUrl('model/project/model/getbyid?id=');
				return $http.get(globals.webApiBaseUrl + modelUrl + service.getModelId()).then(function (res) {
					service.model[service.drawingIdField] = res.data.Uuid;
					return res.data.Uuid;
				});
			};

			service.getList = function () {
				var deferred = $q.defer();

				service.getDrawingId().then(function (drawingId) {
					if (!drawingId) {
						return deferred.resolve([]);
					}

					var url = globals.webApiBaseUrl + 'model/igeviewer/drawing/' + drawingId;

					$http.get(url).then(function (res) {
						service.list = res.data.layouts;
						deferred.resolve(service.list);
					});
				});

				return deferred.promise;
			};

			service.getItemByKey = function (key) {
				return service.getList().then(function (list) {
					return _.find(list, {id: key});
				});
			};

			return service;
		}
	]);

	angular.module('model.wdeviewer').directive('modelWdeViewerBaseLayoutLookup', ['BasicsLookupdataLookupDirectiveDefinition', 'modelWdeViewerBaseLayoutLookupService',
		function (BasicsLookupdataLookupDirectiveDefinition, modelWdeViewerBaseLayoutLookupService) {
			var defaults = {
				lookupType: 'BaseDrawingLayout',
				valueMember: 'id',
				displayMember: 'name',
				disableDataCaching: true
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: modelWdeViewerBaseLayoutLookupService
			});
		}
	]);

	angular.module('model.wdeviewer').directive('modelWdeViewerRefLayoutLookup', ['BasicsLookupdataLookupDirectiveDefinition', 'modelWdeViewerRefLayoutLookupService',
		function (BasicsLookupdataLookupDirectiveDefinition, modelWdeViewerRefLayoutLookupService) {
			var defaults = {
				lookupType: 'RefDrawingLayout',
				valueMember: 'id',
				displayMember: 'name',
				disableDataCaching: true
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: modelWdeViewerRefLayoutLookupService
			});
		}
	]);

	angular.module('model.wdeviewer').directive('modelWdeViewerModelLayoutLookup', ['BasicsLookupdataLookupDirectiveDefinition', 'modelWdeViewerModelLayoutLookupService',
		function (BasicsLookupdataLookupDirectiveDefinition, modelWdeViewerModelLayoutLookupService) {
			var defaults = {
				version: 2,
				lookupType: 'DrawingLayout',
				valueMember: 'id',
				displayMember: 'name',
				disableDataCaching: true
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: modelWdeViewerModelLayoutLookupService
			});
		}
	]);

})(angular);