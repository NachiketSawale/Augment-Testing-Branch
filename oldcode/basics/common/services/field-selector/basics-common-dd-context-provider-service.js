/*
 * $Id: basics-common-dd-subentity-service.js 568411 2019-12-20 15:04:41Z saa\hof $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name basics.common.basicsCommonDdContextProviderService
	 * @function
	 *
	 * @description Provides classes that manages subentities created by a user within a schema graph based on the data dictionary.
	 */
	angular.module('basics.common').factory('basicsCommonDdContextProviderService', ['basicsCommonSchemaGraphService',
		'_', '$http', '$q', 'platformColorService', 'math', '$log', '$translate', 'PlatformMessenger',
		function (basicsCommonSchemaGraphService, _, $http, $q, platformColorService, math, $log,
			$translate, PlatformMessenger) {

			const service = {};

			service.createContextProvider = function createContextProvider(context) {
				return new ContextProvider(context);
			};

			service.getColorInfoByPropertyPath = function getColorInfoByPropertyPath(propertyPath) {
				if (_.isString(propertyPath)) {
					const extractedIdentifier = extractId(propertyPath);
					const id = convertId(extractedIdentifier);
					if (!_.isNil(id)) {
						const colorRange = platformColorService.colors().length;
						const selectedColorId = id % colorRange;
						const selectedColor = platformColorService.colors()[selectedColorId].name;
						const hueRange = _.min(_.map(platformColorService.colors(), 'colors.length'));
						const defaultStartHue = 4;
						const startHue = _.min([defaultStartHue - 1, hueRange]);
						let selectedHue = (startHue + math.floor(id / hueRange)) % hueRange;
						selectedHue++; // always above zero because css class names start at 1
						if (colorRange * hueRange < id) {
							$log.warn('Color range exceeded. Subentity colors might occur more than once!');
						}
						return ['bg', selectedColor, selectedHue].join('-');
					}
				}
			};

			function Subentity(name, path, id, node, displayName) {
				// initialise here
				this.id = id;
				this.idInt = convertId(this.id);
				this.name = name;
				this.path = path;
				this.node = node;
				this.displayName = displayName;
			}

			function ContextProvider(context) {
				this.context = {
					subentities: _.has(context, 'subentities') ? context.subentities : [],
					dynamicFields: {},
					aliasExpressions: [],
					ruleEditorManager: context ? context.ruleEditorManager : null
				};
				this.onContextChanged = new PlatformMessenger();
			}

			ContextProvider.prototype.addEntities = function addEntities(subentities) {
				const provider = this;
				const subE = provider.context.subentities;
				let newEntities = [];

				function addSubentity(subentity) {
					if (_.every([subentity.node, subentity.originalNode, subentity.path], _.isUndefined)) {
						$log.error('missing information to create subentity');
					}
					const newEntity = new Subentity(
						subentity.name,
						subentity.path || subentity.originalNode.id,
						assignId(subentity.id, subE),
						subentity.node || _.clone(subentity.originalNode),
						subentity.displayName
					);
					setNodeProperties(newEntity);
					subE.push(newEntity);
					newEntities.push(newEntity);
				}

				if (_.isArray(subentities)) {
					_.forEach(subentities, addSubentity);
				} else if (_.isObject(subentities)) {
					addSubentity(subentities);
					newEntities = _.first(newEntities);
				}
				this.onContextChanged.fire(this.context);
				return newEntities;
			};

			ContextProvider.prototype.removeEntities = function removeEntities(idList) {
				if (_.isArray(idList)) {
					return _.remove(this.context.subentities, function (subE) {
						return _.includes(idList, subE.id);
					});
				} else if (_.isString(idList)) {
					return _.remove(this.context.subentities, {id: idList});
				} else if (_.isUndefined(idList)) {
					this.context.subentities = [];
				}
				this.onContextChanged.fire(this.context);
			};

			ContextProvider.prototype.retrieveEntities = function retrieveEntities(idList) {
				const subE = this.context.subentities;
				if (idList) {
					return _.isArray(idList) ? _.compact(_.map(idList, function (id) {
						return retrieveEntityById(id, subE);
					})) : retrieveEntityById(idList, subE);
				} else {
					return this.context.subentities;
				}
			};

			class AliasExpression {
				constructor(id, parentPath) {
					this.id = id;
					this.parentPath = parentPath;
				}
			}

			ContextProvider.prototype.addAliasExpression = function(parentPath, pathSegment, parameters) {
				const aeList = this.context.aliasExpressions;
				const newId = aeList.length;

				const newExpr = new AliasExpression(`@${newId}`, parentPath);
				newExpr.pathSegment = pathSegment;
				newExpr.parameters = parameters;
				newExpr.fullId = (_.isEmpty(parentPath) ? '' : (parentPath + '.')) + newExpr.id;

				aeList.push(newExpr);

				this.onContextChanged.fire(this.context);
				return newExpr.fullId;
			};

			ContextProvider.prototype.retrieveAliasExpressions = function() {
				return this.context.aliasExpressions;
			};

			ContextProvider.prototype.removeAliasExpressions = function () {
				this.context.aliasExpressions = [];
				this.onContextChanged.fire(this.context);
			};

			ContextProvider.prototype.normalizePath = function normalizePath(id, passedEntities) {
				const subentityPathSegments = _.filter(id.split('.'), function (segment) {
					return segment.includes('*');
				});

				const subentities = passedEntities || this.retrieveEntities(subentityPathSegments);
				_.forEach(subentities, function (subentity) {
					id = id.replace(subentity.id, subentity.path);
				});
				// TODO: While loop to resolve dependent subentities

				return id;
			};

			ContextProvider.prototype.sanitizePath = function sanitizePath(id) {
				const cleanPathSegments = _.filter(id.split('.'), function (segment) {
					return !segment.includes('*');
				});
				return cleanPathSegments.join('.');
			};

			ContextProvider.prototype.getSubEntityLabel = function (index) {
				const seId = _.isString(index) && index.startsWith('*') ? index : `*${index}`;
				const se = this.retrieveEntities([seId])[0];
				return se.name;
			};

			ContextProvider.prototype.getAliasExpressionLabel = function (index) {
				if (!_.isInteger(index) && !_.isInteger(parseInt(index))) {
					throw new Error('Invalid alias expression index.');
				}

				const ae = this.context.aliasExpressions[index];

				return $http.post(globals.webApiBaseUrl + 'basics/common/bulkexpr/schema/formatfield', {
					Path: ae.pathSegment,
					Parameters: ae.parameters
				}).then (response => response.data);
			};

			ContextProvider.prototype.extractLabelsFromPath = function extractLabelsFromPath(id) {
				const subentityPathSegments = _.filter(id.split('.'), function (segment) {
					return segment.includes('*');
				});
				const subentities = this.retrieveEntities(subentityPathSegments);
				return _.map(subentities, 'name');
			};

			// to prevent unnecessary calls
			ContextProvider.prototype.initializeSubentities = function initializeSubentities(graphProvider) {
				const promises = [];
				const missingSubentities = _.filter(this.context.subentities, function (sub) {
					return _.isUndefined(sub.node);
				});
				_.forEach(missingSubentities, function (subentity) {
					promises.push(createPathNodeAsync(subentity, graphProvider, graphProvider.findLoadedNode(subentity.path)));
				});
				return !_.isEmpty(promises) ? $q.all(promises) : $q.when(true);
			};

			ContextProvider.prototype.initializeAliasExpressions = function (graphProvider, parentNode, field, registerPromise) {
				const promises = [];

				const aliasExpressionParentPath = parentNode.parent.id;
				const relevantAliasExpressions = _.filter(this.context.aliasExpressions, ae => ae.parentPath === aliasExpressionParentPath);

				for (let aliasInfo of relevantAliasExpressions) {
					const newTreeNode = new basicsCommonSchemaGraphService.SchemaGraphNode(aliasInfo.id, field.UiTypeId, field.TargetId, aliasInfo.label, parentNode, field.UiTypeId === 'lookup', field.IsForeignKey);
					_.assign(newTreeNode, {
						isVirtual: true,
						mightHaveChildren: true,
						onlyStructural: true
					});

					var aliasIndex = parseInt(aliasInfo.id.substring(1));
					promises.push(this.getAliasExpressionLabel(aliasIndex).then(function (lbl) {
						newTreeNode.name = lbl;
					}));

					parentNode.children.push(newTreeNode);
				}

				if (_.isFunction(registerPromise)) {
					registerPromise($q.all(promises));
				}
			};

			ContextProvider.prototype.addDynamicFields = function (fields, doAsync) {
				const promises = doAsync ? [] : null;

				let changesPerformed = false;

				const that = this;
				if (_.isObject(fields)) {
					Object.keys(fields).forEach(function (typeId) {
						const typeFields = fields[typeId];

						let dynFields = that.context.dynamicFields[typeId];
						if (!dynFields) {
							dynFields = [];
							that.context.dynamicFields[typeId] = dynFields;
						}

						typeFields.forEach(function (field) {
							if (_.isString(field)) {
								if (!_.some(dynFields, {DdPath: field})) {
									if (!doAsync) {
										throw new Error('Unable to retrieve field info for ' + field + ' in synchronous mode.');
									}

									promises.push($http.get(globals.webApiBaseUrl + 'basics/common/bulkexpr/schema/field', {
										params: {
											path: field
										}
									}).then(function (response) {
										dynFields.push(response.data);
										changesPerformed = true;
									}));
								}
							} else {
								if (!_.some(dynFields, {DdPath: field.DdPath})) {
									dynFields.push(field);
									changesPerformed = true;
								}
							}
						});
					});
				}

				return doAsync ? $q.all(promises).then(function () {
					return changesPerformed;
				}) : changesPerformed;
			};

			ContextProvider.prototype.getDynamicFieldsByType = function (typeId) {
				const dynFields = this.context.dynamicFields[typeId];
				return _.isArray(dynFields) ? dynFields : [];
			};

			ContextProvider.prototype.getEditorManager = function () {
				return this.context.ruleEditorManager;
			};

			// returns subentity
			function retrieveEntityById(id, subentities) {
				let idString = null;
				if (_.isNumber(id)) {
					idString = convertId(id);
				} else if (_.isString(id)) {
					idString = id;
				} else {
					return undefined;
				}
				return _.find(subentities, {id: idString});
			}

			// returns string!
			function assignId(id, subentities) {
				if (!id) {
					let currentId = _.max(_.map(_.map(subentities, 'id'), convertId)) || 0;
					currentId++;
					return convertId(currentId);
				} else if (_.find(subentities, {id: id})) {
					$log.error('Id for pinned subentity is already allocated. Error at subentity initialization');
				} else {
					return _.isNumber(id) ? convertId(id) : id;
				}
			}

			// convert from string to number or from number to string
			function convertId(id) {
				if (_.isNumber(id)) {
					return '*' + id;
				} else if (_.isString(id)) {
					return _.toInteger(id.replace(/\D/g, ''));
				}
			}

			function extractId(propertyPath) {
				return _.find(propertyPath.split('.'), function (segment) {
					return segment.includes('*');
				});
			}

			function setNodeProperties(subentity) {
				_.assign(subentity.node, {
					id: subentity.id,
					name: subentity.name,
					image: 'control-icons ico-criterion',
					isVirtual: true,
					children: null,
					parent: ''
				});
			}

			function createPathNodeAsync(subentity, graphProvider, originalNode) {
				// node is loading
				subentity.node = 'isLoading';
				let promise;
				if (_.isObject(originalNode)) {
					const loadSyncNode = function () {
						subentity.node = _.cloneDeep(originalNode);
						return $q.when(true);
					};
					promise = loadSyncNode();
				} else {
					promise = $http.get(globals.webApiBaseUrl + 'basics/common/bulkexpr/schema/field', {
						params: {
							path: subentity.path
						}
					}).then(function (result) {
						const info = result.data;
						subentity.node = _.assign(new basicsCommonSchemaGraphService.SchemaGraphNode(subentity.id, info.UiTypeId, info.TargetId, subentity.name, null, info.UiTypeId === 'lookup', info.IsForeignKey), {
							isNullable: Boolean(info.IsNullable),
							mightHaveChildren: _.isNumber(info.TargetId) && _.isEmpty(info.TargetKind),
							onlyStructural: false,
							targetKind: info.TargetKind
						});
					});
				}

				return promise.then(function () {
					setNodeProperties(subentity);
					const labelList = {
						PathLabels: [subentity.node.path, subentity.node.name]
					};
					subentity.displayName = graphProvider.formatDisplayName(labelList);
					// don't initialize: children always empty
					// return graphProvider.loadMissing({rawNode: subentity.node}, [],1);
				});
			}

			return service;
		}]);
})(angular);
