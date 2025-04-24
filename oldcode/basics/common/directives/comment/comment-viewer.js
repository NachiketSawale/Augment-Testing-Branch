/**
 * Created by wui on 12/10/2014.
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	/* jshint -W072 */ // has too many parameters.
	angular.module(moduleName).directive('basicsCommonCommentViewer', ['$translate', '$compile', '$rootScope', 'keyCodes', 'platformObjectHelper', 'platformModalService', 'PlatformMessenger', '_', 'platformCreateUuid', 'globals', '$',
		function ($translate, $compile, $rootScope, keyCodes, platformObjectHelper, platformModalService, PlatformMessenger, _, platformCreateUuid, globals, $) {

			const mediaHtml = '<div class="media"></div>';
			const mediaObjectHtml = '<div class="pull-left"></div>';

			const headerContainerHtml = '<div class="flex-box"></div>';
			const headerInnerContainerHtml = '<div class="message-header"></div>';
			const groupButton = '<div class="input-group-btn action-btn"></div>';
			const actionButton = '<button class="btn control-icons ico-comment"></button>';
			const deleteButton = '<button class="btn tlb-icons ico-delete2"></button>';
			const headerHtml = '<span class="title"></span>';
			// text next to header
			const dateHtml = '<span> | </span>';

			const bodyHtml = '<div class="message-body"></div>';

			const mediaBodyHtml = '<div class="media-body"></div>';
			const footerHtml = '<div class="message-footer"></div>';
			// var commentBtn = '<a class="media-btn cursor-pointer">Comment</a>';

			const detailHtml = '<div class="comment-interval cursor-pointer"></div>';
			const statusContainer = '<span class="comment-status"></span>';

			const defaults = {
				pageSize: 10,
				pageNum: 1,
				parentProp: '',
				childProp: '',
				dateProp: '',
				// trunkSize: 64,
				// leafSize: 49,
				editorLock: new CommentEditorLock(),
				editor: null,
				ngScope: null,
				objectHelper: null,
				detail: {
					visible: false,
					count: 0,
					action: null
				}
			};

			function CommentViewer(container, data, columns, options) {
				this.container = container;
				this.data = data;
				this.columns = columns;
				this.options = {};
				this.dataLength = 0;
				this.onTotalItemsChanged = new PlatformMessenger();
				this.onPageNumChanged = new PlatformMessenger();
				this.onDestroy = new PlatformMessenger();
				this.init(options);
			}

			CommentViewer.prototype.init = function (options) {
				const self = this;

				$.extend(self.options, defaults, options);
				self.registerEvents();
				self.totalItems(self.count(self.data));
				self.render(self.data);
			};

			CommentViewer.prototype.registerEvents = function () {
				const self = this, eConfigArray = self.options.events;

				if (angular.isArray(eConfigArray)) {
					eConfigArray.forEach(function (eConfig) {
						const event = self[eConfig.name];
						if (event && event.register) {
							event.register(eConfig.handler);
						}
					});
				}
			};

			CommentViewer.prototype.getValue = function (entity, field) {
				const self = this;

				if (self.options.objectHelper) {
					return self.options.objectHelper.getValue(entity, field);
				} else {
					return entity[field];
				}
			};

			CommentViewer.prototype.setValue = function (entity, field, value) {
				const self = this;

				if (self.options.objectHelper) {
					self.options.objectHelper.setValue(entity, field, value);
				} else {
					entity[field] = value;
				}
			};

			CommentViewer.prototype.transferTo = function (page) {
				const self = this;

				self.pageNum(page);
				self.render(self.data);
			};

			CommentViewer.prototype.navigateTo = function (dataItem) {
				const self = this;
				const state = {exist: false, index: -1};
				const equal = function (left, right) {
					return left === right;
				};
				const search = function (target, state) {
					if (!target.isShow) {
						return;
					}
					state.index++;
					state.exist = equal(target, dataItem);

					if (state.exist === true) {
						return;
					}

					const children = self.getValue(target, self.options.childProp);

					if (angular.isArray(children)) {
						for (let k = 0; k < children.length; k++) {
							search(children[k], state);
							if (state.exist === true) {
								break;
							}
						}
					}
				};

				for (let i = 0; i < self.data.length; i++) {
					search(self.data[i], state);
					if (state.exist === true) {
						self.transferTo(Math.ceil((state.index + 1) / self.options.pageSize));
						const media = self.container.find('.media[cid=' + state.index + ']');
						if (media.length > 0) {
							media[0].scrollIntoView(false); // make this comment visible on ui.
						}
						break;
					}
				}
			};

			CommentViewer.prototype.addItem = function (newItem, parent) {
				const self = this;
				let targetArr;

				if (parent) {
					targetArr = self.getValue(parent, self.options.childProp);

					if (!angular.isArray(targetArr)) {
						targetArr = [];
						self.setValue(parent, self.options.childProp, targetArr);
					}
				} else {
					targetArr = self.data;
				}

				const items = self.dataLength + 1;

				newItem.isShow = true;
				targetArr.push(newItem);
				self.totalItems(items);
				self.navigateTo(newItem);
			};

			CommentViewer.prototype.deleteItems = function (deleteItem) {
				const self = this;
				const data = self.data;
				let parent = null;

				if (data.length > 0) {
					parent = deleteItems(data, deleteItem);
				}

				self.totalItems(self.count(data));
				if (data.length === 0) {
					self.container.empty();
				} else {
					self.navigateTo(parent ? parent : data[0]);
				}

				// ////////////////////////////////////
				function deleteItems(items, deleteItem, parent) {
					let found = null;
					let newParent = null;
					let previous = null;
					for (let k = 0; k < items.length; ++k) {
						const oriItem = items[k];

						if (oriItem.Id === deleteItem.Id) {
							found = oriItem;
							break;
						}

						previous = oriItem;
						let children = self.getValue(oriItem, self.options.childProp);
						if (!angular.isArray(children)) {
							children = [];
							self.setValue(oriItem, self.options.childProp, children);
						}
						if (children.length > 0) {
							newParent = deleteItems(children, deleteItem, oriItem);
						}
					}

					if (found) {
						_.remove(items, {Id: found.Id});
						found = null;
						if (parent) {
							parent.ChildCount--;
							newParent = parent;
						} else {
							self.options.ngScope.updateRootCount(-1);
							newParent = previous;
						}
					}

					return newParent;
				}
			};

			CommentViewer.prototype.totalItems = function (newValue) {
				const self = this;
				const oldValue = self.dataLength;

				if (oldValue === newValue) {
					return;
				}

				self.dataLength = newValue;
				self.fire(self.onTotalItemsChanged, {
					oldValue: oldValue,
					newValue: newValue
				});
			};

			CommentViewer.prototype.pageNum = function (newValue) {
				const self = this;
				const oldValue = self.options.pageNum;

				if (oldValue === newValue) {
					return;
				}

				self.options.pageNum = newValue;
				self.fire(self.onPageNumChanged, {
					oldValue: oldValue,
					newValue: newValue
				});
			};

			CommentViewer.prototype.fire = function (event, args) {
				const self = this;
				const fire = function () {
					event.fire(event, args);
				};

				if (!args) {
					args = {};
				}
				$.extend(args, {viewer: self});

				if (!self.options || !self.options.ngScope) {
					fire();
				} else {
					const ngScope = self.options.ngScope;

					if (ngScope.$root.$$phase) {
						fire();
					} else {
						ngScope.$apply(fire);
					}
				}
			};

			CommentViewer.prototype.refresh = function (options) {
				const self = this;

				$.extend(self.options, options);
				self.render(self.data);
			};

			CommentViewer.prototype.setData = function (data, parentStatus) {
				const self = this;

				self.data = data;
				self.totalItems(self.count(self.data));
				self.IsReadonlyStatus = parentStatus;
				if (self.options.showLastComments) {
					const lastPageNum = Math.ceil(self.dataLength / self.options.pageSize);
					self.pageNum(lastPageNum);
				}
				self.render(self.data);
			};

			CommentViewer.prototype.getData = function () {
				return this.data;
			};

			CommentViewer.prototype.setColumns = function (columns) {
				this.columns = columns;
			};

			CommentViewer.prototype.getColumns = function () {
				return this.columns;
			};

			CommentViewer.prototype.renderContext = function () {
				const self = this;
				const length = self.dataLength;
				const pageSize = self.options.pageSize;
				let pageNum = self.options.pageNum;
				const pages = Math.ceil(length / pageSize);

				if (pageNum < 1) {
					pageNum = 1;
				} else if (pageNum > pages) {
					pageNum = pages;
				}

				const start = pageSize * (pageNum - 1) - 1;
				const end = start + pageSize;

				return {
					index: -1,
					start: start,
					end: end
					// tSize: self.options.trunkSize,
					// lSize: self.options.leafSize
				};
			};

			CommentViewer.prototype.render = function (treeList) {
				const self = this;
				const context = self.renderContext();
				let lastChild = null;

				self.container.empty();

				if (!angular.isArray(treeList)) {
					return;
				}

				self.sortByDate(treeList).forEach(function (dataItem) {
					if (dataItem.isShow) {
						lastChild = self.renderItem(self.container, context, dataItem, 0);
					}
				});
				self.buildDetail(lastChild);

				let scrollTop = 0;
				if (self.options.showLastComments && self.container[0]) {
					scrollTop = self.container[0].scrollHeight;
				}
				self.container.scrollTop(scrollTop);
			};

			CommentViewer.prototype.sortByDate = function (data) {
				const self = this;

				const tempData = _.sortBy(data, function (item) {
					const x = self.getValue(item, self.options.dateProp);
					return Date.parse(x);
				});
				_.remove(data);
				$.merge(data, tempData);

				return data;
			};

			CommentViewer.prototype.renderItem = function (container, context, dataItem, level) {
				const self = this;
				const options = self.options;
				const children = self.getValue(dataItem, options.childProp);
				let childContainer = null;
				let media = null;
				let lastChild = null;

				++context.index;

				if (context.index > context.end) {
					return;
				}

				if (context.index > context.start) {
					// var sizeCls = {};

					media = self.buildMedia(dataItem).attr('cid', context.index);
					childContainer = media.find('.media-body');

					if (!container) {
						container = self.container;

						// var marginLeft = context.tSize + context.lSize * (level - 1);
						// media.css({marginLeft: marginLeft + 'px'});
					}

					// if (level > 0) {
					// sizeCls.width = sizeCls.height = context.lSize + 'px';
					// }
					// else {
					// sizeCls.width = sizeCls.height = context.tSize + 'px';
					// }

					// media.find('.pull-left').css(sizeCls);
					container.append(media);
				}

				if (angular.isArray(children)) {
					self.sortByDate(children).forEach(function (child) {
						if (child.isShow) {
							lastChild = self.renderItem(childContainer, context, child, level + 1);
						}
					});
					self.buildDetail(lastChild, dataItem);
				}

				return media;
			};

			CommentViewer.prototype.buildMedia = function (dataItem) {
				const self = this;
				/*
				 Assembling various containers.
				 HTML-Markup:
				 <div class="media">
				 <div class="pull-left"><div class="circle control-icons ico-user-default"></div></div>
				 <div class="media-body">
				 <div class="flex-box">
				 <div class="message-header"><span class="title">titel</span><span> | second desc </span></div>
				 <div class="input-group-btn action-btn"><button class="btn control-icons ico-comment"></button></div>
				 </div>
				 <div class="message-body"> text </div>
				 <div class="message-footer"></div>
				 </div>
				 </div>
				 */

				const media = $(mediaHtml);
				const mediaObject = $(mediaObjectHtml).appendTo(media);
				const mediaBody = $(mediaBodyHtml).appendTo(media);
				const headerContainer = $(headerContainerHtml).appendTo(mediaBody);
				const headerInnerContainer = $(headerInnerContainerHtml).appendTo(headerContainer);

				const status = $(statusContainer).appendTo(headerInnerContainer);
				const header = $(headerHtml).appendTo(headerInnerContainer);

				const date = $(dateHtml).appendTo(headerInnerContainer);
				const groupBtn = $(groupButton).appendTo(headerContainer);
				const actionBtn = $(actionButton).appendTo(groupBtn);
				const deleteBtn = $(deleteButton).appendTo(groupBtn);

				// var header = $(headerHtml).appendTo(mediaBody);
				// var date = $(dateHtml).appendTo(mediaBody);
				const body = $(bodyHtml).appendTo(mediaBody);

				const footer = $(footerHtml).appendTo(mediaBody);

				actionBtn.click(function () {
					const editorLock = self.options.editorLock;
					const editor = self.options.editor;
					const comment = {
						element: footer, // insert html-markup after element
						editor: editor,
						model: dataItem,
						scope: self.options.ngScope
					};

					editorLock.create(comment);

				});

				deleteBtn.click(function () {
					if (!dataItem.CanDelete) {
						return;
					}
					self.options.ngScope.delete(dataItem);
				});

				deleteBtn.attr('disabled', function () {
					return !dataItem.CanDelete || (!dataItem.CanCascadeDelete && dataItem.Children && dataItem.Children.length) || self.IsReadonlyStatus || isDisabled(self.options.ngScope);
				});

				actionBtn.attr('disabled', function () {
					return self.IsReadonlyStatus || isDisabled(self.options.ngScope);
				});

				function isDisabled(scope) {
					let readonly = false;
					let parentScope = scope.$parent;
					while (parentScope) {
						if (parentScope.isReadOnly) {
							readonly = parentScope.isReadOnly();
							break;
						} else
							parentScope = parentScope.$parent;
					}
					return readonly;
				}

				// footer.bind('mouseenter', function () {
				// var editorLock = self.options.editorLock;
				// var editor = self.options.editor;
				// var comment = {
				// element: footer, //insert html-markup after element
				// editor: editor,
				// model: dataItem
				// };
				// var btn = $(commentBtn);
				//
				// btn.bind('click', function () {
				// editorLock.create(comment);
				// });
				//
				// footer.append(btn);
				// footer.bind('mouseleave', function () {
				// btn.remove();
				// footer.unbind('mouseleave');
				// });
				// });

				self.columns.forEach(function (col) {
					let value = self.getValue(dataItem, col.field);
					let appendTarget = null;

					if (col.converter) {
						value = col.converter(col.field, value, dataItem);
					} else if (col.field === self.options.dateProp) {
						if (angular.isString(value)) {
							value = new Date(value);
						}
						value = value.toLocaleDateString() + ' at ' + value.toLocaleTimeString();
					}

					if (value && !angular.isString(value)) {
						value = value.toString();
					}

					switch (col.id) {
						case 'indicator':
							appendTarget = mediaObject;
							break;
						case 'header':
							appendTarget = header;
							break;
						case 'body':
							appendTarget = body;
							break;
						case 'footer':
							appendTarget = footer;
							break;
						case 'date':
							appendTarget = date;
							break;
						case 'status':
							appendTarget = status;
							break;
					}
					if (appendTarget !== null) {
						appendTarget.append(value);
					}

				});

				return media;
			};

			CommentViewer.prototype.buildDetail = function (lastChild, parent) {
				const self = this;

				if (!lastChild || !self.options.detail) {
					return;
				}

				const detail = self.options.detail(parent);
				const visible = detail.visible;
				const count = detail.count;
				const action = detail.action;

				if (visible) {
					let translateViewAll = $translate.instant('basics.common.pinboardLog.viewAll', {count: count});
					const element = $(detailHtml).append('<a>'+translateViewAll+'</a>');

					element.bind('click', function () {
						action(parent);
						element.remove();
					});

					lastChild.after(element);
				} else {
					if((parent&&parent.ChildCount>3)||(!parent&&self.data.length>5))
					{
						let  translateShowLatest = $translate.instant('basics.common.pinboardLog.showLatest');
						const element2 = $(detailHtml).append('<a>'+translateShowLatest+'</a>');
						element2.bind('click', function () {
							action(parent, function (source) {
								if (!source) {
									return source;
								}
								return self.sortByDate.apply(self, [source]);
							});
							element2.remove();
						});
						lastChild.after(element2);
					}
				}
			};

			/* jshint -W083 */ // just follow Array api.
			CommentViewer.prototype.count = function (data) {
				const self = this;
				let length = 0;
				const queue = [];

				if (angular.isArray(data)) {
					data.forEach(function (item) {
						if (item.isShow) {
							queue.push(item);
						}
					});

					while (queue.length > 0) {
						const firstItem = queue.shift();
						const children = self.getValue(firstItem, self.options.childProp);

						length++;

						if (angular.isArray(children)) {
							children.forEach(function (child) {
								if (child.isShow) {
									queue.push(child);
								}
							});
						}
					}
				}

				return length;
			};

			CommentViewer.prototype.destroy = function () {
				const self = this;

				self.fire(self.onDestroy);
				self.options.editorLock.destroy();
			};

			function CommentEditorLock() {
				this.editor = null; // comment editor instance.
				this.parentModel = null; // model of parent comment.
			}

			CommentEditorLock.prototype.init = function () {

			};

			CommentEditorLock.prototype.destroy = function () {
				this.drop();
			};

			CommentEditorLock.prototype.drop = function () {
				if (this.editor) {
					this.editor.destroy();
					this.editor = null;
					this.parentModel = null;
				}
			};

			CommentEditorLock.prototype.create = function (args) {
				const self = this,
					oldModel = self.parentModel;

				self.drop();

				if (args.model === oldModel) {
					return;
				}

				if (args.editor) {
					self.editor = new args.editor(args);
					self.parentModel = args.model;
				}
			};

			const directiveDefaults = {
				data: [],
				columns: [],
				parentProp: '',
				childProp: '',
				dateProp: '',
				pageSize: 10,
				pageNum: 1,
				ready: null,
				create: null,
				detail: null,
				loading: null
			};

			const editorTemplate = '<div class="comment-interval" data-basics-common-comment-editor data-ng-model="leafComment" data-status-options="statusOptions" data-submit="submit()" data-init="init()"></div>';

			return {
				restrict: 'A',
				replace: true,
				scope: {
					options: '=basicsCommonCommentViewer',
					disabled: '='
				},
				templateUrl: globals.appBaseUrl + 'basics.common/templates/comment-viewer.html',
				link: function ($scope, $element) {
					const settings = $.extend({}, directiveDefaults, $scope.options),
						container = $element.find('.comment-view'),
						options = {
							pageNum: settings.pageNum,
							pageSize: settings.pageSize,
							parentProp: settings.parentProp,
							childProp: settings.childProp,
							dateProp: settings.dateProp,
							editor: CommentEditor,
							ngScope: $scope,
							objectHelper: platformObjectHelper,
							detail: settings.detail,
							events: [
								{
									name: 'onTotalItemsChanged',
									handler: onTotalItemsChanged
								},
								{
									name: 'onPageNumChanged',
									handler: onPageNumChanged
								}
							],
							showLastComments: !!settings.showLastComments
						};

					$scope.totalItems = 0;

					$scope.trunkComment = '';

					$scope.config = settings;

					const viewer = new CommentViewer(container, settings.data, settings.columns, options);

					$scope.submit = function () {
						const statusValue = $scope.options.statusOptions ? $scope.options.statusOptions.viewValue : null;
						settings.create($scope.trunkComment, null, statusValue).then(function (newItem) {
							if (newItem) {
								viewer.addItem(newItem);
							}
						});
					};

					$scope.onPageChange = function (newValue) {
						viewer.transferTo(newValue);
					};

					$scope.showPager = function () {
						return $scope.totalItems > settings.pageSize;
					};

					$scope.IsReadonlyStatus = function () {
						return $scope.options.IsReadonlyStatus;
					};

					$scope.preview = function (event) {
						if ($(event.target).is('img.comment-image')) {
							const modalOptions = {
								width: '800px',
								height: '600px',
								scope: $scope,
								template: '<div data-basics-common-image-preview data-image="image" class="flex-element flex-box flex-column overflow-hidden"></div>',
								resizeable: true,
								headerText: $translate.instant('basics.common.button.preview')
							};

							$scope.image = event.target;
							platformModalService.showDialog(modalOptions);
						}
					};

					$scope.loading = function () {
						if (angular.isFunction($scope.config.loading)) {
							return $scope.config.loading();
						} else {
							return false;
						}
					};

					$scope.delete = function (comment) {
						settings.delete(comment).then(function () {
							viewer.deleteItems(comment);
						});
					};

					$scope.updateRootCount = function (value) {
						settings.updateRootCount(value);
					};

					$scope.$on('$destroy', onScopeDestroy);

					if (angular.isFunction(settings.ready)) {
						settings.ready(viewer);
					}

					function onTotalItemsChanged(e, args) {
						$scope.totalItems = args.newValue;
					}

					function onPageNumChanged(e, args) {
						settings.pageNum = args.newValue;
					}

					function onScopeDestroy() {
						viewer.destroy();
					}

					function CommentEditor(args) {
						let element = null;
						// angular.element().scope() will return undefined if disable debug info to angular.
						const scope = args.scope.$new(true);
						if (args.scope.options && args.scope.options.statusOptions) {
							scope.statusOptions = _.cloneDeep(args.scope.options.statusOptions);
							scope.statusOptions.groupName = platformCreateUuid();
							scope.statusOptions.viewValue = scope.statusOptions.statusViewValueHandler(args.model);
						}

						this.init = function () {
							this.prepare(scope);
							element = $compile(editorTemplate)(scope);
							args.element.after(element);
						};

						this.prepare = function (scope) {
							const self = this;

							scope.leafComment = '';

							scope.submit = function () {
								self.apply();
							};

							scope.init = function () {
								element.find('.comment-text-area').focus();
							};
						};

						this.apply = function () {
							const self = this;

							settings.create(scope.leafComment, args.model, scope.statusOptions ? scope.statusOptions.viewValue : null).then(function (newItem) {
								viewer.addItem(newItem, args.model);
								self.destroy();
							});
						};

						this.destroy = function () {
							scope.$destroy();
							element.remove();
						};

						this.init();
					}
				}
			};

		}
	]);

})(angular);