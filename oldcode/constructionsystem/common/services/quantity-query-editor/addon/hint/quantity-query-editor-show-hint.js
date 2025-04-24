// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
/* jshint -W089 */
/* jshint -W004 */
/* jshint -W071 */
/* jshint -W073 */
/* globals define,CodeMirror */
(function (angular){
	'use strict';

	var moduleName = 'constructionsystem.common';

	angular.module(moduleName).factory('constructionsystemCommonQuantityQueryEditorShowHintService', ['$http',
		function ($http) {
			var HINT_ELEMENT_CLASS = 'CodeMirror-hint';
			var ACTIVE_HINT_ELEMENT_CLASS = 'CodeMirror-hint-active';
			var CODEMIRROR_HINTS_QUANTITYQUERY_NOTAB = 'CodeMirror-hints-QuantityQuery-noTab';
			var CODEMIRROR_CONTAINER_QuantityQuery_OUTMOST_NOPICTURE = 'CodeMirror-container-QuantityQuery-outMost-noPicture';
			//
			// .CodeMirror-Tree-Common-QuantityQuery {}

			// .CodeMirror-ParentLi-QuantityQuery {}
			// .CodeMirror-ParentLi-QuantityQuery-Active
			//
			// .CodeMirror-ChildLi-QuantityQuery {}
			// .CodeMirror-ChildLi-QuantityQuery-Active {}
			//
			var CodeMirror_Tree_Common_QuantityQuery = 'CodeMirror-Tree-Common-QuantityQuery';
			var CodeMirror_ParentLi_QuantityQuery = 'CodeMirror-ParentLi-QuantityQuery';
			var CodeMirror_ParentLi_QuantityQuery_Img = 'CodeMirror-ParentLi-QuantityQuery-Img';
			var CodeMirror_ParentLi_QuantityQuery_Span = 'CodeMirror-ParentLi-QuantityQuery-Span';
			var CodeMirror_ChildLi_QuantityQuery = 'CodeMirror-ChildLi-QuantityQuery';
			var CodeMirror_ChildLi_QuantityQuery_Active = 'CodeMirror-ChildLi-QuantityQuery-Active';

			var defaultOptions;
			var selectedTabIndex = 1;
			var tabObjectsArray = [];

			// This is the old interface, kept around for now to stay
			// backwards-compatible.
			CodeMirror.showHintQuantityQueryEditor = function (cm, getHints, options) {
				if (!getHints) {
					return cm.showHintQuantityQueryEditor(options);
				}
				if (options && options.async) {
					getHints.async = true;
				}
				var newOpts = {hint: getHints};
				if (options) {
					for (var prop in options) {
						newOpts[prop] = options[prop];
					}
				}
				return cm.showHintQuantityQueryEditor(newOpts);
			};

			CodeMirror.defineExtension('showHintQuantityQueryEditor', function (options) {
				selectedTabIndex = 1;
				options = parseOptions(this, this.getCursor('start'), options);
				var selections = this.listSelections();
				if (selections.length > 1) {
					return;
				}
				// By default, don't allow completion when something is selected.
				// A hint function can have a `supportsSelection` property to
				// indicate that it can handle selections.
				if (this.somethingSelected()) {
					if (!options.hint.supportsSelection) {
						return;
					}
					// Don't try with cross-line selections
					for (var i = 0; i < selections.length; i++) {
						if (selections[i].head.line !== selections[i].anchor.line) {
							return;
						}
					}
				}

				if (this.state.completionActive) {
					this.state.completionActive.close();
				}
				var completion = this.state.completionActive = new Completion(this, options);
				if (!completion.options.hint) {
					return;
				}

				CodeMirror.signal(this, 'startCompletion', this);
				completion.update(true);
			});

			function Completion(cm, options) {
				this.cm = cm;
				this.options = options;
				this.widget = null;
				this.debounce = 0;
				this.tick = 0;
				this.startPos = this.cm.getCursor('start');
				this.startLen = this.cm.getLine(this.startPos.line).length - this.cm.getSelection().length;
				var self = this;
				cm.on('cursorActivity', this.activityFunc = function () {
					self.cursorActivity();
				});
			}

			var requestAnimationFrame = window.requestAnimationFrame || function (fn) {
				return setTimeout(fn, 1000 / 60);
			};
			var cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;

			Completion.prototype = {
				close: function () {
					if (!this.active()) {
						return;
					}
					this.cm.state.completionActive = null;
					this.tick = null;
					this.cm.off('cursorActivity', this.activityFunc);

					if (this.widget && this.data) {
						CodeMirror.signal(this.data, 'close');
					}
					if (this.widget) {
						this.widget.close();
					}
					CodeMirror.signal(this.cm, 'endCompletion', this.cm);
				},

				active: function () {
					return this.cm.state.completionActive === this;
				},

				pick: function (data, i) {
					var completion = data.list[i];
					if (completion.hint) {
						completion.hint(this.cm, data, completion);
					} else {
						this.cm.replaceRange(getValue(completion), completion.from || data.from,
							completion.to || data.to, 'complete');
					}
					CodeMirror.signal(data, 'pick', completion);
					this.cm.scrollIntoView();
					this.close();
				},

				cursorActivity: function () {
					if (this.debounce) {
						cancelAnimationFrame(this.debounce);
						this.debounce = 0;
					}

					var pos = this.cm.getCursor(), line = this.cm.getLine(pos.line);
					if (pos.line !== this.startPos.line || line.length - pos.ch !== this.startLen - this.startPos.ch ||
						pos.ch < this.startPos.ch || this.cm.somethingSelected() ||
						(pos.ch && this.options.closeCharacters.test(line.charAt(pos.ch - 1)))) {
						this.close();
					} else {
						var self = this;
						this.debounce = requestAnimationFrame(function () {
							self.update();
						});
						if (this.widget) {
							this.widget.disable();
						}
					}
				},

				update: function (first) {
					if (this.tick === null && this.tick === undefined) {
						return;
					}
					if (!this.options.hint.async) {
						this.finishUpdate(this.options.hint(this.cm, this.options), first);
					} else {
						var myTick = ++this.tick, self = this;
						this.options.hint(this.cm, function (data) {
							if (self.tick === myTick) {
								self.finishUpdate(data, first);
							}
						}, this.options);
					}
				},

				finishUpdate: function (data, first) {
					if (this.data) {
						CodeMirror.signal(this.data, 'update');
					}
					if (data && this.data && CodeMirror.cmpPos(data.from, this.data.from)) {
						data = null;
					}
					this.data = data;

					var picked = (this.widget && this.widget.picked) || (first && this.options.completeSingle);
					if (this.widget) {
						this.widget.close();
					}
					if (data && data.list.length) {
						if (picked && data.list.length === 1) {
							this.pick(data, 0);
						} else {
							this.widget = new Widget(this, data);
							CodeMirror.signal(data, 'shown');
						}
					}
				}
			};

			function parseOptions(cm, pos, options) {
				var editor = cm.options.hintOptions;
				var out = {};
				var prop;
				for (prop in defaultOptions) {
					out[prop] = defaultOptions[prop];
				}
				if (editor) {
					for (prop in editor) {
						if (editor[prop] !== undefined) {
							out[prop] = editor[prop];
						}
					}
				}
				if (options) {
					for (prop in options) {
						if (options[prop] !== undefined) {
							out[prop] = options[prop];
						}
					}
				}
				if (out.hint.resolve) {
					out.hint = out.hint.resolve(cm, pos);
				}
				return out;
			}

			function getValue(completion) {
				if (typeof completion === 'string') {
					return completion;
				} else {
					return completion.value || completion.text;
				}
			}

			function getText(completion) {
				if (typeof completion === 'string') {
					return completion;
				} else {
					return completion.text;
				}
			}

			function buildKeyMap(completion, handle) {
				var baseMap = {
					Up: function () {
						handle.moveFocus(-1);
					},
					Down: function () {
						handle.moveFocus(1);
					},
					Left: function () {
						if (selectedTabIndex >= 1) {
							selectedTabIndex = selectedTabIndex - 1;
						} else {
							selectedTabIndex = 3;
						}
						if (tabObjectsArray[selectedTabIndex].click) {
							tabObjectsArray[selectedTabIndex].click();
						}
					},
					Right: function () {
						if (selectedTabIndex <= 2) {
							selectedTabIndex = selectedTabIndex + 1;
						} else {
							selectedTabIndex = 0;
						}
						if (tabObjectsArray[selectedTabIndex].click) {
							tabObjectsArray[selectedTabIndex].click();
						}
					},
					PageUp: function () {
						handle.moveFocus(-handle.menuSize() + 1, true);
					},
					PageDown: function () {
						handle.moveFocus(handle.menuSize() - 1, true);
					},
					Home: function () {
						handle.setFocus(0);
					},
					End: function () {
						handle.setFocus(handle.length - 1);
					},
					Enter: handle.pick,
					Tab: handle.pick,
					Esc: handle.close
				};
				var custom = completion.options.customKeys;
				var ourMap = custom ? {} : baseMap;

				function addBinding(key, val) {
					var bound;
					if (typeof val !== 'string') {
						bound = function (cm) {
							return val(cm, handle);
						};
					}
					// This mechanism is deprecated
					else if (Object.prototype.hasOwnProperty.call(baseMap, val)) {
						bound = baseMap[val];
					} else {
						bound = val;
					}
					ourMap[key] = bound;
				}

				var key;
				if (custom) {
					for (key in custom) {
						if (Object.prototype.hasOwnProperty.call(custom, key)) {
							addBinding(key, custom[key]);
						}
					}
				}
				var extra = completion.options.extraKeys;
				if (extra) {
					for (key in extra) {
						if (Object.prototype.hasOwnProperty.call(extra, key)) {
							addBinding(key, extra[key]);
						}
					}
				}
				return ourMap;
			}

			function getHintElement(hintsElement, el) {
				while (el && el !== hintsElement) {
					if (el.nodeName.toUpperCase() === 'LI' && el.parentNode === hintsElement) {
						return el;
					}
					el = el.parentNode;
				}
			}

			function Widget(completion, data) {
				var self = this;
				self.completion = completion;
				self.InitialData = data;
				self.data = data;
				self.picked = false;
				self.tabsArray = [];
				self.outMostDiv = null;
				self.mayHavePicture = false;
				self.pictureDiv = null;
				var widget = this, cm = completion.cm;
				var typeFlagEnum = {
					functionName: 'functionName',
					parameterName: 'parameterName',
					parameterValue_Type: 'parameterValue_Type',
					parameterValue_QNorm: 'parameterValue_QNorm',
					parameterValue_Non_Type: 'parameterValue_Non_Type'
				};

				// list is the found[] array
				var initialDataList = self.InitialData.list;
				var qtoDefaultTypesObjectArray = this.InitialData.qtoDefaultTypesObjectArray;
				var hints;
				var ulObject;
				self.selectedHint = data.selectedHint || 0;
				self.largeArray = [];

				function setActivatedTab(tab) {
					var activeClassName = 'CodeMirror-tab-item-QuantityQuery-active';
					var splitor = ' ';
					for (var j = self.tabsArray.length; j > 0; j--) {
						var curTab = self.tabsArray[j - 1];
						var classNamesArray = curTab.className.split(splitor);
						var newClassNamesArray = [];
						for (var i = classNamesArray.length; i > 0; i--) {
							if (classNamesArray[i - 1] !== activeClassName) {
								newClassNamesArray.push(classNamesArray[i - 1]);
							}
						}
						curTab.className = newClassNamesArray.join(' ');
					}
					var clss = tab.className.split(splitor);
					clss.push(activeClassName);
					tab.className = clss.join(splitor);
				}

				function setDefaultSelectedIndex(tabIndex) {
					if ((!!qtoDefaultTypesObjectArray) && (qtoDefaultTypesObjectArray instanceof Array)) {
						for (var i = 0; i < qtoDefaultTypesObjectArray.length; i++) {
							if (qtoDefaultTypesObjectArray[i].dim === tabIndex.toString()) {
								var selectedParameterValue = qtoDefaultTypesObjectArray[i].p_Type;
								if ((self.largeArray instanceof Array) && self.largeArray.length > tabIndex) {
									var dimArray = self.largeArray[tabIndex];
									for (var j = 0; j < dimArray.length; j++) {
										if (dimArray[j].dataItem.parameterValueKey === selectedParameterValue) {
											self.selectedHint = j;
											break;
										}
									}
								}
								break;
							}
						}
					}
				}

				function bindTabListData(tabIndex) {
					var dimArray = [];
					if ((self.largeArray instanceof Array) && self.largeArray.length > tabIndex) {
						dimArray = self.largeArray[tabIndex];
						ulObject.innerHTML = '';
						for (var i = 0; i < dimArray.length; ++i) {
							var elt = ulObject.appendChild(document.createElement('li')), cur = dimArray[i];
							var className = HINT_ELEMENT_CLASS + (i !== self.selectedHint ? '' : ' ' + ACTIVE_HINT_ELEMENT_CLASS);
							if (cur.className !== null && cur.className !== undefined) {
								className = cur.className + ' ' + className;
							}
							elt.dataItem = cur.dataItem;
							elt.className = className;
							elt.appendChild(document.createTextNode(cur.displayText || getText(cur)));
							elt.hintId = i;
						}
					}

					return dimArray;
				}

				var outMostDiv = self.outMostDiv = document.createElement('div');
				outMostDiv.className = 'CodeMirror-container-QuantityQuery-outMost';

				if (data.dataType === typeFlagEnum.parameterValue_Type) {
					self.mayHavePicture = true;
					var outDiv = document.createElement('div');
					outDiv.className = 'CodeMirror-container-QuantityQuery';
					outMostDiv.appendChild(outDiv);
					hints = this.hints = outMostDiv;
					var innerTopDiv = document.createElement('div');
					innerTopDiv.className = 'CodeMirror-tab-QuantityQuery';
					var innerBottomDiv = document.createElement('div');
					innerBottomDiv.className = 'CodeMirror-content-QuantityQuery';
					ulObject = self.ulObject = document.createElement('ul');
					ulObject.className = 'CodeMirror-hints-QuantityQuery';
					innerBottomDiv.appendChild(ulObject);
					outDiv.appendChild(innerTopDiv);
					outDiv.appendChild(innerBottomDiv);
					var tabClick = function (e) {
						var target = e.target || e.srcElement;
						setActivatedTab(target);
						setDefaultSelectedIndex(target.tabIndex);
						self.data.list = bindTabListData(target.tabIndex);
						widget.changeActive(self.selectedHint);
					};

					tabObjectsArray = [];
					for (var tabIndex = 0; tabIndex < 4; tabIndex++) {
						var tabitem = document.createElement('div');
						tabitem.tabIndex = tabIndex;
						tabitem.className = 'CodeMirror-tab-item-QuantityQuery';
						if (tabIndex === 3) {
							tabitem.className += ' CodeMirror-tab-item-end-QuantityQuery';
						}
						var textNode = document.createTextNode('Dim ' + tabIndex);
						tabitem.appendChild(textNode);
						CodeMirror.on(tabitem, 'click', tabClick);
						if (tabIndex === selectedTabIndex) {
							setActivatedTab(tabitem);
						}
						innerTopDiv.appendChild(tabitem);
						self.tabsArray.push(tabitem);
						tabObjectsArray.push(tabitem);
					}

					var dim1Array = [], dim2Array = [], dim3Array = [], dim4Array = [];
					for (var i = 0; i < initialDataList.length; ++i) {
						if (initialDataList[i].dataItem.connectionsForTypeNode.Dim === '0') {
							dim1Array.push(initialDataList[i]);
						} else if (initialDataList[i].dataItem.connectionsForTypeNode.Dim === '1') {
							dim2Array.push(initialDataList[i]);
						} else if (initialDataList[i].dataItem.connectionsForTypeNode.Dim === '2') {
							dim3Array.push(initialDataList[i]);
						} else if (initialDataList[i].dataItem.connectionsForTypeNode.Dim === '3') {
							dim4Array.push(initialDataList[i]);
						}
					}
					self.largeArray = [dim1Array, dim2Array, dim3Array, dim4Array];

					var currentTabIndex = 1;
					setDefaultSelectedIndex(currentTabIndex);
					self.data.list = bindTabListData(currentTabIndex);
				} else if (data.dataType === typeFlagEnum.parameterValue_QNorm) {
					var toggleParentLi = function (e) {
						var target = e.target || e.srcElement;
						if (target.tagName.toUpperCase() === 'IMG') {
							// if (target.src.indexOf('cloud.style/content/images/control/tree-collapse.svg') !== -1) {
							// target.src = 'cloud.style/content/images/control/tree-expand.svg';
							// } else {
							// target.src = 'cloud.style/content/images/control/tree-collapse.svg';
							// }
							widget.changeParentPic(target);
							var parentVaueKey = target.parentNode.dataItem.parameterValueKey;
							widget.toggleChildrenLi(parentVaueKey, true);
							e.stopPropagation();
						}
					};

					if (data.dataType === typeFlagEnum.parameterValue_Non_Type) {
						self.mayHavePicture = true;
					} else {
						self.mayHavePicture = false;
					}
					// eslint-disable-next-line no-redeclare
					var outDiv = document.createElement('div');
					outMostDiv.appendChild(outDiv);
					outDiv.className = 'CodeMirror-container-QuantityQuery';
					hints = this.hints = outMostDiv;
					ulObject = self.ulObject = document.createElement('ul');
					ulObject.className = 'CodeMirror-hints-QuantityQuery' + ' ' + CODEMIRROR_HINTS_QUANTITYQUERY_NOTAB;
					outDiv.appendChild(ulObject);
					var hintId = 0;
					// eslint-disable-next-line no-redeclare
					for (var i = 0; i < initialDataList.length; ++i) {
						var elt = ulObject.appendChild(document.createElement('li')), cur = initialDataList[i];
						var className = CodeMirror_Tree_Common_QuantityQuery + ' ' +
							HINT_ELEMENT_CLASS + (i !== self.selectedHint ? '' : ' ' + ACTIVE_HINT_ELEMENT_CLASS);
						if ((!!cur.dataItem) && (cur.dataItem.parentParameterValueKey === null)) { // if it is not a child Li element
							className += ' ' + CodeMirror_ParentLi_QuantityQuery;

							if (cur.dataItem.hasChildren === true) {
								var imgElement = document.createElement('img');
								imgElement.src = 'cloud.style/content/images/control-icons.svg#ico-tree-collapse';
								imgElement.className = CodeMirror_ParentLi_QuantityQuery_Img;
								elt.appendChild(imgElement);
								CodeMirror.on(imgElement, 'click', toggleParentLi);

								var spanElement = document.createElement('span');
								spanElement.appendChild(document.createTextNode(cur.displayText || getText(cur)));
								spanElement.className = CodeMirror_ParentLi_QuantityQuery_Span;
								elt.appendChild(spanElement);
							} else {
								elt.appendChild(document.createTextNode(cur.displayText || getText(cur)));
							}
						} else {
							CodeMirror.off(elt, 'click', toggleParentLi);
							className += ' ' + CodeMirror_ChildLi_QuantityQuery + ' ';

							elt.appendChild(document.createTextNode(cur.displayText || getText(cur)));
						}
						if (cur.className !== null && cur.className !== undefined) {
							className = cur.className + ' ' + className;
						}
						elt.dataItem = cur.dataItem;
						elt.className = className;
						elt.hintId = hintId++;
					}
				} else {
					if (data.dataType === typeFlagEnum.parameterValue_Non_Type) {
						self.mayHavePicture = true;
					} else {
						self.mayHavePicture = false;
					}
					// eslint-disable-next-line no-redeclare
					var outDiv = document.createElement('div');
					outMostDiv.appendChild(outDiv);
					outDiv.className = 'CodeMirror-container-QuantityQuery';
					hints = this.hints = outMostDiv;
					ulObject = self.ulObject = document.createElement('ul');
					ulObject.className = 'CodeMirror-hints-QuantityQuery' + ' ' + CODEMIRROR_HINTS_QUANTITYQUERY_NOTAB;
					outDiv.appendChild(ulObject);
					// eslint-disable-next-line no-redeclare
					for (var i = 0; i < initialDataList.length; ++i) {
						// eslint-disable-next-line no-redeclare
						var elt = ulObject.appendChild(document.createElement('li')), cur = initialDataList[i];
						// eslint-disable-next-line no-redeclare
						var className = HINT_ELEMENT_CLASS + (i !== self.selectedHint ? '' : ' ' + ACTIVE_HINT_ELEMENT_CLASS);
						if (cur.className !== null && cur.className !== undefined) {
							className = cur.className + ' ' + className;
						}
						elt.dataItem = cur.dataItem;
						elt.className = className;
						if (cur.render) {
							cur.render(elt, data, cur);
						} else {
							elt.appendChild(document.createTextNode(cur.displayText || getText(cur)));
						}
						elt.hintId = i;
					}
				}

				var pos = cm.cursorCoords(completion.options.alignWithWord ? data.from : null);
				var left = pos.left, top = pos.bottom, below = true;
				hints.style.left = left + 'px';
				hints.style.top = top + 'px';
				// If we're at the edge of the screen, then we want the menu to appear on the left of the cursor.
				var winW = window.innerWidth || Math.max(document.body.offsetWidth, document.documentElement.offsetWidth);
				var winH = window.innerHeight || Math.max(document.body.offsetHeight, document.documentElement.offsetHeight);
				(completion.options.container || document.body).appendChild(hints);
				var box = hints.getBoundingClientRect(), overlapY = box.bottom - winH;
				if (overlapY > 0) {
					var height = box.bottom - box.top, curTop = pos.top - (pos.bottom - box.top);
					if (curTop - height > 0) { // Fits above cursor
						hints.style.top = (top = pos.top - height) + 'px';
						below = false;
					} else if (height > winH) {
						hints.style.height = (winH - 5) + 'px';
						hints.style.top = (top = pos.bottom - box.top) + 'px';
						var cursor = cm.getCursor();
						if (data.from.ch !== cursor.ch) {
							pos = cm.cursorCoords(cursor);
							hints.style.left = (left = pos.left) + 'px';
							box = hints.getBoundingClientRect();
						}
					}
				}
				var overlapX = box.right - winW;
				if (overlapX > 0) {
					if (box.right - box.left > winW) {
						hints.style.width = (winW - 5) + 'px';
						overlapX -= (box.right - box.left) - winW;
					}
					hints.style.left = (left = pos.left - overlapX) + 'px';
				}
				cm.ulListObject = hints;

				cm.addKeyMap(self.keyMap = buildKeyMap(completion, {
					moveFocus: function (n, avoidWrap) {
						widget.changeActive(widget.selectedHint + n, avoidWrap);
					},
					setFocus: function (n) {
						widget.changeActive(n);
					},
					menuSize: function () {
						return widget.screenAmount();
					},
					length: initialDataList.length,
					close: function () {
						completion.close();
					},
					pick: function () {
						widget.pick();
					},
					data: data
				}));

				if (completion.options.closeOnUnfocus) {
					var closingOnBlur;
					cm.on('blur', self.onBlur = function () {
						closingOnBlur = setTimeout(function () {
							completion.close();
						}, 100);
					});
					cm.on('focus', self.onFocus = function () {
						clearTimeout(closingOnBlur);
					});
				}

				var startScroll = cm.getScrollInfo();
				cm.on('scroll', self.onScroll = function () {
					var curScroll = cm.getScrollInfo(), editor = cm.getWrapperElement().getBoundingClientRect();
					var newTop = top + startScroll.top - curScroll.top;
					var point = newTop - (window.pageYOffset || (document.documentElement || document.body).scrollTop);
					if (!below) {
						point += hints.offsetHeight;
					}
					if (point <= editor.top || point >= editor.bottom) {
						return completion.close();
					}
					hints.style.top = newTop + 'px';
					hints.style.left = (left + startScroll.left - curScroll.left) + 'px';
				});

				CodeMirror.on(ulObject, 'dblclick', function (e) {
					var t = getHintElement(ulObject, e.target || e.srcElement);
					if (t && t.hintId !== null && t.hintId !== undefined) {
						widget.changeActive(t.hintId);
						widget.pick();
					}
				});

				CodeMirror.on(ulObject, 'click', function (e) {
					var t = getHintElement(ulObject, e.target || e.srcElement);
					if (t && t.hintId !== null && t.hintId !== undefined) {
						widget.changeActive(t.hintId);
						if (completion.options.completeOnSingleClick) {
							widget.pick();
						}
					}
				});

				CodeMirror.on(hints, 'mousedown', function () {
					setTimeout(function () {
						cm.focus();
					}, 20);
				});

				if (completion.options.completeOnSingleClick) {
					CodeMirror.on(ulObject, 'mousemove', function (e) {
						var elt = getHintElement(ulObject, e.target || e.srcElement);
						if (elt && elt.hintId !== null && elt.hintId !== undefined) {
							widget.changeActive(elt.hintId);
						}
					});
				}

				CodeMirror.on(data, 'changeImg', function (listItem) {
					if (self.pictureDiv !== null && self.pictureDiv !== undefined) {
						self.outMostDiv.removeChild(self.pictureDiv);
						self.pictureDiv = null;
					}
					if ((!!listItem) && (!!listItem.dataItem.parameterValuePic) && (!!listItem.dataItem.parameterValuePic.Path)) {
						var pictureDiv = self.pictureDiv = document.createElement('div');
						pictureDiv.className = 'CodeMirror-container-QuantityQuery-picturePanel';

						var img = document.createElement('img');
						var imgPath = listItem.dataItem.parameterValuePic.Path;
						var imgName = null;
						var imgExt = null;
						var lastIndexOfSlash = imgPath.lastIndexOf('\\');
						if (lastIndexOfSlash !== -1) {
							imgPath = imgPath.substr(lastIndexOfSlash + 1);
							if (imgPath.indexOf('.') !== -1) {
								imgName = imgPath.substr(0, imgPath.indexOf('.'));
								imgExt = imgPath.substr(imgPath.indexOf('.') + 1);
							}
						}
						var languageCode = data.languageCode;
						if (imgName !== null && imgExt !== null && languageCode !== null) {
							var imgUrl = globals.webApiBaseUrl + 'constructionsystem/master/quantityquery/getPicture?pictureName=' + imgName + '&ext=' + imgExt + '&languageCode=' + languageCode;

							$http.get(imgUrl).then(function (res){
								img.src = res.data;
							});
						}

						pictureDiv.appendChild(img);
						self.outMostDiv.appendChild(pictureDiv);
						self.outMostDiv.className = self.outMostDiv.className.replace(' ' + CODEMIRROR_CONTAINER_QuantityQuery_OUTMOST_NOPICTURE, '');
					} else {
						self.outMostDiv.className = self.outMostDiv.className.replace(' ' + CODEMIRROR_CONTAINER_QuantityQuery_OUTMOST_NOPICTURE, '');
						self.outMostDiv.className += ' ' + CODEMIRROR_CONTAINER_QuantityQuery_OUTMOST_NOPICTURE;
					}
				});

				widget.changeActive(self.selectedHint);

				return true;
			}

			Widget.prototype = {
				close: function () {
					if (this.completion.widget !== this) {
						return;
					}
					this.completion.widget = null;
					this.hints.parentNode.removeChild(this.hints);
					this.completion.cm.removeKeyMap(this.keyMap);

					var cm = this.completion.cm;
					if (this.completion.options.closeOnUnfocus) {
						cm.off('blur', this.onBlur);
						cm.off('focus', this.onFocus);
					}
					cm.off('scroll', this.onScroll);
					var tipManager = new CodeMirror.TipManager();
					tipManager.closeTooltip(cm);
				},

				disable: function () {
					this.completion.cm.removeKeyMap(this.keyMap);
					var widget = this;
					this.keyMap = {
						Enter: function () {
							widget.picked = true;
						}
					};
					this.completion.cm.addKeyMap(this.keyMap);
				},

				pick: function () {
					this.completion.pick(this.data, this.selectedHint);
				},

				resetListItemClassName: function () {
					if (this.ulObject) {
						var listItemArray = this.ulObject.getElementsByTagName('li');
						for (var j = 0; j < listItemArray.length; j++) {
							var li = listItemArray[j];
							li.className = li.className.replace(' ' + ACTIVE_HINT_ELEMENT_CLASS, '');
						}
					}
				},

				toggleChildrenLi: function (parentVaueKey, isToggleFromMouseClick) {
					var childrenLiArray = [];
					var ulElements = this.ulObject.getElementsByTagName('LI');
					for (var i = 0; i < ulElements.length; i++) {
						if (ulElements[i].dataItem.parentParameterValueKey === parentVaueKey) {
							childrenLiArray.push(ulElements[i]);
						}
					}

					for (var childLiIndex = 0; childLiIndex < childrenLiArray.length; childLiIndex++) {
						var childLi = childrenLiArray[childLiIndex];
						if (childLi.className.indexOf(' ' + CodeMirror_ChildLi_QuantityQuery_Active) !== -1) {
							if (isToggleFromMouseClick) {
								childLi.className = childLi.className.replace(' ' + CodeMirror_ChildLi_QuantityQuery_Active, '');
							}
						} else {
							childLi.className += ' ' + CodeMirror_ChildLi_QuantityQuery_Active;
						}
					}
				},

				changeParentPic: function (target) {
					if (target.src.indexOf('cloud.style/content/images/control-icons.svg#ico-tree-collapse') !== -1) {
						target.src = 'cloud.style/content/images/control-icons.svg#ico-tree-expand';
					} else {
						target.src = 'cloud.style/content/images/control-icons.svg#ico-tree-collapse';
					}
				},

				changeActive: function (i, avoidWrap) {
					if (i >= this.data.list.length) {
						i = avoidWrap ? this.data.list.length - 1 : 0;
					} else if (i < 0) {
						i = avoidWrap ? 0 : this.data.list.length - 1;
					}

					this.resetListItemClassName();
					var node = this.ulObject.childNodes[this.selectedHint = i];
					node.className += ' ' + ACTIVE_HINT_ELEMENT_CLASS;

					var description = null;
					if (this.data.list[i].dataItem && this.data.list[i].dataItem.parameterValueExtDesc) {
						description = this.data.list[i].dataItem.parameterValueExtDesc;
					}
					if (description === null || description === undefined || description === '') {
						if (this.data.list[i].dataItem && this.data.list[i].dataItem.parameterNameDesc) {
							description = this.data.list[i].dataItem.parameterNameDesc;
						}
					}
					if (description === null || description === undefined || description === '') {
						if (this.data.list[i].dataItem && this.data.list[i].dataItem.functionExtDesc) {
							description = this.data.list[i].dataItem.functionExtDesc;
						}
					}
					if (description === null || description === undefined || description === '') {
						if (this.data.list[i].dataItem && this.data.list[i].dataItem.ExtDesc) {
							description = this.data.list[i].dataItem.ExtDesc;
						}
					}

					if (node.className.indexOf(' ' + CodeMirror_ChildLi_QuantityQuery) !== -1) {
						var parentVaueKey = node.dataItem.parentParameterValueKey;
						if (node.className.indexOf(' ' + CodeMirror_ChildLi_QuantityQuery_Active) === -1) {
							var targetList = this.ulObject.getElementsByTagName('img');
							var target;
							// eslint-disable-next-line no-redeclare
							for (var i = 0; i < targetList.length; i++) {
								target = targetList[i];
								if (target.parentNode.dataItem.parameterValueKey === parentVaueKey) {
									break;
								}
							}
							this.changeParentPic(target);
						}
						this.toggleChildrenLi(parentVaueKey, false);
					}

					var cm = this.completion.cm;
					var tipManager = new CodeMirror.TipManager();
					var ulListObject = cm.ulListObject;
					var intLeft = parseInt(ulListObject.style.left.replace('px', ''));
					var intTop = parseInt(ulListObject.style.top.replace('px', '')) + 250;
					tipManager.updateTooltip(cm, description, intLeft + 'px', intTop + 'px');

					if (node.offsetTop < this.ulObject.scrollTop) {
						// this.hints.scrollTop = node.offsetTop - 3;
						this.ulObject.scrollTop = node.offsetTop - 3;
					} else if (node.offsetTop + node.offsetHeight > this.ulObject.scrollTop + this.ulObject.clientHeight) {
						// this.hints.scrollTop = node.offsetTop + node.offsetHeight - this.hints.clientHeight + 3;
						this.ulObject.scrollTop = node.offsetTop + node.offsetHeight - this.ulObject.clientHeight + 3;
					}
					if (this.mayHavePicture === true) {
						CodeMirror.signal(this.data, 'changeImg', this.data.list[this.selectedHint]);
					} else {
						if (this.pictureDiv !== null && this.pictureDiv !== undefined) {
							this.outMostDiv.removeChild(this.pictureDiv);
							this.pictureDiv = null;
						}
						this.outMostDiv.className = this.outMostDiv.className.replace(' ' + CODEMIRROR_CONTAINER_QuantityQuery_OUTMOST_NOPICTURE, '');
						this.outMostDiv.className += ' ' + CODEMIRROR_CONTAINER_QuantityQuery_OUTMOST_NOPICTURE;
					}
				},

				screenAmount: function () {
					return Math.floor(this.hints.clientHeight / this.hints.firstChild.offsetHeight) || 1;
				}
			};

			function applicableHelpers(cm, helpers) {
				if (!cm.somethingSelected()) {
					return helpers;
				}
				var result = [];
				for (var i = 0; i < helpers.length; i++) {
					if (helpers[i].supportsSelection) {
						result.push(helpers[i]);
					}
				}
				return result;
			}

			function resolveAutoHints(cm, pos) {
				var helpers = cm.getHelpers(pos, 'hint'), words;
				if (helpers.length) {
					var async = false, resolved;
					for (var i = 0; i < helpers.length; i++) {
						if (helpers[i].async) {
							async = true;
						}
					}
					if (async) {
						resolved = function (cm, callback, options) {
							var app = applicableHelpers(cm, helpers);

							function run(i, result) {
								if (i === app.length) {
									return callback(null);
								}
								var helper = app[i];
								if (helper.async) {
									helper(cm, function (result) {
										if (result) {
											callback(result);
										} else {
											run(i + 1);
										}
									}, options);
								} else {
									// eslint-disable-next-line no-redeclare
									var result = helper(cm, options);
									if (result) {
										callback(result);
									} else {
										run(i + 1);
									}
								}
							}

							run(0);
						};
						resolved.async = true;
					} else {
						resolved = function (cm, options) {
							var app = applicableHelpers(cm, helpers);
							for (var i = 0; i < app.length; i++) {
								var cur = app[i](cm, options);
								if (cur && cur.list.length) {
									return cur;
								}
							}
						};
					}
					resolved.supportsSelection = true;
					return resolved;
				} else if ((words = cm.getHelper(cm.getCursor(), 'hintWords'))) {
					return function (cm) {
						return CodeMirror.hint.fromList(cm, {words: words});
					};
				} else if (CodeMirror.hint.anyword) {
					return function (cm, options) {
						return CodeMirror.hint.anyword(cm, options);
					};
				} else {
					return function () {
					};
				}
			}

			CodeMirror.registerHelper('hint', 'auto', {
				resolve: resolveAutoHints
			});

			CodeMirror.registerHelper('hint', 'fromList', function (cm, options) {
				var cur = cm.getCursor(), token = cm.getTokenAt(cur);
				var term, from;
				var to = CodeMirror.Pos(cur.line, token.end);

				if (token.string && /\w/.test(token.string[token.string.length - 1])) {
					term = token.string;
					from = CodeMirror.Pos(cur.line, token.start);
				} else {
					term = '';
					from = to;
				}
				var found = [];
				for (var i = 0; i < options.words.length; i++) {
					var word = options.words[i];
					if (word.slice(0, term.length) === term) {
						found.push(word);
					}
				}

				if (found.length) {
					return {list: found, from: from, to: to};
				}
			});

			CodeMirror.commands.autocompleteQuantityQueryEditor = CodeMirror.showHintQuantityQueryEditor;

			defaultOptions = {
				hint: CodeMirror.hint.auto,
				completeSingle: true,
				alignWithWord: true,
				closeCharacters: /[\s()[\]{};:>,]/,
				closeOnUnfocus: true,
				completeOnSingleClick: true,
				container: null,
				customKeys: null,
				extraKeys: null
			};

			CodeMirror.defineOption('hintOptions', null);

			return true;
		}
	]);

})(angular);
