/**
 * Created by lst on 7/16/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'cloud.desktop';

	angular.module(moduleName).factory('cloudDesktopOneDriveControllerContextMenuService',
		['cloudDesktopOneDriveDataService', 'platformGridAPI', '$window', '$log',
			function (dataService, platformGridAPI, $window, $log) {
				var service = {};

				service.initContextMenu = function ($scope) {
					$scope.clipboard = null;
					$scope.processingItems = null;
					var contextMenu = {
						copy: {
							_show: true,
							get show() {
								return this._show;
							},
							set show(value) {
								this._show = value;
								$('.context-menu-item-copy').attr('data-show', value);
							},

							fn: function () {
								$log.log('copy');

								$scope.clipboard = $scope.processingItems;
							}
						},
						paste: {
							_show: true,
							get show() {
								return this._show;
							},
							set show(value) {
								this._show = value;
								$('.context-menu-item-paste').attr('data-show', value);
							},

							fn: function () {
								$log.log('paste');

								// after paste, clean the clipboard.
								$scope.clipboard = null;
							}
						},
						delete: {
							_show: true,
							get show() {
								return this._show;
							},
							set show(value) {
								this._show = value;
								$('.context-menu-item-delete').attr('data-show', value);
							},

							fn: function () {
								$log.log('delete');
							}
						},
						rename: {
							_show: true,
							get show() {
								return this._show;
							},
							set show(value) {
								this._show = value;
								$('.context-menu-item-rename').attr('data-show', value);
							},

							fn: function () {
								$log.log('rename');
							}
						},

						newFolder: {
							fn: function () {
								$log.log('newFolder');
							}
						},
						properties: {
							fn: function () {
								$log.log('properties');
							}
						},

						adjust: function () {
							// control group line.
							if (contextMenu.copy.show || contextMenu.paste.show) {
								$('.context-menu-item-g1').attr('data-show', true);
							} else {
								$('.context-menu-item-g1').attr('data-show', false);
							}

							if (contextMenu.delete.show || contextMenu.rename.show) {
								$('.context-menu-item-g2').attr('data-show', true);
							} else {
								$('.context-menu-item-g2').attr('data-show', false);
							}
						}
					};
					$scope.executeCmd = function (cmdName) {
						if (contextMenu.hasOwnProperty(cmdName)) {
							contextMenu[cmdName].fn();
						}

						// after executeCmd clean the processing items.
						$scope.processingItems = null;
					};

					// disable default context menu;
					$('#sidebar-oneDrive').bind('contextmenu', function (e) {
						e.preventDefault();
					});

					$('.one-drive-context-menu').bind('contextmenu', function (e) {
						e.preventDefault();
					});

					$('.one-drive-grid-container').bind('contextmenu', function (e) {
						e.preventDefault();

						var id = 'contextMenu_' + $scope.$id;
						var $contextMenu = $('.one-drive-context-menu');
						$contextMenu.attr('id', id);// set id to distory by grid.

						var grid = platformGridAPI.grids.element('id', $scope.getContainerUUID()).instance;
						var cell = grid.getCellFromEvent(e);
						var selectedRows = grid.getSelectedRows();

						var selectedItems = dataService.getSelectedEntities() || [];
						var ctrlKey = e.ctrlKey === true || e.ctrlKey === 1;
						var shiftKey = e.shiftKey === true || e.shiftKey === 1;

						// if ctrl and shift is press down. neet process?
						// only process selectedItems.
						if (ctrlKey || shiftKey) {
							$scope.processingItems = selectedItems;
						} else {
							// if mouse click on selected item
							if (cell && selectedRows.indexOf(cell.row) !== -1) {
								$scope.processingItems = selectedItems;
							} else {
								dataService.deselect();
								$scope.processingItems = null;
							}
						}

						if (cell) {
							var currentItem = getGridRowItem(cell.row);
							$log.log(currentItem);

							// folder copy and delete may be support later? subitem must be processed.
							if (currentItem.file /* ||currentItem.folder */) {
								contextMenu.copy.show = true;
								contextMenu.delete.show = true;
							} else {
								contextMenu.copy.show = false;
								contextMenu.delete.show = false;
							}
							$contextMenu.data('row', cell.row);
						} else {
							contextMenu.copy.show = false;
							contextMenu.delete.show = false;
							$contextMenu.data('row', null);
							$log.log('blank space');
						}
						contextMenu.rename.show = false;
						if ($scope.clipboard && $scope.clipboard !== null) {
							contextMenu.paste.show = true;
						} else {
							contextMenu.paste.show = false;
						}
						contextMenu.adjust();

						var position = getContextMenuPosition(e, $contextMenu);
						$contextMenu.css(position);
						$contextMenu.show();
						$('html').one('click', function () {
							$contextMenu.hide();
						});
					});

					function getGridRowItems(rows) {
						var result = [];
						if (rows && rows.length > 0) {
							var gridItems = platformGridAPI.rows.getRows($scope.getContainerUUID());
							angular.forEach(rows, function (row) {
								result.push(gridItems[row]);
							});
						}
						return result;
					}

					function getGridRowItem(row) {
						return getGridRowItems([row])[0];
					}

					function getContextMenuPosition(event, $contextMenu) {
						var $container = $('#sidebar-oneDrive'),
							containerLeftBorderWidth = _.trimEnd($container.css('border-left-width'), 'px'),
							clbw = 0,
							x = event.clientX, y = event.clientY,
							html = $window.document.documentElement,
							vw = html.clientWidth, vh = html.clientHeight,
							mw = $contextMenu.outerWidth(),
							mh = $contextMenu.outerHeight();
						var left = (x + mw) > vw ? (vw - mw) : x;
						var top = (y + mh) > vh ? (vh - mh) : y;

						if (containerLeftBorderWidth && /^\d+$/g.test(containerLeftBorderWidth)) {
							clbw = parseInt(containerLeftBorderWidth);
						}

						var adjustLeft = left - ($container.offset().left + clbw);
						var adjustTop = top - $container.offset().top;

						return {
							left: adjustLeft,
							top: adjustTop
						};
					}
				};

				return service;
			}]);

})(angular);