(function (angular) {
	/* global globals,_ */
	'use strict';
	var moduleName = 'hsqe.checklist';
	globals.lookups.modelObjectDialog = function modelObjectDialog($injector) {
		var $q = $injector.get('$q');
		var $http = $injector.get('$http');
		return {
			lookupOptions: {
				lookupType: 'ModelObjectDialog',
				valueMember: 'Id',
				displayMember: 'Description',
				columns: [{
					id: 'description',
					field: 'Description',
					name$tr$: 'cloud.common.entityDescription',
					width: 300
				}, {
					id: 'uuid',
					field: 'CpiId',
					name$tr$: 'model.main.objectCpiId',
					width: 400
				}],
				width: 500,
				height: 200,
				title: {
					name$tr$: 'model.main.objectLookupTitle'
				},
				disableDataCaching: true
			},
			dataProvider: {
				getList: getList,
				getItemByKey: function (value) {
					let item = {};
					if (globals.lookups.modelObjectDialog.data && globals.lookups.modelObjectDialog.data.length > 0) {
						item = _.find(globals.lookups.modelObjectDialog.data, {Id: value});
						return $q.when(item);
					} else {
						var deferred = $q.defer();
						getModelObjectList().then(function (res) {
							let list = (res.data ? res.data : res) || [];
							item = _.find(list, {Id: value});
							deferred.resolve(item);
						});
						return deferred.promise;
					}
				},
				getSearchList: getList
			},
			data: []
		};

		function getList(value, displayMeber, scope, setting) {
			var deferred = $q.defer();
			var searchString = setting ? setting.searchString : null;
			getModelObjectList().then(function (res) {
				var list = (res.data ? res.data : res) || [];
				if (searchString) {
					list = _.filter(list, function (item) {
						for (let field in item) {
							if (_.isString(item[field]) && item[field].toLocaleLowerCase().indexOf(searchString.toLocaleLowerCase()) > -1) {
								return item;
							}
						}
					});
				}
				globals.lookups.modelObjectDialog.data = list;
				deferred.resolve(list);
			});
			return deferred.promise;
		}

		function getModelObjectList() {
			var cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');
			var modelId = null;
			var pinModelEntity = _.find(cloudDesktopPinningContextService.getContext(), {token: 'model.main'});
			if (!_.isNil(pinModelEntity)) {
				modelId = pinModelEntity.id;
			}
			if (!modelId) {
				return [];
			}
			return $http.get(globals.webApiBaseUrl + 'model/main/object/list?mainItemId=' + modelId);
		}
	};

	/**
	 * @ngdoc directive
	 * @name hsqe.checkList.directive:hsqeChecklistModelObjectLookup
	 * @element div
	 * @restrict A
	 * @description
	 * Package lookup.
	 *
	 */
	angular.module(moduleName).directive('hsqeChecklistModelObjectLookup', ['$injector', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = globals.lookups.modelObjectDialog($injector);

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults.lookupOptions, {dataProvider: defaults.dataProvider});
		}
	]);

})(angular);
