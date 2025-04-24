/**
 * Created by wui on 12/15/2014.
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsCommonCommentDataServiceFactory', ['_', '$http', '$q', 'basicsCommonUtilities',
		'cloudDesktopSidebarService',
		'globals', 'PlatformMessenger', '$injector', '$',
		function (_, $http, $q, basicsCommonUtilities, cloudDesktopSidebarService, globals, PlatformMessenger, $injector, $) {

			const service = {}, serviceCache = {};

			function CommentDataService(qualifier, parentDataServiceName, options) {
				const self = this;

				self.qualifier = qualifier;

				self.parentDataService = options && options.parentService ? options.parentService : $injector.get(parentDataServiceName);

				if (options && options.saveEntityName) {
					self.itemName = options.saveEntityName + 'ToSave';
				} else {
					self.itemName = (options && options.entityName) ? options.entityName + 'ToSave' : 'CommentDataToSave';
				}

				// save current page
				self.pageNum = 1;

				self.data = {};

				self.loginClerk = {};

				self.dataToSave = [];

				self.onDataRefresh = new PlatformMessenger();

				self.getParentId = function getParentId(parent) {
					if (_.isFunction(options.getCommentParentId)) {
						return options.getCommentParentId(parent);
					}

					return parent.Id;
				};

				self.columns = [
					{
						id: 'indicator',
						field: 'Comment.ClerkFk',
						converter: function (field, value) {
							let clerk = null, blob = null;

							if (self.loginClerk.Clerk && self.loginClerk.Clerk.Id === value) {
								blob = self.loginClerk.Blob;
							} else {
								const clerks = self.getClerks();
								for (let i = 0; i < clerks.length; i++) {
									if (clerks[i].Id === value) {
										clerk = clerks[i];
										break;
									}
								}
								if (clerk && clerk.BlobsPhotoFk) {
									const blobs = self.getBlobs();
									for (let j = 0; j < blobs.length; j++) {
										if (blobs[j].Id === clerk.BlobsPhotoFk) {
											blob = blobs[j];
											break;
										}
									}
								}
							}

							return blob ? '<img class="circle" alt="" src="' + basicsCommonUtilities.toImage(blob.Content) + '" />' : '<div class="circle control-icons ico-user-default"></div>';
						}
					},
					{
						id: 'header',
						field: 'Comment.ClerkFk',
						converter: function (field, value) {
							let clerk = value;
							if (self.loginClerk.Clerk && self.loginClerk.Clerk.Id === value) {
								clerk = self.loginClerk.Clerk;
							} else {
								const clerks = self.getClerks();
								for (let i = 0; i < clerks.length; i++) {
									if (clerks[i].Id === value) {
										clerk = clerks[i];
										break;
									}
								}
							}
							return clerk && clerk.Description ? clerk.Description : clerk && clerk.Code ? clerk.Code : '';
						}
					},
					{
						id: 'body',
						field: 'Comment.Comment'
					},
					{
						id: 'date',
						field: 'Comment.InsertedAt'
					}
				];

				if (options.columns) {
					self.columns = _.merge(self.columns, options.columns);
				}

				if (options.statusOptions) {
					self.statusOptions = options.statusOptions;
				}

				self.isLoading = false;

				self.getRootCount = function () {
					if (!angular.isNumber(self.data.RootCount) || _.isNaN(self.data.RootCount)) {
						self.data.RootCount = 0;
					}

					return self.data.RootCount;
				};

				self.updateRootCount = function (value) {
					if (!angular.isNumber(self.data.RootCount) || _.isNaN(self.data.RootCount)) {
						self.data.RootCount = 0;
					}

					return self.data.RootCount += value;
				};

				self.getComments = function () {
					if (!angular.isArray(self.data[options.entityName ? options.entityName : 'Comments'])) {
						self.data[options.entityName ? options.entityName : 'Comments'] = [];
					}

					return self.data[options.entityName ? options.entityName : 'Comments'];
				};
				self.IsReadonlyStatus = false;
				self.getSelectedParentItemStatus = function () {
					return self.IsReadonlyStatus;
				};

				self.getParentItem = function getParentItem() {
					return self.parentDataService.getSelected();
				};

				self.getClerks = function () {
					if (!angular.isArray(self.data.Clerks)) {
						self.data.Clerks = [];
					}

					return self.data.Clerks;
				};

				self.getBlobs = function () {
					if (!angular.isArray(self.data.Blobs)) {
						self.data.Blobs = [];
					}

					return self.data.Blobs;
				};

				self.loginClerkHttp = function () {
					return $http.get(globals.webApiBaseUrl + 'basics/common/comment/loginclerkinfo');
				};

				self.lastHttp = function (parentItem) {
					const data = {
						Qualifier: self.qualifier,
						ParentItemId: self.getParentId(parentItem)
					};
					if (options.PKey1) {
						data.ParentItemId2 = parentItem[options.PKey1];
					}
					if (options.UserDefinedText1) {
						data.UserDefinedText1 = parentItem[options.UserDefinedText1];
					}
					return $http.post(options.lastUrl ? options.lastUrl : globals.webApiBaseUrl + 'basics/common/comment/last', data)
						.then(function (response) {
							const dataSource = response.data[options.entityName ? options.entityName : 'Comments'];
							setIsShow(dataSource);
							return response;
						});
				};

				self.remainHttp = function (parentItemId, parentCommentId) {
					const data = {
						Qualifier: self.qualifier,
						ParentItemId: parentItemId,
						ParentCommentId: parentCommentId
					};
					return $http.post(options.remainUrl ? options.remainUrl : globals.webApiBaseUrl + 'basics/common/comment/remain', data)
						.then(function (response) {
							const dataSource = response.data[options.entityName ? options.entityName : 'Comments'];
							setIsShow(dataSource);
							return response;
						});
				};

				self.createHttp = function (data) {
					data.Qualifier = self.qualifier;
					const defer = $q.defer();

					function getServiceWithUpdate(service) {
						let max = 0;
						// find the update method on the rootItem
						for (; ;) {
							if (_.isFunction(service.update) || service.isRoot || max > 10) {
								break;
							}
							// chinese generic services have a getService Method
							service = service.parentService ? service.parentService() : service.getService().parentService();
							max++;
						}
						return service;
					}

					function sendCreate() {
						if (!_.isInteger(data.StatusIconFk)) {
							data.StatusIconFk = 0;
						}
						$http.post(options.createUrl ? options.createUrl : globals.webApiBaseUrl + 'basics/common/comment/createcomment', data).then(function (data) {
							defer.resolve(data);
						});
					}

					if (options.saveParentBefore && self.getParentItem().Version === 0) {
						// update before
						getServiceWithUpdate(self.parentDataService).update().then(function () {
							data.IsParentItemNew = false;
							sendCreate();
						});

					} else {
						sendCreate();
					}

					return defer.promise;
				};

				self.deleteHttp = function deleteHttp(parentItemId, commentDataIdToDelete, commentIdToDelete) {
					const data = {
						Qualifier: self.qualifier,
						ParentItemId: parentItemId,
						CommentDataIdToDelete: commentDataIdToDelete,
						CommentIdToDelete: commentIdToDelete
					};
					return $http.post(options.deleteUrl ? options.deleteUrl : globals.webApiBaseUrl + 'basics/common/comment/deletecomment', data);
				};

				self.clear = function () { // note that must reset the state of the data service.
					// restore current page.
					self.pageNum = 1;
					// clear data.
					self.data = {};
					self.dataToSave = [];
					// clear data on view.
					self.onDataRefresh.fire();
				};

				self.load = function () {
					const parentItem = self.getParentItem();

					self.clear();

					if (parentItem && angular.isDefined(self.getParentId(parentItem))) {
						self.isLoading = true;
						self.lastHttp(parentItem).then(function (response) {
							self.isLoading = false;
							self.IsReadonlyStatus = parentItem.IsReadonlyStatus;
							self.data = response.data;
							self.onDataRefresh.fire();
						});
					}
				};

				self.create = function (comment, parent, iconFk) {
					const defer = $q.defer(),
						parentItem = self.getParentItem();
					if (parentItem && angular.isDefined(self.getParentId(parentItem))) {
						const data = {
							ParentItemId: self.getParentId(parentItem),
							Comment: comment,
							ParentCommentId: parent && parent.Comment ? parent.Comment.Id : (parent && parent.Id) ? parent.Id : null,
							IsParentItemNew: !parentItem.Version,
							StatusIconFk: iconFk
						};
						if (options.PKey1) {
							data.ParentItemId2 = parentItem[options.PKey1];
						}
						if (options.UserDefinedText1) {
							data.UserDefinedText1 = parentItem[options.UserDefinedText1];
						}
						if (comment) {
							self.isLoading = true;
							self.createHttp(data).then(function (response) {
								const newItem = response.data;
								if (newItem.IsNew) {
									self.dataToSave.push(newItem);
								}
								defer.resolve(newItem);
								self.isLoading = false;

								if (parent) {
									parent.ChildCount++;
								} else {
									if (!angular.isNumber(self.data.RootCount) || _.isNaN(self.data.RootCount)) {
										self.data.RootCount = 0;
									}
									self.data.RootCount++;
								}
							});
						}
					} else {
						defer.resolve(null);
					}
					return defer.promise;
				};

				self.delete = function (commentData) {
					const defer = $q.defer();
					if (commentData.IsNew) {
						if (angular.isArray(self.dataToSave)) {
							_.remove(self.dataToSave, {Id: commentData.Id});
						}
						defer.resolve(commentData);
						return defer.promise;
					}
					const parentItem = self.getParentItem();
					if (parentItem && angular.isDefined(self.getParentId(parentItem)) && commentData) {
						self.deleteHttp(self.getParentId(parentItem), commentData.Id, commentData.CommentFk).then(function () {
							defer.resolve(null);
						});
					} else {
						defer.resolve(null);
					}
					return defer.promise;
				};

				self.viewDetail = function (parent) {
					let parentCommentId = null;
					let dataSource = [];
					const clerks = self.getClerks();
					const blobs = self.getBlobs();
					const parentItem = self.getParentItem();

					if (parent) {
						parentCommentId = parent && parent.Comment ? parent.Comment.Id : (parent && parent.Id) ? parent.Id : null;
						dataSource = parent.Children;
					} else {
						dataSource = self.getComments();
					}

					const oldItems = dataSource.filter(function (item) {
						return !item.IsNew;
					});
					const length = parent ? parent.ChildCount : self.getRootCount();

					if (dataSource.length === length) {
						_.forEach(oldItems, function (item) {
							item.isShow = true;
						});
						self.onDataRefresh.fire();
						return;
					}

					self.isLoading = true;
					self.remainHttp(self.getParentId(parentItem), parentCommentId).then(function (response) {
						self.isLoading = false;
						const commentList = response.data[options.entityName ? options.entityName : 'Comments'];
						const clerkList = response.data.Clerks;
						const blobList = response.data.Blobs;
						const diffComments = _.differenceBy(commentList, dataSource, 'Id');
						const diffClerks = _.differenceBy(clerkList, clerks, 'Id');
						const diffBlobs = _.differenceBy(blobList, blobs, 'Id');
						$.merge(dataSource, diffComments);
						$.merge(clerks, diffClerks);
						$.merge(blobs, diffBlobs);
						self.onDataRefresh.fire();
					});
				};

				self.viewPartialLast = function (parent, sortByDate) {
					if (!angular.isFunction(sortByDate)) {
						return;
					}

					let dataSource;
					if (parent) {
						dataSource = parent.Children;
					} else {
						dataSource = self.getComments();
					}

					dataSource = sortByDate(dataSource);
					const lastViewCount = !parent ? 5 : 3;
					const length = dataSource.length;
					let index = 0;
					_.forEach(dataSource, function (item) {
						item.isShow = length - index++ <= lastViewCount;
					});

					self.onDataRefresh.fire(_.filter(dataSource, function (item){
						return item.isShow;
					}));
				};

				self.detailInfo = function (parent) {
					const result = {
						visible: false,
						count: 0,
						action: self.viewDetail
					};

					let showItems = [];

					if (parent) {
						if (angular.isArray(parent.Children)) {

							showItems = parent.Children.filter(function (item) {
								return item.isShow;
							});

							if (showItems.length < parent.ChildCount) {
								result.visible = true;
								result.count = parent.ChildCount;
							} else {
								result.action = self.viewPartialLast;
							}
						}
					} else {
						const roots = self.getComments();
						const rootLength = self.getRootCount();

						showItems = roots.filter(function (item) {
							return item.isShow;
						});

						if (showItems.length < rootLength) {
							result.visible = true;
							result.count = rootLength;
						} else {
							result.action = self.viewPartialLast;
						}
					}

					return result;
				};

				self.loading = function () {
					return self.isLoading;
				};

				self.revertProcessItems = function () {
				};
				self.cleanUpLocalData = function () {
				};
				self.mergeInUpdateData = function () {
				};
				self.parentDataService.registerChildService(self);

				// ALM 127888 -> comment service is non-standard but register into parent service that is create from standard data factory, so just define the below missing function as workaround.
				self.reduceTreeStructuresInUpdateData = angular.noop;

				self.provideUpdateData = function (updateData) {
					if (self.dataToSave.length > 0) {
						if (!angular.isArray(updateData[self.itemName])) {
							updateData[self.itemName] = [];
						}
						_.forEach(self.dataToSave, function (item) {
							updateData[self.itemName].push(item);
						});
						updateData.EntitiesCount += self.dataToSave.length;
						self.dataToSave.length = 0;
					}
				};

				self.refreshLoginClerk = function () {
					self.loginClerkHttp().then(function (response) {
						self.loginClerk = response.data;
					});
				};

				self.killRunningLoad = function () {

				};

				self.loadSubItemList = function () {

				};

				function handleChildren(children, action) {
					if (angular.isArray(children) && children.length > 0) {
						_.forEach(children, function (child) {
							if (angular.isFunction(action)) {
								action(child);
							}
							handleChildren(child.Children, action);
						});
					}
				}

				function setIsShow(comments) {
					if (!angular.isArray(comments) || comments.length === 0) {
						return;
					}
					_.forEach(comments, function (item) {
						item.isShow = true;
						handleChildren(item.Children, function (child) {
							child.isShow = true;
						});
					});
				}

				self.parentDataService.registerSelectionChanged(self.load);

				self.parentDataService.registerSelectionChanged(self.refreshLoginClerk);

				self.parentDataService.registerListLoaded(function (list) {
					if (!list) {
						self.clear();
					}
				});

				// refresh login clerk.
				cloudDesktopSidebarService.onExecuteSearchFilter.register(self.refreshLoginClerk);

				self.refreshLoginClerk();

				self.load();
			}

			service.get = function (qualifier, parentDataServiceName, options) {
				const cacheName = qualifier + parentDataServiceName;
				if (!serviceCache[cacheName]) {
					serviceCache[cacheName] = new CommentDataService(qualifier, parentDataServiceName, options);
				}
				return serviceCache[cacheName];
			};

			service.clearFromCache = function (qualifier, parentDataServiceName) {
				const cacheName = qualifier + parentDataServiceName;
				if (serviceCache[cacheName]) {
					serviceCache[cacheName] = null;
				}
			};

			return service;
		}
	]);

})(angular);
