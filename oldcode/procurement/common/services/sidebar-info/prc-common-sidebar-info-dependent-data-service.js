/**
 * Created by lja on 2015/12/3.
 */
(function (angular) {
	'use strict';

	let moduleName = 'procurement.common';

	angular.module(moduleName).factory('procurementCommonSideBarInfoDependentDataService', [
		'_',
		'globals',
		'$translate',
		'basicsCommonUtilities',
		'$http',
		'platformStatusIconService',
		'cloudDesktopSidebarService',
		'$state',
		'procurementCommonSideBarInfoDataServiceFactory',
		'cloudDesktopNavigationPermissionService',
		'procurementContextService',
		function (
			_,
			globals,
			$translate,
			basicsCommonUtilities,
			$http,
			platformStatusIconService,
			cloudDesktopSidebarService,
			$state,
			procurementCommonSideBarInfoDataServiceFactory,
			naviPermissionService, procurementContextService) {

			// this config can be pass from outside
			let dependentModuleConfig = {
				requisition: {
					getTitleHandler: 'getDReqHeaderTitle',
					getStatusIconUrl: 'getDReqStatusIconUrl',
					selectedItem: 'reqSelectedItem'
				},
				package: {
					getTitleHandler: 'getDPkgHeaderTitle',
					getStatusIconUrl: 'getDPkgStatusIconUrl',
					selectedItem: 'packageSelectedItem'
				},
				rfq: {
					getTitleHandler: 'getDRfqHeaderTitle',
					getStatusIconUrl: 'getDRfqStatusIconUrl',
					selectedItem: 'rfqSelectedItem'
				},
				quote: {
					getTitleHandler: 'getDQtnHeaderTitle',
					getStatusIconUrl: 'getDQtnStatusIconUrl',
					selectedItem: 'qtnSelectedItem'
				},
				contract: {
					getTitleHandler: 'getDConHeaderTitle',
					getStatusIconUrl: 'getDConStatusIconUrl',
					selectedItem: 'conSelectedItem'
				},
				pes: {
					getTitleHandler: 'getDPesHeaderTitle',
					getStatusIconUrl: 'getDPesStatusIconUrl',
					selectedItem: 'pesSelectedItem'
				},
				invoice: {
					getTitleHandler: 'getDInvHeaderTitle',
					getStatusIconUrl: 'getDInvStatusIconUrl',
					selectedItem: 'invSelectedItem'
				}
			};

			/**
			 * dependent Data Handler
			 *
			 * todo: will split to smaller part instead of create all the module's dataService out
			 * todo: or pass the modules which we need to show
			 * @param $scope
			 * @param sourceModuleName
			 */
			function dependentDataHandler($scope, sourceModuleName) {

				sourceModuleName = sourceModuleName.toLowerCase();

				let prcModules = ['package', 'requisition', 'quote', 'rfq', 'contract', 'pes', 'invoice'],
					index = prcModules.indexOf(sourceModuleName.toLowerCase());

				if (index === -1) {
					throw new Error(sourceModuleName + ' is not in the procurement modules');
				}

				let title = {
						requisition: $translate.instant('procurement.common.sidebar.req'),
						package: $translate.instant('procurement.common.sidebar.package'),
						rfq: $translate.instant('procurement.common.sidebar.rfq'),
						quote: $translate.instant('procurement.common.sidebar.qtn'),
						contract: $translate.instant('procurement.common.sidebar.con'),
						pes: $translate.instant('procurement.common.sidebar.pes'),
						invoice: $translate.instant('procurement.common.sidebar.invoice')
					},
					pools = new Pools();

				// remove current module
				Array.prototype.splice.call(prcModules, index, 1);

				// each module should has a service to handle the prev and next event
				prcModules.forEach(function (item) {

					pools.addPool(item, function () {
						let selectedItemName = dependentModuleConfig[this.name].selectedItem;
						if ($scope.headerItem) {
							$scope.headerItem[selectedItemName] = this.service.getSelected();
							if ($scope.headerItem[selectedItemName]) {
								$scope.headerItem[selectedItemName].CodeAndDescription = basicsCommonUtilities
									.combineText([$scope.headerItem[selectedItemName].Code, $scope.headerItem[selectedItemName].Description], ' - ');

								$scope.headerItem[selectedItemName].StatusDescription = $scope.headerItem[selectedItemName].StatusDescriptionInfo.Translated;
								$scope.headerItem[selectedItemName].StatusClass = getStatusClass($scope.headerItem[selectedItemName]);
								treeEventBinding(this.name);
								if (this.name === 'requisition' || this.name === 'contract') {
									let childrenData = this.service.getChildrenData();
									$scope.headerItem[selectedItemName].dataForTheTree = childrenData;
									$scope.headerItem[selectedItemName].expandedNodesMap[selectedItemName] = childrenData;
									$scope.headerItem[selectedItemName].expandedNodes.push(childrenData);
								}
							}
						}
					});

					getTitleBinding(item);
					statusIconBinding(item);
				});

				let unWatch = $scope.$watch('headerItem', function () {

					if ($scope.headerItem && $scope.headerItem.Id && !procurementContextService.isGetPrcDependentData) {
						$http.get(globals.webApiBaseUrl + 'procurement/common/prcdependentdata/dependentlist?forergnFk=' +
							$scope.headerItem.Id + '&source=procurement.' + sourceModuleName)
							.then(function (response) {
								pools.reset(response.data);// might cause some issues
							});
					}
					if (procurementContextService.isGetPrcDependentData) {
						procurementContextService.isGetPrcDependentData = false;
					}
				});

				function getStatusClass(item) {
					return 'status-icons ico-status' + _.padStart(item.Icon, 2, '0');
				}

				function treeEventBinding(item) {
					let selectedItemName = dependentModuleConfig[item].selectedItem;
					if ($scope.headerItem) {
						let selectNodeItem = $scope.headerItem[selectedItemName];
						if (selectNodeItem) {
							selectNodeItem.expandedNodes = selectNodeItem.expandedNodes || [];
							selectNodeItem.expandedNodesMap = {};
							for (let i = 0; i < selectNodeItem.expandedNodes.length; i++) {
								selectNodeItem.expandedNodesMap['' + i] = selectNodeItem.expandedNodes[i];
							}
							selectNodeItem.nodeExpanded = function () {
								return !!selectNodeItem.expandedNodesMap[selectedItemName];
							};
							selectNodeItem.getStatusClass = function (selectedNode) {
								return getStatusClass(selectedNode);
							};
							selectNodeItem.getCodeAndDescription = function (selectedNode) {
								return basicsCommonUtilities.combineText([selectedNode.Code, selectedNode.Description], ' - ');
							};
							selectNodeItem.gotoInfoModule = function () {
								gotoModule(item, selectNodeItem.Targetfk);
							};
							selectNodeItem.selectNodeHead = function (selectedNode) {
								let expanding = selectNodeItem.expandedNodesMap[selectedItemName] === undefined;
								selectNodeItem.expandedNodesMap[selectedItemName] = (expanding ? selectedNode : undefined);
								if (expanding) {
									selectNodeItem.expandedNodes.push(selectedNode);
								} else {
									selectNodeItem.expandedNodes.splice(selectNodeItem.expandedNodes.length, 1);
								}
							};
						}
					}
				}

				$scope.$on('$destroy', function () {
					pools.destroy();
					unWatch();
				});

				/**
				 * binding module' getStatusAndIcon
				 * @param moduleName
				 */
				function statusIconBinding(moduleName) {
					let moduleConfig = dependentModuleConfig[moduleName];
					$scope[moduleConfig.getStatusIconUrl] = function () {
						return getStatusUrl(moduleConfig.selectedItem);
					};
				}

				// get status url
				function getStatusUrl(selectedItemName) {
					if ($scope.headerItem && $scope.headerItem[selectedItemName]) {
						// noinspection JSUnresolvedVariable
						$scope.headerItem[selectedItemName].StatusDescriptionInfo.Icon =
							$scope.headerItem[selectedItemName].Icon;
						// noinspection JSUnresolvedVariable
						$scope.headerItem[selectedItemName].StatusDescriptionInfo.Id =
							$scope.headerItem[selectedItemName].Statusfk;
						// noinspection JSUnresolvedVariable
						if (!$scope.headerItem[selectedItemName].StatusDescriptionInfo.Translated) {
							// noinspection JSUnresolvedVariable
							$scope.headerItem[selectedItemName].StatusDescriptionInfo.Translated = $scope.headerItem[selectedItemName].StatusDescriptionInfo.Description;
						}
						// noinspection JSUnresolvedVariable
						return platformStatusIconService.select($scope.headerItem[selectedItemName].StatusDescriptionInfo);

					}
				}

				/**
				 * binding module' getTitle
				 * @param moduleName
				 */
				function getTitleBinding(moduleName) {
					let pool = pools.getPool(moduleName),
						getTitleHandler = dependentModuleConfig[moduleName].getTitleHandler;
					$scope[getTitleHandler] = function () {
						return getTitle(title[moduleName], pool);
					};
				}

				// get title
				function getTitle(title, pool) {
					if (!pool) {
						return '';
					}
					let len = pool.service.size();
					return ($scope.headerItem && len) ? title + ': (' + len + ')' : '';
				}

				return pools.getPools();
			}

			/**
			 * get module template and binding go to module event to $scope
			 * @param $scope
			 * @param moduleName
			 * @returns {string}
			 */
			function gotoModuleHandler($scope, moduleName) {

				let getGotoTmpl = function (hasPermission, modelExp, clickExp, bindProp, styleExp) {
					let bindDirective = bindProp || 'data-ng_bind';
					if (!hasPermission) {
						return '<div class="info-domtree-description" ' + bindDirective + '="##model##" style="cursor: default;"></div>';
					}
					return '<a class="info-domtree-description" ' + bindDirective + '="' + modelExp + '" data-ng-click="' + clickExp + '"' + (styleExp ? styleExp : '') + '></a>';
				};

				let hasGotoPermission = naviPermissionService.hasPermissionForModule(moduleName.indexOf('.') > -1 ? moduleName : 'procurement.' + moduleName);

				let selectedItemName = dependentModuleConfig[moduleName].selectedItem;
				let headerItemModel = 'headerItem.' + selectedItemName;
				let customTemplate = '<div class="marginBottom flex-box" data-ng-show="##model##" >' +
					'<div class="flex-element">' +
					'<div ng-click="' + headerItemModel + '.selectNodeHead(' + headerItemModel + '.dataForTheTree)" style="float: left">' +
					'<div data-ng-class="' + headerItemModel + '.StatusClass" style="float: left"></div><div data-ng-bind="' + headerItemModel + '.StatusDescription" style="float: left;width: 80px"></div></div>' +
					'<div style="height: 18px">' +
					'' + getGotoTmpl(hasGotoPermission, '##model##', '##gotoModule##()', 'data-ng-bind-html', 'style="cursor: pointer;"') +
					'</div>' +
					'##description##' +

					'<ul class="info-domtree" ng-if="' + headerItemModel + '.nodeExpanded()"><li ng-repeat="item in ' + headerItemModel + '.dataForTheTree"><div style="float:left">' +
					'<div class="info-domtree-statusimg" data-ng_class="' + headerItemModel + '.getStatusClass(item)"></div>' +
					'<div class="info-domtree-status" data-ng_bind="item.StatusDescriptionInfo.Translated"></div>' +
					'<div class="info-domtree-node-vertical"><div class="info-domtree-node-horizontal"></div></div>' +
					'' + getGotoTmpl(hasGotoPermission, headerItemModel + '.getCodeAndDescription(item)', headerItemModel + '.gotoInfoModule()', 'data-ng_bind') +
					'</div></li></ul>' +
					'</div></div>';

				let fnName = 'goto' + upperFC(moduleName) + 'Module',
					template = customTemplate.replace(/##gotoModule##/g, fnName);

				$scope[fnName] = function () {
					gotoModule(moduleName, $scope.headerItem[dependentModuleConfig[moduleName].selectedItem].Targetfk);
				};

				return template;
			}

			/**
			 * collect dependent data's service
			 * provide gotoPrev gotoNext disablePrev disableNext for the dependent data
			 */
			function Pools() {
				this.pools = {};
			}

			Pools.prototype.addPool = function (name, fn, context) {
				this.pools[name] = {
					name: name,
					service: new procurementCommonSideBarInfoDataServiceFactory.Create([]),
					onSelectionChange: function () {
						fn.call(context || this);
					}
				};

				// put the scope into fire event
				this.pools[name].service.setContext(this.pools[name]);
				// register selectionChange event
				this.pools[name].service.selectionChangedRegister(this.pools[name].onSelectionChange);
			};

			Pools.prototype.getPools = function () {
				return this.pools;
			};

			Pools.prototype.getPool = function (key) {
				return this.pools[key];
			};

			Pools.prototype.reset = function (dataSource) {

				for (let item in this.pools) {
					if (Object.hasOwnProperty.call(this.pools, item)) {
						if (this.pools[item].service) {
							this.pools[item].service.init(dataSource[upperFC(item)]);
							if (item === 'requisition') {
								let reqChildrenItem = 'RequistionItems';
								this.pools[item].service.initChildren(dataSource[reqChildrenItem]);
							} else if (item === 'contract') {
								let conChildrenItem = 'ContractItems';
								this.pools[item].service.initChildren(dataSource[conChildrenItem]);
							}
							this.pools[item].onSelectionChange();
						}
					}
				}
			};

			Pools.prototype.destroy = function () {
				for (let item in this.pools) {
					if (Object.hasOwnProperty.call(this.pools, item)) {
						this.pools[item].service.unRegisterSelectionChanged(this.pools[item].onSelectionChange);
						this.pools[item].service = null;
					}
				}
			};

			/**
			 * upper first char in the word
			 * package -> Package
			 * @param str
			 * @returns {*}
			 */
			function upperFC(str) {
				return str.replace(/\w/, function (chr) {
					return chr.toUpperCase();
				});
			}

			/**
			 * go to module
			 * @param theModule
			 * @param id
			 */
			function gotoModule(theModule, id) {
				theModule = 'procurement.' + theModule;
				let url = globals.defaultState + '.' + theModule.replace('.', '');
				$state.go(url).then(function () {
					cloudDesktopSidebarService.filterSearchFromPKeys([id]);
				});
			}

			return {
				dependentDataHandler: dependentDataHandler,
				gotoModuleHandler: gotoModuleHandler
			};
		}
	]);
})(angular);