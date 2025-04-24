/**
 * Created by ford on 3/21/2017.
 */
(function (ng, $) {
	'use strict';

	var defaults = {
		'nextPage': true,
		'prevPage': true,
		'lastPage': false,
		'firstPage': false,
		'jumpTo': false,
		'pagingInfo': {
			'pagesize': 100,
			'totalCount': 1000
		}
	};

	var updateState = {
		'currentPage': 1,
		'filterActive': false
	};

	function StatusbarController($rootScope) {
		var ctrl = this, _pageCount, _currentPage, _prevPage, _filterEventHandler;

		ctrl.pageText = '';
		ctrl.filterActive = false;

		function updateFilterActive(e, isActive) {
			ctrl.filterActive = isActive;
		}

		ctrl.changePage = function changePage(type) {
			var args = {
				'nextStep': type,
				'currentPage': _currentPage
			};
			if ((type === 'next' || type === 'last') && (_currentPage !== _pageCount)) {
				ctrl.onPagechange({'args': args});
			} else if ((type === 'prev' || type === 'first') && (_currentPage > 1)) {
				ctrl.onPagechange({'args': args});
			}
		};

		ctrl.$onInit = function onInit() {
			ctrl.options = angular.extend({}, defaults, ctrl.options);
			_pageCount = Math.ceil(ctrl.options.pagingInfo.totalCount / ctrl.options.pagingInfo.pagesize);
			_currentPage = angular.isUndefined(ctrl.currentPage) || ctrl.currentPage === 0 ? 1 : ctrl.currentPage;
			_prevPage = ctrl.currentPage - 1;
			_filterEventHandler = $rootScope.$on('filterIsActive', updateFilterActive);
		};

		ctrl.$onChanges = function onChanges(changes) {
			if (changes.options) {
				ctrl.options = angular.copy(changes.options.currentValue);
				_pageCount = Math.ceil(ctrl.options.pagingInfo.totalCount / ctrl.options.pagingInfo.pagesize);
			}
			if (changes.currentPage) {
				_currentPage = ctrl.currentPage;
				var rangeEnd = ctrl.currentPage * ctrl.options.pagingInfo.pagesize;
				var rangeStart = rangeEnd - (ctrl.options.pagingInfo.pagesize - 1);
				ctrl.pageText = '' + rangeStart + ' - ' + rangeEnd + ' / ' + ctrl.options.pagingInfo.totalCount;
			}
		};

		ctrl.$onDestroy = function onDestroy() {
			_filterEventHandler();
		};
	}

	StatusbarController.$inject = ['$rootScope'];

	var statusbarConfig = {
		'bindings': {
			'options': '<',
			// 'updateState': '<',
			'currentPage': '<',
			'onPagechange': '&'
		},
		'template': ['$templateCache', function ($templateCache) {
			return $templateCache.get('platform/container-statusbar.html');
		}],
		'controller': StatusbarController
	};

	ng.module('platform').component('platformStatusbar', statusbarConfig);

})(angular, jQuery);