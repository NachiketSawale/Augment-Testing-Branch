(function (angular) {
		'use strict';

		platformComponentUtilService.$inject = ['_', 'platformGridAPI'];

		function platformComponentUtilService(_, platformGridAPI) {

			return {
				/**
				 * @ngdoc function
				 * @name setSplitterResizeWatcher
				 * @function
				 * @methodOf platformComponentUtilService
				 * @description Execute a function when the splitter moves;
				 * @param  element The common element.
				 * @param function te funtion tat is called.
				 */
				setSplitterResizeWatcher: setSplitterResizeWatcher,
				/**
				 * @ngdoc function
				 * @name processComponentsByWindowResizess
				 * @function
				 * @methodOf platformComponentUtilService
				 * @description Execute a function when dialog-container resized;
				 * @param  element The common selector element.
				 * @param function The function that is called.
				 */
				processComponentsByWindowResize: processComponentsByWindowResize,

			};

			function setSplitterResizeWatcher(element, callBack, callBackParams) {
				if (!element && !_.isFunction(callBack)) {
					return;
				}

				let splitter = element.closest('.k-splitter').data('kendoSplitter');
				if (splitter) {
					splitter.bind('resize', () => {
						callBack(callBackParams);
					});
				}
			}

			function getSplitter(selector) {
				return angular.element(selector).find('.k-splitter').data('kendoSplitter');
			}

			function getGridsInDialog(parentSelector) {
				let platformGridsContainer = angular.element(parentSelector).find('.modal-body .platformgrid');
				let _gridItems = [];

				angular.forEach(platformGridsContainer, function (item) {
					let _ID = angular.element(item).attr('id');
					if (_ID && platformGridAPI.grids.exist(_ID)) {
						_gridItems.push(_ID);
					}
				});

				return _gridItems;
			}

			function processComponentsByWindowResize(parentSelector) {
				setTimeout(function() {
					let existsSplitter = getSplitter(parentSelector);
					if(existsSplitter) {
						existsSplitter.resize(true);
						return;
					}

					if (getGridsInDialog(parentSelector).length > 0) {
						angular.forEach(getGridsInDialog(parentSelector), function (item, index) {
							platformGridAPI.grids.resize(item);
						});
					}
				}, 0);
			}
		}

		/**
		 * @ngdoc service
		 * @name platformComponentUtilService
		 * @function
		 * @requires _
		 * @description a util service specifically for components.
		 */
		angular.module('platform').factory('platformComponentUtilService', platformComponentUtilService);
	}
)(angular);
