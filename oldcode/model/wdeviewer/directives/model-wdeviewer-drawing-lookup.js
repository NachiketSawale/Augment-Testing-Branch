(function (angular) {
	'use strict';

	angular.module('model.wdeviewer').factory('modelWdeViewerDrawingLookupService', ['$http', '$q',
		function ($http, $q) {
			var service = {
				list: []
			};

			service.getList = function () {
				if (service.list > 0) {
					return $q.when(service.list);
				}

				var url = globals.webApiBaseUrl + 'model/igeviewer/list';

				return $http.get(url).then(function (res) {
					service.list = [];
					res.data.drawings.forEach(function (item) {
						if (!item.drawingId) {
							console.warn(item.drawingName + ': drawing id is null');
						} else {
							service.list.push({
								id: item.drawingId,
								name: item.drawingName
							});
						}
					});

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
	]);

	angular.module('model.wdeviewer').directive('modelWdeViewerDrawingLookup', ['BasicsLookupdataLookupDirectiveDefinition', 'modelWdeViewerDrawingLookupService',
		function (BasicsLookupdataLookupDirectiveDefinition, modelWdeViewerDrawingLookupService) {
			var defaults = {
				lookupType: 'Drawing',
				valueMember: 'id',
				displayMember: 'name'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: modelWdeViewerDrawingLookupService
			});
		}
	]);
})(angular);