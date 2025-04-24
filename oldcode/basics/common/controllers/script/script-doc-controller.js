/**
 * Created by wui on 7/17/2017.
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).controller('basicsCommonScriptDocController', [
		'$scope',
		'scriptApiId',
		'platformGridAPI',
		'_',
		'basicsCommonScriptEditorService',
		'cloudCommonLanguageService',
		'platformContextService',
		function (
			$scope,
			scriptApiId,
			platformGridAPI,
			_,
			basicsCommonScriptEditorService,
			cloudCommonLanguageService,
			platformContextService) {
			const gridConfig1 = generateGridConfig1(),
				gridConfig2 = generateGridConfig2(),
				gridConfig3 = generateGridConfig3();
			const language = platformContextService.getLanguage();
			const scriptView = basicsCommonScriptEditorService.get(scriptApiId);
			const apiList = scriptView.getApiList();

			$scope.selectedProp = {};
			$scope.onDocChange = angular.noop;
			$scope.selectedTranslation = {};
			$scope.onTranslationChange = angular.noop;

			$scope.gridData1 = {
				state: gridConfig1.id,
				config: gridConfig1,
				moduleState: {}
			};

			$scope.gridData2 = {
				state: gridConfig2.id,
				config: gridConfig2,
				moduleState: {}
			};

			$scope.gridData3 = {
				state: gridConfig3.id,
				config: gridConfig3,
				moduleState: {}
			};

			$scope.close = function (result) {
				if (result) {
					scriptView.applyApiList(apiList).then(function () {
						$scope.$close(result);
					});
				} else {
					$scope.$close(result);
				}
			};

			if (!platformGridAPI.grids.exist(gridConfig1.id)) {
				// ToDo: Old version - 2BRemoved when init via scope works
				platformGridAPI.grids.config(gridConfig1);
			}

			if (!platformGridAPI.grids.exist(gridConfig2.id)) {
				// ToDo: Old version - 2BRemoved when init via scope works
				platformGridAPI.grids.config(gridConfig2);
			}

			if (!platformGridAPI.grids.exist(gridConfig3.id)) {
				// ToDo: Old version - 2BRemoved when init via scope works
				platformGridAPI.grids.config(gridConfig3);
			}

			platformGridAPI.events.register(gridConfig1.id, 'onSelectedRowsChanged', onObjectTypeSelected);
			platformGridAPI.events.register(gridConfig2.id, 'onSelectedRowsChanged', onObjectPropertySelected);
			platformGridAPI.events.register(gridConfig3.id, 'onSelectedRowsChanged', onTranslationSelected);
			platformGridAPI.items.data(gridConfig1.id, apiList);

			let languages = [];

			cloudCommonLanguageService.getLanguageItems().then(function (data) {
				languages = data.filter(function (item) {
					return item.Culture !== language;
				});
				// platformGridAPI.items.data(gridConfig3.id, languages);
			});

			function generateGridConfig1() {
				const gridId = 'BF4DB2D8BDB541399B1AB211D61089AD';
				const columns = [
					{
						id: 'name',
						field: 'name',
						name: 'Name',
						width: 100,
						name$tr$: 'cloud.common.entityName',
						searchable: true
					},
					{
						id: 'global',
						field: 'global',
						name: 'Global',
						width: 100,
						name$tr$: 'basics.common.entityGlobal',
						searchable: true
					}
				];

				return {
					columns: columns,
					data: [],
					id: gridId,
					options: {
						indicator: true,
						idProperty: 'name',
						showMainTopPanel: true
					}
				};
			}

			function generateGridConfig2() {
				const gridId = '88D86A7A478D4C34B1E916FD1549EBEC';
				const columns = [
					{
						id: 'name',
						field: 'name',
						name: 'name',
						width: 100,
						name$tr$: 'cloud.common.entityName',
						searchable: true,
						readonly: true
					},
					{
						id: 'doc',
						field: 'translated',
						name: 'Document',
						width: 100,
						name$tr$: 'cloud.common.entityDescription',
						searchable: true,
						domain: 'text'
					}
				];

				return {
					columns: columns,
					data: [],
					id: gridId,
					options: {
						indicator: true,
						idProperty: 'name',
						showMainTopPanel: true,
						skipPermissionCheck: true
					}
				};
			}

			function generateGridConfig3() {
				const gridId = '24A54FE04C80452097F55135AA9C7E28';
				const columns = [
					{
						id: 'language',
						field: 'k',
						name: 'Language',
						width: 100,
						name$tr$: 'cloud.common.languageColHeader_Language',
						searchable: true,
						readonly: true,
						formatter: function (row, cell, value) {
							return _.find(languages, {Culture: value}).Description;
						}
					},
					{
						id: 'doc',
						field: 'v',
						name: 'Document',
						width: 100,
						name$tr$: 'cloud.common.languageColHeader_LanguageTT',
						searchable: true,
						domain: 'text'
					}
				];

				return {
					columns: columns,
					data: [],
					id: gridId,
					options: {
						indicator: true,
						idProperty: 'k',
						showMainTopPanel: true
					}
				};
			}

			function onObjectTypeSelected(e, args) {
				const props = args.grid.getDataItem(args.rows[0]).props;

				props.forEach(function (prop) {
					if (Object.prototype.hasOwnProperty.call(prop, 'translated')) {
						return;
					}

					Object.defineProperty(prop, 'translated', {
						get: function () {
							if (language === 'en') {
								return prop.doc;
							}
							if (angular.isArray(prop.__tr)) {
								const target = _.find(prop.__tr, {k: language});
								if (target) {
									return target.v;
								}
							}
							return prop.doc;
						},
						set: function (newValue) {
							if (language === 'en') {
								prop.doc = newValue;
							} else {
								if (!angular.isArray(prop.__tr)) {
									prop.__tr = [];
								}
								const target = _.find(prop.__tr, {k: language});
								if (target) {
									target.v = newValue;
								} else {
									prop.__tr.push({
										k: language,
										v: newValue
									});
								}
							}
						}
					});
				});

				platformGridAPI.items.data(gridConfig2.id, props);
			}

			function onObjectPropertySelected(e, args) {
				$scope.selectedProp = args.grid.getDataItem(args.rows[0]);
				$scope.onDocChange = function () {
					platformGridAPI.rows.refreshRow({
						gridId: gridConfig2.id,
						item: $scope.selectedProp
					});
				};

				if ($scope.selectedProp === null) {
					platformGridAPI.items.data(gridConfig3.id, []);
				} else {
					platformGridAPI.items.data(gridConfig3.id, processTrData($scope.selectedProp));
				}
			}

			function onTranslationSelected(e, args) {
				$scope.selectedTranslation = args.grid.getDataItem(args.rows[0]);
				$scope.onTranslationChange = function () {
					platformGridAPI.rows.refreshRow({
						gridId: gridConfig3.id,
						item: $scope.selectedTranslation
					});
				};
			}

			function processTrData(prop) {
				const data = [];

				if (!angular.isArray(prop.__tr)) {
					prop.__tr = [];
				}

				languages.forEach(function (item) {
					let obj = _.find(prop.__tr, {k: item.Culture});

					if (obj === null) {
						if (item.Culture === 'en') {
							obj = {k: 'en'};
							Object.defineProperty(obj, 'v', {
								get: function () {
									return prop.doc;
								},
								set: function (newValue) {
									prop.doc = newValue;
								}
							});
						} else {
							obj = {k: item.Culture, v: null};
							prop.__tr.push(obj);
						}
					}
					data.push(obj);
				});

				return data;
			}

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister(gridConfig1.id, 'onSelectedRowsChanged', onObjectTypeSelected);
				platformGridAPI.events.unregister(gridConfig2.id, 'onSelectedRowsChanged', onObjectPropertySelected);
				platformGridAPI.events.unregister(gridConfig3.id, 'onSelectedRowsChanged', onTranslationSelected);
			});
		}
	]);

})(angular);