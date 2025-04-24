/*
 * Created by Jeffrey at 5/25/2015
 * For Chart.js, add some Chart Type, override some core methods.
 */
/* global Chart:false */

// Jeffrey draw 3D Column

(function (Chart) {
	'use strict';

	function isVertical(bar) {
		return bar._view.width !== undefined;
	}

	/**
	 * Helper function to get the bounds of the bar regardless of the orientation
	 * @private
	 * @param bar {Chart.Element.Rectangle} the bar
	 * @return bounds of the bar
	 */
	function getBarBounds(bar) {
		const vm = bar._view;
		let x1, x2, y1, y2;

		if (isVertical(bar)) {
			// vertical
			const halfWidth = vm.width / 2;
			x1 = vm.x - halfWidth;
			x2 = vm.x + halfWidth;
			y1 = Math.min(vm.y, vm.base);
			y2 = Math.max(vm.y, vm.base);
		} else {
			// horizontal bar
			const halfHeight = vm.height / 2;
			x1 = Math.min(vm.x, vm.base);
			x2 = Math.max(vm.x, vm.base);
			y1 = vm.y - halfHeight;
			y2 = vm.y + halfHeight;
		}

		return {
			left: x1,
			top: y1,
			right: x2,
			bottom: y2
		};
	}

	Chart.defaults.global.yValueDomain = {
		name: '',
		decimal: '',
		thousand: ''
	}; // money

	Chart.Domain = {
		money: {
			dataType: 'numeric',
			precision: 2,
			regex: '^(([-+]?(\\d{0,3})([.,]\\d{3}){0,3}([.,]\\d{0,2}))|([-+]?\\d{0,12})([.,]\\d{0,2})?)$',
			parse: function (value, decimal, thousand) {
				let moneyValue = '',
					m = parseFloat(value).toFixed(Chart.Domain.money.precision),
					pointIndex = m.indexOf('.'),
					integerLength = pointIndex === -1 ? m.length : pointIndex,
					zeroPadding = integerLength % 3 === 0 ? 3 : integerLength % 3;

				thousand = thousand || ',';
				decimal = decimal || '.';

				for (let j = zeroPadding - 3; j < integerLength; j += 3) {
					if (j < zeroPadding - 1) {
						moneyValue += m.substring(0, zeroPadding);
					} else {
						moneyValue += m.substring(j, j + 3);
					}
					if (j + 3 !== integerLength) {
						moneyValue += thousand;
					}
				}
				if (pointIndex > -1) {
					moneyValue += (decimal + m.slice(integerLength + 1));
				}
				return moneyValue;
			}
		}
	};

	Chart.elements.Rectangular = Chart.Element.extend({
		draw: function () {
			this.angleData = 30;
			this.thicknessScale = 0.6;
			const ctx = this._chart.ctx;
			const vm = this._view;

			const middleColor = Array.isArray(this.middleColor) ? this.middleColor[this._index] : this.middleColor;

			let halfWidth = vm.width / 2,
				leftX = vm.x - halfWidth,
				rightX = vm.x + halfWidth,
				top = vm.base - (vm.base - vm.y),
				halfStroke = vm.borderWidth / 2,
				sinAngleX = Math.cos(Math.PI / 180 * this.angleData),
				sinAngleY = Math.sin(Math.PI / 180 * this.angleData),
				thickX = Math.floor(vm.width * this.thicknessScale) * sinAngleX,
				thickY = Math.floor(vm.width * this.thicknessScale) * sinAngleY,
				leftBehindX = leftX + thickX,
				behindTop = top - thickY,
				rightBehindX = rightX + thickX,
				belowY = vm.base - thickY;

			// Canvas doesn't allow us to stroke inside the width so we can
			// adjust the sizes to fit if we're setting a stroke on the line
			if (vm.borderWidth) {
				leftX += halfStroke;
				rightX -= halfStroke;
				top += halfStroke;
			}

			ctx.beginPath();
			ctx.fillStyle = vm.backgroundColor;
			ctx.strokeStyle = vm.borderColor;
			ctx.lineWidth = vm.borderWidth;

			// It'd be nice to keep this class totally generic to any rectangle
			// and simply specify which border to miss out.
			ctx.moveTo(leftX, vm.base);
			ctx.lineTo(leftX, top);
			ctx.lineTo(rightX, top);
			ctx.lineTo(rightX, vm.base);
			ctx.closePath();
			ctx.fill();
			if (vm.borderWidth) {
				ctx.stroke();
			}

			// draw right
			ctx.beginPath();
			ctx.fillStyle = middleColor; // this.middleColor;// gradient;
			ctx.strokeStyle = middleColor; // this.middleColor;// gradient;

			ctx.moveTo(rightX, vm.base);
			ctx.lineTo(rightBehindX, belowY);
			ctx.lineTo(rightBehindX, behindTop);
			ctx.lineTo(rightX, top);
			ctx.closePath();
			ctx.fill();
			if (vm.borderWidth) {
				ctx.stroke();
			}

			// draw above
			ctx.beginPath();
			ctx.fillStyle = middleColor; // this.middleColor;// gradient;
			ctx.strokeStyle = middleColor; // this.middleColor;// gradient;

			ctx.moveTo(rightX, top);
			ctx.lineTo(rightBehindX, behindTop);
			ctx.lineTo(leftBehindX, behindTop);
			ctx.lineTo(leftX, top);
			ctx.closePath();
			ctx.fill();
			if (vm.borderWidth) {
				ctx.stroke();
			}
		},
		height: function () {
			const vm = this._view;
			return vm.base - vm.y;
		},
		inRange: function (mouseX, mouseY) {
			let inRange = false;

			if (this._view) {
				const bounds = getBarBounds(this);
				inRange = mouseX >= bounds.left && mouseX <= bounds.right && mouseY >= bounds.top && mouseY <= bounds.bottom;
			}

			return inRange;
		},
		inLabelRange: function (mouseX, mouseY) {
			const me = this;
			if (!me._view) {
				return false;
			}

			let inRange;
			const bounds = getBarBounds(me);

			if (isVertical(me)) {
				inRange = mouseX >= bounds.left && mouseX <= bounds.right;
			} else {
				inRange = mouseY >= bounds.top && mouseY <= bounds.bottom;
			}

			return inRange;
		},
		inXRange: function (mouseX) {
			const bounds = getBarBounds(this);
			return mouseX >= bounds.left && mouseX <= bounds.right;
		},
		inYRange: function (mouseY) {
			const bounds = getBarBounds(this);
			return mouseY >= bounds.top && mouseY <= bounds.bottom;
		},
		getCenterPoint: function () {
			const vm = this._view;
			let x, y;
			if (isVertical(this)) {
				x = vm.x;
				y = (vm.y + vm.base) / 2;
			} else {
				x = (vm.x + vm.base) / 2;
				y = vm.y;
			}

			return {x: x, y: y};
		},
		getArea: function () {
			const vm = this._view;
			return vm.width * Math.abs(vm.y - vm.base);
		},
		tooltipPosition: function () {
			const vm = this._view;
			return {
				x: vm.x,
				y: vm.y
			};
		}
	});

	/* Chart.elements.Rectangle = Chart.Element.extend({
		draw: function() {
			var ctx = this._chart.ctx;
			var vm = this._view;

			var halfWidth = vm.width / 2,
					leftX = vm.x - halfWidth,
					rightX = vm.x + halfWidth,
					top = vm.base - (vm.base - vm.y),
					halfStroke = vm.borderWidth / 2;

			// Canvas doesn't allow us to stroke inside the width so we can
			// adjust the sizes to fit if we're setting a stroke on the line
			if (vm.borderWidth) {
				leftX += halfStroke;
				rightX -= halfStroke;
				top += halfStroke;
			}

			ctx.beginPath();
			ctx.fillStyle = vm.backgroundColor;
			ctx.strokeStyle = vm.borderColor;
			ctx.lineWidth = vm.borderWidth;

			// Corner points, from bottom-left to bottom-right clockwise
			// | 1 2 |
			// | 0 3 |
			var corners = [
				[leftX, vm.base],
				[leftX, top],
				[rightX, top],
				[rightX, vm.base]
			];

			// Find first (starting) corner with fallback to 'bottom'
			var borders = ['bottom', 'left', 'top', 'right'];
			var startCorner = borders.indexOf(vm.borderSkipped, 0);
			if (startCorner === -1) {
				startCorner = 0;
			}

			function cornerAt(index) {
				return corners[(startCorner + index) % 4];
			}

			// Draw rectangle from 'startCorner'
			var corner = cornerAt(0);
			ctx.moveTo(corner[0], corner[1]);

			for (var i = 1; i < 4; i++) {
				corner = cornerAt(i);
				ctx.lineTo(corner[0], corner[1]);
			}

			ctx.fill();
			if (vm.borderWidth) {
				ctx.stroke();
			}
		},
		height: function() {
			var vm = this._view;
			return vm.base - vm.y;
		},
		inRange: function(mouseX, mouseY) {
			var inRange = false;

			if (this._view) {
				var bounds = getBarBounds(this);
				inRange = mouseX >= bounds.left && mouseX <= bounds.right && mouseY >= bounds.top && mouseY <= bounds.bottom;
			}

			return inRange;
		},
		inLabelRange: function(mouseX, mouseY) {
			var me = this;
			if (!me._view) {
				return false;
			}

			var inRange = false;
			var bounds = getBarBounds(me);

			if (isVertical(me)) {
				inRange = mouseX >= bounds.left && mouseX <= bounds.right;
			} else {
				inRange = mouseY >= bounds.top && mouseY <= bounds.bottom;
			}

			return inRange;
		},
		inXRange: function(mouseX) {
			var bounds = getBarBounds(this);
			return mouseX >= bounds.left && mouseX <= bounds.right;
		},
		inYRange: function(mouseY) {
			var bounds = getBarBounds(this);
			return mouseY >= bounds.top && mouseY <= bounds.bottom;
		},
		getCenterPoint: function() {
			var vm = this._view;
			var x, y;
			if (isVertical(this)) {
				x = vm.x;
				y = (vm.y + vm.base) / 2;
			} else {
				x = (vm.x + vm.base) / 2;
				y = vm.y;
			}

			return {x: x, y: y};
		},
		getArea: function() {
			var vm = this._view;
			return vm.width * Math.abs(vm.y - vm.base);
		},
		tooltipPosition: function() {
			var vm = this._view;
			return {
				x: vm.x,
				y: vm.y
			};
		}
	}); */

})(Chart);

