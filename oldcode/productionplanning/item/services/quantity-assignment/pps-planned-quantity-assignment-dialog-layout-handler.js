(function () {
	'use strict';
	/* global angular, _, globals */
	const moduleName = 'productionplanning.item';
	angular.module(moduleName).service('ppsPlannedQuantitiyAssginmentDialogLayoutHandler', LayoutHandler);
	LayoutHandler.$inject = ['platformRuntimeDataService', 'platformGridAPI', '$', '$http', '$q'];
	function LayoutHandler(platformRuntimeDataService, platformGridAPI, $, $http, $q) {
		const qtyAssimtDialogLayoutGuid = '614dabcb5a6d468e902709848ec81ab5';
		let latestLayoutConfig = null;
		this.loadLatestLayoutConfig = () => {
			let defer = $q.defer();
			if (_.isNil(latestLayoutConfig)) {
				$http.get(globals.webApiBaseUrl + 'basics/layout/module-config?module=' + 'productionplanning.item')
					.then((response) => {
						if(response.data) {
							let uiConfig = response.data.find(e => e.Guid === qtyAssimtDialogLayoutGuid);
							if (uiConfig && (uiConfig.CustomConfig || uiConfig.CustomConfig !== '')) {
								latestLayoutConfig = deserializeConfig(uiConfig.CustomConfig);
							}
						}
						defer.resolve(latestLayoutConfig);
					});
			} else {
				defer.resolve(latestLayoutConfig);
			}
			return defer.promise;
		};

		// Copy from app/services/mainview-serivice.js->method deserializeConfig
		function deserializeConfig(viewConfig) {
			let config = _.cloneDeep(viewConfig);
			config = JSON.parse(config);
			// validate pane sizes - must be not more than 100%
			_.each([config.splitterDef1, config.splitterDef2], function (splitterDef) {
				if (splitterDef.panes.length) {
					const sum = _.sumBy(splitterDef.panes, function (pane) {
						if (!pane.collapsed) {
							return parseFloat(pane.size);
						}
					});

					if (sum > 100.1) {
						// reset panes to default values
						const size = (100.0 / splitterDef.panes.length).toString() + '%';

						_.each(splitterDef.panes, function (pane) {
							pane.size = size;
						});
					}
				}
			});

			if (angular.isString(config.subviews)) {
				config.subviews = JSON.parse(config.subviews);
			}
			return config;
		}

		// Copy(part code) from app/services/mainview-serivice.js->method setSplitterDef
		function setSplitterDef(paneObj, sender) {
			if (_.isNil(paneObj)) {
				return;
			}
			const dimension = parseFloat(sender.options.panes[0].size) + parseFloat(sender.options.panes[1].size);
			angular.forEach(sender.options.panes, function (pane, index) {
				let calVal = (pane.size.indexOf('%') > -1) ? dimension * (parseFloat(pane.size) / 100) : pane.size;
				paneObj.panes[index].size = (parseFloat(calVal) / dimension * 100) + '%';
				paneObj.panes[index].collapsed = pane.collapsed; // when collapsed of pane is false, it means size of pane is 0%. BTW, generally, "collapsible" is always true, no matter what the value of "size" is
			});
		}

		this.appendPropertiesAndMethodsForLayout = function ($scope) {
			if(!_.isNil(latestLayoutConfig)){
				$scope.layoutConfig = latestLayoutConfig;
			}
			else { // if latestLayoutConfig is null(corresponding record does not exist in the DB), we use following default layout config
				$scope.layoutConfig = {
					splitterDef1: {panes: [{collapsible: true, size: '55%'}, {collapsible: true, size: '45%'}], orientation: 'horizontal'},
					splitterDef2: {panes: [{collapsible: true, size: '50%'}, {collapsible: true, size: '50%'}], orientation: 'vertical'},
					activeTab: 0
				};
			}

			$scope.isActive = function (index) {
				return $scope.layoutConfig.activeTab === index;
			};
			$scope.onTabClicked = function (index) {
				if($scope.layoutConfig.activeTab === index){
					return;
				}

				$scope.layoutConfig.activeTab = index;
				// fix issue about losing layout of plannedQtyChild grid. The issue is occurred by following steps: 1.switch to Specification tab; 2.adjust splitter; 3.switch to plannedQtyChild tab
				if(index === 0){ // 0 maps tab of plannedQtyChild Grid
					setTimeout(function () {
						platformGridAPI.grids.resize($scope.gridOptions.plannedQtyChildGrid.state);
					}, 50);
				}
			};

			$scope.resizeSplitter1 = function (e){
				setSplitterDef($scope.layoutConfig.splitterDef1, e.sender);
			};

			$scope.resizeSplitter2 = function (e){
				setSplitterDef($scope.layoutConfig.splitterDef2, e.sender);
			};

			$scope.saveLayoutConfig = function () {
				latestLayoutConfig = $scope.layoutConfig;
				/* testing data
				let testConfig = {
					'splitterDef1':{
						'selectorName': 'horizontal',
						'panes': [
							{'collapsible': true, 'size': '55%'},
							{'collapsible': true, 'size': '45%'}
						],
						'orientation': 'horizontal'
					},
					'splitterDef2': {
						'selectorName': 'vertical',
						'panes': [
							{'collapsible': true, 'size': '45.48%'},
							{'collapsible': true, 'size': '53.54%'}
						],
						'orientation': 'vertical'
					},
					'activeTab': 0
				};
				const config = JSON.stringify(testConfig);
				*/
				const config = JSON.stringify($scope.layoutConfig);
				const data = [{
					Guid: qtyAssimtDialogLayoutGuid,
					CustomConfig: config,
					IsUser: true,
					IsRole: false,
					IsSystem: false,
					IsPortal: false,
					IsFormConfig: false
				}];

				$http.post(globals.webApiBaseUrl + 'basics/layout/module-config?module=productionplanning.item', data);
			};
		};
	}
})();