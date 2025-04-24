/**
 * Created by wed on 7/27/2017.
 */
(function (angular) {
	'use strict';

	const moduleName = 'basics.common';
	/**
	 * @ngdoc service
	 * @name commonTooltipService
	 * @function
	 * @requires _, $, platformGridAPI
	 *
	 * @description
	 * Service to register tooltips for specified column in grid.
	 **/
	angular.module(moduleName).factory('commonTooltipService', ['$', '_', 'platformGridAPI', function ($, _, platformGridAPI) {

		let container = null;
		let isVisible = false;
		const gridOptions = {};

		function validateCell(grid, cell) {
			const options = gridOptions[grid.id], result = {
				isTooltipCell: false,
				options: null,
				isShowArrow: options.isShowArrow
			};
			_.each(options.fields, function (item) {
				let tooltipField = item['tooltipField'],
					columnIndex = grid.getColumnIndex(tooltipField.toLowerCase());
				if (_.isUndefined(columnIndex)) {
					columnIndex = grid.getColumnIndex(tooltipField);
				}
				if (columnIndex === cell) {
					result.isTooltipCell = true;
					result.options = item;
				}
			});
			return result;
		}

		function buildContent(content, isShowArrow) {
			const $outerContainer = $('<div>').addClass('popup-content flex-box flex-auto').html(content).css({
				overflow: 'visible',
				position: 'relative'
			});
			if (isShowArrow) {
				$outerContainer.append('<span style="display:block;position:absolute;border-width: 8px;border-style: solid dashed dashed solid;border-color: #ababab transparent transparent #ababab;bottom: -20px;l;left: 1px;"></span>');
				$outerContainer.append('<span style="display:block;position:absolute;border-width: 8px;border-style: solid dashed dashed solid;border-color: #fff transparent transparent #fff;bottom: -18px;l;left: 2px;"></span>');
			}
			return $outerContainer;
		}

		function fixStatus(referPos) {
			let top = referPos.top, left = referPos.left,
				winWidth = $(window).width();

			container.css({
				display: 'flex',
				visibility: 'hidden'
			});

			const containerWidth = container.width(), containerHeight = container.height(), arrowHeight = 12;
			if (left + containerWidth > winWidth) {
				left = winWidth - containerWidth - 2;
			}
			top = top - containerHeight - arrowHeight;
			container.css({
				top: top + 'px',
				left: left + 'px',
				display: 'flex',
				visibility: 'visible',
				overflow: 'visible'
			});
		}

		function setContent(content, isShowArrow) {
			const $contentContainer = buildContent(content, isShowArrow);
			container.html($contentContainer);
		}

		function showTooltip(referPos, content, isShowArrow) {
			if (!container) {
				container = $('<div>').addClass('popup-container flex-box popup-container-n').appendTo('body').css({
					maxWidth: '300px',
					wordBreak: 'break-word',
					padding: '4px',
					// borderRadius: '3px',
					minWidth: '30px',
					minHeight: '20px'
				});
			}
			setContent(content, isShowArrow);
			fixStatus(referPos);
		}

		function hideTooltip() {
			if (container) {
				container.css({
					display: 'none'
				});
			}
		}

		function mouseEnter(e, arg) {
			const grid = arg.grid, cell = grid.getCellFromEvent(e);
			const result = validateCell(grid, cell.cell);
			if (result.isTooltipCell) {
				let item = grid.getDataItem(cell.row),
					indicator = (result.options['textField'] || result.options['tooltipField']), content;
				if (angular.isFunction(indicator)) {
					content = indicator(item);
				} else if (angular.isString(indicator)) {
					content = item[indicator];
				}
				const cellNode = grid.getCellNode(cell.row, cell.cell);
				if (cellNode && !_.isUndefined(content) && content !== null && content !== '') {
					showTooltip({
						top: cellNode.offset().top,
						left: e.clientX
					}, content, result.isShowArrow);
					isVisible = true;
				}
			}
		}

		function mouseLeave(/* e, arg */) {
			if (isVisible) {
				hideTooltip();
				isVisible = false;
			}
		}

		/**
		 * @ngdoc function
		 * @name register
		 * @function
		 * @methodOf commonTooltipService
		 * @description Function to register tooltips for specified column in grid.
		 * @param {string} gridId Indicates grid uuid.
		 * @param {object} options Indicates the columns you  want to show tooltips when mouse over.
		 * e.g.
		 * options : {
		 * isShowArrow:false,
		 * fields: [
		 * {
		 * tooltipField: 'GroupDescription',
		 * textField: 'CommentText'
		 * },
		 * {
		 * tooltipField: 'PointsPossible',
		 * textField: function (item) {
		 * return '<span style="color:red;">' + item['Weighting'] + '%</span>';
		 * }
		 * }
		 * ]
		 * }
		 */
		function register(gridId, options) {
			gridOptions[gridId] = angular.extend({isShowArrow: false}, options);
			platformGridAPI.events.register(gridId, 'onMouseEnter', mouseEnter);
			platformGridAPI.events.register(gridId, 'onMouseLeave', mouseLeave);
		}

		function unregister(gridId) {
			delete gridOptions[gridId];
			platformGridAPI.events.unregister(gridId, 'onMouseEnter', mouseEnter);
			platformGridAPI.events.unregister(gridId, 'onMouseLeave', mouseLeave);
		}

		return {
			register: register,
			unregister: unregister
		};
	}]);
})(angular);