// Jeffrey add 3D_Columns
(function () {
	'use strict';

	const root = this,
		Chart = root.Chart,
		helpers = Chart.helpers;

	Chart.defaults['3D_Columns'] = helpers.extend({}, Chart.defaults.bar);

	Chart.controllers['3D_Columns'] = Chart.DatasetController.extend({

		dataElementType: Chart.elements.Rectangular,

		initialize: function (chart, datasetIndex) {
			Chart.DatasetController.prototype.initialize.call(this, chart, datasetIndex);

			// Use this to indicate that this is a bar dataset.
			this.getMeta().bar = true;

			this.ScaleClass = Chart.Scale.extend({

				// These methods are ordered by lifecycle. Utilities then follow.
				// Any function defined here is inherited by all scale types.
				// Any function can be extended by the scale type

				beforeUpdate: function () {
					helpers.callCallback(this.options.beforeUpdate, [this]);
				},
				update: function (maxWidth, maxHeight, margins) {
					const me = this;

					// Update Lifecycle - Probably don't want to ever extend or overwrite this function ;)
					me.beforeUpdate();

					// Absorb the master measurements
					me.maxWidth = maxWidth;
					me.maxHeight = maxHeight;
					me.margins = helpers.extend({
						left: 0,
						right: 0,
						top: 0,
						bottom: 0
					}, margins);

					// Dimensions
					me.beforeSetDimensions();
					me.setDimensions();
					me.afterSetDimensions();

					// Data min/max
					me.beforeDataLimits();
					me.determineDataLimits();
					me.afterDataLimits();

					// Ticks
					me.beforeBuildTicks();
					me.buildTicks();
					me.afterBuildTicks();

					me.beforeTickToLabelConversion();
					me.convertTicksToLabels();
					me.afterTickToLabelConversion();

					// Tick Rotation
					me.beforeCalculateTickRotation();
					me.calculateTickRotation();
					me.afterCalculateTickRotation();
					// Fit
					me.beforeFit();
					me.fit();
					me.afterFit();
					//
					me.afterUpdate();

					return me.minSize;

				},
				afterUpdate: function () {
					helpers.callCallback(this.options.afterUpdate, [this]);
				},

				//

				beforeSetDimensions: function () {
					helpers.callCallback(this.options.beforeSetDimensions, [this]);
				},
				setDimensions: function () {
					const me = this;
					// Set the unconstrained dimension before label rotation
					if (me.isHorizontal()) {
						// Reset position before calculating rotation
						me.width = me.maxWidth;
						me.left = 0;
						me.right = me.width;
					} else {
						me.height = me.maxHeight;

						// Reset position before calculating rotation
						me.top = 0;
						me.bottom = me.height;
					}

					// Reset padding
					me.paddingLeft = 0;
					me.paddingTop = 0;
					me.paddingRight = 0;
					me.paddingBottom = 0;
				},
				afterSetDimensions: function () {
					helpers.callCallback(this.options.afterSetDimensions, [this]);
				},

				// Data limits
				beforeDataLimits: function () {
					helpers.callCallback(this.options.beforeDataLimits, [this]);
				},
				determineDataLimits: helpers.noop,
				afterDataLimits: function () {
					helpers.callCallback(this.options.afterDataLimits, [this]);
				},

				//
				beforeBuildTicks: function () {
					helpers.callCallback(this.options.beforeBuildTicks, [this]);
				},
				buildTicks: helpers.noop,
				afterBuildTicks: function () {
					helpers.callCallback(this.options.afterBuildTicks, [this]);
				},

				beforeTickToLabelConversion: function () {
					helpers.callCallback(this.options.beforeTickToLabelConversion, [this]);
				},
				convertTicksToLabels: function () {
					const me = this;
					// Convert ticks to strings
					const tickOpts = me.options.ticks;
					me.ticks = me.ticks.map(tickOpts.userCallback || tickOpts.callback);
				},
				afterTickToLabelConversion: function () {
					helpers.callCallback(this.options.afterTickToLabelConversion, [this]);
				},

				//

				beforeCalculateTickRotation: function () {
					helpers.callCallback(this.options.beforeCalculateTickRotation, [this]);
				},
				calculateTickRotation: function () {
					const me = this;
					const context = me.ctx;
					const globalDefaults = Chart.defaults.global;
					const optionTicks = me.options.ticks;

					// Get the width of each grid by calculating the difference
					// between x offsets between 0 and 1.
					const tickFontSize = helpers.getValueOrDefault(optionTicks.fontSize, globalDefaults.defaultFontSize);
					const tickFontStyle = helpers.getValueOrDefault(optionTicks.fontStyle, globalDefaults.defaultFontStyle);
					const tickFontFamily = helpers.getValueOrDefault(optionTicks.fontFamily, globalDefaults.defaultFontFamily);
					const tickLabelFont = helpers.fontString(tickFontSize, tickFontStyle, tickFontFamily);
					context.font = tickLabelFont;

					const firstWidth = context.measureText(me.ticks[0]).width;
					const lastWidth = context.measureText(me.ticks[me.ticks.length - 1]).width;
					let firstRotated;

					me.labelRotation = optionTicks.minRotation || 0;
					me.paddingRight = 0;
					me.paddingLeft = 0;

					if (me.options.display) {
						if (me.isHorizontal()) {
							me.paddingRight = lastWidth / 2 + 3;
							me.paddingLeft = firstWidth / 2 + 3;

							if (!me.longestTextCache) {
								me.longestTextCache = {};
							}
							const originalLabelWidth = helpers.longestText(context, tickLabelFont, me.ticks, me.longestTextCache);
							let labelWidth = originalLabelWidth;
							let cosRotation;
							let sinRotation;

							// Allow 3 pixels x2 padding either side for label readability
							// only the index matters for a dataset scale, but we want a consistent interface between scales
							const tickWidth = me.getPixelForTick(1) - me.getPixelForTick(0) - 6;

							// Max label rotation can be set or default to 90 - also act as a loop counter
							while (labelWidth > tickWidth && me.labelRotation < optionTicks.maxRotation) {
								cosRotation = Math.cos(helpers.toRadians(me.labelRotation));
								sinRotation = Math.sin(helpers.toRadians(me.labelRotation));

								firstRotated = cosRotation * firstWidth;

								// We're right aligning the text now.
								if (firstRotated + tickFontSize / 2 > me.yLabelWidth) {
									me.paddingLeft = firstRotated + tickFontSize / 2;
								}

								me.paddingRight = tickFontSize / 2;

								if (sinRotation * originalLabelWidth > me.maxHeight) {
									// go back one step
									me.labelRotation--;
									break;
								}

								me.labelRotation++;
								labelWidth = cosRotation * originalLabelWidth;
							}
						}
					}

					if (me.margins) {
						me.paddingLeft = Math.max(me.paddingLeft - me.margins.left, 0);
						me.paddingRight = Math.max(me.paddingRight - me.margins.right, 0);
					}
				},
				afterCalculateTickRotation: function () {
					helpers.callCallback(this.options.afterCalculateTickRotation, [this]);
				},

				//

				beforeFit: function () {
					helpers.callCallback(this.options.beforeFit, [this]);
				},
				fit: function () {
					const me = this;
					// Reset
					const minSize = me.minSize = {
						width: 0,
						height: 0
					};

					const opts = me.options;
					const globalDefaults = Chart.defaults.global;
					const tickOpts = opts.ticks;
					const scaleLabelOpts = opts.scaleLabel;
					const gridLineOpts = opts.gridLines;
					const display = opts.display;
					const isHorizontal = me.isHorizontal();

					const tickFontSize = helpers.getValueOrDefault(tickOpts.fontSize, globalDefaults.defaultFontSize);
					const tickFontStyle = helpers.getValueOrDefault(tickOpts.fontStyle, globalDefaults.defaultFontStyle);
					const tickFontFamily = helpers.getValueOrDefault(tickOpts.fontFamily, globalDefaults.defaultFontFamily);
					const tickLabelFont = helpers.fontString(tickFontSize, tickFontStyle, tickFontFamily);

					const scaleLabelFontSize = helpers.getValueOrDefault(scaleLabelOpts.fontSize, globalDefaults.defaultFontSize);

					const tickMarkLength = opts.gridLines.tickMarkLength;

					// Width
					if (isHorizontal) {
						// subtract the margins to line up with the chartArea if we are a full width scale
						minSize.width = me.isFullWidth() ? me.maxWidth - me.margins.left - me.margins.right : me.maxWidth;
					} else {
						minSize.width = display && gridLineOpts.drawTicks ? tickMarkLength : 0;
					}

					// height
					if (isHorizontal) {
						minSize.height = display && gridLineOpts.drawTicks ? tickMarkLength : 0;
					} else {
						minSize.height = me.maxHeight; // fill all the height
					}

					// Are we showing a title for the scale?
					if (scaleLabelOpts.display && display) {
						if (isHorizontal) {
							minSize.height += (scaleLabelFontSize * 1.5);
						} else {
							minSize.width += (scaleLabelFontSize * 1.5);
						}
					}

					if (tickOpts.display && display) {
						// Don't bother fitting the ticks if we are not showing them
						if (!me.longestTextCache) {
							me.longestTextCache = {};
						}

						let largestTextWidth = helpers.longestText(me.ctx, tickLabelFont, me.ticks, me.longestTextCache);
						const tallestLabelHeightInLines = helpers.numberOfLabelLines(me.ticks);
						const lineSpace = tickFontSize * 0.5;

						if (isHorizontal) {
							// A horizontal axis is more constrained by the height.
							me.longestLabelWidth = largestTextWidth;

							// TODO - improve this calculation
							const labelHeight = (Math.sin(helpers.toRadians(me.labelRotation)) * me.longestLabelWidth) + (tickFontSize * tallestLabelHeightInLines) + (lineSpace * tallestLabelHeightInLines);

							minSize.height = Math.min(me.maxHeight, minSize.height + labelHeight);
							me.ctx.font = tickLabelFont;

							const firstLabelWidth = me.ctx.measureText(me.ticks[0]).width;
							const lastLabelWidth = me.ctx.measureText(me.ticks[me.ticks.length - 1]).width;

							// Ensure that our ticks are always inside the canvas. When rotated, ticks are right aligned which means that the right padding is dominated
							// by the font height
							const cosRotation = Math.cos(helpers.toRadians(me.labelRotation));
							const sinRotation = Math.sin(helpers.toRadians(me.labelRotation));
							me.paddingLeft = me.labelRotation !== 0 ? (cosRotation * firstLabelWidth) + 3 : firstLabelWidth / 2 + 3; // add 3 px to move away from canvas edges
							me.paddingRight = me.labelRotation !== 0 ? (sinRotation * (tickFontSize / 2)) + 3 : lastLabelWidth / 2 + 3; // when rotated
						} else {
							// A vertical axis is more constrained by the width. Labels are the dominant factor here, so get that length first
							const maxLabelWidth = me.maxWidth - minSize.width;

							// Account for padding
							const mirror = tickOpts.mirror;
							if (!mirror) {
								largestTextWidth += me.options.ticks.padding;
							} else {
								// If mirrored text is on the inside so don't expand
								largestTextWidth = 0;
							}

							if (largestTextWidth < maxLabelWidth) {
								// We don't need all the room
								minSize.width += largestTextWidth;
							} else {
								// Expand to max size
								minSize.width = me.maxWidth;
							}

							me.paddingTop = tickFontSize / 2;
							me.paddingBottom = tickFontSize / 2;
						}
					}

					if (me.margins) {
						me.paddingLeft = Math.max(me.paddingLeft - me.margins.left, 0);
						me.paddingTop = Math.max(me.paddingTop - me.margins.top, 0);
						me.paddingRight = Math.max(me.paddingRight - me.margins.right, 0);
						me.paddingBottom = Math.max(me.paddingBottom - me.margins.bottom, 0);
					}

					me.width = minSize.width;
					me.height = minSize.height;

				},
				afterFit: function () {
					helpers.callCallback(this.options.afterFit, [this]);
				},

				// Shared Methods
				isHorizontal: function () {
					return this.options.position === 'top' || this.options.position === 'bottom';
				},
				isFullWidth: function () {
					return (this.options.fullWidth);
				},

				// Get the correct value. NaN bad inputs, If the value type is object get the x or y based on whether we are horizontal or not
				getRightValue: function (rawValue) {
					// Null and undefined values first
					if (rawValue === null || typeof (rawValue) === 'undefined') {
						return NaN;
					}
					// isNaN(object) returns true, so make sure NaN is checking for a number; Discard Infinite values
					if (typeof (rawValue) === 'number' && !isFinite(rawValue)) {
						return NaN;
					}
					// If it is in fact an object, dive in one more level
					if (typeof (rawValue) === 'object') {
						if ((rawValue instanceof Date) || (rawValue.isValid)) {
							return rawValue;
						}
						return this.getRightValue(this.isHorizontal() ? rawValue.x : rawValue.y);
					}

					// Value is good, return it
					return rawValue;
				},

				// Used to get the value to display in the tooltip for the data at the given index
				// function getLabelForIndex(index, datasetIndex)
				getLabelForIndex: helpers.noop,

				// Used to get data value locations.  Value can either be an index or a numerical value
				getPixelForValue: helpers.noop,

				// Used to get the data value from a given pixel. This is the inverse of getPixelForValue
				getValueForPixel: helpers.noop,

				// Used for tick location, should
				getPixelForTick: function (index, includeOffset) {
					const me = this;
					if (me.isHorizontal()) {
						const innerWidth = me.width - (me.paddingLeft + me.paddingRight);
						const tickWidth = innerWidth / Math.max((me.ticks.length - ((me.options.gridLines.offsetGridLines) ? 0 : 1)), 1);
						let pixel = (tickWidth * index) + me.paddingLeft;

						if (includeOffset) {
							pixel += tickWidth / 2;
						}

						let finalVal = me.left + Math.round(pixel);
						finalVal += me.isFullWidth() ? me.margins.left : 0;
						return finalVal;
					}
					const innerHeight = me.height - (me.paddingTop + me.paddingBottom);
					return me.top + (index * (innerHeight / (me.ticks.length - 1)));
				},

				// Utility for getting the pixel location of a percentage of scale
				getPixelForDecimal: function (decimal /* , includeOffset */) {
					const me = this;
					if (me.isHorizontal()) {
						const innerWidth = me.width - (me.paddingLeft + me.paddingRight);
						const valueOffset = (innerWidth * decimal) + me.paddingLeft;

						let finalVal = me.left + Math.round(valueOffset);
						finalVal += me.isFullWidth() ? me.margins.left : 0;
						return finalVal;
					}
					return me.top + (decimal * me.height);
				},

				getBasePixel: function () {
					const me = this;
					const min = me.min;
					const max = me.max;

					return me.getPixelForValue(
						me.beginAtZero ? 0 :
							min < 0 && max < 0 ? max :
								min > 0 && max > 0 ? min :
									0);
				},

				// Actually draw the scale on the canvas
				// @param {rectangle} chartArea : the area of the chart to draw full grid lines on
				draw: function (chartArea) {
					const me = this;
					const options = me.options;
					if (!options.display) {
						return;
					}

					const context = me.ctx;
					const globalDefaults = Chart.defaults.global;
					const optionTicks = options.ticks;
					const gridLines = options.gridLines;
					const scaleLabel = options.scaleLabel;

					const isRotated = me.labelRotation !== 0;
					let skipRatio;
					const useAutoskipper = optionTicks.autoSkip;
					const isHorizontal = me.isHorizontal();

					// figure out the maximum number of gridlines to show
					let maxTicks;
					if (optionTicks.maxTicksLimit) {
						maxTicks = optionTicks.maxTicksLimit;
					}

					const tickFontColor = helpers.getValueOrDefault(optionTicks.fontColor, globalDefaults.defaultFontColor);
					const tickFontSize = helpers.getValueOrDefault(optionTicks.fontSize, globalDefaults.defaultFontSize);
					const tickFontStyle = helpers.getValueOrDefault(optionTicks.fontStyle, globalDefaults.defaultFontStyle);
					const tickFontFamily = helpers.getValueOrDefault(optionTicks.fontFamily, globalDefaults.defaultFontFamily);
					const tickLabelFont = helpers.fontString(tickFontSize, tickFontStyle, tickFontFamily);
					const tl = gridLines.tickMarkLength;
					const borderDash = helpers.getValueOrDefault(gridLines.borderDash, globalDefaults.borderDash);
					const borderDashOffset = helpers.getValueOrDefault(gridLines.borderDashOffset, globalDefaults.borderDashOffset);

					const scaleLabelFontColor = helpers.getValueOrDefault(scaleLabel.fontColor, globalDefaults.defaultFontColor);
					const scaleLabelFontSize = helpers.getValueOrDefault(scaleLabel.fontSize, globalDefaults.defaultFontSize);
					const scaleLabelFontStyle = helpers.getValueOrDefault(scaleLabel.fontStyle, globalDefaults.defaultFontStyle);
					const scaleLabelFontFamily = helpers.getValueOrDefault(scaleLabel.fontFamily, globalDefaults.defaultFontFamily);
					const scaleLabelFont = helpers.fontString(scaleLabelFontSize, scaleLabelFontStyle, scaleLabelFontFamily);

					const labelRotationRadians = helpers.toRadians(me.labelRotation);
					const cosRotation = Math.cos(labelRotationRadians);
					let longestRotatedLabel = me.longestLabelWidth * cosRotation;

					// Make sure we draw text in the correct color and font
					context.fillStyle = tickFontColor;

					const itemsToDraw = [];

					if (isHorizontal) {
						skipRatio = false;

						// Only calculate the skip ratio with the half width of longestRotateLabel if we got an actual rotation
						// See #2584
						if (isRotated) {
							longestRotatedLabel /= 2;
						}

						if ((longestRotatedLabel + optionTicks.autoSkipPadding) * me.ticks.length > (me.width - (me.paddingLeft + me.paddingRight))) {
							skipRatio = 1 + Math.floor(((longestRotatedLabel + optionTicks.autoSkipPadding) * me.ticks.length) / (me.width - (me.paddingLeft + me.paddingRight)));
						}

						// if they defined a max number of optionTicks,
						// increase skipRatio until that number is met
						if (maxTicks && me.ticks.length > maxTicks) {
							while (!skipRatio || me.ticks.length / (skipRatio || 1) > maxTicks) {
								if (!skipRatio) {
									skipRatio = 1;
								}
								skipRatio += 1;
							}
						}

						if (!useAutoskipper) {
							skipRatio = false;
						}
					}

					const xTickStart = options.position === 'right' ? me.left : me.right - tl;
					const xTickEnd = options.position === 'right' ? me.left + tl : me.right;
					const yTickStart = options.position === 'bottom' ? me.top : me.bottom - tl;
					const yTickEnd = options.position === 'bottom' ? me.top + tl : me.bottom;

					helpers.each(me.ticks, function (label, index) {
						// If the callback returned a null or undefined value, do not draw this line
						if (label === undefined || label === null) {
							return;
						}

						const isLastTick = me.ticks.length === index + 1;

						// Since we always show the last tick,we need may need to hide the last shown one before
						const shouldSkip = (skipRatio > 1 && index % skipRatio > 0) || (index % skipRatio === 0 && index + skipRatio >= me.ticks.length);
						if (shouldSkip && !isLastTick) {
							return;
						}

						let lineWidth, lineColor;
						if (index === (typeof me.zeroLineIndex !== 'undefined' ? me.zeroLineIndex : 0)) {
							// Draw the first index specially
							lineWidth = gridLines.zeroLineWidth;
							lineColor = gridLines.zeroLineColor;
						} else {
							lineWidth = helpers.getValueAtIndexOrDefault(gridLines.lineWidth, index);
							lineColor = helpers.getValueAtIndexOrDefault(gridLines.color, index);
						}

						// Common properties
						let tx1, ty1, tx2, ty2, x1, y1, x2, y2, labelX, labelY;
						let textAlign;
						let textBaseline = 'middle';

						if (isHorizontal) {
							if (!isRotated) {
								textBaseline = options.position === 'top' ? 'bottom' : 'top';
							}

							textAlign = isRotated ? 'right' : 'center';

							const xLineValue = me.getPixelForTick(index) + helpers.aliasPixel(lineWidth); // xvalues for grid lines
							labelX = me.getPixelForTick(index, gridLines.offsetGridLines) + optionTicks.labelOffset; // x values for optionTicks (need to consider offsetLabel option)
							labelY = (isRotated) ? me.top + 12 : options.position === 'top' ? me.bottom - tl : me.top + tl;

							tx1 = tx2 = x1 = x2 = xLineValue;
							ty1 = yTickStart;
							ty2 = yTickEnd;
							y1 = chartArea.top;
							y2 = chartArea.bottom;
						} else {
							if (options.position === 'left') {
								if (optionTicks.mirror) {
									labelX = me.right + optionTicks.padding;
									textAlign = 'left';
								} else {
									labelX = me.right - optionTicks.padding;
									textAlign = 'right';
								}
								// right side
							} else if (optionTicks.mirror) {
								labelX = me.left - optionTicks.padding;
								textAlign = 'right';
							} else {
								labelX = me.left + optionTicks.padding;
								textAlign = 'left';
							}

							let yLineValue = me.getPixelForTick(index); // xvalues for grid lines
							yLineValue += helpers.aliasPixel(lineWidth);
							labelY = me.getPixelForTick(index, gridLines.offsetGridLines);

							tx1 = xTickStart;
							tx2 = xTickEnd;
							x1 = chartArea.left;
							x2 = chartArea.right;
							ty1 = ty2 = y1 = y2 = yLineValue;
						}

						itemsToDraw.push({
							tx1: tx1,
							ty1: ty1,
							tx2: tx2,
							ty2: ty2,
							x1: x1,
							y1: y1,
							x2: x2,
							y2: y2,
							labelX: labelX,
							labelY: labelY,
							glWidth: lineWidth,
							glColor: lineColor,
							glBorderDash: borderDash,
							glBorderDashOffset: borderDashOffset,
							rotation: -1 * labelRotationRadians,
							label: label,
							textBaseline: textBaseline,
							textAlign: textAlign
						});
					});

					// Draw all of the tick labels, tick marks, and grid lines at the correct places
					helpers.each(itemsToDraw, function (itemToDraw) {
						if (gridLines.display) {
							context.save();
							context.lineWidth = itemToDraw.glWidth;
							context.strokeStyle = itemToDraw.glColor;
							if (context.setLineDash) {
								context.setLineDash(itemToDraw.glBorderDash);
								context.lineDashOffset = itemToDraw.glBorderDashOffset;
							}

							context.beginPath();

							if (gridLines.drawTicks) {
								context.moveTo(itemToDraw.tx1, itemToDraw.ty1);
								context.lineTo(itemToDraw.tx2, itemToDraw.ty2);
							}

							if (gridLines.drawOnChartArea) {
								context.moveTo(itemToDraw.x1, itemToDraw.y1);
								context.lineTo(itemToDraw.x2, itemToDraw.y2);
							}

							context.stroke();
							context.restore();
						}

						if (optionTicks.display) {
							context.save();
							context.translate(itemToDraw.labelX, itemToDraw.labelY);
							context.rotate(itemToDraw.rotation);
							context.font = tickLabelFont;
							context.textBaseline = itemToDraw.textBaseline;
							context.textAlign = itemToDraw.textAlign;

							const label = itemToDraw.label;
							if (helpers.isArray(label)) {
								let i = 0, y = -(label.length - 1) * tickFontSize * 0.75;
								for (; i < label.length; ++i) {
									// We just make sure the multiline element is a string here..
									context.fillText('' + label[i], 0, y);
									// apply same lineSpacing as calculated @ L#320
									y += (tickFontSize * 1.5);
								}
							} else {
								context.fillText(label, 0, 0);
							}
							context.restore();
						}
					});

					if (scaleLabel.display) {
						// Draw the scale label
						let scaleLabelX;
						let scaleLabelY;
						let rotation = 0;

						if (isHorizontal) {
							scaleLabelX = me.left + ((me.right - me.left) / 2); // midpoint of the width
							scaleLabelY = options.position === 'bottom' ? me.bottom - (scaleLabelFontSize / 2) : me.top + (scaleLabelFontSize / 2);
						} else {
							const isLeft = options.position === 'left';
							scaleLabelX = isLeft ? me.left + (scaleLabelFontSize / 2) : me.right - (scaleLabelFontSize / 2);
							scaleLabelY = me.top + ((me.bottom - me.top) / 2);
							rotation = isLeft ? -0.5 * Math.PI : 0.5 * Math.PI;
						}

						context.save();
						context.translate(scaleLabelX, scaleLabelY);
						context.rotate(rotation);
						context.textAlign = 'center';
						context.textBaseline = 'middle';
						context.fillStyle = scaleLabelFontColor; // render in correct colour
						context.font = scaleLabelFont;
						context.fillText(scaleLabel.labelString, 0, 0);
						context.restore();
					}

					if (gridLines.drawBorder) {
						// Draw the line at the edge of the axis
						context.lineWidth = helpers.getValueAtIndexOrDefault(gridLines.lineWidth, 0);
						context.strokeStyle = helpers.getValueAtIndexOrDefault(gridLines.color, 0);
						let x1 = me.left,
							x2 = me.right,
							y1 = me.top,
							y2 = me.bottom;

						const aliasPixel = helpers.aliasPixel(context.lineWidth);
						if (isHorizontal) {
							y1 = y2 = options.position === 'top' ? me.bottom : me.top;
							y1 += aliasPixel;
							y2 += aliasPixel;
						} else {
							x1 = x2 = options.position === 'left' ? me.right : me.left;
							x1 += aliasPixel;
							x2 += aliasPixel;
						}

						context.beginPath();
						context.moveTo(x1, y1);
						context.lineTo(x2, y2);
						context.stroke();
					}
				}
			});
		},

		// Get the number of datasets that display bars. We use this to correctly calculate the bar width
		getBarCount: function () {
			const me = this;
			let barCount = 0;
			helpers.each(me.chart.data.datasets, function (dataset, datasetIndex) {
				const meta = me.chart.getDatasetMeta(datasetIndex);
				if (meta.bar && me.chart.isDatasetVisible(datasetIndex)) {
					++barCount;
				}
			}, me);
			return barCount;
		},

		update: function (reset) {
			const me = this;
			helpers.each(me.getMeta().data, function (rectangle, index) {
				me.updateElement(rectangle, index, reset);
			}, me);
		},

		updateElement: function (rectangle, index, reset) {
			const me = this;
			const meta = me.getMeta();
			const xScale = me.getScaleForId(meta.xAxisID);
			const yScale = me.getScaleForId(meta.yAxisID);
			const scaleBase = yScale.getBasePixel();
			const rectangleElementOptions = me.chart.options.elements.rectangle;
			const custom = rectangle.custom || {};
			const dataset = me.getDataset();

			rectangle._xScale = xScale;
			rectangle._yScale = yScale;
			rectangle._datasetIndex = me.index;
			rectangle._index = index;

			const ruler = me.getRuler(index);
			rectangle._model = {
				x: me.calculateBarX(index, me.index, ruler),
				y: reset ? scaleBase : me.calculateBarY(index, me.index),

				// Tooltip
				label: me.chart.data.labels[index],
				datasetLabel: dataset.label,

				// Appearance
				base: reset ? scaleBase : me.calculateBarBase(me.index, index),
				width: me.calculateBarWidth(ruler),
				backgroundColor: custom.backgroundColor ? custom.backgroundColor : helpers.getValueAtIndexOrDefault(dataset.backgroundColor, index, rectangleElementOptions.backgroundColor),
				borderSkipped: custom.borderSkipped ? custom.borderSkipped : rectangleElementOptions.borderSkipped,
				borderColor: custom.borderColor ? custom.borderColor : helpers.getValueAtIndexOrDefault(dataset.borderColor, index, rectangleElementOptions.borderColor),
				borderWidth: custom.borderWidth ? custom.borderWidth : helpers.getValueAtIndexOrDefault(dataset.borderWidth, index, rectangleElementOptions.borderWidth)
			};

			rectangle.pivot();
		},

		calculateBarBase: function (datasetIndex, index) {
			const me = this;
			const meta = me.getMeta();
			const yScale = me.getScaleForId(meta.yAxisID);
			let base = 0;

			if (yScale.options.stacked) {
				const chart = me.chart;
				const datasets = chart.data.datasets;
				const value = Number(datasets[datasetIndex].data[index]);

				for (let i = 0; i < datasetIndex; i++) {
					const currentDs = datasets[i];
					const currentDsMeta = chart.getDatasetMeta(i);
					if (currentDsMeta.bar && currentDsMeta.yAxisID === yScale.id && chart.isDatasetVisible(i)) {
						const currentVal = Number(currentDs.data[index]);
						base += value < 0 ? Math.min(currentVal, 0) : Math.max(currentVal, 0);
					}
				}

				return yScale.getPixelForValue(base);
			}

			return yScale.getBasePixel();
		},

		getRuler: function (index) {
			const me = this;
			const meta = me.getMeta();
			const xScale = me.getScaleForId(meta.xAxisID);
			const datasetCount = me.getBarCount();
			const barPercentage = 0.9;
			const categoryPercentage = 0.8;
			let tickWidth;

			if (xScale.options.type === 'category') {
				let ticks = xScale.ticks;
				let nextIndex = index + 1;
				if (nextIndex < 0 || nextIndex > ticks.length - 1) {
					tickWidth = xScale.getPixelForValue(ticks[nextIndex], nextIndex + xScale.minIndex) - xScale.getPixelForTick(index);
				} else {
					tickWidth = xScale.getPixelForTick(index + 1) - xScale.getPixelForTick(index);
				}
			} else {
				// Average width
				tickWidth = xScale.width / xScale.ticks.length;
			}
			const categoryWidth = tickWidth * (xScale.options.categoryPercentage || categoryPercentage);
			const categorySpacing = (tickWidth - (tickWidth * (xScale.options.categoryPercentage || categoryPercentage))) / 2;
			let fullBarWidth = categoryWidth / datasetCount;

			if (xScale.ticks.length !== me.chart.data.labels.length) {
				const perc = xScale.ticks.length / me.chart.data.labels.length;
				fullBarWidth = fullBarWidth * perc;
			}

			const barWidth = fullBarWidth * (xScale.options.barPercentage || barPercentage);
			const barSpacing = fullBarWidth - (fullBarWidth * (xScale.options.barPercentage || barPercentage));

			return {
				datasetCount: datasetCount,
				tickWidth: tickWidth,
				categoryWidth: categoryWidth,
				categorySpacing: categorySpacing,
				fullBarWidth: fullBarWidth,
				barWidth: barWidth,
				barSpacing: barSpacing
			};
		},

		calculateBarWidth: function (ruler) {
			const xScale = this.getScaleForId(this.getMeta().xAxisID);
			if (xScale.options.barThickness) {
				return xScale.options.barThickness;
			}
			return xScale.options.stacked ? ruler.categoryWidth : ruler.barWidth;
		},

		// Get bar index from the given dataset index accounting for the fact that not all bars are visible
		getBarIndex: function (datasetIndex) {
			let barIndex = 0;
			let meta, j;

			for (j = 0; j < datasetIndex; ++j) {
				meta = this.chart.getDatasetMeta(j);
				if (meta.bar && this.chart.isDatasetVisible(j)) {
					++barIndex;
				}
			}

			return barIndex;
		},

		calculateBarX: function (index, datasetIndex, ruler) {
			const me = this;
			const meta = me.getMeta();
			const xScale = me.getScaleForId(meta.xAxisID);
			const barIndex = me.getBarIndex(datasetIndex);
			let leftTick = xScale.getPixelForValue(null, index, datasetIndex, me.chart.isCombo);
			//leftTick -= me.chart.isCombo ? (ruler.tickWidth / 2) : 0;
			leftTick -= me.chart.config.isCombo ? (ruler.tickWidth / 2) : 0;
			if (xScale.options.stacked) {
				return leftTick + (ruler.categoryWidth / 2) + ruler.categorySpacing;
			}

			return leftTick +
				(ruler.barWidth / 2) +
				ruler.categorySpacing +
				(ruler.barWidth * barIndex) +
				(ruler.barSpacing / 2) +
				(ruler.barSpacing * barIndex);
		},

		calculateBarY: function (index, datasetIndex) {
			const me = this;
			const meta = me.getMeta();
			const yScale = me.getScaleForId(meta.yAxisID);
			const value = Number(me.getDataset().data[index]);

			if (yScale.options.stacked) {

				let sumPos = 0,
					sumNeg = 0;

				for (let i = 0; i < datasetIndex; i++) {
					const ds = me.chart.data.datasets[i];
					const dsMeta = me.chart.getDatasetMeta(i);
					if (dsMeta.bar && dsMeta.yAxisID === yScale.id && me.chart.isDatasetVisible(i)) {
						const stackedVal = Number(ds.data[index]);
						if (stackedVal < 0) {
							sumNeg += stackedVal || 0;
						} else {
							sumPos += stackedVal || 0;
						}
					}
				}

				if (value < 0) {
					return yScale.getPixelForValue(sumNeg + value);
				}
				return yScale.getPixelForValue(sumPos + value);
			}

			return yScale.getPixelForValue(value);
		},

		calculate3DOffsetX: function () {
			const index = 0;
			const ruler = this.getRuler(index);// todo:index
			const barWidth = this.calculateBarWidth(ruler);
			return Math.round(Math.floor(barWidth * this.thicknessScale) * Math.cos(Math.PI / 180 * this.angleData));
		},
		calculate3DOffsetY: function () {
			const barWidth = this.calculateBarWidth(this.barCount);
			return Math.round(Math.floor(barWidth * this.thicknessScale) * Math.sin(Math.PI / 180 * this.angleData));
		},

		draw: function (ease) {
			const me = this;
			const easingDecimal = ease || 1;
			const metaData = me.getMeta().data;
			const dataset = me.getDataset();
			let i, len;

			for (i = 0, len = metaData.length; i < len; ++i) {
				const d = dataset.data[i];
				if (d !== null && d !== undefined && !isNaN(d)) {
					metaData[i].middleColor = dataset.middleColor;
					metaData[i].transition(easingDecimal).draw();
				}
			}
		},

		setHoverStyle: function (rectangle) {
			const dataset = this.chart.data.datasets[rectangle._datasetIndex];
			const index = rectangle._index;

			const custom = rectangle.custom || {};
			const model = rectangle._model;
			model.backgroundColor = custom.hoverBackgroundColor ? custom.hoverBackgroundColor : helpers.getValueAtIndexOrDefault(dataset.hoverBackgroundColor, index, helpers.getHoverColor(model.backgroundColor));
			model.borderColor = custom.hoverBorderColor ? custom.hoverBorderColor : helpers.getValueAtIndexOrDefault(dataset.hoverBorderColor, index, helpers.getHoverColor(model.borderColor));
			model.borderWidth = custom.hoverBorderWidth ? custom.hoverBorderWidth : helpers.getValueAtIndexOrDefault(dataset.hoverBorderWidth, index, model.borderWidth);
		},

		removeHoverStyle: function (rectangle) {
			const dataset = this.chart.data.datasets[rectangle._datasetIndex];
			const index = rectangle._index;
			const custom = rectangle.custom || {};
			const model = rectangle._model;
			const rectangleElementOptions = this.chart.options.elements.rectangle;

			model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : helpers.getValueAtIndexOrDefault(dataset.backgroundColor, index, rectangleElementOptions.backgroundColor);
			model.borderColor = custom.borderColor ? custom.borderColor : helpers.getValueAtIndexOrDefault(dataset.borderColor, index, rectangleElementOptions.borderColor);
			model.borderWidth = custom.borderWidth ? custom.borderWidth : helpers.getValueAtIndexOrDefault(dataset.borderWidth, index, rectangleElementOptions.borderWidth);
		}

	});

	Chart.beforeDatasetUpdate = function (meta){
		console.log(meta);
	};

}).call(window);
