/*
 * $Id: platform-long-text-dialog-service.js 550695 2019-07-10 07:39:49Z alisch $
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform.platformLongTextDialogService
	 * @function
	 *
	 * @description Displays a dialog box that allows for viewing very long texts.
	 */
	angular.module('platform').factory('platformLongTextDialogService', ['_', 'platformDialogService', '$q',
		function (_, platformDialogService, $q) {
			var service = {};

			function LongTextDataSource() {
				this.currentPageIndex = 0;
				this.totalPageCount = 0;
			}

			service.LongTextDataSource = LongTextDataSource;

			LongTextDataSource.prototype.loadPage = function (index) {
				this.currentPageIndex = index;
				return $q.resolve();
			};

			LongTextDataSource.prototype.loadPreviousPage = function () {
				if (this.currentPageIndex > 0) {
					return this.loadPage(this.currentPageIndex - 1);
				}
				return $q.resolve();
			};

			LongTextDataSource.prototype.loadNextPage = function () {
				if (this.currentPageIndex < this.totalPageCount - 1) {
					return this.loadPage(this.currentPageIndex + 1);
				}
				return $q.resolve();
			};

			LongTextDataSource.prototype.hasPreviousPage = function () {
				return this.currentPageIndex > 0;
			};

			LongTextDataSource.prototype.hasNextPage = function () {
				return this.currentPageIndex < this.totalPageCount - 1;
			};

			function getCustomButtons(actualConfig) {
				var buttons = [];

				if (actualConfig && !actualConfig.hidePager) {
					buttons.push({
						id: 'back',
						caption$tr$: 'platform.previousPage',
						disabled: function (info) {
							return info.isPaginating || !actualConfig.dataSource.hasPreviousPage();
						},
						fn: function ($event, info) {
							info.scope.isPaginating = true;
							actualConfig.dataSource.loadPreviousPage().then(function () {
								info.scope.$evalAsync(function () {
									info.scope.isPaginating = false;
								});
							});
						}
					}, {
						id: 'next',
						caption$tr$: 'platform.nextPage',
						disabled: function (info) {
							return info.isPaginating || !actualConfig.dataSource.hasNextPage();
						},
						fn: function ($event, info) {
							info.scope.isPaginating = true;
							actualConfig.dataSource.loadNextPage().then(function () {
								info.scope.$evalAsync(function () {
									info.scope.isPaginating = false;
								});
							});
						}
					});
				}

				buttons.push(platformDialogService.assets.buttons.getCopyToClipboard(function () {
					return actualConfig.dataSource.current;
				}, {
					processSuccess: function (info, msgKey) {
						_.set(info.modalOptions, 'dataItem.alarm.text', msgKey);
					}
				}));

				return buttons;
			}

			service.showDialog = function (config) {
				let actualConfig = _.isObject(config) ? config : {};

				let dlgOptions = _.assign({
					width: '50%',
					height: '50%',
					showOkButton: true,
					resizeable: true,
					backdrop: 'static'
				}, actualConfig, {
					windowClass: 'longtext-dialog',
					bodyCssClass: _.isUndefined(actualConfig.topDescription) ? '' : 'split',
					bodyTemplateUrl: globals.appBaseUrl + 'app/components/longtextdialog/partials/platform-long-text-dialog-body-template.html',
					customButtons: getCustomButtons(actualConfig),
					dataItem: {
						dataSource: actualConfig.dataSource
					}
				});

				return platformDialogService.showDialog(dlgOptions);
			};

			return service;
		}]);
})();