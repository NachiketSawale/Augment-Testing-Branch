/* globals define, angular */
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['quill'], factory);
	} else if (typeof module !== 'undefined' && typeof exports === 'object') {
		module.exports = factory(require('quill'));
	} else {
		root.Requester = factory(root.Quill);
	}
})(this, function (Quill) {
	'use strict';

	var app;
	// declare ngQuill module
	app = angular.module('ngQuill', ['ngSanitize']);

	app.provider('ngQuillConfig', function () {
		var config = {
			modules: {
				toolbar: [
					['bold', 'italic', 'underline', 'strike'],        // toggled buttons
					['blockquote', 'code-block'],

					[{'header': 1}, {'header': 2}],               // custom button values
					[{'list': 'ordered'}, {'list': 'bullet'}],
					[{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
					[{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
					[{'direction': 'rtl'}],                         // text direction

					[{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
					[{'header': [1, 2, 3, 4, 5, 6, false]}],

					[{'color': []}, {'background': []}],          // dropdown with defaults from theme
					[{'font': []}],
					[{'align': []}],

					['clean'],                                         // remove formatting button

					['link', 'image', 'video']                         // link and image, video
				]
			},
			bounds: document.body,
			debug: 'warn',
			theme: 'snow',
			scrollingContainer: null,
			// placeholder: 'Insert text here ...',
			readOnly: false,
			trackChanges: 'user',
			preserveWhitespace: false
		};

		this.set = function (customConf) {
			customConf = customConf || {};

			if (customConf.modules) {
				config.modules = customConf.modules;
			}
			if (customConf.theme) {
				config.theme = customConf.theme;
			}
			if (customConf.placeholder !== null && customConf.placeholder !== undefined) {
				config.placeholder = customConf.placeholder.trim();
			}
			if (customConf.readOnly) {
				config.readOnly = customConf.readOnly;
			}
			if (customConf.formats) {
				config.formats = customConf.formats;
			}
			if (customConf.bounds) {
				config.bounds = customConf.bounds;
			}
			if (customConf.scrollingContainer) {
				config.scrollingContainer = customConf.scrollingContainer;
			}
			if (customConf.debug || customConf.debug === false) {
				config.debug = customConf.debug;
			}
			if (customConf.trackChanges && ['all', 'user'].indexOf(customConf.trackChanges) > -1) {
				config.trackChanges = customConf.trackChanges;
			}
			if (customConf.preserveWhitespace) {
				config.preserveWhitespace = true;
			}
		};

		this.$get = function () {
			return config;
		};
	});

	app.component('ngQuillEditor', {
		bindings: {
			'modules': '<modules',
			'theme': '@?',
			'readOnly': '<?',
			'format': '@?',
			'debug': '@?',
			'formats': '<?',
			'placeholder': '<?',
			'bounds': '<?',
			'scrollingContainer': '<?',
			'strict': '<?',
			'onEditorCreated': '&?',
			'onContentChanged': '&?',
			'onSetConfig': '&?',
			'onBlur': '&?',
			'onFocus': '&?',
			'onSelectionChanged': '&?',
			'ngModel': '<',
			'maxLength': '<',
			'minLength': '<',
			'customOptions': '<?',
			'styles': '<?',
			'sanitize': '<?',
			'customToolbarPosition': '@?',
			'trackChanges': '@?',
			'preserveWhitespace': '<?',
		},
		require: {
			ngModelCtrl: 'ngModel'
		},
		transclude: {
			'toolbar': '?ngQuillToolbar',
			'ruler': '?ngQuillRuler'
		},
		template: '<div class="ng-quill-div ng-hide" ng-show="$ctrl.ready"><ng-transclude ng-transclude-slot="toolbar"></ng-transclude><ng-transclude ng-transclude-slot="ruler"></ng-transclude></div>',
		controller: ['$scope', '$element', '$sanitize', '$timeout', '$transclude', 'ngQuillConfig', 'platformEditorConverterService','platformSanitizeService', function ($scope, $element, $sanitize, $timeout, $transclude, ngQuillConfig, platformEditorConverterService, platformSanitizeService) {
			var config = {};
			var content;
			var editorElem;
			var format = 'html';
			var editorChanged = false;
			var editor;
			var placeholder = ngQuillConfig.placeholder;
			var textChangeEvent;
			var selectionChangeEvent;

			this.setter = function (value) {
				if (format === 'html') {
					return editor.clipboard.convert(platformSanitizeService.cleanHTML(value));
				} else if (this.format === 'json') {
					try {
						return JSON.parse(value);
					} catch (e) {
						return [{insert: value}];
					}
				}

				return value;
			};

			this.validate = function (text) {
				var textLength = text.trim().length;

				if (this.maxLength) {
					if (textLength > this.maxLength) {
						this.ngModelCtrl.$setValidity('maxlength', false);
					} else {
						this.ngModelCtrl.$setValidity('maxlength', true);
					}
				}

				if (this.minLength > 0) {
					if (textLength < this.minLength && textLength) {
						this.ngModelCtrl.$setValidity('minlength', false);
					} else {
						this.ngModelCtrl.$setValidity('minlength', true);
					}
				}
			};

			function setDefaultStyle(defaultSize) {
				if (!defaultSize) {
					// then we check style set on stylesheet
					let computStyle = window.getComputedStyle(editor.root);

					if (computStyle) {
						defaultSize = parseInt(computStyle.getPropertyValue('font-size'));
					}
				}

				let paragraphs = editor.root.children;

				for (let i = 0; i < paragraphs.length; i++) {
					let p = paragraphs[i];
					let size = 0;
					for (let j = 0; j < p.childNodes.length; j++) {
						let elt = p.childNodes[j];
						if (elt.nodeType !== 3) // text node : https://developer.mozilla.org/fr/docs/Web/API/Node/nodeType
						{
							let eltSize = elt.style['font-size'];
							if (eltSize) {
								size = Math.max(size, parseInt(eltSize));
							}
						}
					}

					if(size && !p.style['font-size']) {
						p.style['font-size'] = size + 'pt';
					}
					else if (!p.style['font-size']) {
						p.style['font-size'] = defaultSize + 'pt';
					}
				}
			}

			this.$onChanges = function (changes) {
				if (changes.ngModel) {
					content = changes.ngModel.currentValue;

					if (editor) {
						if (!editorChanged) {
							if (content) {
								if (changes.ngModel.currentValue !== changes.ngModel.previousValue && editor.root.innerHTML !== changes.ngModel.currentValue) {
									content = platformEditorConverterService.convertOldFormat(content, $scope.$parent.customSettings);
									if (this.format === 'text') {
										editor.setText(content);
									} else {
										editor.setContents(
											this.setter(content)
										);
										setDefaultStyle($scope.$parent.customSettings.defaultFontSize);
									}
								}
							} else {
								editor.setText('');
							}

							let length = editor.getLength();
							if (length > 0) {
								let text = editor.getText(length - 2, 2);

								// Remove extraneous new lines
								if (text === '\n\n') {
									//editor.root.classList.add('loading');
									editor.deleteText(length - 2, 2);
								}
							}
						}
						editorChanged = false;
					}
				}

				if (editor && changes.readOnly) {
					editor.enable(!changes.readOnly.currentValue);
				}

				if (editor && changes.placeholder) {
					editor.root.dataset.placeholder = changes.placeholder.currentValue;
				}

				if (editor && editorElem && changes.styles) {
					var currentStyling = changes.styles.currentValue;
					var previousStyling = changes.styles.previousValue;

					if (previousStyling) {
						for (var key in previousStyling) {
							editorElem.style[key] = '';
						}
					}
					if (currentStyling) {
						for (var activeStyle in currentStyling) {
							if (currentStyling.hasOwnProperty(activeStyle)) {
								editorElem.style[activeStyle] = currentStyling[activeStyle];
							}
						}
					}
				}
			};

			this.$onInit = function () {
				if (this.placeholder !== null && this.placeholder !== undefined) {
					placeholder = this.placeholder.trim();
				}

				if (this.format && ['object', 'html', 'text', 'json'].indexOf(this.format) > -1) {
					format = this.format;
				}

				config = {
					theme: this.theme || ngQuillConfig.theme,
					readOnly: this.readOnly || ngQuillConfig.readOnly,
					modules: this.modules || ngQuillConfig.modules,
					formats: this.formats || ngQuillConfig.formats,
					placeholder: placeholder,
					bounds: this.bounds || ngQuillConfig.bounds,
					strict: this.strict,
					scrollingContainer: this.scrollingContainer || ngQuillConfig.scrollingContainer,
					debug: this.debug || this.debug === false ? this.debug : ngQuillConfig.debug
				};

				if (this.onSetConfig) {
					this.onSetConfig({config: config});
				}
			};

			this.$postLink = function () {
				// create quill instance after dom is rendered
				$timeout(function () {
					this._initEditor();
				}.bind(this), 0);
			};

			this.$onDestroy = function () {
				editor = null;

				if (textChangeEvent) {
					textChangeEvent.removeListener('text-change');
				}
				if (selectionChangeEvent) {
					selectionChangeEvent.removeListener('selection-change');
				}
			};

			this._initEditor = function () {
				var $editorElem = this.preserveWhitespace ? angular.element('<pre></pre>') : angular.element('<div></div>');
				var container = $element.children();

				editorElem = $editorElem[0];

				if (config.bounds === 'self') {
					config.bounds = editorElem;
				}

				// set toolbar to custom one
				if ($transclude.isSlotFilled('toolbar')) {
					config.modules.toolbar = container.find('ng-quill-toolbar').children()[0];
				}

				if (this.styles) {
					for (var activeStyle in this.styles) {
						if (this.styles.hasOwnProperty(activeStyle)) {
							editorElem.style[activeStyle] = this.styles[activeStyle];
						}
					}
				}

				if (!this.customToolbarPosition || this.customToolbarPosition === 'top') {
					container.append($editorElem);
				} else {
					container.prepend($editorElem);
				}

				if (this.customOptions) {
					this.customOptions.forEach(function (customOption) {
						var newCustomOption = Quill.import(customOption.import);
						newCustomOption.whitelist = customOption.whitelist;
						if (customOption.toRegister) {
							newCustomOption[customOption.toRegister.key] = customOption.toRegister.value;
						}
						Quill.register(newCustomOption, true);
					});
				}

				editor = new Quill(editorElem, config);

				if ($transclude.isSlotFilled('ruler')) {
					const toolbar = container.find('.ql-toolbar');
					if(toolbar && toolbar.length > 0) {
						toolbar[0].insertAdjacentElement('afterend', container.find('ng-quill-ruler')[0]);
					}
				}

				this.ready = true;

				// mark model as touched if editor lost focus
				selectionChangeEvent = editor.on('selection-change', function (range, oldRange, source) {
					if (range === null && this.onBlur) {
						this.onBlur({
							editor: editor,
							source: source
						});
					} else if (oldRange === null && this.onFocus) {
						this.onFocus({
							editor: editor,
							source: source
						});
					}

					if (this.onSelectionChanged) {
						this.onSelectionChanged({
							editor: editor,
							oldRange: oldRange,
							range: range,
							source: source
						});
					}

					if (range) {
						return;
					}
					$scope.$applyAsync(function () {
						this.ngModelCtrl.$setTouched();
					}.bind(this));
				}.bind(this));

				// update model if text changes
				textChangeEvent = editor.on('text-change', function (delta, oldDelta, source) {

					var html = editorElem.querySelector('.ql-editor').innerHTML;
					var text = editor.getText();
					var content = editor.getContents();

					var emptyModelTag = ['<' + editor.root.firstChild.localName + '>', '</' + editor.root.firstChild.localName + '>'];

					if (html === emptyModelTag[0] + '<br>' + emptyModelTag[1]) {
						html = null;
					}
					this.validate(text);

					$scope.$applyAsync(function () {
						var trackChanges = this.trackChanges || ngQuillConfig.trackChanges;
						if (source === 'user' || trackChanges && trackChanges === 'all') {
							editorChanged = true;
							if (format === 'text') {
								// if nothing changed $ngOnChanges is not called again
								// But we have to reset editorChanged flag
								if (text === this.ngModelCtrl.$viewValue) {
									editorChanged = false;
								} else {
									this.ngModelCtrl.$setViewValue(text);
								}
							} else if (format === 'object') {
								this.ngModelCtrl.$setViewValue(content);
							} else if (this.format === 'json') {
								try {
									this.ngModelCtrl.$setViewValue(JSON.stringify(content));
								} catch (e) {
									this.ngModelCtrl.$setViewValue(text);
								}
							} else {
								this.ngModelCtrl.$setViewValue(html);
							}
						}

						if (source === 'api') {
							if (editor.container.lastChild.className === 'blot-formatter__overlay') {
								editor.root.click();
							}
						}

						if (this.onContentChanged) {
							this.onContentChanged({
								editor: editor,
								html: html,
								text: text,
								source: source,
								content: content,
								delta: delta,
								oldDelta: oldDelta
							});
						}

						// if nothing changed $ngOnChanges is not called again
						// But we have to reset editorChanged flag
						if (text === this.ngModelCtrl.$viewValue) {
							editorChanged = false;
						}
					}.bind(this));
				}.bind(this));

				// set initial content
				if (content) {
					if (format === 'text') {
						editor.setText(content, 'silent');
					} else if (format === 'object') {
						editor.setContents(content, 'silent');
					} else if (format === 'json') {
						try {
							editor.setContents(JSON.parse(content), 'silent');
						} catch (e) {
							editor.setText(content, 'silent');
						}
					} else {
						$timeout(function () {
							editor.setContents(this.setter(platformSanitizeService.cleanHTML(content)));
						}.bind(this), 5);
					}

					editor.history.clear();
				}
				this.validate(editor.getText());

				// provide event to get informed when editor is created -> pass editor object.
				if (this.onEditorCreated) {
					this.onEditorCreated({editor: editor});
				}
			};
	}]
	});

	return app.name;
});
