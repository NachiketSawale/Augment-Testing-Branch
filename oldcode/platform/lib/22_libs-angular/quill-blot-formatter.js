!(function (e, t) {
	'object' === typeof exports && 'object' === typeof module
		? (module.exports = t(require('Quill')))
		: 'function' === typeof define && define.amd
			? define(['Quill'], t)
			: 'object' === typeof exports
				? (exports.QuillBlotFormatter = t(require('Quill')))
				: (e.QuillBlotFormatter = t(e.Quill));
})(this, function (e) {
	return (function (e) {
		function t(r) {
			if (n[r]) return n[r].exports;
			var o = (n[r] = {i: r, l: !1, exports: {}});
			return e[r].call(o.exports, o, o.exports, t), (o.l = !0), o.exports;
		}

		var n = {};
		return (
			(t.m = e),
			(t.c = n),
			(t.d = function (e, n, r) {
				t.o(e, n) || Object.defineProperty(e, n, {configurable: !1, enumerable: !0, get: r});
			}),
			(t.n = function (e) {
				var n =
						e && e.__esModule
							? function () {
								return e.default;
							}
							: function () {
								return e;
							};
				return t.d(n, 'a', n), n;
			}),
			(t.o = function (e, t) {
				return Object.prototype.hasOwnProperty.call(e, t);
			}),
			(t.p = ''),
			t((t.s = 14))
		);
	})([
		function (e, t, n) {
			'use strict';

			let observer = null;

			function r(e) {
				return e && e.__esModule ? e : {default: e};
			}

			function o(e, t) {
				if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
			}

			Object.defineProperty(t, '__esModule', {value: !0});
			var i = (function () {
					function e(e, t) {
						for (var n = 0; n < t.length; n++) {
							var r = t[n];
							(r.enumerable = r.enumerable || !1), (r.configurable = !0), 'value' in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
						}
					}

					return function (t, n, r) {
						return n && e(t.prototype, n), r && e(t, r), t;
					};
				})(),
				a = n(15),
				l = r(a),
				u = n(4),
				s = r(u),
				c = n(1),
				f = (r(c), n(2)),
				p =
					(r(f),
					function (e, t) {
						return t;
					}),
				d = (function () {
					function e(t) {
						var n = this,
							r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
						o(this, e),
						(this.onClick = function () {
							n.hide();
						}),
						(this.quill = t),
						(this.options = (0, l.default)(s.default, r, {arrayMerge: p})),
						(this.currentSpec = null),
						(this.actions = []),
						(this.overlay = document.createElement('div')),
						this.overlay.classList.add(this.options.overlay.className),
						this.options.overlay.style && Object.assign(this.overlay.style, this.options.overlay.style),
						document.execCommand('enableObjectResizing', !1, 'false'),
						(this.quill.root.parentNode.style.position = this.quill.root.parentNode.style.position || 'relative'),
						this.quill.root.addEventListener('click', this.onClick),
						(this.specs = this.options.specs.map(function (e) {
							return new e(n);
						})),
						this.specs.forEach(function (e) {
							return e.init();
						});
					}

					return (
						i(e, [
							{
								key: 'show',
								value: function (e) {
									let blot = Quill.find(e.img);
									let index = blot.offset(this.quill.scroll);
									observer = new MutationObserver(function(mutations, obs){
										e.formatter.repositionOverlay();
									});
									observer.observe(e.img.parentElement.parentElement, { attributes : true, attributeFilter : ['style'] });
									observer.observe(this.quill.container, { attributes : true, attributeFilter : ['class'] });
									(this.currentSpec = e), this.currentSpec.setSelection(), this.setUserSelect('none'), this.quill.root.parentNode.appendChild(this.overlay), this.repositionOverlay(), this.createActions(e);
									this.quill.setSelection(index + 1, 0);
								},
							},
							{
								key: 'hide',
								value: function () {
									if(this.isDragging) { return; }
									this.currentSpec &&
									(this.currentSpec.onHide(),
									(this.currentSpec = null),
									this.quill.root.parentNode.removeChild(this.overlay),
									this.overlay.style.setProperty('display', 'none'),
									this.setUserSelect(''),
									this.destroyActions());
									if(observer) {
										observer.disconnect();
									}
								},
							},
							{
								key: 'endAction',
								value: function () {
									this.quill.insertText(this.quill.getLength(), '', 'user');
								},
							},
							{
								key: 'update',
								value: function () {
									this.repositionOverlay(),
									this.actions.forEach(function (e) {
										return e.onUpdate();
									});
								},
							},
							{
								key: 'createActions',
								value: function (e) {
									var t = this;
									this.actions = e.getActions().map(function (e) {
										var n = new e(t);
										return n.onCreate(), n;
									});
								},
							},
							{
								key: 'destroyActions',
								value: function () {
									this.actions.forEach(function (e) {
										return e.onDestroy();
									}),
									(this.actions = []);
								},
							},
							{
								key: 'repositionOverlay',
								value: function () {
									if (this.currentSpec) {
										var e = this.currentSpec.getOverlayElement();
										if (e) {
											var t = this.quill.root.parentNode,
												n = e.getBoundingClientRect(),
												r = t.getBoundingClientRect();
											Object.assign(this.overlay.style, {display: 'block', left: n.left - r.left - 1 + t.scrollLeft + 'px', top: n.top - r.top + t.scrollTop + 'px', width: n.width + 'px', height: n.height + 'px'});
										}
									}
								},
							},
							{
								key: 'setUserSelect',
								value: function (e) {
									var t = this;
									['userSelect', 'mozUserSelect', 'webkitUserSelect', 'msUserSelect'].forEach(function (n) {
										t.quill.root.style.setProperty(n, e), document.documentElement && document.documentElement.style.setProperty(n, e);
									});
								},
							},
						]),
						e
					);
				})();
			t.default = d;
		},
		function (e, t, n) {
			'use strict';

			function r(e, t) {
				if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
			}

			Object.defineProperty(t, '__esModule', {value: !0});
			var o = (function () {
					function e(e, t) {
						for (var n = 0; n < t.length; n++) {
							var r = t[n];
							(r.enumerable = r.enumerable || !1), (r.configurable = !0), 'value' in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
						}
					}

					return function (t, n, r) {
						return n && e(t.prototype, n), r && e(t, r), t;
					};
				})(),
				i = n(0),
				a =
					((function (e) {
						e && e.__esModule;
					})(i),
					(function () {
						function e(t) {
							r(this, e), (this.formatter = t);
						}

						return (
							o(e, [
								{
									key: 'onCreate', value: function () {
									}
								},
								{
									key: 'onDestroy', value: function () {
									}
								},
								{
									key: 'onUpdate', value: function () {
									}
								},
							]),
							e
						);
					})());
			t.default = a;
		},
		function (e, t, n) {
			'use strict';

			function r(e) {
				return e && e.__esModule ? e : {default: e};
			}

			function o(e, t) {
				if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
			}

			Object.defineProperty(t, '__esModule', {value: !0});
			var i = (function () {
					function e(e, t) {
						for (var n = 0; n < t.length; n++) {
							var r = t[n];
							(r.enumerable = r.enumerable || !1), (r.configurable = !0), 'value' in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
						}
					}

					return function (t, n, r) {
						return n && e(t.prototype, n), r && e(t, r), t;
					};
				})(),
				a = n(0),
				l = (r(a), n(1)),
				u = (r(l), n(5)),
				s = r(u),
				c = n(9),
				f = r(c),
				p = n(10),
				d = r(p),
				y = (function () {
					function e(t) {
						o(this, e), (this.formatter = t);
					}

					return (
						i(e, [
							{
								key: 'init', value: function () {
								}
							},
							{
								key: 'getActions',
								value: function () {
									return [s.default, f.default, d.default];
								},
							},
							{
								key: 'getTargetElement',
								value: function () {
									return null;
								},
							},
							{
								key: 'getOverlayElement',
								value: function () {
									return this.getTargetElement();
								},
							},
							{
								key: 'setSelection',
								value: function () {
									this.formatter.quill.setSelection(null);
								},
							},
							{
								key: 'onHide', value: function () {
								}
							},
						]),
						e
					);
				})();
			t.default = y;
		},
		function (e, t, n) {
			'use strict';
		},
		function (e, t, n) {
			'use strict';

			function r(e) {
				return e && e.__esModule ? e : {default: e};
			}

			Object.defineProperty(t, '__esModule', {value: !0});
			var o = n(2),
				i = (r(o), n(11)),
				a = r(i),
				l = n(12),
				u = r(l),
				s = {
					specs: [a.default, u.default],
					overlay: {className: 'blot-formatter__overlay', style: {position: 'absolute', boxSizing: 'border-box', border: '1px dashed #444'}},
					align: {
						attribute: 'data-align',
						aligner: {applyStyle: !0},
						icons: {
							left:
								'\n        <svg viewbox="0 0 18 18">\n          <line class="ql-stroke" x1="3" x2="15" y1="9" y2="9"></line>\n          <line class="ql-stroke" x1="3" x2="13" y1="14" y2="14"></line>\n          <line class="ql-stroke" x1="3" x2="9" y1="4" y2="4"></line>\n        </svg>\n      ',
							center:
								'\n        <svg viewbox="0 0 18 18">\n           <line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"></line>\n          <line class="ql-stroke" x1="14" x2="4" y1="14" y2="14"></line>\n          <line class="ql-stroke" x1="12" x2="6" y1="4" y2="4"></line>\n        </svg>\n      ',
							right:
								'\n        <svg viewbox="0 0 18 18">\n          <line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"></line>\n          <line class="ql-stroke" x1="15" x2="5" y1="14" y2="14"></line>\n          <line class="ql-stroke" x1="15" x2="9" y1="4" y2="4"></line>\n        </svg>\n      ',
						},
						toolbar: {
							allowDeselect: !0,
							mainClassName: 'blot-formatter__toolbar',
							mainStyle: {
								position: 'absolute',
								top: '-12px',
								right: '0',
								left: '0',
								height: '0',
								minWidth: '100px',
								font: '12px/1.0 Arial, Helvetica, sans-serif',
								textAlign: 'center',
								color: '#333',
								boxSizing: 'border-box',
								cursor: 'default',
								zIndex: '1',
							},
							buttonClassName: 'blot-formatter__toolbar-button',
							addButtonSelectStyle: !0,
							buttonStyle: {display: 'inline-block', width: '24px', height: '24px', background: 'white', border: '1px solid #999', verticalAlign: 'middle'},
							svgStyle: {display: 'inline-block', width: '24px', height: '24px', background: 'white', border: '1px solid #999', verticalAlign: 'middle'},
						},
					},
					resize: {
						handleClassName: 'blot-formatter__resize-handle',
						handleStyle: {position: 'absolute', height: '12px', width: '12px', backgroundColor: 'white', border: '1px solid #777', boxSizing: 'border-box', opacity: '0.80'},
					},
				};
			t.default = s;
		},
		function (e, t, n) {
			'use strict';

			function r(e) {
				return e && e.__esModule ? e : {default: e};
			}

			function o(e, t) {
				if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
			}

			function i(e, t) {
				if (!e) throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');
				return !t || ('object' !== typeof t && 'function' !== typeof t) ? e : t;
			}

			function a(e, t) {
				if ('function' !== typeof t && null !== t) throw new TypeError('Super expression must either be null or a function, not ' + typeof t);
				(e.prototype = Object.create(t && t.prototype, {constructor: {value: e, enumerable: !1, writable: !0, configurable: !0}})), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
			}

			Object.defineProperty(t, '__esModule', {value: !0});
			var l = (function () {
					function e(e, t) {
						for (var n = 0; n < t.length; n++) {
							var r = t[n];
							(r.enumerable = r.enumerable || !1), (r.configurable = !0), 'value' in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
						}
					}

					return function (t, n, r) {
						return n && e(t.prototype, n), r && e(t, r), t;
					};
				})(),
				u = n(1),
				s = r(u),
				c = n(0),
				f = (r(c), n(6)),
				p = r(f),
				d = (n(3), n(7), n(8)),
				y = r(d),
				h = (function (e) {
					function t(e) {
						o(this, t);
						var n = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
						return (n.aligner = new p.default(e.options.align)), (n.toolbar = new y.default()), n;
					}

					return (
						a(t, e),
						l(t, [
							{
								key: 'onCreate',
								value: function () {
									var e = this.toolbar.create(this.formatter, this.aligner);
									this.formatter.overlay.appendChild(e);
								},
							},
							{
								key: 'onDestroy',
								value: function () {
									var e = this.toolbar.getElement();
									e && (this.formatter.overlay.removeChild(e), this.toolbar.destroy());
								},
							},
						]),
						t
					);
				})(s.default);
			t.default = h;
		},
		function (e, t, n) {
			'use strict';

			function r(e, t, n) {
				return t in e ? Object.defineProperty(e, t, {value: n, enumerable: !0, configurable: !0, writable: !0}) : (e[t] = n), e;
			}

			function o(e, t) {
				if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
			}

			Object.defineProperty(t, '__esModule', {value: !0});
			var i = (function () {
					function e(e, t) {
						for (var n = 0; n < t.length; n++) {
							var r = t[n];
							(r.enumerable = r.enumerable || !1), (r.configurable = !0), 'value' in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
						}
					}

					return function (t, n, r) {
						return n && e(t.prototype, n), r && e(t, r), t;
					};
				})(),
				a = (n(3), 'left'),
				l = 'center',
				u = 'right',
				s = (function () {
					function e(t) {
						var n,
							i = this;
						o(this, e),
						(this.applyStyle = t.aligner.applyStyle),
						(this.alignAttribute = t.attribute),
						(this.alignments =
								((n = {}),
								r(n, a, {
									name: a,
									icon: t.icons.left,
									apply: function (e) {
										i.setAlignment(e, a), i.setStyle(e, 'inline', 'left', '0 1em 1em 0');
									},
								}),
								r(n, l, {
									name: l,
									icon: t.icons.center,
									apply: function (e) {
										i.setAlignment(e, l), i.setStyle(e, 'block', null, 'auto');
									},
								}),
								r(n, u, {
									name: u,
									icon: t.icons.right,
									apply: function (e) {
										i.setAlignment(e, u), i.setStyle(e, 'inline', 'right', '0 0 1em 1em');
									},
								}),
								n));
					}

					return (
						i(e, [
							{
								key: 'getAlignments',
								value: function () {
									var e = this;
									return Object.keys(this.alignments).map(function (t) {
										return e.alignments[t];
									});
								},
							},
							{
								key: 'clear',
								value: function (e) {
									e.removeAttribute(this.alignAttribute), this.setStyle(e, null, null, null);
								},
							},
							{
								key: 'isAligned',
								value: function (e, t) {
									return e.getAttribute(this.alignAttribute) === t.name || e.style.float === t.name;
								},
							},
							{
								key: 'setAlignment',
								value: function (e, t) {
									e.setAttribute(this.alignAttribute, t);
								},
							},
							{
								key: 'setStyle',
								value: function (e, t, n, r) {
									this.applyStyle && (e.style.setProperty('display', t), e.style.setProperty('float', n), e.style.setProperty('margin', r));
								},
							},
						]),
						e
					);
				})();
			t.default = s;
		},
		function (e, t, n) {
			'use strict';
			var r = (n(3), n(0));
			!(function (e) {
				e && e.__esModule;
			})(r);
		},
		function (e, t, n) {
			'use strict';

			function r(e, t) {
				if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
			}

			Object.defineProperty(t, '__esModule', {value: !0});
			var o = (function () {
					function e(e, t) {
						for (var n = 0; n < t.length; n++) {
							var r = t[n];
							(r.enumerable = r.enumerable || !1), (r.configurable = !0), 'value' in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
						}
					}

					return function (t, n, r) {
						return n && e(t.prototype, n), r && e(t, r), t;
					};
				})(),
				i = (n(7), n(3), n(0)),
				a =
					((function (e) {
						e && e.__esModule;
					})(i),
					(function () {
						function e() {
							r(this, e), (this.toolbar = null), (this.buttons = []);
						}

						return (
							o(e, [
								{
									key: 'create',
									value: function (e, t) {
										var n = document.createElement('div');
										return this.addInputField(e, n, t), (this.toolbar = n), this.toolbar;
										// return n.classList.add(e.options.align.toolbar.mainClassName), this.addToolbarStyle(e, n), (this.toolbar = n), this.toolbar;
									},
								},
								{
									key: 'destroy',
									value: function () {
										(this.toolbar = null), (this.buttons = []);
									},
								},
								{
									key: 'getElement',
									value: function () {
										return this.toolbar;
									},
								},
								{
									key: 'addToolbarStyle',
									value: function (e, t) {
										e.options.align.toolbar.mainStyle && Object.assign(t.style, e.options.align.toolbar.mainStyle);
									},
								},
								{
									key: 'addButtonStyle',
									value: function (e, t, n) {
										n.options.align.toolbar.buttonStyle && (Object.assign(e.style, n.options.align.toolbar.buttonStyle), t > 0 && (e.style.borderLeftWidth = '0')),
										n.options.align.toolbar.svgStyle && Object.assign(e.children[0].style, n.options.align.toolbar.svgStyle);
									},
								},
								{
									key: 'addInputStyle',
									value: function (e, t) {
										e.options.inputGroup.mainStyle && Object.assign(t.style, e.options.inputGroup.mainStyle);
									},
								},
								{
									key: 'addInputField',
									value: function (e, t, n) {
										let data = e.quill.options.modules.table.scope.customSettings;
										let unit;
										if (data.user.useSettings) {
											unit = data.user.unitOfMeasurement;
										}
										else {
											unit = data.system.unitOfMeasurement;
										}
										let imgWidth = e.quill.options.modules.blotFormatter.platformWysiwygEditorSettingsService.convertInRequiredUnit(unit, 'px', e.currentSpec.img.clientWidth).toFixed(2);
 										let imgHeight = e.quill.options.modules.blotFormatter.platformWysiwygEditorSettingsService.convertInRequiredUnit(unit, 'px', e.currentSpec.img.clientHeight).toFixed(2);

										e.quill.options.modules.table.scope.imgWidth = imgWidth;
										e.quill.options.modules.table.scope.imgHeight = imgHeight;
										e.quill.options.modules.table.scope.e=e;


										var b = e.quill.options.modules.blotFormatter.platformImageResizeService.getElement(e.quill.options.modules.table.scope);

										t.appendChild(b[0]);
									},
								},
								{
									key: 'addButtons',
									value: function (e, t, n) {
										var r = this;
										n.getAlignments().forEach(function (o, i) {
											var a = document.createElement('span');
											a.classList.add(e.options.align.toolbar.buttonClassName),
											(a.innerHTML = o.icon),
											a.addEventListener('click', function () {
												r.onButtonClick(a, e, o, n);
											}),
											r.preselectButton(a, o, e, n),
											r.addButtonStyle(a, i, e),
											r.buttons.push(a),
											t.appendChild(a);
										});
									},
								},
								{
									key: 'preselectButton',
									value: function (e, t, n, r) {
										if (n.currentSpec) {
											var o = n.currentSpec.getTargetElement();
											o && r.isAligned(o, t) && this.selectButton(n, e);
										}
									},
								},
								{
									key: 'onButtonClick',
									value: function (e, t, n, r) {
										if (t.currentSpec) {
											var o = t.currentSpec.getTargetElement();
											o && this.clickButton(e, o, t, n, r);
											if(t.options.alignBtnClickHandler) {
												t.options.alignBtnClickHandler(e, {alignment: n.name, image: o});
											}
										}
									},
								},
								{
									key: 'clickButton',
									value: function (e, t, n, r, o) {
										var i = this;
										this.buttons.forEach(function (e) {
											i.deselectButton(n, e);
										}),
										o.isAligned(t, r) ? (n.options.align.toolbar.allowDeselect ? o.clear(t) : this.selectButton(n, e)) : (this.selectButton(n, e), r.apply(t)),
										n.update();
										n.endAction();
									},
								},
								{
									key: 'selectButton',
									value: function (e, t) {
										t.classList.add('is-selected'), e.options.align.toolbar.addButtonSelectStyle && t.style.setProperty('filter', 'invert(20%)');
									},
								},
								{
									key: 'deselectButton',
									value: function (e, t) {
										t.classList.remove('is-selected'), e.options.align.toolbar.addButtonSelectStyle && t.style.removeProperty('filter');
									},
								},
							]),
							e
						);
					})());
			t.default = a;
		},
		function (e, t, n) {
			'use strict';

			function r(e) {
				return e && e.__esModule ? e : {default: e};
			}

			function o(e, t) {
				if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
			}

			function i(e, t) {
				if (!e) throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');
				return !t || ('object' !== typeof t && 'function' !== typeof t) ? e : t;
			}

			function a(e, t) {
				if ('function' !== typeof t && null !== t) throw new TypeError('Super expression must either be null or a function, not ' + typeof t);
				(e.prototype = Object.create(t && t.prototype, {constructor: {value: e, enumerable: !1, writable: !0, configurable: !0}})), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
			}

			Object.defineProperty(t, '__esModule', {value: !0});
			var l = (function () {
					function e(e, t) {
						for (var n = 0; n < t.length; n++) {
							var r = t[n];
							(r.enumerable = r.enumerable || !1), (r.configurable = !0), 'value' in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
						}
					}

					return function (t, n, r) {
						return n && e(t.prototype, n), r && e(t, r), t;
					};
				})(),
				u = n(1),
				s = r(u),
				c = n(0),
				f =
					(r(c),
					(function (e) {
						function t(e) {
							o(this, t);
							var n = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
							return (
								(n.onMouseDown = function (e) {
									if (e.target instanceof HTMLElement && ((n.dragHandle = e.target), n.setCursor(n.dragHandle.style.cursor), n.formatter.currentSpec)) {
										var t = n.formatter.currentSpec.getTargetElement();
										if (t) {
											var r = t.getBoundingClientRect();
											(n.dragStartX = e.clientX), (n.preDragWidth = r.width), (n.targetRatio = r.height / r.width), document.addEventListener('mousemove', n.onDrag), document.addEventListener('mouseup', n.onMouseUp);
										}
									}
								}),
							(n.onDrag = function (e) {
									if (n.formatter.currentSpec) {
										n.formatter.quill.setSelection(null);
										var t = n.formatter.currentSpec.getTargetElement();
										if (t) {
											var r = e.clientX - n.dragStartX,
												o = 0;
											o = n.dragHandle === n.topLeftHandle || n.dragHandle === n.bottomLeftHandle ? Math.round(n.preDragWidth - r) : Math.round(n.preDragWidth + r);
											var i = n.targetRatio * o;
											let widthInMm = Math.floor(o * 0.264583);
											t.setAttribute('width', '' + o), t.setAttribute('style', 'width:' + widthInMm + 'mm'), t.setAttribute('height', '' + i), n.formatter.update();
											let data = n.formatter.currentSpec.formatter.quill.options.modules.table.scope.customSettings;
											let unit;
											if (data.user.useSettings) {
												unit = data.user.unitOfMeasurement;
											}
											else {
												unit = data.system.unitOfMeasurement;
											}
											let imgWidth = n.formatter.currentSpec.formatter.quill.options.modules.blotFormatter.platformWysiwygEditorSettingsService.convertInRequiredUnit(unit, 'px', t.clientWidth).toFixed(2);
											let inputWidth = document.getElementById('idWidth');
											inputWidth.value = imgWidth;
											n.formatter.currentSpec.formatter.quill.options.modules.table.scope.imgWidth=imgWidth;

											if (t.clientWidth < 220) {
												n.bottomRightHandle.style.borderColor = 'white';
											}
											else {
												n.bottomRightHandle.style.border = ' 1px solid rgb(119, 119, 119)';
											}

											let imgHeight = n.formatter.currentSpec.formatter.quill.options.modules.blotFormatter.platformWysiwygEditorSettingsService.convertInRequiredUnit(unit, 'px', t.clientHeight).toFixed(2);
											let inputHeight = document.getElementById('idHeight');
											inputHeight.value = imgHeight;
											n.formatter.currentSpec.formatter.quill.options.modules.table.scope.imgHeight=imgHeight;
										}
									}
								}),
								(n.onMouseUp = function () {
									n.setCursor(''), document.removeEventListener('mousemove', n.onDrag), document.removeEventListener('mouseup', n.onMouseUp);
									n.formatter.endAction();
									let blot = Quill.find(e.currentSpec.img);
									let index = blot.offset(n.formatter.quill.scroll);
									n.formatter.quill.setSelection(index + 1, 0);
								}),
								(n.topLeftHandle = n.createHandle('top-left', 'nwse-resize')),
								(n.topRightHandle = n.createHandle('top-right', 'nesw-resize')),
								(n.bottomRightHandle = n.createHandle('bottom-right', 'nwse-resize')),
								(n.bottomLeftHandle = n.createHandle('bottom-left', 'nesw-resize')),
								(n.dragHandle = null),
								(n.dragStartX = 0),
								(n.preDragWidth = 0),
								(n.targetRatio = 0),
								n
							);
						}

						return (
							a(t, e),
							l(t, [
								{
									key: 'onCreate',
									value: function () {
										this.formatter.overlay.appendChild(this.topLeftHandle),
										this.formatter.overlay.appendChild(this.topRightHandle),
										this.formatter.overlay.appendChild(this.bottomRightHandle),
										this.formatter.overlay.appendChild(this.bottomLeftHandle),
										this.repositionHandles(this.formatter.options.resize.handleStyle);
									},
								},
								{
									key: 'onDestroy',
									value: function () {
										this.setCursor(''),
										this.formatter.overlay.removeChild(this.topLeftHandle),
										this.formatter.overlay.removeChild(this.topRightHandle),
										this.formatter.overlay.removeChild(this.bottomRightHandle),
										this.formatter.overlay.removeChild(this.bottomLeftHandle);
									},
								},
								{
									key: 'createHandle',
									value: function (e, t) {
										var n = document.createElement('div');
										return (
											n.classList.add(this.formatter.options.resize.handleClassName),
											n.setAttribute('data-position', e),
											(n.style.cursor = t),
											this.formatter.options.resize.handleStyle && Object.assign(n.style, this.formatter.options.resize.handleStyle),
											n.addEventListener('mousedown', this.onMouseDown),
											n
										);
									},
								},
								{
									key: 'repositionHandles',
									value: function (e) {
										var t = '0px',
											n = '0px';
										e && (e.width && (t = -parseFloat(e.width) / 2 + 'px'), e.height && (n = -parseFloat(e.height) / 2 + 'px')),
										Object.assign(this.topLeftHandle.style, {left: t, top: n}),
										Object.assign(this.topRightHandle.style, {right: t, top: n}),
										Object.assign(this.bottomRightHandle.style, {right: t, bottom: n}),
										Object.assign(this.bottomLeftHandle.style, {left: t, bottom: n});
									},
								},
								{
									key: 'setCursor',
									value: function (e) {
										if ((document.body && (document.body.style.cursor = e), this.formatter.currentSpec)) {
											var t = this.formatter.currentSpec.getOverlayElement();
											t && (t.style.cursor = e);
										}
									},
								},
							]),
							t
						);
					})(s.default));
			t.default = f;
		},
		function (e, t, n) {
			'use strict';

			function r(e) {
				return e && e.__esModule ? e : {default: e};
			}

			function o(e, t) {
				if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
			}

			function i(e, t) {
				if (!e) throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');
				return !t || ('object' !== typeof t && 'function' !== typeof t) ? e : t;
			}

			function a(e, t) {
				if ('function' !== typeof t && null !== t) throw new TypeError('Super expression must either be null or a function, not ' + typeof t);
				(e.prototype = Object.create(t && t.prototype, {constructor: {value: e, enumerable: !1, writable: !0, configurable: !0}})), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
			}

			Object.defineProperty(t, '__esModule', {value: !0});
			var l = (function () {
					function e(e, t) {
						for (var n = 0; n < t.length; n++) {
							var r = t[n];
							(r.enumerable = r.enumerable || !1), (r.configurable = !0), 'value' in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
						}
					}

					return function (t, n, r) {
						return n && e(t.prototype, n), r && e(t, r), t;
					};
				})(),
				u = n(16),
				s = r(u),
				c = n(1),
				f = r(c),
				p = (function (e) {
					function t() {
						var e, n, r, a;
						o(this, t);
						for (var l = arguments.length, u = Array(l), c = 0; c < l; c++) u[c] = arguments[c];
						return (
							(n = r = i(this, (e = t.__proto__ || Object.getPrototypeOf(t)).call.apply(e, [this].concat(u)))),
							(r.onKeyUp = function (e) {
								if (r.formatter.currentSpec && (46 === e.keyCode || 8 === e.keyCode)) {
									if (
										(e.keyCode !== 8 && e.srcElement.tagName !== 'input') ||
										(e.keyCode === 8 && r.formatter.currentSpec.img === 'img')
									) {
										let t = s.default.find(r.formatter.currentSpec.getTargetElement());
										let current;

										if (t && t.domNode) {
											current = Quill.find(t.domNode).offset(r.formatter.quill.scroll);
										}

										t && t.deleteAt(0);
										r.formatter.hide();
										r.formatter.endAction();

										if (current) {
											r.formatter.quill.setSelection(current);
										}

										if (e.keyCode === 8 && r.formatter.currentSpec.img === 'img') {
											r.formatter.repositionOverlay();
										}
									}
								}
							}),
							(a = n),
							i(r, a)
						);
					}

					return (
						a(t, e),
						l(t, [
							{
								key: 'onCreate',
								value: function () {
									document.addEventListener('keyup', this.onKeyUp, !0),
									this.formatter.quill.root.addEventListener('input', this.onKeyUp, !0);
								},
							},
							{
								key: 'onDestroy',
								value: function () {
									document.removeEventListener('keyup', this.onKeyUp), this.formatter.quill.root.removeEventListener('input', this.onKeyUp);
								},
							},
						]),
						t
					);
				})(f.default);
			t.default = p;
		},
		function (e, t, n) {
			'use strict';

			function r(e) {
				return e && e.__esModule ? e : {default: e};
			}

			function o(e, t) {
				if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
			}

			function i(e, t) {
				if (!e) throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');
				return !t || ('object' !== typeof t && 'function' !== typeof t) ? e : t;
			}

			function a(e, t) {
				if ('function' !== typeof t && null !== t) throw new TypeError('Super expression must either be null or a function, not ' + typeof t);
				(e.prototype = Object.create(t && t.prototype, {constructor: {value: e, enumerable: !1, writable: !0, configurable: !0}})), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
			}

			Object.defineProperty(t, '__esModule', {value: !0});
			var l = (function () {
					function e(e, t) {
						for (var n = 0; n < t.length; n++) {
							var r = t[n];
							(r.enumerable = r.enumerable || !1), (r.configurable = !0), 'value' in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
						}
					}

					return function (t, n, r) {
						return n && e(t.prototype, n), r && e(t, r), t;
					};
				})(),
				u = n(2),
				s = r(u),
				c = n(0),
				f =
					(r(c),
					(function (e) {
						function t(e) {
							o(this, t);
							var n = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
							return (
								(n.onClick = function (e) {
									var t = e.target;
									t instanceof HTMLElement && 'IMG' === t.tagName && ((n.img = t), n.formatter.show(n));
								}),
								(n.img = null),
								n
							);
						}

						return (
							a(t, e),
							l(t, [
								{
									key: 'init',
									value: function () {
										this.formatter.quill.root.addEventListener('click', this.onClick);

										// handling scroll event
										this.formatter.quill.root.addEventListener('scroll', () => {
											this.formatter.repositionOverlay();
										});
									},
								},
								{
									key: 'getTargetElement',
									value: function () {
										return this.img;
									},
								},
								{
									key: 'onHide',
									value: function () {
										this.img = null;
									},
								},
							]),
							t
						);
					})(s.default));
			t.default = f;
		},
		function (e, t, n) {
			'use strict';

			function r(e) {
				return e && e.__esModule ? e : {default: e};
			}

			function o(e, t) {
				if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
			}

			function i(e, t) {
				if (!e) throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');
				return !t || ('object' !== typeof t && 'function' !== typeof t) ? e : t;
			}

			function a(e, t) {
				if ('function' !== typeof t && null !== t) throw new TypeError('Super expression must either be null or a function, not ' + typeof t);
				(e.prototype = Object.create(t && t.prototype, {constructor: {value: e, enumerable: !1, writable: !0, configurable: !0}})), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
			}

			Object.defineProperty(t, '__esModule', {value: !0});
			var l = n(13),
				u = r(l),
				s = n(0),
				c =
					(r(s),
					(function (e) {
						function t(e) {
							return o(this, t), i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, 'iframe.ql-video'));
						}

						return a(t, e), t;
					})(u.default));
			t.default = c;
		},
		function (e, t, n) {
			'use strict';

			function r(e) {
				return e && e.__esModule ? e : {default: e};
			}

			function o(e, t) {
				if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
			}

			function i(e, t) {
				if (!e) throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');
				return !t || ('object' !== typeof t && 'function' !== typeof t) ? e : t;
			}

			function a(e, t) {
				if ('function' !== typeof t && null !== t) throw new TypeError('Super expression must either be null or a function, not ' + typeof t);
				(e.prototype = Object.create(t && t.prototype, {constructor: {value: e, enumerable: !1, writable: !0, configurable: !0}})), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
			}

			Object.defineProperty(t, '__esModule', {value: !0});
			var l = (function () {
					function e(e, t) {
						for (var n = 0; n < t.length; n++) {
							var r = t[n];
							(r.enumerable = r.enumerable || !1), (r.configurable = !0), 'value' in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
						}
					}

					return function (t, n, r) {
						return n && e(t.prototype, n), r && e(t, r), t;
					};
				})(),
				u = n(2),
				s = r(u),
				c = n(0),
				f = (r(c), 'data-blot-formatter-unclickable-bound'),
				p = (function (e) {
					function t(e, n) {
						o(this, t);
						var r = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
						return (
							(r.onTextChange = function () {
								Array.from(document.querySelectorAll(r.selector + ':not([' + f + '])')).forEach(function (e) {
									e.setAttribute(f, 'true'), e.addEventListener('mouseenter', r.onMouseEnter);
								});
							}),
							(r.onMouseEnter = function (e) {
								var t = e.target;
								t instanceof HTMLElement && ((r.nextUnclickable = t), r.repositionProxyImage(r.nextUnclickable));
							}),
							(r.onProxyImageClick = function () {
								(r.unclickable = r.nextUnclickable), (r.nextUnclickable = null), r.formatter.show(r), r.hideProxyImage();
							}),
							(r.selector = n),
							(r.unclickable = null),
							(r.nextUnclickable = null),
							r
						);
					}

					return (
						a(t, e),
						l(t, [
							{
								key: 'init',
								value: function () {
									document.body && document.body.appendChild(this.createProxyImage()),
									this.hideProxyImage(),
									this.proxyImage.addEventListener('click', this.onProxyImageClick),
									this.formatter.quill.on('text-change', this.onTextChange);
								},
							},
							{
								key: 'getTargetElement',
								value: function () {
									return this.unclickable;
								},
							},
							{
								key: 'getOverlayElement',
								value: function () {
									return this.unclickable;
								},
							},
							{
								key: 'onHide',
								value: function () {
									this.hideProxyImage(), (this.nextUnclickable = null), (this.unclickable = null);
								},
							},
							{
								key: 'createProxyImage',
								value: function () {
									var e = document.createElement('canvas'),
										t = e.getContext('2d');
									return (
										(t.globalAlpha = 0),
										t.fillRect(0, 0, 1, 1),
										(this.proxyImage = document.createElement('img')),
										(this.proxyImage.src = e.toDataURL('image/png')),
										this.proxyImage.classList.add('blot-formatter__proxy-image'),
										Object.assign(this.proxyImage.style, {position: 'absolute', margin: '0'}),
										this.proxyImage
									);
								},
							},
							{
								key: 'hideProxyImage',
								value: function () {
									Object.assign(this.proxyImage.style, {display: 'none'});
								},
							},
							{
								key: 'repositionProxyImage',
								value: function (e) {
									var t = e.getBoundingClientRect();
									Object.assign(this.proxyImage.style, {display: 'block', left: t.left + window.pageXOffset + 'px', top: t.top + window.pageYOffset + 'px', width: t.width + 'px', height: t.height + 'px'});
								},
							},
						]),
						t
					);
				})(s.default);
			t.default = p;
		},
		function (e, t, n) {
			'use strict';

			function r(e) {
				return e && e.__esModule ? e : {default: e};
			}

			Object.defineProperty(t, '__esModule', {value: !0});
			var o = n(4);
			Object.defineProperty(t, 'DefaultOptions', {
				enumerable: !0,
				get: function () {
					return r(o).default;
				},
			});
			var i = n(0);
			Object.defineProperty(t, 'default', {
				enumerable: !0,
				get: function () {
					return r(i).default;
				},
			});
			var a = n(1);
			Object.defineProperty(t, 'Action', {
				enumerable: !0,
				get: function () {
					return r(a).default;
				},
			});
			var l = n(5);
			Object.defineProperty(t, 'AlignAction', {
				enumerable: !0,
				get: function () {
					return r(l).default;
				},
			});
			var u = n(6);
			Object.defineProperty(t, 'DefaultAligner', {
				enumerable: !0,
				get: function () {
					return r(u).default;
				},
			});
			var s = n(8);
			Object.defineProperty(t, 'DefaultToolbar', {
				enumerable: !0,
				get: function () {
					return r(s).default;
				},
			});
			var c = n(10);
			Object.defineProperty(t, 'DeleteAction', {
				enumerable: !0,
				get: function () {
					return r(c).default;
				},
			});
			var f = n(9);
			Object.defineProperty(t, 'ResizeAction', {
				enumerable: !0,
				get: function () {
					return r(f).default;
				},
			});
			var p = n(2);
			Object.defineProperty(t, 'BlotSpec', {
				enumerable: !0,
				get: function () {
					return r(p).default;
				},
			});
			var d = n(11);
			Object.defineProperty(t, 'ImageSpec', {
				enumerable: !0,
				get: function () {
					return r(d).default;
				},
			});
			var y = n(13);
			Object.defineProperty(t, 'UnclickableBlotSpec', {
				enumerable: !0,
				get: function () {
					return r(y).default;
				},
			});
			var h = n(12);
			Object.defineProperty(t, 'IframeVideoSpec', {
				enumerable: !0,
				get: function () {
					return r(h).default;
				},
			});
		},
		function (e, t, n) {
			'use strict';

			function r(e) {
				return !!e && 'object' === typeof e;
			}

			function o(e) {
				var t = Object.prototype.toString.call(e);
				return '[object RegExp]' === t || '[object Date]' === t || i(e);
			}

			function i(e) {
				return e.$$typeof === d;
			}

			function a(e) {
				return Array.isArray(e) ? [] : {};
			}

			function l(e, t) {
				return (t && !1 === t.clone) || !f(e) ? e : c(a(e), e, t);
			}

			function u(e, t, n) {
				return e.concat(t).map(function (e) {
					return l(e, n);
				});
			}

			function s(e, t, n) {
				var r = {};
				return (
					f(e) &&
					Object.keys(e).forEach(function (t) {
						r[t] = l(e[t], n);
					}),
					Object.keys(t).forEach(function (o) {
						f(t[o]) && e[o] ? (r[o] = c(e[o], t[o], n)) : (r[o] = l(t[o], n));
					}),
					r
				);
			}

			function c(e, t, n) {
				var r = Array.isArray(t),
					o = Array.isArray(e),
					i = n || {arrayMerge: u};
				if (r === o) return r ? (i.arrayMerge || u)(e, t, n) : s(e, t, n);
				return l(t, n);
			}

			Object.defineProperty(t, '__esModule', {value: !0});
			var f = function (e) {
					return r(e) && !o(e);
				},
				p = 'function' === typeof Symbol && Symbol.for,
				d = p ? Symbol.for('react.element') : 60103;
			c.all = function (e, t) {
				if (!Array.isArray(e)) throw new Error('first argument should be an array');
				return e.reduce(function (e, n) {
					return c(e, n, t);
				}, {});
			};
			var y = c;
			t.default = y;
		},
		function (t, n) {
			t.exports = e;
		},
	]);
});
