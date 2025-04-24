/*
 * $Id: basics-common-clientside-schema-graph-service.js 634323 2021-04-27 22:05:46Z haagf $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basics.common.basicsCommonDdSchemaGraphService
	 * @function
	 *
	 * @description Provides classes that represent data schema graphs based on the data dictionary.
	 */
	angular.module('basics.common').factory('basicsCommonClientsideSchemaGraphService', ['_', 'basicsCommonSchemaGraphService',
		'$http', 'PlatformMessenger', '$q', '$translate',
		function (_, basicsCommonSchemaGraphService, $http, PlatformMessenger, $q, $translate) {
			const service = {};

			function getState(instance) {
				let result = instance.__ddDataState;
				if (!result) {
					instance.__ddDataState = result = {
						entitiesById: {},
						loadedTree: null,
						onDataLoaded: new PlatformMessenger(),
						isInitialized: false,
						initialize: function (config) {
							const that = this;

							that.focusEntityName = config.focusEntityName;
							that.uiTypeId = config.uiTypeId;
							that.targetTableId = config.targetTableId;
							that.targetTableName = config.targetTableName;
							that.manager = config.manager;

							// baum bauen, root knoten + kinder mit mightHaveChildren: false

							return instance.storeTreeRoot(_.assign(new basicsCommonSchemaGraphService.SchemaGraphNode(':root', null, null, $translate.instant('basics.common.fieldSelector.allFields')), {
								mightHaveChildren: true,
								isRoot: true
							}),
							function getChildrenForNode(node) {
								let children = [];
								if (node.isRoot) {
									children = getGraphNodeList(that.manager);
								}
								return children;
							});

						},
						cancelCurrentSearchRequest: function () {
						},
						applyTypeRestrictionsToRequest: function (requestParams) {
							const els = {};
							if (this.uiTypeId) {
								els.t = this.uiTypeId;
							}
							if (this.targetTableId) {
								els.e = this.targetTableId;
							} else if (this.targetTableName) {
								els.e = this.targetTableName;
							}
							const restrictionElements = _.map(Object.keys(els), function (key) {
								return key + ':' + els[key];
							});
							if (restrictionElements.length > 0) {
								requestParams.typeRestrictions = restrictionElements.join(';');
							}
						}
					};
				}
				return result;
			}

			function getGraphNodeList(manager) {
				const ruleEditorManager = manager;
				let availableProps = ruleEditorManager.getConfig().AvailableProperties;
				availableProps = _.filter(availableProps, function (prop) {
					const operatorType = ruleEditorManager.getConfig().RuleOperatorType;
					return ((!_.isEmpty(prop.editor) && operatorType === 4) || operatorType === 2) &&
						prop.formatter !== 'history' &&
						prop.formatter !== 'dynamic' &&
						(prop.bulkSupport !== false || operatorType === 2);
				});
				const props = _.map(availableProps, function (prop) {
					let newProp;
					if (!_.isObject(prop)) {
						newProp = {
							PropName: prop,
							Id: prop.toLowerCase()
						};
					} else {
						newProp = {
							PropName: prop.name,
							UserLabelName: prop.userLabelName,
							Id: prop.id,
							ParentPathName: prop.parentName,
							bulkSupport: prop.bulkSupport
						};
					}
					const uiTypeName = ruleEditorManager.getUiTypeByDisplayDomainId(ruleEditorManager.getDisplayDomainIdByUiType(ruleEditorManager.getDtoPropDomain(prop)));
					newProp = new basicsCommonSchemaGraphService.SchemaGraphNode(newProp.Id, uiTypeName, uiTypeName === 'lookup' ? 1 : null, newProp.PropName, null, false, null, newProp.UserLabelName);

					return newProp;
				});
				return $q.when(_.orderBy(props, ['ParentPathName', 'PropName']));
			}

			function ClientsideGraphProviver(config) {
				basicsCommonSchemaGraphService.SchemaGraphProvider.call(this, config);

				const actualConfig = _.assign({
					uiType: null,
					targetTableId: null
				}, _.isObject(config) ? config : {});

				const state = getState(this);
				state.initialize(actualConfig);
			}

			ClientsideGraphProviver.prototype = Object.create(basicsCommonSchemaGraphService.SchemaGraphProvider.prototype);
			ClientsideGraphProviver.prototype.constructor = ClientsideGraphProviver;

			service.ClientsideGraphProviver = ClientsideGraphProviver;

			ClientsideGraphProviver.prototype.findFields = function (searchText) {
				const that = this;
				const state = getState(this);
				const manager = state.manager;
				return getGraphNodeList(manager).then(function (items) {
					items = _.filter(items, function (item) {
						return _.includes(item.name.toLowerCase(), searchText.toLowerCase());
					});
					that.storeSearchResults(items);
					return items.length;
				});
			};

			ClientsideGraphProviver.prototype.getDisplayNameForItem = function (id) {
				let displayName = '';
				if (id && _.isString(id)) {
					const state = getState(this);
					const manager = state.manager;
					displayName = manager.getColumnDisplayName(id);
				}
				return $q.when(displayName);
			};

			ClientsideGraphProviver.prototype.canSelectItem = function (item) {
				return !item.isRoot;
			};

			ClientsideGraphProviver.prototype.getEnumValues = function () {
				return $q.when([]);
			};

			ClientsideGraphProviver.prototype.fieldTypesMatch = function (propInfo1, propInfo2) {
				const uiTypeId1 = propInfo1 && propInfo1.value ? propInfo1.value.UiTypeId : null;
				const uiTypeId2 = propInfo2 && propInfo2.value ? propInfo2.value.UiTypeId : null;
				return (uiTypeId1 && uiTypeId2) && (uiTypeId1 === uiTypeId2) && (uiTypeId1 !== 'lookup');
			};

			ClientsideGraphProviver.prototype.useDropdown = true;

			return service;
		}]);
})(angular);
