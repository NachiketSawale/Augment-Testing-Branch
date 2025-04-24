/**
 * Created by wed on 10/24/2017.
 */
(function (window, $, utility) {

	'use strict';

	// dropdown control
	$.fn.dropdown = function (options) {
		let templates = {
			containerTpl: '<div class="input-group domain-type-select form-control form-control"></div>',
			monitorTpl: '<div class="input-group-content"></div>',
			dropdownTpl: '<div class="input-group-btn"><button type="button" class="btn btn-default dropdown-toggle"><span class="caret"></span></button></div>',
			viewContainerTpl: '<div class="popup-container flex-box flex-column popup-container-s ng-scope"><div class="popup-content flex-box flex-auto" style="max-height: 600px;"><ul class="flex-element select-popup"></ul></div></div>',
			viewItemTpl: '<li><button></button> </li>'
		};

		function Dropdown(templates, container, dataOptions) {

			let box = $(templates.containerTpl),
				moniter = $(templates.monitorTpl).appendTo(box),
				view = null;
			$(templates.dropdownTpl).appendTo(box);
			let currSelected = null;

			let context = this, opts = $.extend({
				data: [
					{text: 'White', value: 'w'},
					{text: 'Back', value: 'b'}
				],
				selected: null,
				textField: 'text',
				valueField: 'value',
				onSelected: function (/* context, item */) {

				}
			}, dataOptions);

			this.hasChanged = false;
			this.setData = function (data, selected) {
				opts.data = data;
				view.remove();
				view = createView();
				selectViewItem(selected || (opts.data && opts.data.length > 0 ? opts.data[0] : null));
			};

			function selectViewItem(item) {
				if (item) {
					moniter.text(item[opts.textField]);
					context.hasChanged = currSelected !== item;
					currSelected = item;

					view.find('ul').find('button').each(function () {
						if ($(this).hasClass('selected')) {
							$(this).removeClass('selected');
						}
						let searchKey = item[opts.valueField] + ':' + item[opts.textField];
						if (this.searchKey === searchKey) {
							$(this).addClass('selected');
						}
					});

					if (utility.isFunction(opts.onSelected)) {
						opts.onSelected(context, item);
					}
				} else {
					moniter.text('');
				}
				view.hide();
				currSelected = item;
			}

			function createView() {
				let viewContainer = $(templates.viewContainerTpl);

				if (utility.isArray(opts.data)) {
					$.each(opts.data, function (index, item) {
						let text = item[opts.textField];
						let itemNode = $(templates.viewItemTpl);
						itemNode.find('button').text(text).attr('title', text).bind('click', function () {
							selectViewItem(item);
						}).each(function () {
							this.searchKey = item[opts.valueField] + ':' + item[opts.textField];
						});
						viewContainer.find('ul').append(itemNode);
					});
				}

				return viewContainer.appendTo('body');
			}

			function resetPosition() {
				let offset = box.offset(), viewHeight = view.height(), size = {
					width: box.outerWidth(),
					height: box.outerHeight()
				};
				if ((offset.top + size.height + viewHeight) > $(window).height()) {
					offset.top = offset.top - viewHeight - 6;
				} else {
					offset.top = offset.top + size.height;
				}
				view.css({
					left: offset.left + 'px',
					top: offset.top + 'px',
					width: size.width + 'px'
				});
			}

			function initialize() {
				view = createView();
				box.bind('click', function (e) {
					if (view.is(':visible')) {
						view.hide();
					} else {
						view.show();
						resetPosition(e);
					}
					return false;
				});

				selectViewItem(opts.selected || (opts.data && opts.data.length > 0 ? opts.data[0] : null));

				$(container).append(box);

				$(document).bind('click', function () {
					view.hide();
				});
			}

			initialize();
		}

		return this.each(function () {
			this.instance = new Dropdown(templates, this, options);
		});
	};

	// company tree control
	$.fn.companyTree = function (options) {
		let templates = {
			containerTpl: {
				startTag: '<ul style="display:{childVisible};">',
				endTag: '</ul>'
			},
			itemTpl: {
				startTag: '<li class="{headClass}"><i class="tree-branch-head"></i><i class="tree-leaf-head"></i><div class="tree-label" data-key="{id}"><span class="sm control-icons {typeClass}"></span><span>{displayText}</span></div>',
				endTag: '</li>'
			}
		};

		function CompanyTree(templates, container, dataOptions) {
			let context = this;
			let opts = $.extend({
				data: {
					companies: [],
					roles: [],
					rolesLookup: []
				},
				selected: null,
				orderBy: 'code',
				descending: 1,
				itemName: 'company',
				nodeChildren: 'children',
				onSelected: function (/* context, item */) {

				},
				onRenderComplete: null,
				onExpanded: null,
				onCollapsed: null,
				onClear: null
			}, dataOptions);
			let currSelectedNode = null;
			let companyMap = {};

			function comparator(a, b) {
				let value1 = a[opts.orderBy], value2 = b[opts.orderBy];
				if (a.code !== b.code) {
					return opts.descending * (value1 < value2 ? -1 : 1);
				}
				return 0;
			}

			function orderBy(companies) {
				companies.sort(comparator);
				for (let i = 0; i < companies.length; i++) {
					if (companies[i][opts.nodeChildren]) {
						orderBy(companies[i][opts.nodeChildren]);
					}
				}
			}

			function bindEvent() {

				// arrow handler
				$(container).find('i.tree-branch-head').bind('click', function () {
					if ($(this).parent().hasClass('tree-collapsed')) {
						$(this).parent().removeClass('tree-collapsed').addClass('tree-expanded').find('> ul').show();
						if (utility.isFunction(opts.onExpanded)) {
							opts.onExpanded(context);
						}
					} else {
						$(this).parent().removeClass('tree-expanded').addClass('tree-collapsed').find('> ul').hide();
						if (utility.isFunction(opts.onCollapsed)) {
							opts.onCollapsed(context);
						}
					}
				});

				// item selector
				$(container).find('div.tree-label').bind('click', function () {
					if ($(this).hasClass('tree-selected')) {
						$(this).removeClass('tree-selected');
						if (utility.isFunction(opts.onClear)) {
							opts.onClear(context);
						}
					} else {
						if (currSelectedNode) {
							$(currSelectedNode).removeClass('tree-selected');
						}
						$(this).addClass('tree-selected');
						currSelectedNode = this;
						if (utility.isFunction(opts.onSelected)) {
							let company = companyMap[this._key], signCompany = getCompanyToSignedIn(company.id);
							opts.onSelected(context, company, signCompany);
						}
					}
				}).each(function () {
					this._key = $(this).attr('data-key');
				});
			}

			function buildTree(companies, childVisible) {
				let views = [];
				views.push(templates.containerTpl.startTag.replace('{childVisible}', childVisible ? 'block' : 'none'));
				for (let i = 0; i < companies.length; i++) {
					let node = companies[i];
					views.push(templates.itemTpl.startTag.replace('{headClass}', getHeadClass(node)).replace('{typeClass}', classByType(node)).replace('{displayText}', getDisplayText(node)).replace('{id}', node.id));
					if (!isLeaf(node)) {
						views = views.concat(buildTree(node[opts.nodeChildren], false));
					}
					views.push(templates.itemTpl.endTag);
					companyMap[node.id] = node;
				}
				views.push(templates.containerTpl.endTag);
				return views;
			}

			function buildRoles() {
				for (let name in companyMap) {
					if (Object.hasOwnProperty.call(companyMap, name)) {
						let node = companyMap[name];
						node.roles = getClientRoles(node.id);
					}
				}
			}

			function getClientRoles(clientId) {
				let roles = [], clientRoles = opts.data.roles, roleLookups = opts.data.rolesLookup;
				let target = utility.array.find(clientRoles, clientId, 'clientId');
				if (target) {
					roles = target['roleIds'];
				}
				if (roles.length > 0) {
					for (let k = 0; k < roles.length; k++) {
						for (let z = 0; z < roleLookups.length; z++) {
							if (roleLookups[z].key === roles[k]) {
								roles[k] = {
									clientId: clientId,
									id: roleLookups[z].key,
									name: roleLookups[z].value
								};
								break;
							}
						}
					}
					return roles;
				}
				let node = companyMap[clientId];
				if (node.parentId) {
					return getClientRoles(node.parentId);
				}
				return null;
			}

			function isLeaf(node) {
				return !node[opts.nodeChildren] || node[opts.nodeChildren].length === 0;
			}

			function getDisplayText(node) {
				return node.code + (node.name ? ' ' + node.name : '');
			}

			function getHeadClass(node) {
				let resultingClass;
				if (isLeaf(node)) {
					resultingClass = 'tree-leaf';
				} else {
					resultingClass = 'tree-collapsed';
				}
				return resultingClass + ' ' + opts.itemName + '_' + node.id;
			}

			function classByType(node) {
				if (node) {
					let theClass = node['companyType'] === 1 ? 'ico-comp-businessunit' :
						node['companyType'] === 2 ? 'ico-comp-root' : 'ico-comp-profitcenter';
					if (!node['canLogin']) {
						theClass += '-d';
					}
					return theClass;
				}
				return 'ico-comp-businessunit';
			}

			function expandTreeAndSelectNode(startId, selectId) {
				if (startId) {
					let node = companyMap[startId];
					if (node) {
						let $labelNode = $(container).find('div.tree-label').filter('[data-key="' + startId + '"]');
						if (startId === selectId) {
							$labelNode.click();
						} else {
							$labelNode.prevAll('i.tree-branch-head').click();
						}
						if (node.parentId) {
							expandTreeAndSelectNode(node.parentId, selectId);
						}
					}
				}
			}

			function getCompanyToSignedIn(signedInCompanyId) {
				let signedInCompany = companyMap[signedInCompanyId];
				if (signedInCompany && signedInCompany['companyType'] === 1) {
					return signedInCompany;
				}
				if (signedInCompany.parentId) {
					return getCompanyToSignedIn(signedInCompany.parentId);
				}
				return null;
			}

			function initialize() {
				orderBy(opts.data.companies);
				let companies = opts.data.companies;
				let views = buildTree(companies, true);
				buildRoles();
				$(container).html(views.join(''));

				if (utility.isFunction(opts.onRenderComplete)) {
					opts.onRenderComplete(context);
				}

				bindEvent();

				expandTreeAndSelectNode(opts.selected, opts.selected);
			}

			initialize();
		}

		return this.each(function () {
			this.instance = new CompanyTree(templates, this, options);
		});
	};

	// tips
	$.fn.notify = function (text) {

		function createNotifyElement(text) {
			return $('<div class="notify"></div>').text(text);
		}

		return this.each(function () {
			let instance = createNotifyElement(text).prependTo(this);
			window.setTimeout(function () {
				instance.addClass('active');
				window.setTimeout(function () {
					instance.removeClass('active');
					window.setTimeout(function () {
						instance.remove();
					}, 4000);
				}, 4000);
			}, 100);

			this.instance = instance;
		});
	};

	// loading bar
	$.fn.loadingbar = function (cmd) {

		function LoadingBar(parent) {

			let loadingBarContainer,
				loadingBar;
			let incTimeout,
				completeTimeout,
				started = false,
				status = 0;
			let autoIncrement = true,
				startSize = 0.02;

			/**
			 * Inserts the loading bar element into the dom, and sets it to 2%
			 */
			function _start() {
				if (!loadingBarContainer && !loadingBar) {
					loadingBarContainer = $('<div id="loading-bar"><div class="bar"><div class="peg"></div></div></div>').appendTo(parent);
					loadingBar = loadingBarContainer.find('div.bar');
				}
				window.clearTimeout(completeTimeout);
				// do not continually broadcast the started event:
				if (started) {
					return;
				}
				started = true;
				_set(startSize);
			}

			/**
			 * Set the loading bar's width to a certain percent.
			 *
			 * @param n any value between 0 and 1
			 */
			function _set(n) {
				if (!started) {
					return;
				}
				let pct = (n * 100) + '%';
				loadingBar.css('width', pct);
				status = n;

				// increment loadingbar to give the illusion that there is always
				// progress but make sure to cancel the previous timeouts so we don't
				// have multiple incs running at the same time.
				if (autoIncrement) {
					window.clearTimeout(incTimeout);
					incTimeout = window.setTimeout(function () {
						_inc();
					}, 250);
				}
			}

			/*
			 * Increments the loading bar by a random amount
			 * but slows down as it progresses
			 */
			function _inc() {
				if (_status() >= 1) {
					return;
				}

				let rnd;

				// TODO: do this mathmatically instead of through conditions

				let stat = _status();
				if (stat >= 0 && stat < 0.25) {
					// Start out between 3 - 6% increments
					rnd = (Math.random() * (5 - 3 + 1) + 3) / 100;
				} else if (stat >= 0.25 && stat < 0.65) {
					// increment between 0 - 3%
					rnd = (Math.random() * 3) / 100;
				} else if (stat >= 0.65 && stat < 0.9) {
					// increment between 0 - 2%
					rnd = (Math.random() * 2) / 100;
				} else if (stat >= 0.9 && stat < 0.99) {
					// finally, increment it .5 %
					rnd = 0.005;
				} else {
					// after 99%, don't increment:
					rnd = 0;
				}

				let pct = _status() + rnd;
				_set(pct);
			}

			function _status() {
				return status;
			}

			function _completeAnimation() {
				status = 0;
				started = false;
				_destroy();
			}

			function _complete() {

				_set(1);
				window.setTimeout(completeTimeout);

				// Attempt to aggregate any start/complete calls within 500ms:
				completeTimeout = window.setTimeout(function () {
					_completeAnimation();
				}, 500);
			}

			function _destroy() {
				loadingBarContainer.remove();
				loadingBarContainer = null;
				loadingBar = null;
			}

			this.start = _start;
			this.complete = _complete;
		}

		return this.each(function () {
			if (!this.instance) {
				this.instance = new LoadingBar(this);
			}
			if (cmd && utility.isFunction(this.instance[cmd])) {
				this.instance[cmd]();
			}
		});

	};

})(window, window.jQuery, window.utility);
