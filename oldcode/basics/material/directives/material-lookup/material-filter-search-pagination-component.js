/*
 * Copyright(c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.material';
	angular.module(moduleName).component('basicsMaterialFilterSearchPagination', {
		templateUrl: 'basics.material/templates/material-lookup/material-filter-search-pagination-component.html',
		bindings: {
			searchViewOptions: '<'
		},
		controller: [
			'$scope',
			'$translate',
			function (
				$scope,
				$translate
			) {
				let statusBarObject = null;
				const searchViewOptions = this.searchViewOptions;
				const searchService = this.searchViewOptions.searchService;
				const numberOfItemsPerPage = this.searchViewOptions.pageSizeOptions;
				const resultsPerPageText = $translate.instant('basics.material.lookup.resultsPerPage');

				$scope.getStatusBarObject = function getStatusBarObject(obj) {
					statusBarObject = obj;
					statusBarObject.setFields(getStatusBarItem());
				};

				this.$onInit = function onInit() {
					initItemsPerPage();
					searchService.onListLoaded.register(onMaterialListLoaded);
				}

				function onMaterialListLoaded() {
					statusBarObject.setFields(getStatusBarItem());
				}

				function getStatusBarItem() {
					const pageStartNumber = searchService.searchOptions.ItemsPerPage * (searchService.searchOptions.CurrentPage - 1) + 1;
					let pageEndNumber = searchService.searchOptions.ItemsPerPage * searchService.searchOptions.CurrentPage;
					pageEndNumber = pageEndNumber > searchService.data.matchedCount ? searchService.data.matchedCount : pageEndNumber;
					const forwardEnabled = pageEndNumber < searchService.data.matchedCount;
					const backwardEnabled = pageStartNumber > 1;
					const paginationInfo = $translate.instant('basics.material.lookup.showPageStartToEnd', {startNumber: pageStartNumber, endNumber: pageEndNumber, totalCount: searchService.data.hasMoreMaterials?searchService.data.matchedCount+'+':searchService.data.matchedCount});
					const isShowPagination = !!(searchService.data.hasResult && searchService.data.matchedCount);

					return [
						{align: 'left', id: 'pageResult', type: 'text', disabled: false, cssClass: '', visible: true, ellipsis: true, value: resultsPerPageText},
						{align: 'left', id: 'pageNumberList', type: 'dropdown-btn', disabled: false, iconClass: 'control-icons ico-down', cssClass: 'bg-light-grey-7 block-image per-page-number', visible: true, ellipsis: true, value: searchService.searchOptions.ItemsPerPage, list: getPageNumberList()},
						{align: 'last', id: 'goToFirst', type: 'button', disabled: !backwardEnabled, visible: isShowPagination, iconClass: 'tlb-icons ico-rec-first', cssClass: 'block-image', func: goToFirstPage},
						{align: 'last', id: 'goToPrev', type: 'button', disabled: !backwardEnabled, visible: isShowPagination, iconClass: 'control-icons ico-previous', cssClass: 'block-image', func: goToPrevPage},
						{align: 'last', id: 'info', type: 'text', visible: isShowPagination, ellipsis: true, value: paginationInfo},
						{align: 'last', id: 'goToNext', type: 'button', disabled: !forwardEnabled, visible: isShowPagination, iconClass: 'control-icons ico-next', cssClass: 'block-image', func: goToNextPage},
						{align: 'last', id: 'goToLast', type: 'button', disabled: !forwardEnabled, visible: isShowPagination, iconClass: 'tlb-icons ico-rec-last', cssClass: 'block-image', func: goToLastPage}];
				}

				function getPageNumberList() {
					return {
						showImages: false,
						cssClass: '',
						items: (function() {
							let items = [];
							numberOfItemsPerPage.forEach((num) => {
								items.push({
									id: num,
									value: num,
									type: 'item',
									caption: num,
									fn: function () {
										onItemsPerPageChange(num);
									}
								});
							});
							return items;
						})()
					}
				}

				function initItemsPerPage() {
					const materialDefOfItemsPerPage = searchViewOptions.getInitPageSize();
					if (materialDefOfItemsPerPage) {
						searchService.searchOptions.ItemsPerPage = materialDefOfItemsPerPage;
					}
				}

				function onItemsPerPageChange(numberPerPage) {
					searchViewOptions.handlePageSizeChanged(numberPerPage);
					updatePerPageNumber(numberPerPage);
				}

				function updatePerPageNumber(numberPerPage) {
					searchService.searchOptions.ItemsPerPage = numberPerPage;
					searchViewOptions.executePageSize().then(function() {
						statusBarObject.updateFields(getStatusBarItem());
					});
				}

				function goToFirstPage() {
					searchService.searchOptions.CurrentPage = 1;
					searchViewOptions.executePaging();
				}

				function goToPrevPage() {
					searchService.searchOptions.CurrentPage--;
					searchViewOptions.executePaging();
				}

				function goToNextPage() {
					searchService.searchOptions.CurrentPage++;
					searchViewOptions.executePaging();
				}

				function goToLastPage() {
					searchService.searchOptions.CurrentPage = Math.ceil(searchService.data.matchedCount / searchService.searchOptions.ItemsPerPage);
					searchViewOptions.executePaging();
				}

				this.$onDestroy = function () {
				};
			}
		],
		controllerAs: 'basicsMaterialFilterSearchStatusBar'
	});
})(angular);