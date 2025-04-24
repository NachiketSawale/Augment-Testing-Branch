/**
 * Created by myh on 08/16/2021.
 */

(function (angular) {
	'use strict';

	let moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonUserDefinedColumnValueService', ['globals', '$http', '_', '$q',
		function (globals, $http, _, $q) {

			function createNewComplete(options) {
				let service = {};
				let itemList = [];
				let userDefinedColums = [];
				let UserDefinedColumnValueCompleteDto = {
					UserDefinedColumnValueToUpdate: [],
					UserDefinedColumnValueToCreate: [],
					UserDefinedColumnValueToDelete: []
				};

				angular.extend(UserDefinedColumnValueCompleteDto, options);

				function validReadData(readData) {
					let pkNames = ['Pk1', 'Pk2', 'Pk3'];
					pkNames.forEach(function (pkName) {
						let val = readData[pkName];
						if (_.isArray(val)) {
							readData[pkName] = _.uniq(val);
						} else if (!_.isUndefined(val) && !_.isArray(val)) {
							readData[pkName] = [val];
						}
					});
				}

				let getListAsync = function (readData) {
					let defer = $q.defer();

					if (!readData) {
						defer.resolve([]);
					} else {
						validReadData(readData);

						$http.post(globals.webApiBaseUrl + 'basics/common/userdefinedcolumnvalue/list', readData)
							.then(function (response) {
								service.updateValueList(response.data);

								defer.resolve(itemList);
							});
					}

					return defer.promise;
				};

				service.getList = function (readData) {
					let defer = $q.defer();

					if (itemList.length > 0) {
						defer.resolve(itemList);
					} else {
						getListAsync(readData).then(function () {
							defer.resolve(itemList);
						});
					}

					return defer.promise;
				};

				service.getData = function () {
					return itemList;
				};

				service.getListAsync = getListAsync;

				service.getItemAsync = function (requestData) {
					let defer = $q.defer();

					if (!requestData) {
						defer.reject();
					} else {
						validReadData(requestData);

						$http.post(globals.webApiBaseUrl + 'basics/common/userdefinedcolumnvalue/getitem', requestData)
							.then(function (response) {
								let data = response.data;
								if (data) {
									service.updateValueList([data]);
								}

								defer.resolve(data);
							});
					}

					return defer.promise;
				};

				service.getItemByKeys = function (tableId, pk1, pk2, pk3) {
					return _.find(itemList, function (item) {
						return item.TableId === tableId && item.Pk1 === pk1 && item.Pk2 === pk2 && item.Pk3 === pk3;
					});
				};

				service.loadAndAttachData = function (readData, dtos, filterFn, columns, fieldSuffix) {
					return service.getListAsync(readData).then(function (data) {
						attachData2Items(columns, dtos, filterFn, data, fieldSuffix);
						return dtos;
					});
				};

				function attachData2Items(columns, items, filterFn, values, fieldSuffix, isFromUpdated) {
					_.forEach(items, function (item) {
						let columnValue = _.find(values, function (d) {
							return filterFn(d, item);
						});
						if (isFromUpdated && !columnValue) {
							return;
						}

						attachData2Column(columns, item, columnValue, fieldSuffix);
					});
				}

				service.attachData2Items = attachData2Items;

				function attachData2Column(columns, dto, values, fieldSuffix) {
					_.forEach(columns, function (column) {
						let field = column.field;
						let valueField = _.isString(fieldSuffix) ? field.replace(fieldSuffix, '') : field;
						dto[field] = values && values[valueField] ? values[valueField] : 0;
					});
				}

				service.attachEmptyData2Column = function (columns, dto) {
					attachData2Column(columns, dto);
				};

				service.update = function () {
					if (UserDefinedColumnValueCompleteDto.UserDefinedColumnValueToUpdate.length === 0 &&
						UserDefinedColumnValueCompleteDto.UserDefinedColumnValueToCreate.length === 0 &&
						UserDefinedColumnValueCompleteDto.UserDefinedColumnValueToDelete.length === 0) {
						return $q.when(null);
					}

					return $http.post(globals.webApiBaseUrl + 'basics/common/userdefinedcolumnvalue/update', UserDefinedColumnValueCompleteDto)
						.then(function (response) {
							service.updateValueList(response.data);

							service.clearCompleteDto();

							return itemList;
						});
				};

				service.updateValueList = function (valueList) {
					if (_.isArray(valueList) && valueList.length > 0) {
						valueList.forEach(function (value) {
							if(!value){
								return;
							}

							let existedItem = _.find(itemList, function (item) {
								return findItemFunc(item, value);
							});

							if (existedItem) {
								angular.extend(existedItem, value);

								if (existedItem.Id && existedItem.Id > 0) {
									_.remove(UserDefinedColumnValueCompleteDto.UserDefinedColumnValueToCreate, function (toCreateItem) {
										return findItemFunc(toCreateItem, existedItem);
									});
								}
							} else {
								itemList.push(value);
							}
						});
					}
				};

				function findItemFunc(item, toFindItem) {
					return (item.TableId === toFindItem.TableId) &&
						(!toFindItem.Pk1 || item.Pk1 === toFindItem.Pk1) &&
						(!toFindItem.Pk2 || item.Pk2 === toFindItem.Pk2) &&
						(!toFindItem.Pk3 || item.Pk3 === toFindItem.Pk3);
				}

				service.handleUserDefinedColumnValueChanged = function (modifiedItem, dataItem, field, newValue) {
					let existedUserDefinedColumnValue = _.find(itemList, function (item) {
						return item.Id > 0 && findItemFunc(item, modifiedItem);
					});

					if (existedUserDefinedColumnValue) {
						let toUpdateItem = _.find(UserDefinedColumnValueCompleteDto.UserDefinedColumnValueToUpdate, function (item) {
							return findItemFunc(item, modifiedItem);
						});

						if (!toUpdateItem) {
							toUpdateItem = angular.copy(existedUserDefinedColumnValue);
							UserDefinedColumnValueCompleteDto.UserDefinedColumnValueToUpdate.push(toUpdateItem);
						}

						if (field && !_.isNil(newValue)) {
							toUpdateItem[field] = newValue;
						} else {
							angular.extend(toUpdateItem, modifiedItem);
						}
						angular.extend(existedUserDefinedColumnValue, toUpdateItem);
					} else {
						let toCreateItem = _.find(UserDefinedColumnValueCompleteDto.UserDefinedColumnValueToCreate, function (item) {
							return findItemFunc(item, modifiedItem);
						});

						if (toCreateItem) {
							if (field && newValue) {
								toCreateItem[field] = newValue;
							} else {
								angular.extend(toCreateItem, modifiedItem);
							}
						} else {
							toCreateItem = angular.copy(modifiedItem);
							if (field) {
								let columns = _.filter(userDefinedColums, function (column) {
									return !column.isExtend;
								});

								columns.forEach(function (column) {
									let field = column.field;
									toCreateItem[field] = dataItem && dataItem[field] ? dataItem[field] : 0;
								});
							}

							itemList.push(toCreateItem);
							UserDefinedColumnValueCompleteDto.UserDefinedColumnValueToCreate.push(toCreateItem);
						}
					}
				};

				service.handleUserDefinedColumnValueDeleted = function (deleteItem, isDeleted) {
					_.remove(UserDefinedColumnValueCompleteDto.UserDefinedColumnValueToUpdate, function (item) {
						return findItemFunc(item, deleteItem);
					});

					_.remove(UserDefinedColumnValueCompleteDto.UserDefinedColumnValueToCreate, function (item) {
						return findItemFunc(item, deleteItem);
					});

					_.remove(itemList, function (item) {
						return findItemFunc(item, deleteItem);
					});

					let toDeleteItem = _.first(_.remove(itemList, function (item) {
						return item.Id > 0 && findItemFunc(item, deleteItem);
					}));

					if (toDeleteItem && !isDeleted) {
						UserDefinedColumnValueCompleteDto.UserDefinedColumnValueToDelete.push(toDeleteItem);
					}
				};

				service.setUserDefinedColums = function (columns) {
					userDefinedColums = columns;
				};

				service.clear = function () {
					service.clearCompleteDto();
					itemList = [];
				};

				service.clearCompleteDto = function () {
					UserDefinedColumnValueCompleteDto.UserDefinedColumnValueToUpdate = [];
					UserDefinedColumnValueCompleteDto.UserDefinedColumnValueToCreate = [];
					UserDefinedColumnValueCompleteDto.UserDefinedColumnValueToDelete = [];
				};

				service.isNeedUpdate = function () {
					return UserDefinedColumnValueCompleteDto && (
						(_.isArray(UserDefinedColumnValueCompleteDto.UserDefinedColumnValueToUpdate) && UserDefinedColumnValueCompleteDto.UserDefinedColumnValueToUpdate.length > 0) ||
						(_.isArray(UserDefinedColumnValueCompleteDto.UserDefinedColumnValueToCreate) && UserDefinedColumnValueCompleteDto.UserDefinedColumnValueToCreate.length > 0) ||
						(_.isArray(UserDefinedColumnValueCompleteDto.UserDefinedColumnValueToDelete) && UserDefinedColumnValueCompleteDto.UserDefinedColumnValueToDelete.length > 0));
				};

				service.getUpdateData = function () {
					let updateData = angular.copy(UserDefinedColumnValueCompleteDto);
					service.clearCompleteDto();

					return updateData;
				};

				service.handleUpdateDone = function (responseData) {
					if (!responseData) {
						return;
					}

					service.updateValueList(responseData.UserDefinedColumnValueToCreate);
					service.updateValueList(responseData.UserDefinedColumnValueToUpdate);

					if (_.isArray(responseData.UserDefinedColumnValueToDelete) && responseData.UserDefinedColumnValueToDelete.length > 0) {
						responseData.UserDefinedColumnValueToDelete.forEach(function (deleteItem) {
							_.remove(itemList, function (item) {
								return findItemFunc(item, deleteItem);
							});
						});
					}

					service.clearCompleteDto();
				};

				service.copyNewUserDefinedColumnItem = function (oldValue, newValue) {
					let oldUserDefineColumnValue = _.find(itemList, function (item) {
						return findItemFunc(item, oldValue);
					});
					if (oldUserDefineColumnValue) {
						let toCreateItem = angular.copy(newValue);
						let columns = _.filter(userDefinedColums, function (column) {
							return !column.isExtend;
						});
						columns.forEach(function (column) {
							toCreateItem[column.field] = oldUserDefineColumnValue[column.field] ? oldUserDefineColumnValue[column.field] : 0;
						});
						service.clearCompleteDto();
						UserDefinedColumnValueCompleteDto.UserDefinedColumnValueToCreate.push(toCreateItem);
					}
				};
				return service;
			}

			return {
				createNewComplete: function (options) {
					return createNewComplete(options);
				}
			};
		}]);
})(angular);
