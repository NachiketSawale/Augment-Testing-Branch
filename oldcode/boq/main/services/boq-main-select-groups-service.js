/**
 * Created by reimer on 22.06.2017.
 */

(function () {
	/* global globals, _, Platform */
	'use strict';

	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainSelectGroupsService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('boqMainSelectGroupsService', [
		'$q',
		'$http',
		'boqMainItemTypes2',
		'platformModalService',
		'platformSchemaService',
		'platformRuntimeDataService',
		function ($q,
			$http,
			boqMainItemTypes2,
			platformModalService,
			platformSchemaService,
			platformRuntimeDataService) {

			var service = {};

			// local buffers
			var _gridId = '58a978db0ce84a1fbcf58dbece745239';  // selected codes grid
			var _busyStatus = false;

			service.busyStatusChanged = new Platform.Messenger();

			var setBusyStatus = function (newStatus) {
				if (_busyStatus !== newStatus) {
					_busyStatus = newStatus;
					service.busyStatusChanged.fire(_busyStatus);
				}
			};

			service.showEditor = function (params) {

				_busyStatus = false;

				var entity = params.boqMainService.getSelected();
				if (_.isEmpty(entity)) {
					showWarning('boq.main.gaebImportBoqMissing');
					return;
				}

				params.gridId = _gridId;
				// params.data = JSON.parse(JSON.stringify(params.boqMainService.getTree()));    // --> deep copy!
				params.data = service.filterGroups(params.boqMainService.getTree());

				if (_.isEmpty(params.data)) {
					showWarning('BoQ contains no alternate items!');
					return;
				}

				// init data/lookups
				var schema = platformSchemaService.getSchemas([{assemblyName: 'RIB.Visual.Boq.Main.WebApi', typeName: 'BoqItemDto', moduleSubModule: 'Boq.Main'}]);

				$q.all([schema]).then(function () {

					var modalOptions = {
						templateUrl: globals.appBaseUrl + 'boq.main/templates/boq-main-select-groups.html',
						windowClass: 'form-modal-dialog',
						headerTextKey: 'boq.main.selectGroupsPopup',
						lazyInit: true,
						resizeable: true,
						width: '60%',
						params: params
					};
					platformModalService.showDialog(modalOptions);

				});
			};

			service.saveChangedItems = function (data) {

				var params = [];

				angular.forEach(data, function (item) {
					if (!item.isDummyNode) {   // skip
						if (Object.prototype.hasOwnProperty.call(item, '_ParentEntity')) {  // avoid circular structure error
							delete item._ParentEntity;
						}
						params.push(item);
					}
				});

				setBusyStatus(true);
				return $http.post(globals.webApiBaseUrl + 'boq/main/updatemultiple', params)
					.then(function () {
						return;
					}, function (reason) {           /* jshint ignore:line */
						// error case will be handled by interceptor
						console.log(reason);
					}).finally(function () {
						setBusyStatus(false);
					}
					);
			};

			service.filterGroups = function (tree) {

				var result;
				var arr = [];
				var maxId = 0;

				if (!_.isObject(tree)) {
					return null;
				}

				function pickGroups(item, arr) {
					if (item.AGN) {
						item.sort = (1000 * parseInt(item.AGN)) + item.AAN || 0;
						arr.push(item);
						if (item.Id > maxId) {
							maxId = item.Id;
						}
					}
					var len = item.BoqItems ? item.BoqItems.length : 0;
					for (var i = 0; i < len; i++) {
						pickGroups(item.BoqItems[i], arr);
					}
				}

				// filter all alternate items
				pickGroups(tree[0], arr);
				arr = _.sortBy(arr, 'sort');  // order by AGN/AAN

				var agn = -1;
				var aan = -1;

				var rootItem, baseItem, groupItem;

				var readonlyFields = [
					{field: 'AAN', readonly: true},
					{field: '_selected', readonly: true}
				];

				for (var i = 0; i < arr.length; i++) {

					if (!result) {
						result = [];
						rootItem = _.clone(tree[0]);
						rootItem._BoqItemFk = rootItem.BoqItemFk;
						rootItem.BoqItems = [];
						rootItem._isDummyNode = true;
						platformRuntimeDataService.readonly(rootItem, readonlyFields);
						result.push(rootItem);
					}

					if (arr[i].AGN !== agn) {
						maxId++;
						agn = arr[i].AGN;
						// baseItem = {Id: maxId, _BoqItemFk: rootItem.Id, AGN: agn, AAN: arr[i].AAN, BoqItems: [], BriefInfo: {}};
						baseItem = {Id: maxId, _BoqItemFk: rootItem.Id, AGN: agn, BoqItems: [], BriefInfo: {}};
						// baseItem.BriefInfo.Translated = 'Group ' + agn; --> agn is changeable!
						// baseItem.BriefInfo.Translated = 'Group';
						baseItem._isDummyNode = true;
						platformRuntimeDataService.readonly(baseItem, readonlyFields);
						rootItem.BoqItems.push(baseItem);
					}

					if (arr[i].AAN !== aan) {
						maxId++;
						aan = arr[i].AAN;
						groupItem = {Id: maxId, _BoqItemFk: baseItem.Id, AGN: agn, AAN: aan, BoqItems: [], BriefInfo: {}};
						// groupItem.BriefInfo.Translated = baseItem.BriefInfo.Translated + ', Alternative ' + aan; --> aan is changeable!
						// groupItem.BriefInfo.Translated = 'Alternative';
						groupItem._isDummyNode = true;
						platformRuntimeDataService.readonly(groupItem, readonlyFields);
						baseItem.BoqItems.push(groupItem);
					}

					var clone = _.clone(arr[i]);
					clone._BoqItemFk = groupItem.Id;
					clone._ParentEntity = groupItem;
					clone.BoqItems = null;
					clone._selected = (clone.BasItemType2Fk===boqMainItemTypes2.base || clone.BasItemType2Fk===boqMainItemTypes2.alternativeAwarded);
					clone._originAAN = clone.AAN;
					groupItem.BoqItems.push(clone);

				}

				return result;
			};

			function showWarning(message) {
				var modalOptions = {
					headerTextKey: 'boq.main.warning',
					bodyTextKey: message,
					showOkButton: true,
					iconClass: 'ico-warning'
				};
				platformModalService.showDialog(modalOptions);
			}

			// region un-/select items

			service.setSelected = function (rootItem, selected) {

				var modifiedItems = [];

				if (!_.isObject(rootItem) || !_.isObject(selected)) {
					return null;
				}

				walkTheTree(rootItem, function (item) {

					if (isPosition(item) && item.AGN === selected.AGN) {   // same AGN group
						var modified = false;
						storeOriginAAN(item);
						if (item._originAAN === selected._originAAN) {      // same level
							if (item.BasItemType2Fk===boqMainItemTypes2.base || item.BasItemType2Fk===boqMainItemTypes2.basePostponed || selected.AAN===0) {
								item.BasItemType2Fk = boqMainItemTypes2.base;
							} else {
								item.BasItemType2Fk = boqMainItemTypes2.alternativeAwarded;
							}
							item._selected = true;
							service.add2ModifiedItems(item, modifiedItems);
						}
						else {
							if (item.BasItemType2Fk===boqMainItemTypes2.base || item.BasItemType2Fk===boqMainItemTypes2.basePostponed) {
								if (item.BasItemType2Fk!==boqMainItemTypes2.basePostponed && selected.AAN!==0) {
									item.BasItemType2Fk = boqMainItemTypes2.basePostponed;
									modified = true;
								}
							}
							else if (item.BasItemType2Fk !== boqMainItemTypes2.alternative) {
								item.BasItemType2Fk = boqMainItemTypes2.alternative;
								modified = true;
							}

							if (item.AAN===0 || item._originAAN===0) {  // previous selected item

								if (item._originAAN !== 0) {
									setAAN(item, item._originAAN);
									modified = true;
								}
							}

							if (item._selected === true) {
								item._selected = false;
								modified = true;
							}

							if (modified) {
								service.add2ModifiedItems(item, modifiedItems);
							}
						}
					}

				});
				return modifiedItems;
			};

			function setAAN(item, newValue) {
				if (!_.isObject(item)) {
					return;
				}

				item.AAN = newValue;

				if (Object.prototype.hasOwnProperty.call(item, '_ParentEntity') && item._ParentEntity) {
					item._ParentEntity.AAN = newValue;
				}
			}

			service.setBaseItem = function (rootItem, selected) {

				var modifiedItems = [];

				if (!_.isObject(rootItem) || !_.isObject(selected)) {
					return null;
				}

				walkTheTree(rootItem, function (item) {

					if (isPosition(item) && item.AGN === selected.AGN) {   // same AGN group
						var modified = false;
						storeOriginAAN(item);
						if (item._originAAN === selected._originAAN) {      // same level
							setAAN(item, 0);
							item.BasItemType2Fk = boqMainItemTypes2.base;
							item._selected = true;
							service.add2ModifiedItems(item, modifiedItems);
						}
						else {
							if (item.AAN === 0) {
								if (item._originAAN === 0) {
									setAAN(item, selected._originAAN);
								} else {
									setAAN(item, item._originAAN);
								}
								modified = true;
							}
							if (item.BasItemType2Fk !== boqMainItemTypes2.alternative) {
								item.BasItemType2Fk = boqMainItemTypes2.alternative;
								modified = true;
							}

							if (item._selected === true) {
								item._selected = false;
							}

							if (modified) {
								service.add2ModifiedItems(item, modifiedItems);
							}
						}
					}

				});
				return modifiedItems;
			};

			service.setItemType = function (rootItem, selected, newItemType, skipCreatingNewAAN) {

				var modifiedItems = [];

				if (!_.isObject(rootItem) || !_.isObject(selected)) {
					return null;
				}

				walkTheTree(rootItem, function (item) {

					if (isPosition(item) &&
						(item.AGN===selected.AGN ||
							(item._originAGN && selected._originAGN && item._originAGN===selected._originAGN) ||
							item.AGN===selected._originAGN)) {   // same AGN group

						var modified = false;
						storeOriginAAN(item);
						// if (item._BoqItemFk === selected._BoqItemFk) {        // same level
						if (item._originAAN === selected._originAAN) {        // same level

							item.BasItemType2Fk = newItemType;
							item._selected = (newItemType===boqMainItemTypes2.base || newItemType===boqMainItemTypes2.alternative.alternativeAwarded);
							if (newItemType === boqMainItemTypes2.base) {
								setAAN(item, 0);
							}

							if (newItemType===boqMainItemTypes2.basePostponed || newItemType===boqMainItemTypes2.alternative) {
								if (newItemType === boqMainItemTypes2.alternative) {
									if(!skipCreatingNewAAN) {
										var p = {};
										p.maxAAN = -1;
										p.AGN = selected.AGN;
										service.getMaxAAN(rootItem, p);
										setAAN(item, (parseInt(p.maxAAN)+1).toString());
									}
								} else if (item.AAN === 0) {
									if (item._originAAN !== 0) {
										setAAN(item, item._originAAN);
									}
								}

								item._selected = false;
							}

							modified = true;
						}
						else {
							if (newItemType === boqMainItemTypes2.base)  // another item was set as base
							{
								service.unSelectItem(item/* , selected */);
								item.BasItemType2Fk = boqMainItemTypes2.alternative;
								if (item.AAN === 0) {
									item.AAN = selected._originAAN;
								}
								modified = true;
							}

							if (newItemType === boqMainItemTypes2.basePostponed) // another item was set as base
							{
								if (item.BasItemType2Fk === boqMainItemTypes2.base) {
									item.BasItemType2Fk = boqMainItemTypes2.alternativeAwarded;
									service.selectItem(item);
									modified = true;
								} else {
									if (item.BasItemType2Fk !== boqMainItemTypes2.alternative) {
										item.BasItemType2Fk = boqMainItemTypes2.alternative;
										service.unSelectItem(item/* , selected */);
										modified = true;
									}
								}
							}

							// if (newItemType === ITEMTYPE_ALTERNATIVE) { // nothing to do }

							if (newItemType === boqMainItemTypes2.alternativeAwarded)  // another item was selected
							{
								modified = service.unSelectItem(item/* , selected */);
								if (item.BasItemType2Fk === boqMainItemTypes2.base) {
									item.BasItemType2Fk = boqMainItemTypes2.basePostponed;
									modified = true;
								} else if (item.BasItemType2Fk === boqMainItemTypes2.basePostponed) {
									// stay postponed
									modified = true;
								} else if (item.BasItemType2Fk === boqMainItemTypes2.alternativeAwarded) {
									item.BasItemType2Fk = boqMainItemTypes2.alternative;
									modified = true;
								}
							}
						}

						if (modified) {
							service.add2ModifiedItems(item, modifiedItems);
						}
					}
				});

				return modifiedItems;
			};

			service.setItemTypeOnly = function setItemTypeOnly(item, newItemType) {
				// Here we only set the new item type and don't traverse the tree to adjust the other related items
				if (_.isObject(item)) {
					item.BasItemType2Fk = newItemType;
					if (newItemType===boqMainItemTypes2.base || newItemType===boqMainItemTypes2.alternativeAwarded) {
						item._selected = true;
					} else {
						item._selected = false;
					}
				}
			};

			service.copyState = function copyState(sourceItem, targetItem) {
				if (_.isObject(sourceItem) && _.isObject(targetItem)) {
					targetItem.AGN = sourceItem.AGN;
					targetItem.AAN = sourceItem.AAN;
					targetItem.BasItemType2Fk = sourceItem.BasItemType2Fk;
					targetItem._selected = sourceItem._selected;
				}
			};

			service.getNextAGN = function(rootBoqItem) {
				if (!rootBoqItem) {
					return null;
				}

				var maxId = 99;
				walkTheTree(rootBoqItem, function(boqItem) {
					const agn = parseInt(boqItem.AGN);
					if (agn!==null && agn>maxId) {
						maxId = agn;
					}
				});

				return (maxId+1).toString();
			};

			service.getAllItemsWithAGN = function (rootItem, agn) {

				var allItemsWithGivenAGN = [];

				if (!_.isObject(rootItem)) {
					return [];
				}

				walkTheTree(rootItem, function (item) {

					if (item.AGN === agn) {
						allItemsWithGivenAGN.push(item);
					}
				});
				return allItemsWithGivenAGN;
			};

			service.inheritItemType2Childs = function (level) {

				if (!_.isObject(level)) {
					return;
				}

				walkTheTree(level, function (item) {
					item.BasItemType2Fk = level.BasItemType2Fk;
					item.AGN = level.AGN;
					item.AAN = 0;  // level.AAN;
				});
			};

			service.inheritAGN2Childs = function (level) {

				if (!_.isObject(level)) {
					return;
				}

				walkTheTree(level, function (item) {
					if (item.AGN === null) {
						item.BasItemType2Fk = level.BasItemType2Fk;
						item.AGN = level.AGN;
						item.AAN = level.AAN;
					}
				});
			};

			function walkTheTree(item, callback) {

				if (!_.isObject(item)) {
					return;
				}

				callback(item);

				var len = item.BoqItems ? item.BoqItems.length : 0;
				for (var i = 0; i < len; i++) {
					walkTheTree(item.BoqItems[i], callback);
				}
			}

			service.add2ModifiedItems = function (item, modifiedItems) {

				if (!_.isObject(item)) {
					return;
				}

				for (var i = 0; i < modifiedItems.length; i++) {
					if (item.Id === modifiedItems[i].Id) {
						modifiedItems[i] = item;
						return;
					}
				}
				modifiedItems.push(item);
			};

			service.merge2ModifiedItems = function merge2ModifiedItems(items, modifiedItems) {

				for (var i = 0; i < items.length; i++) {
					service.add2ModifiedItems(items[i], modifiedItems);
				}
			};

			service.hasSelectedItems = function (rootItem, AGN) {

				var result = false;

				if (!_.isObject(rootItem)) {
					return false;
				}

				walkTheTree(rootItem, function (item) {
					if (isPosition(item) && item.AGN === AGN) {   // same AGN group
						if (item.BasItemType2Fk===boqMainItemTypes2.base || item.BasItemType2Fk===boqMainItemTypes2.alternativeAwarded) {
							result = true;
						}
					}
				});
				return result;
			};

			service.removeTempSelectGroupProperties = function (rootItem) {

				if (!_.isObject(rootItem)) {
					return;
				}

				walkTheTree(rootItem, function (item) {
					if (Object.prototype.hasOwnProperty.call(item, '_originAGN')) {
						delete item._originAGN;
					}
					if (Object.prototype.hasOwnProperty.call(item, '_originAAN')) {
						delete item._originAAN;
					}
					if (Object.prototype.hasOwnProperty.call(item, '_isDummyNode')) {
						delete item._isDummyNode;
					}
					if (Object.prototype.hasOwnProperty.call(item, '_ParentEntity')) {
						delete item._ParentEntity;
					}
				});
			};

			service.getBaseItem = function (rootItem, AGN) {

				var baseItem = null;

				if (!_.isObject(rootItem)) {
					return null;
				}

				walkTheTree(rootItem, function (item) {
					if (isPosition(item) && item.AGN === AGN) {   // same AGN group
						if (item.BasItemType2Fk===boqMainItemTypes2.base || item.BasItemType2Fk===boqMainItemTypes2.basePostponed) {
							baseItem = item;
						}
					}
				});
				return baseItem;
			};

			service.getRandomAlternativItem = function (rootItem, AGN) {

				var result = null;

				if (!_.isObject(rootItem)) {
					return null;
				}

				walkTheTree(rootItem, function (item) {
					if (isPosition(item) && item.AGN === AGN) {   // same AGN group
						if (item.BasItemType2Fk===boqMainItemTypes2.alternative || item.BasItemType2Fk===boqMainItemTypes2.alternativeAwarded) {
							result = item;
						}
					}
				});
				return result;
			};

			service.getMaxAAN = function getMaxAAN(item, p) {
				if (item.AGN === p.AGN) {
					if (item.AAN !== null && item.AAN > p.maxAAN) {
						p.maxAAN = item.AAN;
					}
				}
				var len = item.BoqItems ? item.BoqItems.length : 0;
				for (var i = 0; i < len; i++) {
					getMaxAAN(item.BoqItems[i], p);
				}
			};

			service.unSelectItem = function unSelectItem(item/* , selected */) {

				var modified = false;

				if (!_.isObject(item)) {
					return false;
				}

				if (item.AAN === 0 || item._selected) {
					if (item._originAAN !== 0) {
						// item.AAN = item._originAAN;
						setAAN(item, item._originAAN);
					}
					item._selected = false;
					modified = true;
				}
				return modified;
			};

			service.selectItem = function selectItem(item) {

				var modified = false;

				if (!_.isObject(item)) {
					return false;
				}

				if (item.AAN !== 0 || !item._selected) {
					item._selected = true;
					modified = true;
				}
				return modified;
			};

			function isDummyNode(node) {

				if (_.isObject(node) && Object.prototype.hasOwnProperty.call(node, '_isDummyNode')) {
					return node._isDummyNode;
				} else {
					return false;
				}
			}

			function isPosition(item) {

				if (_.isObject(item) && Object.prototype.hasOwnProperty.call(item, 'AAN') && item.AAN !== null && !isDummyNode(item)) {
					return true;
				} else {
					return false;
				}
			}

			function storeOriginAAN(item) {

				if (_.isObject(item) && !Object.prototype.hasOwnProperty.call(item, '_originAAN')) {
					item._originAAN = item.AAN;   // remember origin AAN
				}
			}

			//

			return service;

		}
	]);
})(angular);
