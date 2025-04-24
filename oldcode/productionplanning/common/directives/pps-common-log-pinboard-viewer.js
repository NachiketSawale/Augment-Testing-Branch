(function () {
	'use strict';
	/*global angular, $, globals*/

	var moduleName = 'productionplanning.common';

	/*jshint -W072*/ // has too many parameters.
	angular.module(moduleName).directive('ppsCommonLogPinboardViewer', [
		'$compile', '$rootScope', 'keyCodes', 'platformObjectHelper',
		'platformModalService', 'PlatformMessenger', '_', 'platformCreateUuid',
		'$translate',
		function ($compile, $rootScope, keyCodes, platformObjectHelper,
		          platformModalService, PlatformMessenger, _, platformCreateUuid,
		          $translate) {

			var mediaHtml = '<div class="media" style="clear:left;"></div>';
			var mediaObjectHtml = '<div class="pull-left"></div>';

			var headerContainerHtml = '<div class="flex-box"></div>';
			var headerInnerContainerHtml = '<div class="message-header"></div>';
			var groupButton = '<div class="input-group-btn action-btn"></div>';
			var actionButton = '<button class="btn control-icons ico-comment"></button>';
			var deleteButton = '<button class="btn tlb-icons ico-delete2"></button>';
			var headerHtml = '<span class="title"></span>';
			//text next to header
			var dateHtml = '<span> | </span>';

			var bodyHtml = '<div class="message-body" style="float: left"></div>';
			var logCodeHtml = '<div id="logCodeHtml"></div>';
			var logChgDetailHtml = '<div id="logChgDetailHtml"></div>';
			var logColumnHtml = '<span id="logColumnHtml" style="color: red;margin-right: 8px;"></span>';
			var logOldValueHtml = '<span id="logOldValueHtml"></span>';
			var logSymbolToHtml = '<span id="logSymbolTo" style="margin: 3px;">&rarr;</span>';
			var logNewValueHtml = '<span id="logNewValueHtml"></span>';
			var logCommentHtml = '<div id="logCommentHtml"></div>';
			var logReasonHtml = '<span id="logReasonHtml" style="margin-right: 2px;"></span>';
			var logRemarkHtml = '<span id="logRemarkHtml"></span>';
			var logSymbolManualHtml = '<span id="logSymbolManual"></span>';

			var mediaBodyHtml = '<div class="media-body" style="font-family: none;"></div>';
			var footerHtml = '<div class="message-footer"></div>';
			//var commentBtn = '<a class="media-btn cursor-pointer">Comment</a>';

			var detailHtml = '<div class="comment-interval cursor-pointer" style="clear: left;margin-top: 50px"></div>';
			var statusContainer = '<span class="comment-status"></span>';

			var defaults = {
				pageSize: 10,
				pageNum: 1,
				parentProp: '',
				childProp: '',
				dateProp: '',
				//trunkSize: 64,
				//leafSize: 49,
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
				var self = this;

				$.extend(self.options, defaults, options);
				self.registerEvents();
				self.totalItems(self.count(self.data));
				self.render(self.data);
			};

			CommentViewer.prototype.registerEvents = function () {
				var self = this, eConfigArray = self.options.events;

				if (angular.isArray(eConfigArray)) {
					eConfigArray.forEach(function (eConfig) {
						var event = self[eConfig.name];
						if (event && event.register) {
							event.register(eConfig.handler);
						}
					});
				}
			};

			CommentViewer.prototype.getValue = function (entity, field) {
				var self = this;

				if (self.options.objectHelper) {
					return self.options.objectHelper.getValue(entity, field);
				} else {
					return entity[field];
				}
			};

			CommentViewer.prototype.setValue = function (entity, field, value) {
				var self = this;

				if (self.options.objectHelper) {
					self.options.objectHelper.setValue(entity, field, value);
				} else {
					entity[field] = value;
				}
			};

			CommentViewer.prototype.transferTo = function (page) {
				var self = this;

				self.pageNum(page);
				self.render(self.data);
			};

			CommentViewer.prototype.navigateTo = function (dataItem) {
				var self = this;
				var state = {exist: false, index: -1};
				var equal = function (left, right) {
					return left === right;
				};
				var search = function (target, state) {
					if (!target.isShow) {
						return;
					}
					state.index++;
					state.exist = equal(target, dataItem);

					if (state.exist === true) {
						return;
					}

					var children = self.getValue(target, self.options.childProp);

					if (angular.isArray(children)) {
						for (var k = 0; k < children.length; k++) {
							search(children[k], state);
							if (state.exist === true) {
								break;
							}
						}
					}
				};

				for (var i = 0; i < self.data.length; i++) {
					search(self.data[i], state);
					if (state.exist === true) {
						self.transferTo(Math.ceil((state.index + 1) / self.options.pageSize));
						var media = self.container.find('.media[cid=' + state.index + ']');
						if (media.length > 0) {
							media[0].scrollIntoView(true); // make this comment visible on ui.
						}
						break;
					}
				}
			};

			CommentViewer.prototype.addItem = function (newItem, parent) {
				var self = this;
				var targetArr = null;

				if (parent) {
					targetArr = self.getValue(parent, self.options.childProp);

					if (!angular.isArray(targetArr)) {
						targetArr = [];
						self.setValue(parent, self.options.childProp, targetArr);
					}
				} else {
					targetArr = self.data;
				}

				var items = self.dataLength + 1;

				newItem.isShow = true;
				targetArr.push(newItem);
				self.totalItems(items);
				self.navigateTo(newItem);
			};

			CommentViewer.prototype.deleteItems = function (deleteItem) {
				var self = this;
				var data = self.data;
				var parent = null;

				if (data.length > 0) {
					parent = deleteItems(data, deleteItem);
				}

				self.totalItems(self.count(data));
				if (data.length === 0) {
					self.container.empty();
				} else {
					self.navigateTo(parent ? parent : data[0]);
				}

				//////////////////////////////////////
				function deleteItems(items, deleteItem, parent) {
					var found = null;
					var newParent = null;
					var previous = null;
					for (var k = 0; k < items.length; ++k) {
						var oriItem = items[k];

						if (oriItem.Id === deleteItem.Id) {
							found = oriItem;
							break;
						}

						previous = oriItem;
						var children = self.getValue(oriItem, self.options.childProp);
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
				var self = this;
				var oldValue = self.dataLength;

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
				var self = this;
				var oldValue = self.options.pageNum;

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
				var self = this;
				var fire = function () {
					event.fire(event, args);
				};

				if (!args) {
					args = {};
				}
				$.extend(args, {viewer: self});

				if (!self.options || !self.options.ngScope) {
					fire();
				} else {
					var ngScope = self.options.ngScope;

					if (ngScope.$root.$$phase) {
						fire();
					} else {
						ngScope.$apply(fire);
					}
				}
			};

			CommentViewer.prototype.refresh = function (options) {
				var self = this;

				$.extend(self.options, options);
				self.render(self.data);
			};

			CommentViewer.prototype.setData = function (data, parentStatus) {
				var self = this;

				self.data = data;
				self.totalItems(self.count(self.data));
				self.IsReadonlyStatus = parentStatus;
				if (self.options.showLastComments) {
					var lastPageNum = Math.ceil(self.dataLength / self.options.pageSize);
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
				var self = this;
				var length = self.dataLength;
				var pageSize = self.options.pageSize;
				var pageNum = self.options.pageNum;
				var pages = Math.ceil(length / pageSize);

				if (pageNum < 1) {
					pageNum = 1;
				} else if (pageNum > pages) {
					pageNum = pages;
				}

				var start = pageSize * (pageNum - 1) - 1;
				var end = start + pageSize;

				return {
					index: -1,
					start: start,
					end: end
					//tSize: self.options.trunkSize,
					//lSize: self.options.leafSize
				};
			};

			CommentViewer.prototype.render = function (treeList) {
				var self = this;
				var context = self.renderContext();
				var lastChild = null;

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

				var scrollTop = 0;
				if (self.options.showLastComments && self.container[0]) {
					scrollTop = self.container[0].scrollHeight;
				}
				self.container.scrollTop(scrollTop);
			};

			CommentViewer.prototype.sortByDate = function (data) {
				var self = this;

				var tempData = _.sortBy(data, function (item) {
					var x = self.getValue(item, self.options.dateProp);
					return Date.parse(x);
				});
				_.remove(data);
				$.merge(data, tempData);

				return data;
			};

			CommentViewer.prototype.renderItem = function (container, context, dataItem, level) {
				var self = this;
				var options = self.options;
				var children = self.getValue(dataItem, options.childProp);
				var childContainer = null;
				var media = null;
				var lastChild = null;

				++context.index;

				if (context.index > context.end) {
					return;
				}

				if (context.index > context.start) {
					//var sizeCls = {};

					media = self.buildMedia(dataItem).attr('cid', context.index);
					childContainer = media.find('.media-body');

					if (!container) {
						container = self.container;

						//var marginLeft = context.tSize + context.lSize * (level - 1);
						//media.css({marginLeft: marginLeft + 'px'});
					}

					//if (level > 0) {
					//	sizeCls.width = sizeCls.height = context.lSize + 'px';
					//}
					//else {
					//	sizeCls.width = sizeCls.height = context.tSize + 'px';
					//}

					//media.find('.pull-left').css(sizeCls);
					container.append(media);
				}

				if (angular.isArray(children) && children.length > 0) {
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
				var self = this;
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

				var media = $(mediaHtml);
				var mediaObject = $(mediaObjectHtml).appendTo(media);
				var mediaBody = $(mediaBodyHtml).appendTo(media);
				var headerContainer = $(headerContainerHtml).appendTo(mediaBody);
				var headerInnerContainer = $(headerInnerContainerHtml).appendTo(headerContainer);

				var status = $(statusContainer).appendTo(headerInnerContainer);
				var header = $(headerHtml).appendTo(headerInnerContainer);

				var date = $(dateHtml).appendTo(headerInnerContainer);
				var groupBtn = $(groupButton).appendTo(headerContainer);
				var actionBtn = $(actionButton).appendTo(groupBtn);
				var deleteBtn = $(deleteButton).appendTo(groupBtn);

				var body = $(bodyHtml).appendTo(mediaBody);
				var logCode = $(logCodeHtml).appendTo(body);
				var logChgDetail = $(logChgDetailHtml).appendTo(body);
				var logColumn = $(logColumnHtml).appendTo(logChgDetail);
				var logOldValue = $(logOldValueHtml).appendTo(logChgDetail);
				var logSymbolTo = $(logSymbolToHtml).appendTo(logChgDetail);
				var logNewValue = $(logNewValueHtml).appendTo(logChgDetail);
				var logComment = $(logCommentHtml).appendTo(body);
				var logReason = $(logReasonHtml).appendTo(logComment);
				var logRemark = $(logRemarkHtml).appendTo(logComment);

				var footer = $(footerHtml).appendTo(mediaBody);

				actionBtn.click(function () {
					var editorLock = self.options.editorLock;
					var editor = self.options.editor;
					var comment = {
						element: footer, //insert html-markup after element
						editor: editor,
						model: dataItem,
						scope: self.options.ngScope
					};

					editorLock.create(comment);

				});

				deleteBtn.click(function(){
					if (!dataItem.CanDelete) {
						return;
					}
					self.options.ngScope.delete(dataItem);
				});

				deleteBtn.attr('disabled', function() {
					return !dataItem.CanDelete || self.IsReadonlyStatus || isDisabled(self.options.ngScope);
				});

				actionBtn.attr('disabled', function() {
					return	self.IsReadonlyStatus || isDisabled(self.options.ngScope);
				});

				function isDisabled(scope){
					var readonly = false;
					var parentScope = scope.$parent;
					while(parentScope){
						if(parentScope.isReadOnly){
							readonly = parentScope.isReadOnly();
							break;
						}
						else {
							parentScope = parentScope.$parent;
						}
					}
					return readonly;
				}

				// footer.bind('mouseenter', function () {
				// 	var editorLock = self.options.editorLock;
				// 	var editor = self.options.editor;
				// 	var comment = {
				// 		element: footer, //insert html-markup after element
				// 		editor: editor,
				// 		model: dataItem
				// 	};
				// 	var btn = $(commentBtn);
				//
				// 	btn.bind('click', function () {
				// 		editorLock.create(comment);
				// 	});
				//
				// 	footer.append(btn);
				// 	footer.bind('mouseleave', function () {
				// 		btn.remove();
				// 		footer.unbind('mouseleave');
				// 	});
				// });

				self.columns.forEach(function (col) {
					var value = self.getValue(dataItem, col.field);
					var appendTarget = null;
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
						case 'recordcode':
							appendTarget = logCode;
							break;
						case 'columnname':
							appendTarget = logColumn;
							break;
						case 'oldvaluedescription':
							appendTarget = logOldValue;
							break;
						case 'newvaluedescription':
							appendTarget = logNewValue;
							break;
						case 'reason':
							appendTarget = logReason;
							break;
						case 'remark':
							appendTarget = logRemark;
							break;
					}

					if(appendTarget) {
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

						if(!value) {
							if(col.id === 'reason') {
								value = $translate.instant('productionplanning.common.noReason');
							} else if(col.id !== 'remark'){
								value = '" "';
							}
						}
						if(col.id === 'remark' && value) {
							value = dataItem.AutoGenerated ? '(' + value + ')' : value;
						}
						appendTarget.append(value);
					}
				});

				// manual log
				if(!dataItem.AutoGenerated){
					logOldValue.remove();
					logSymbolTo.remove();
					logNewValue.remove();
					logColumn.remove();
					logReason.remove();
					var logSymbolManual = $(logSymbolManualHtml).appendTo(logChgDetail);
					logSymbolManual.append($translate.instant('productionplanning.common.manualLog.manualSymbol'));
				} else if(logReason.html() === $translate.instant('productionplanning.common.noReason') && !logRemark.html()) {
					logComment.remove(); // if empty reason and remark, we hide logComment element
				}

				return media;
			};

			CommentViewer.prototype.buildDetail = function (lastChild, parent) {
				var self = this;

				if (!lastChild || !self.options.detail) {
					return;
				}

				var detail = self.options.detail(parent);
				var visible = detail.visible;
				var count = detail.count;
				var action = detail.action;

				if (visible) {
					var txtViewAll = $translate.instant('productionplanning.common.pinboardLog.viewAll', {count: count});
					var element = $(detailHtml).append('<a>' + txtViewAll + '</a>');

					element.bind('click', function () {
						action(parent);
						element.remove();
					});

					lastChild.after(element);
				}
				else {
					var txtShowLatest = $translate.instant('productionplanning.common.pinboardLog.showLatest'); //Show only the latest comments
					var element2 = $(detailHtml).append('<a>' + txtShowLatest + '</a>');

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
			};

			/* jshint -W083 */ // just follow Array api.
			CommentViewer.prototype.count = function (data) {
				var self = this;
				var length = 0;
				var queue = [];

				if (angular.isArray(data)) {
					data.forEach(function (item) {
						if (item.isShow) {
							queue.push(item);
						}
					});

					while (queue.length > 0) {
						var firstItem = queue.shift();
						var children = self.getValue(firstItem, self.options.childProp);

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
				var self = this;

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
				var self = this,
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

			var directiveDefaults = {
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

			var editorTemplate = '<div class="comment-interval" data-basics-common-comment-editor data-ng-model="leafComment" data-status-options="statusOptions" data-submit="submit()" data-init="init()"></div>';

			return {
				restrict: 'A',
				replace: true,
				scope: {
					options: '=ppsCommonLogPinboardViewer',
					disabled: '='
				},
				templateUrl: globals.appBaseUrl + 'basics.common/templates/comment-viewer.html',
				link: function ($scope, $element) {
					var settings = $.extend({}, directiveDefaults, $scope.options),
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

					var viewer = new CommentViewer(container, settings.data, settings.columns, options);

					$scope.submit = function () {
						var statusValue = $scope.options.statusOptions ? $scope.options.statusOptions.viewValue : null;
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
						var result = $scope.options.IsReadonlyStatus;
						return result;
					};

					$scope.preview = function (event) {
						if ($(event.target).is('img.comment-image')) {
							var modalOptions = {
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
						var element = null;
						// angular.element().scope() will return undefined if disable debug info to angular.
						var scope = args.scope.$new(true);
						if (args.scope.options && args.scope.options.statusOptions) {
							scope.statusOptions = _.clone(args.scope.options.statusOptions);
							scope.statusOptions.groupName = platformCreateUuid();
							scope.statusOptions.viewValue = scope.statusOptions.statusViewValueHandler(args.model);
						}

						this.init = function () {
							this.prepare(scope);
							element = $compile(editorTemplate)(scope);
							args.element.after(element);
						};

						this.prepare = function (scope) {
							var self = this;

							scope.leafComment = '';

							scope.submit = function () {
								self.apply();
							};

							scope.init = function () {
								element.find('.comment-text-area').focus();
							};
						};

						this.apply = function () {
							var self = this;

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

})();
