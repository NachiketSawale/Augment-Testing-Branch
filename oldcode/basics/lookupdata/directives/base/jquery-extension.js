/**
 * @description: this is a jquery plugin to use to open a popup in body element, it is used in basic lookup directive at the moment and in various other components.
 */

(function ($) {

	'use strict';

	var defaults = {
		// decimal value, default 0, popup window width.
		width: 0,
		// decimal value, default 0, popup window height
		height: 0,
		// decimal value, default 0, popup window min-width.
		minWidth: 0,
		// decimal value, default 0, popup window width.
		maxWidth: 0,
		// decimal value, default 0, popup window min-height
		minHeight: 0,
		// decimal value, default 0, popup window height
		maxHeight: 0,
		// element, footer content for popup window.
		footer: null,
		// element, stop closing popup window if event 'click' occurs in this element and its content.
		relatedTarget: null,
		// function, callback after stop resizing.
		resizeStop: null,
		// function, callback to clear external resource after closing popup window.
		clear: null,
		// boolean, default false, if it is true, then resize feature and footer will be disabled,
		// popup window will be similar to standard combo popup window
		plainMode: false,
		// has same width with element which occur popup widow.
		hasDefaultWidth: true,
		// allow opening multi popup window.
		multiPopup: false,
		// popup level
		level: 0,
		// popup alignment
		align: null,
		// z-index for popup
		zIndex: null
	};

	var globalPopupManager = new PopupManager();

	/**
	 * @description: select a element to get position and then open popup div element.
	 * @arguments:
	 *  contentElement: jquery element show in popup div element
	 *  options: { width:null, height:null }
	 */
	$.fn.popup = function (contentElement, options) {
		var settings = $.extend({}, defaults, options);
		var self = this,
			$document = $(document),
			unbindCloseListener,
			unbindResizeListener,
			settings = settings,
			owner = settings.relatedTarget || this,
			docScrollTop = $document.scrollTop(),
			docScrollLeft = $document.scrollLeft(),
			offset = self.offset(), //get coordintae from common element(top- / left- postion)
			offsetTop = offset.top,
			offsetLeft = offset.left,
			selfOuterWidth = self.outerWidth(),
			selfOuterHeight = self.outerHeight(),
			width = selfOuterWidth,
			height = 180,
			footerContainer = $('<div class="popup-footer flex-box"></div>'),
			contentContainer = $(`<div class="popup-content flex-box flex-auto${(settings.cssClass ? ' ' + settings.cssClass : '')}"></div>`),
			popupContainer = $('<div class="popup-container flex-box flex-column"></div>'),
			actionOkButton = $(`<button type="button" class="ok btn btn-primary action-btn">${options.okLabel}</button>`),
			actionCancelButton = $(`<button type="button" class="cancel btn btn-default action-btn">${options.cancelLabel}</button>`),
			align = {},
			close = function () {
				if (unbindCloseListener) {
					unbindCloseListener();
					unbindCloseListener = null;
				}
				if (unbindResizeListener) {
					unbindResizeListener();
					unbindResizeListener = null;
				}
				popupContainer.empty();
				popupContainer.remove();
				if (settings.clear) {
					settings.clear();
				}
				close = null;
				globalPopupManager.remove(popupView);
			},
			okAction = function() {
				if (settings.okAction) {
					settings.okAction();
				}
			},
			generateCss = function () { /* jshint -W074 */
				var body = $('body'),
					bodyHeight = body.height(),
					bodyWidth = body.width(),
					bottomHeight = bodyHeight - offsetTop - selfOuterHeight, //space under the element
					rightWidth = bodyWidth - offsetLeft, //total width - element-position-left-side --> So much space on the right side
					maxHeight = 0,
					minHeight = 0,
					maxWidth = 0,
					minWidth = 0,
					padding = 10,
					isTopFooter = false,
					containerClass = settings.containerClass || '',
					contentClass = '',
					resizeCallbacks = [],
					resizeHandles = [],
					footer = {
						minHeight: 20
					},
					content = {},
					container = {
						width: settings.hasDefaultWidth ? (width + 'px') : 'initial',
						height: settings.height ? (height + 'px') : 'initial'
					},
					alignBottom = false,
					alignLeft = false;

				// if align bottom
				if (settings.align.bottom) {
					alignBottom = true;
				}
				else if (settings.align.up) {
					alignBottom = false;
				}
				else if (bottomHeight > offsetTop) {
					alignBottom = true;
				}
				// end if align bottom

				// if align left
				if (settings.align.left) {
					alignLeft = true;
				}
				else if (settings.align.right) {
					alignLeft = false;
				}
				else if (rightWidth - selfOuterWidth > offsetLeft) {
					alignLeft = true;
				}
				// end if align left

				if (settings.level) { // popup sub menu
					if (alignBottom) {
						if (bottomHeight < settings.height) {
							alignBottom = false;
						}
					}
					else {
						if (offsetTop < settings.height) {
							alignBottom = true;
						}
					}

					if (alignLeft) {
						if (rightWidth - selfOuterWidth < settings.width) {
							alignLeft = false;
						}
					}
					else {
						if (offsetLeft < settings.width) {
							alignLeft = true;
						}
					}
				}

				// judge location in top or bottom.
				if (alignBottom) { // bottom
					container.top = offsetTop + selfOuterHeight - docScrollTop;
					maxHeight = bottomHeight;
					containerClass += ' popup-container-s';
					contentClass = 'popup-content-s';
					resizeHandles.push('s');
					align.bottom = true;
				}
				else { // up
					container.bottom = bodyHeight - offsetTop + docScrollTop;
					maxHeight = offsetTop;
					containerClass += ' popup-container-n';
					contentClass = 'popup-content-n';
					isTopFooter = true;
					resizeHandles.push('n');
					resizeCallbacks.push(function (e, args) {
						args.element.css({top: 'none'}); // solve style conflict between original position and  resizing.
					});
					align.up = true;
				}

				// judge location in left or right.
				if (alignLeft) { // align left
					container.left = offsetLeft - docScrollLeft;
					maxWidth = rightWidth; //max. available space to right side.
					resizeHandles.push('e');
					align.left = true;
				}
				else { // align right
					container.right = rightWidth - selfOuterWidth + docScrollLeft;
					maxWidth = offsetLeft + selfOuterWidth;
					resizeHandles.push('w');
					resizeCallbacks.push(function (e, args) {
						args.element.css({left: 'none'}); // solve style conflict between original position and  resizing.
					});
					// justify footer content from end.
					if (settings.footer) {
						footer.justifyContent = 'flex-end';
					}
					align.right = true;
				}

				// justify footer content from end.
				if (settings.showActionButtons) {
					footer.justifyContent = 'flex-end';
				}

				container.maxWidth = maxWidth - padding;
				container.maxHeight = maxHeight - padding;

				if (settings.level) { // popup sub menu
					if (container.top) {
						container.top -= selfOuterHeight + 3;
						container.maxHeight += selfOuterHeight;
					}
					if (container.bottom) {
						container.bottom -= selfOuterHeight + 2;
						container.maxHeight += selfOuterHeight;
					}
					if (container.left) {
						container.left += selfOuterWidth - 2;
						container.maxWidth -= selfOuterWidth;
					}
					if (container.right) {
						container.right += selfOuterWidth - 2;
						container.maxWidth -= selfOuterWidth;
					}
				}
				//check if users width not wider then body-total-width
				if (settings.maxWidth > 0 && settings.maxWidth < container.maxWidth) {
					container.maxWidth = settings.maxWidth;
				}
				//check is custom minWidth not wider then available place
				if(settings.minWidth > 0 && settings.minWidth < container.maxWidth) {
					container.minWidth = settings.minWidth;

					/*
						check if custom minWidth exist, and cannot be greater than specified width
					 */
					if(settings.hasDefaultWidth && container.minWidth > width) {
						container.width = container.minWidth + 'px';
					}
				}
				if (settings.maxHeight > 0 && settings.maxHeight < container.maxHeight) {
					container.maxHeight = settings.maxHeight;
				}
				//check is custom minHeight not higher then available space
				if (settings.minHeight > 0 && settings.minHeight < container.maxHeight) {
					container.minHeight = settings.minHeight + 'px';
				}

				content.maxHeight = (settings.plainMode ? container.maxHeight : (container.maxHeight - footer.minHeight)) + 'px';
				container.maxWidth = container.maxWidth + 'px';
				container.minWidth = container.minWidth + 'px';
				container.maxHeight = container.maxHeight + 'px';
				footer.minHeight = footer.minHeight + 'px';

				return {
					style: {
						container: container,
						footer: footer,
						content: content
					},
					cssClass: {
						container: containerClass,
						content: contentClass
					},
					resize: {
						handles: resizeHandles,
						callbacks: resizeCallbacks
					},
					isTopFooter: isTopFooter
				};
			},
			popupId = globalPopupManager.newId(),
			popupView = new PopupView(popupId, popupContainer, align, close);

		globalPopupManager.add(popupView, owner);

		width = settings.width ? settings.width : width;
		height = settings.height ? settings.height : height;

		// add event listener in the capture period to avoid handler prevented by external event handler.
		if (!settings.multiPopup) {
			unbindCloseListener = bindCloseListener();
		}

		if(!settings.align) {
			settings.align = {};
		}

		var css = generateCss();

		footerContainer.css(css.style.footer);
		contentContainer.css(css.style.content);
		popupContainer.addClass(css.cssClass.container);
		popupContainer.css(css.style.container);
		$('body').append(popupContainer);
		popupContainer.append(contentContainer);
		contentContainer.append(contentElement);

		if (!settings.plainMode) {
			// add separated line between content and footer.
			contentContainer.addClass(css.cssClass.content);

			// add footer
			if (css.isTopFooter) {
				popupContainer.prepend(footerContainer);
			}
			else {
				popupContainer.append(footerContainer);
			}
			if (settings.footer) {
				footerContainer.append(settings.footer);
			}

			if(settings.showActionButtons) {
				footerContainer.append(actionOkButton);
				footerContainer.append(actionCancelButton);
			}

			// add resize feature
			var resizeOptions = {stop: settings.resizeStop};
			css.resize.handles.push(css.resize.handles.join(''));
			resizeOptions.handles = css.resize.handles.join(',');
			if (css.resize.callbacks.length > 0) {
				// If using resizable option 'resize' to handle following logic,
				// it would not run if external handler logic occurs error for event 'resize'.
				unbindResizeListener = bindListener(popupContainer, 'resize', function (e, args) {
					css.resize.callbacks.forEach(function (callback) {
						callback(e, args);
					});
				});
			}
			popupContainer.resizable(resizeOptions);
		}

		if(angular.isNumber(settings.zIndex)) {
			popupContainer.css('z-index', settings.zIndex);
		}

		function bindListener(element, name, listener) {
			element.bind(name, listener);
			return function () {
				element.unbind(name, listener);
			};
		}

		function bindCloseListener() {
			// bind events during the capture period in case element stop propagation
			document.addEventListener('mousedown', onDocumentMouseDown, true);
			document.addEventListener('mousewheel', onDocumentScroll, true);
			// end
			footerContainer.bind('mousedown', onContainerMouseDown);
			popupContainer.bind('mousewheel', onContainerScroll);

			if(settings.showActionButtons) {
				actionOkButton.bind('mousedown', onActionOkButton);
				actionCancelButton.bind('mousedown', onActionCancelButton);
			}

			return function () {
				document.removeEventListener('mousedown', onDocumentMouseDown, true);
				document.removeEventListener('mousewheel', onDocumentScroll, true);
				footerContainer.unbind('mousedown', onContainerMouseDown);
				popupContainer.unbind('mousewheel', onContainerScroll);

				if(settings.showActionButtons) {
					actionOkButton.unbind('mousedown', onActionOkButton);
					actionCancelButton.unbind('mousedown', onActionCancelButton);
				}
			};
		}

		function onDocumentMouseDown(e) {
			var ownerElement = owner[0];

			if (popupView.contains(e.target) || ownerElement.contains(e.target) || ownsModalDialog()) {
				return;
			}
			if (close) {
				close();
			}
		}

		function onActionOkButton() {
			if (okAction) {
				okAction();
			}
		}

		function onActionCancelButton() {
			if (close) {
				close();
			}
		}

		function onDocumentScroll(e) {
			if (popupView.contains(e.target) || ownsModalDialog()) {
				return;
			}
			if (close) {
				close();
			}
		}

		function ownsModalDialog() {
			var dialog = $('div[role="dialog"]');

			if (!dialog.length) {
				return false;
			}

			var dialogZIndex = dialog.last().css('z-index');
			var popupZIndex = popupView.element.css('z-index');
			return dialogZIndex > popupZIndex;
		}

		function onContainerMouseDown(e) {
			// prevent getting focus
			e.preventDefault();
			e.stopPropagation();

			// preventDefault don't work for IE, using "unselectable" solution
			if (e.target.hasAttribute('unselectable')) {
				var unselectable = e.target.getAttribute('unselectable');
				if (unselectable !== 'on') {
					e.target.setAttribute('unselectable', 'on');
					setTimeout(function () {
						e.target.setAttribute('unselectable', unselectable);
					});
				}
			}
			else {
				e.target.setAttribute('unselectable', 'on');
				setTimeout(function () {
					e.target.removeAttribute('unselectable');
				});
			}
		}

		function onContainerScroll(e) {
			e.stopPropagation();
		}

		return popupView;
	};

	/**
	 * @description: select range text of input.
	 * @arguments:
	 *  start: start index
	 *  end: end index.
	 */
	$.fn.selectRange = function (start, end) {
		if (this.length === 0) {
			return this;
		}

		var input = this[0];

		if (input.setSelectionRange) {
			input.focus();
			input.setSelectionRange(start, end);
		}
		else if (input.createTextRange) { // IE support.
			var range = input.createTextRange();
			range.collapse(true);
			range.moveEnd('character', end);
			range.moveEnd('character', start);
			range.select();
		}

		return this;
	};

	function PopupView(id, element, align, close) {
		this.id = id;
		this.element = element;
		this.align = align;
		this.close = close;
		this.parent = null;
		this.children = [];
		this.element.attr('data-id', id);
	}

	PopupView.prototype.contains = function (target) {
		var dom = this.element[0];
		var result = dom.contains(target);

		if(!result && this.children.length){
			result = this.children.some(function (item) {
				return item.contains(target);
			});
		}

		return result;
	};

	PopupView.prototype.destroy = function () {
		this.close();
	};

	function PopupManager() {
		this.id = 0;
		this.popupViews = [];
	}

	PopupManager.prototype.newId = function () {
		return this.id++;
	};

	PopupManager.prototype.getById = function (id) {
		var filters = this.popupViews.filter(function (item) {
			// eslint-disable-next-line eqeqeq
			return item.id == id;
		});
		return filters.length === 0 ? null: filters[0];
	};

	PopupManager.prototype.add = function (popup, owner) {
		var parents = owner.parents('.popup-container');

		if (parents.length) {
			var id = parents.attr('data-id');
			popup.parent = this.getById(id);
			if (popup.parent !== null && popup.parent !== undefined) {
				popup.parent.children.push(popup);
			}
		}

		this.popupViews.push(popup);
	};

	PopupManager.prototype.remove = function (popup) {
		this.popupViews = this.popupViews.filter(function (item) {
			return item !== popup;
		});
		if (popup.parent !== null && popup.parent !== undefined) {
			popup.parent.children = popup.parent.children.filter(function (item) {
				return item !== popup;
			});
		}
	};

})(jQuery);
