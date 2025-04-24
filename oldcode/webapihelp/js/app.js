(function ($, utility, authService, SwaggerUIBundle, webAPIConfig) {
	'use strict';

	let appGlobal = {
		'appBaseUrl': '',
		'webApiBaseUrl': '',
		'swaggerInitServiceUrl': '',
		'apisDocsUrl': '',
		'authorization': '',
		'clientContext': {
			'signedInClientId': 1,
			'clientId': 1,
			'permissionClientId': 1,
			'permissionRoleId': 1,
			'dataLanguageId': 1,
			'language': 'en',
			'culture': 'en-gb'
		},
		initAjaxRequest: null,
		searchAjaxRequest: null,
		apiResponse: null,
		searchFilter: '',
		enabledFullApiDocDownload: false
	};

	let appHelper = {
		viewHistory: {
			_key: '/webapi/:view',
			update: function (hash) {
				window.sessionStorage.setItem(this._key, hash || window.location.hash);
			},
			getLast: function () {
				return window.sessionStorage.getItem(this._key);
			}
		},
		searchHistory: {
			_key: '/webapi/:search',
			update: function (pageIndex, searchType, searchKey, totalPages) {
				let cache = {pageIndex: pageIndex, searchType: searchType, searchKey: searchKey, totalPages: totalPages};
				window.sessionStorage.setItem(this._key, JSON.stringify(cache));
			},
			getLast: function () {
				let storage = window.sessionStorage, cache = storage.getItem(this._key);
				if (cache) {
					cache = JSON.parse(cache);
				}
				return cache;
			}
		}
	};

	if (window.location.pathname.lastIndexOf('/') !== window.location.pathname.length - 1) {
		window.location.pathname += '/';
	}

	function urlBuilder() {
		let urls = utility.resolveUrl();
		appGlobal.apisDocsUrl = urls.webApiBaseUrl + 'cloud/help/getapis';
		appGlobal.appBaseUrl = urls.appBaseUrl;
		appGlobal.webApiBaseUrl = urls.webApiBaseUrl;

		appGlobal.swaggerInitServiceUrl = appGlobal.webApiBaseUrl + 'cloud/help/init';
	}

	function checkLogon() {
		let clientContext = null;
		authService.ready().then(function () {
			if (!authService.isLogon()) {
				doUnauthorizedTask();
				return;
			}

			authService.getUserInfo().then(userData => {
				authService.checkCompany().then(companyData => {
					authService.getLanguages().then(langData => {
						renderLogonDisplayHTML(companyData, userData, langData);
						$('#login-info-info').show();
					}).fail(data => {
						window.console.info(data);
					});
					clientContext = authService.getClientContext();
				}).fail(() => {
					doUnauthorizedTask();
					window.console.info('Invalid company information.');
				});
				checkDownloadEnabled();
			}).fail(response => {
				doUnauthorizedTask();
				window.console.info(response);
			});

			// Start timer to refresh token.
			authService.startRefreshTokenSchedule();
		});

		function doUnauthorizedTask() {
			authService.logout();
			$('#login-info-login').show();
		}

		function renderLogonDisplayHTML(company, user, languages) {
			let lang = utility.array.find(languages, clientContext.dataLanguageId, 'Id'),
				dataLanguage = lang ? lang.Description : '', container = $('#login-info-info');

			container.find('span.lang').attr('title', 'Data Language: ' + dataLanguage).text(dataLanguage);
			let companyName = company['signedInCompanyCode'] + ' ' + company['signedInCompanyName'];
			container.find('span.company').attr('title', companyName).text(companyName);
			container.find('span.userrole').text(getUserAndRoleInfo(user, company.roleName));

			container.find('button.action').bind('click', function () {
				container.find('div.menu-action').show();
				return false;
			});
			container.find('a[data-action="logout"]').bind('click', function () {
				logout();
			});

			$(document).bind('click', function () {
				container.find('div.menu-action').hide();
			});
		}

		function getUserAndRoleInfo(userInfo, roleName) {

			let socialLoginInfo = '';
			let idpName = userInfo.IdpName;
			if (idpName && idpName.length && idpName !== 'Idsrv') { // display only external provider, internal IdSrv is suppressed
				socialLoginInfo = ' (' + idpName + ')';
			}
			return userInfo.UserName + socialLoginInfo + ' | ' + roleName;
		}

		function logout() {
			authService.logout();

			$('#login-info-info').hide();
			$('#login-info-login').show();

			updateDownloadStatus(false);
		}
	}

	function disableNoUseHtml(disableModel) {
		$('.topbar').html('');
		$('.information-container').html('');
		$('.scheme-container').html('');
		if (disableModel) {
			$('.models').parent().parent().html('');
		}
	}

	// searchType: init,change,search
	function search(pageIndex, searchType) {

		if (searchType === 'init') {
			return;
		}

		if (searchType === 'search') {
			$('#pagination').attr('data-current-page', pageIndex).jqPaginator('option', {currentPage: pageIndex});
		}
		let reload = false;
		if (searchType === 'reload') {
			reload = true;
		}

		$('body').loadingbar('start');
		let searchKey = $('#searchBox').val();

		window.ui.specActions.updateLoadingStatus('loading');
		if (appGlobal.searchAjaxRequest && appGlobal.searchAjaxRequest.readyState !== 4) {
			appGlobal.searchAjaxRequest.abort();
		}

		appGlobal.searchFilter = '?searchKey=' + encodeURIComponent(searchKey) + '&page=' + pageIndex + '&reload=' + reload;

		let url = appGlobal.apisDocsUrl + appGlobal.searchFilter;

		appGlobal.searchAjaxRequest = $.ajax(url).done(function (spec) {

			let $pager = $('#pagination');
			let currentPage = $pager.attr('data-current-page');

			if (parseInt(currentPage) > spec['RIBDocTotalPage']) {
				$pager.jqPaginator('option', {currentPage: spec['RIBDocCurrentPageIndex']});
			}

			$pager.jqPaginator('option', {totalPages: spec['RIBDocTotalPage']});

			window.ui.specActions.updateSpec(JSON.stringify(spec));

			disableNoUseHtml(true);

			window.ui.specActions.updateLoadingStatus('success');
			$('body').loadingbar('complete');

			window.setTimeout(function () {
				startWatchingRenderedNodes(spec, true);
			}, 100);
			appHelper.searchHistory.update(pageIndex, searchType, searchKey, spec['RIBDocTotalPage']);
		});

	}

	function initAutoComplete(data) {
		// Initialize ajax autocomplete:
		$('#searchBox').autocomplete({
			lookup: data,
			lookupFilter: function (suggestion, originalQuery, queryLowerCase) {
				let re = new RegExp($.Autocomplete.utils.escapeRegExChars(queryLowerCase).replace(/\s+/g, '.*'), 'gi');
				return re.test(suggestion.value);
			},
			onSelect: function (suggestion) {
				window.console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);
			},
			onHint: function (hint) {
				$('#searchBox-x').val(hint);
			},
			onInvalidateSelection: function () {
				window.console.log('You selected: none');
			},
			forceFixPosition: true,
			appendTo: '#searchSuggestion',
			deferRequestBy: 300,
			formatResult: function (suggestion, value, i) {
				let suggestionTemp = {value: suggestion.value};
				let html = $.Autocomplete.defaults.formatResult(suggestionTemp, value, i);
				if (/\s+/.test(value)) {
					let valueArr = value.split(/\s+/);
					for (let idv = 0, vLen = valueArr.length; idv < vLen; idv++) {
						suggestionTemp.value = html;
						html = $.Autocomplete.defaults.formatResult(suggestionTemp, valueArr[idv], i);
					}
				}
				return '<span title="' + suggestion.value + '">' + html + '</span>';
			}
		});
	}

	function initSwaggerUI(spec) {
		let ui = SwaggerUIBundle({
			spec: spec,
			dom_id: '#api-container',
			deepLinking: true,
			filter: false,
			validatorUrl: null,
			presets: [
				SwaggerUIBundle.presets.apis
			],
			plugins: [
				SwaggerUIBundle.plugins['DownloadUrl']
			],
			defaultModelRendering: 'example',
			defaultModelExpandDepth: 0,
			requestInterceptor: function (request) {
				if (authService.getAuthorization()) {
					request.headers['Authorization'] = authService.getAuthorization();
				}
				if (authService.getClientContext()) {
					let cloneContext = utility.clone(authService.getClientContext());
					if (cloneContext.secureClientRole) {
						cloneContext.signedInClientId = undefined;
						cloneContext.clientId = undefined;
						cloneContext.permissionClientId = undefined;
						cloneContext.permissionRoleId = undefined;
					}
					request.headers['Client-Context'] = JSON.stringify(cloneContext);
				}

				return request;
			},
			onComplete: function () {
				// window.console.info(arguments);
			}
		});

		try {
			// clear info of swagger
			ui.specSelectors.info = function () {
				return null;
			};
			// disable try it out when debug mode is false.
			ui.specSelectors.allowTryItOutFor = function () {
				return webAPIConfig.debugMode === true;
			};
		} catch (e) {
			console.log(e);
		}

		window.setTimeout(function () {
			startWatchingRenderedNodes(spec, true);
		}, 100);

		window.ui = ui;
	}

	function initPager(totalPages) {
		$('#pagination').jqPaginator({
			totalPages: totalPages,
			visiblePages: 10,
			currentPage: 1,
			onPageChange: function (num, type) {
				$('#pagination').attr('data-current-page', num);

				search(num, type);
			}
		});
	}

	function setLeftMenuContainerVisible(visible) {
		$('.itwo40-menu-container')[visible ? 'show' : 'hide']();
	}

	function initLeftMenu(modules, init) {

		function setMenus(modules) {
			let $menuContainer = $('#menu-list');
			$menuContainer.html('');
			if (!modules) {
				return;
			}
			let html = '';
			$.each(modules, function (index, module) {
				html += '<li>';
				let hasChild = module.subModules && module.subModules.length > 0;
				html += createMenuLink(module.name, null, !hasChild);
				if (hasChild) {
					html += '<ul class="sub-menu">';
					$.each(module.subModules, function (index, subModule) {
						html += '<li>';
						let hasChildren = subModule['entityTags'] && subModule['entityTags'].length > 0;
						html += createMenuLink(module.name, subModule.name, true, hasChildren);

						if (hasChildren) {
							html += '<ul class="entity-tag">';
							$.each(subModule['entityTags'], function (idx, entityTag) {
								html += '<li>';
								html += createEntityTagLink(module.name, subModule.name, entityTag.name);
								html += '</li>';
							});
							html += '</ul>';
						}

						html += '</li>';

					});
					html += '</ul>';
				}
				html += '</li>';
			});
			$menuContainer.html(html);

			const $subContainers = $('ul.sub-menu');
			$subContainers.find('li').click(function () {
				const isNode = $(this).find('>ul.entity-tag').length > 0;
				if (!isNode) {
					$subContainers.find('li').removeClass('selected');
					$(this).addClass('selected');
					return false;
				}
			});
		}

		function createMenuLink(module, subModule, isLink, hasChildren) {

			let keyWord = subModule ? module + '.' + subModule : module;
			let text = subModule ? subModule : module;
			let cls = subModule ? 'menu-sub-item' : 'menu-item';
			let link = isLink ? 'menu-link-item' : '';
			let ariaOpen = 'aria-open="false"';
			let hasChildrenAttr = hasChildren ? ' has-children ' : ' ';
			return '<a href="#" class="' + cls + ' ' + link + '" ' + ariaOpen + hasChildrenAttr + ' data-key-word="' + keyWord + '">' + text + '</a>';
		}

		function createEntityTagLink(module, subModule, entityTag) {
			let keyWord = module + '.' + subModule + '.' + entityTag;
			let text = entityTag;
			let cls = 'menu-tag-item menu-link-item';
			let ariaOpen = 'aria-open="false"';
			return '<a href="#" class="' + cls + '" ' + ariaOpen + ' data-key-word="' + keyWord + '">' + text + '</a>';
		}

		setMenus(modules);

		$.fn.changeAttr = function (attr, from, to) {
			let $element = $(this);
			let attrValue = $element.attr(attr);
			if (attrValue === from) {
				$element.attr(attr, to);
			}
		};

		$.fn.toggleAttr = function (attr, valueA, valueB) {
			let $element = $(this);
			let attrValue = $element.attr(attr);
			if (attrValue === valueA) {
				$element.attr(attr, valueB);
			} else {
				$element.attr(attr, valueA);
			}
		};

		function adjustMenuWidth() {
			let $menuContainer = $('.itwo40-menu-container');
			let $body = $(document.body);
			let $window = $(window);
			let w = $menuContainer.outerWidth();
			$body.css({
				width: $window.width() - w,
				'overflow-x': 'hidden',
				'overflow-y': 'auto',
				position: 'absolute'
			});
			$body.animate({left: $menuContainer.outerWidth()}, 'fast');

			// hack for animation.
			setTimeout(function () {
				let wNew = $menuContainer.outerWidth();
				if (wNew !== w) {
					$body.animate({left: wNew}, 'fast');
					$body.css({width: $window.width() - wNew});
				}
			}, 400);
		}

		function keyUpFunc() {
			let $resultNode = $('#noresult');
			$resultNode.fadeOut('fast');
			let $list = $('#menu-list');
			let filter = $(this).val().toLocaleLowerCase();
			if (filter) {
				filter = filter.toLocaleLowerCase();
				let $aList = $list.find('a.menu-item');
				let allShowCount = 0;
				for (let i = 0; i < $aList.length; i++) {
					let $item = $($aList[i]);
					let $aSubList = $item.parent().find('a.menu-sub-item');
					let showCount = 0;
					let showEntityCount = 0;

					for (let j = 0; j < $aSubList.length; j++) {
						showEntityCount = 0;
						let $subItem = $($aSubList[j]);
						let $entityTagList = $subItem.parent().find('a.menu-tag-item');

						for (let k = 0; k < $entityTagList.length; k++) {
							let $entityTag = $($entityTagList[k]);
							if ($entityTag.text().toLocaleLowerCase().indexOf(filter) === -1) {
								$entityTag.parent().slideUp();
							} else {
								showEntityCount++;
								$entityTag.parent().slideDown();
							}
						}

						if ($subItem.text().toLocaleLowerCase().indexOf(filter) !== -1 || showEntityCount > 0) {
							showCount++;
							allShowCount++;
							$subItem.parent().slideDown();

							if (showEntityCount > 0) {
								$subItem.parent().find('ul:first').slideDown();
								$item.changeAttr('aria-open', 'false', 'true');
							} else {
								$subItem.parent().find('ul:first').slideUp();
								$item.changeAttr('aria-open', 'true', 'false');
							}

						} else {
							$subItem.parent().slideUp();
						}
					}

					if ($item.text().toLocaleLowerCase().indexOf(filter) !== -1 || showCount > 0) {
						allShowCount++;
						$item.parent().slideDown();
						if (showCount > 0) {
							$item.parent().find('ul:first').slideDown();
							$item.changeAttr('aria-open', 'false', 'true');
						} else {
							$item.parent().find('ul:first').slideUp();
							$item.changeAttr('aria-open', 'true', 'false');
						}
					} else {
						$item.parent().slideUp();
						$item.changeAttr('aria-open', 'true', 'false');
					}
				}
				if (allShowCount === 0) {
					$resultNode.stop().fadeIn('fast');
				}
			} else {
				$list.find('a.menu-sub-item').parent().slideDown();
				$list.find('a.menu-item').parent().find('ul').slideUp();
				$list.find('a.menu-item').parent().slideDown();
				$list.find('a.menu-item:not(.menu-link-item)').changeAttr('aria-open', 'true', 'false');
			}
			adjustMenuWidth();
		}

		$('.filterinput').keyup(keyUpFunc);

		function toggleMenu() {
			let $menuItem = $(this);
			let $subMenu = $menuItem.parent().find('ul:first');
			if ($subMenu.length) {
				if ($subMenu.css('display') === 'block') {
					$subMenu.stop().slideUp();
					$menuItem.changeAttr('aria-open', 'true', 'false');
				} else {
					$subMenu.find('li').stop().show();
					$subMenu.stop().slideDown();
					$menuItem.changeAttr('aria-open', 'false', 'true');
				}
			}
			adjustMenuWidth();
		}

		$('.menu-item').click(toggleMenu);

		$('.menu-sub-item').click(toggleMenu);

		$('.menu-link-item').click(function () {
			$('#searchBox').val('[' + $(this).attr('data-key-word') + ']');
			search(1, 'search');
		});

		if (init === true) {

			setLeftMenuContainerVisible(true);

			menuToggle();

			$('#menu-button').click(menuToggle);

			$(window).resize(function () {
				menuToggle(true);
			});
		}

	}

	function menuToggle(close) {
		let $window = $(window);
		let $menuContainer = $('.itwo40-menu-container');
		let $body = $(document.body);
		let $menuBtn = $('#menu-button');

		let isOpen = $menuContainer.attr('data-is-open');

		function closeMenu() {
			$menuBtn.removeClass('expand');
			$menuContainer.attr('data-is-open', 'false');
			$menuContainer.css({
				position: 'fixed'
			});

			$body.css({
				width: '',
				'overflow-x': '',
				'overflow-y': '',
				position: ''
			});

			$menuContainer.animate({left: -$menuContainer.outerWidth()}, 'fast');
			$body.animate({left: 0}, 'fast', function () {
				$('#login-info-info').removeClass('expand');
				$('#lk-external').removeClass('expand');
				$('#login-info-login').removeClass('expand');
			});

		}

		function openMenu() {
			$menuBtn.addClass('expand');
			$menuContainer.attr('data-is-open', 'true');
			$menuContainer.css({position: 'fixed'});

			$body.css({
				width: $window.width() - $menuContainer.outerWidth(),
				'overflow-x': 'hidden',
				'overflow-y': 'auto',
				position: 'absolute'
			});

			$menuContainer.animate({left: 0}, 'fast');
			$body.animate({left: $menuContainer.outerWidth()}, 'fast');
			$('#login-info-info').addClass('expand');
			$('#lk-external').addClass('expand');
			$('#login-info-login').addClass('expand');
		}

		if (close === true) {
			if (isOpen === 'true') {
				closeMenu();
			}
		} else {
			if (isOpen === 'true') {
				closeMenu();
			} else {
				openMenu();
			}
		}

	}

	function initSearch() {
		function searchByType(type) {
			search(1, type);
		}

		$('#searchBox').keydown(function (e) {
			e = e || window['event'];
			if (e.keyCode === 13) {
				searchByType('search');
			}
		});
		$('#SearchBtn').click(function () {
			searchByType('search');
		});

		$('#ReloadBtn').click(function () {
			searchByType('reload');
		});

		$('#api-go-top').click(function () {
			$('html,body').scrollTop(0);
		});
		$(window).scroll(function () {
			window.clearTimeout(window.__scrollTimer);
			window.__scrollTimer = window.setTimeout(function () {
				let scrollTop = $(document).scrollTop();
				if (scrollTop > 200) {
					$('#api-go-top').fadeIn(300);
				} else {
					$('#api-go-top').fadeOut(300);
				}
			}, 200);
		});
	}

	function resetContainerSize() {

		let h = $(window).height(), offsetTop = 50, offsetBottom = 0;
		// remove download button, #114199 - download pdf button from web-api help window

		if (appGlobal.enabledFullApiDocDownload) {
			offsetBottom += 70;
		}

		$('#menu-list').height(h - offsetTop - offsetBottom);

	}

	function initLoginEvent() {
		$('#ui-login').click(function () {
			appHelper.viewHistory.update();
			window.location.href = 'login.html';
		});
	}

	function initChangeCompanyEvent() {
		$('#ui-chg-company').click(function () {
			appHelper.viewHistory.update();
			window.location.href = 'company.html';
		});
	}

	function initSwaggerApp() {
		// Load apis
		$('body').loadingbar('start');
		initPager(1);
		initSwaggerUI('{}');
		window.ui.specActions.updateLoadingStatus('loading');
		appGlobal.initAjaxRequest = $.ajax(appGlobal.swaggerInitServiceUrl).done(function (apiInitResponse) {
			appGlobal.apiResponse = apiInitResponse;
			if (apiInitResponse && apiInitResponse['apiRoutes'] && apiInitResponse['apiRoutes'].length > 0) {

				initAutoComplete(apiInitResponse['apiRoutes']);

				initLeftMenu(apiInitResponse.modules, true);

				let historyCache = appHelper.searchHistory.getLast();
				if (historyCache) {
					let pageIndex = historyCache.pageIndex, searchKey = historyCache.searchKey;
					$('#searchBox').val(searchKey);

					initSwaggerUI('{}');

					initPager(historyCache.totalPages || 100);

					disableNoUseHtml(true);

					search(pageIndex, 'search');
				} else {
					if (appGlobal.apisDocsUrl) {
						appGlobal.searchFilter = '?searchKey=';
						appGlobal.searchAjaxRequest = $.ajax(appGlobal.apisDocsUrl + appGlobal.searchFilter).done(function (spec) {

							initSwaggerUI(spec);

							initPager(spec['RIBDocTotalPage']);

							disableNoUseHtml(true);

							$('body').loadingbar('complete');

							appHelper.searchHistory.update(1, 'search', '', spec['RIBDocTotalPage']);
						});
					}
				}
				if (authService.isLogon()) {
					authService.getUserInfo().then(() => {
						updateDownloadStatus(true);
					});
				}
			}
		});

		// View history
		let viewHash = appHelper.viewHistory.getLast();
		if (viewHash) {
			window.location.hash = viewHash;
		}

	}

	function startWatchingRenderedNodes(data, matchURL) {
		$('#api-container').find('div.opblock-body').each(function (){
			$(this).removeAttr('data-event-bind');
		});

		function getFromCache(method, hash) {
			if (window._apiCache) {
				let cacheKey = method.toLowerCase() + hash;
				return window._apiCache[cacheKey];
			}
			return null;
		}

		function initializeCache() {
			// #/basics.publicapi_(v1.0)/BasicsPublicApiMasterData_GetLineItemContexts
			let paths = data ? data['paths'] : [], _apiCache = {};
			for (let path in paths) {
				if (Object.hasOwnProperty.call(paths, path)) {
					let api = paths[path],
						cacheKey = null;
					if (api.get) {
						api.get.hash = '#' + path;
						cacheKey = 'get' + api.get.hash;
						_apiCache[cacheKey] = api.get;
					}
					if (api.post) {
						api.post.hash = '#' + path;
						cacheKey = 'post' + api.post.hash;
						_apiCache[cacheKey] = api.post;
					}
				}
			}
			window._apiCache = _apiCache;
		}

		function displayObsoleteForApi(apiNode) {
			let bodyNode = apiNode.find('div.opblock-body:first');
			if (apiNode.hasClass('opblock-deprecated')) {
				let hash = '#' + $.trim(apiNode.find('a.nostyle').find('span').text()),
					method = apiNode.find('span.opblock-summary-method').text();
				let api = getFromCache(method, hash);
				let obsoleteMsg = '' + (api && api['RIBDeprecatedMessage'] ? api['RIBDeprecatedMessage'] : '');
				if (bodyNode.find('> p.p-obsolete').length === 0) {
					window.setTimeout(function () {
						if (bodyNode.find('> p.p-obsolete').length === 0) {
							bodyNode.find('> h4.opblock-title_normal').after($('<p class="p-obsolete"></p>').text(obsoleteMsg));
						}
					}, 50);
				} else {
					bodyNode.find('> p.p-obsolete').text(obsoleteMsg);
				}
			}
			if (bodyNode.length > 0) {
				if (!bodyNode.attr('data-event-bind')) {

					let tables = bodyNode.find('table');

					for (let t = 0; t < tables.length; t++) {
						let table = tables[t];
						let trs = $(table).find('tr');
						for (let i = 0; i < trs.length; i++) {
							let tr = trs[i];
							let clsArr = tr.className.split(' ');
							for (let x = 0; x < clsArr.length; x++) {
								let cls = clsArr[x];
								if (cls === 'has-children') {
									$(tr).attr('has-children', '');
								} else {
									let kv = cls.split('-');
									$(tr).attr(kv[0], kv[1]);
								}

							}

							let hasChildren = $(tr).hasClass('has-children');
							if (hasChildren) {
								$(tr).find('td:eq(0)').bind('click', function () {
									let parent = $(this).parent();
									let refName = parent.attr('name');
									let level = parent.attr('level');
									let next = parent.next();
									let collapse = next.attr('collapse');
									let newCollapse = collapse === 'true' ? 'false' : 'true';
									while (next.is('tr')) {
										let currentLevel = next.attr('level');
										if (next.attr('ref') === refName && parseInt(currentLevel) === parseInt(level) + 1) {
											next.attr('collapse', newCollapse);
										}
										if (newCollapse === 'true') {
											if (parseInt(currentLevel) > parseInt(level)) {
												next.attr('collapse', newCollapse);
											} else {
												break;
											}
										}
										next = next.next();
									}
								});
							}
						}
					}

					let codeNodes = bodyNode.find('code'),
						blockNodes = bodyNode.find('div.markdown > blockquote:first').siblings('blockquote'),
						opblockSection = bodyNode.find('> .opblock-section');
					if (codeNodes.length > 0 || blockNodes.length > 0) {

						codeNodes.each(function () {
							$(this).parent().css({position: 'relative'}).append($('<a class="copy-code">Copy</a>').click(function () {
								try {
									let range = document.createRange();
									range.selectNodeContents($(this).parent().find('code').get(0));
									let selection = document.getSelection();
									selection.removeAllRanges();
									selection.addRange(range);
									document.execCommand('copy');
									selection.removeAllRanges();
									$('body').notify('Copy successfully.');
								} catch (ex) {
									window.alert(ex.message);
								}
							}));
						});

						blockNodes.each(function () {
							let blockNode = $(this);
							// Top switcher
							blockNode.append($('<a class="content-switcher top collapsed" title="Collapsed/Expand"></a>').click(function () {
								if (blockNode.hasClass('collapsed')) {
									blockNode.removeClass('collapsed').addClass('expand');
									$(this).removeClass('expand').addClass('collapsed');
								} else {
									blockNode.removeClass('expand').addClass('collapsed');
									$(this).removeClass('collapsed').addClass('expand');
								}
								return false;
							}));
							// Bottom switcher
							if (blockNode.height() > 200) {
								blockNode.append($('<a class="content-switcher bottom collapsed" title="Collapsed"></a>').click(function () {
									$(this).siblings('a.content-switcher').click();
									return false;
								}));
							}
							// Also can click block to expand.
							blockNode.click(function () {
								if ($(this).hasClass('collapsed')) {
									$(this).find('> a.content-switcher:first').click();
								}
							});
						});

						bodyNode.attr('data-event-bind', true);
					}

					if (opblockSection.length > 0) {
						// format examples
						let examples = bodyNode.find('.opblock-description code');
						if (examples !== null && examples.length > 0) {
							$.each(examples, function (idx, example) {
								let $example = $(example);
								$example.html(jsonFormat($example.text()));
							});
						}
					}
				}
				bodyNode.slideDown(300);
			}
		}

		function isJsonLike(str) {
			let JSON_START = /^\[|^{(?!{)/;
			let JSON_ENDS = {
				'[': /]$/,
				'{': /}$/
			};
			let temp = str.replace(/^\s/, '').replace(/\s*$/, '');
			let jsonStart = temp.match(JSON_START);
			return jsonStart && JSON_ENDS[jsonStart[0]].test(temp);
		}

		function jsonFormat(json) {
			if (!json) {
				return json;
			}
			try {
				// json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
				let queryRegex = /(\w+)=([^&]+)/ig;
				if (!isJsonLike(json) && json.match(queryRegex)) {
					return json.replace(queryRegex, function (match) {
						let m = /(\w+)=(.*)/ig.exec(match);
						return '<span class="key">' + m[1] + '</span>=<span class="number">' + m[2] + '</span>';
					});
				}

				return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
					let cls = 'number';
					if (/^"/.test(match)) {
						if (/:$/.test(match)) {
							cls = 'key';
						} else {
							cls = 'string';
						}
					} else if (/true|false/.test(match)) {
						cls = 'boolean';
					} else if (/null/.test(match)) {
						cls = 'null';
					}
					return '<span class="' + cls + '">' + match + '</span>';
				});
			} catch (e) {
				return json;
			}

		}

		function fireCurrentActivateApi() {
			let currHash = window.location.hash, nodes = currHash.split('/');
			if (nodes.length > 0) {
				// operations-basics.publicapi_(v1.0)-BasicsPublicApiMasterData_GetMasterDataContexts
				let elemId = 'operations-' + nodes[1] + '-' + nodes[2];
				try {
					elemId = decodeURIComponent(elemId);
				} catch (e) {
					console.warn(e.message);
				}
				let apiNode = $(document.getElementById(elemId));
				if (apiNode.length > 0) {
					displayObsoleteForApi(apiNode);
				}
			}
		}

		function attachTagSelectionEvent() {
			$('#api-container').find('div.opblock-tag-section').each(function () {
				$(this).click(function () {
					window.setTimeout(function () {
						attachApiEvents();
					}, 100);
				});
				$(this).addClass('hit');
			});
		}

		function attachApiEvents() {
			$('#api-container').find('div.opblock-summary').each(function () {
				if (!$(this).hasClass('hit')) {
					$(this).click(function () {
						let container = $(this).parent();
						window.setTimeout(function () {
							displayObsoleteForApi(container);
						}, 30);
					});
					$(this).addClass('hit');
				}
				if ($(this).next().find('div.opblock-body').length > 0) {
					let container = $(this).parent();
					window.setTimeout(function () {
						displayObsoleteForApi(container);
					}, 30);
				}
			});
		}

		if (data) {
			initializeCache();
		}

		attachTagSelectionEvent();

		attachApiEvents();

		if (matchURL && data && data['paths'] && Object.keys(data['paths']).length > 0) {
			fireCurrentActivateApi();
		}
	}

	function checkDownloadEnabled() {
		return authService.checkDownloadEnabled().then(function checkDownloadResult(result) {
			appGlobal.enabledFullApiDocDownload = result;
			updateDownloadStatus(appGlobal.enabledFullApiDocDownload);
			resetContainerSize();
		});
	}

	function updateDownloadStatus(enabled) {
		let disabledClass = 'download-disabled';
		if (enabled) {
			$('#menu-download-pdf,#DownloadPageBtn').attr('href', 'download.html').attr('title', 'Download PDF').attr('target', '_blank').removeClass(disabledClass);
		} else {
			$('#menu-download-pdf,#DownloadPageBtn').removeAttr('href').removeAttr('target').addClass(disabledClass).attr('title', 'Please login ...');
		}

		if (appGlobal.enabledFullApiDocDownload) {
			$('#menu-download-pdf').removeClass('download-hidden');
		} else {
			$('#menu-download-pdf').addClass('download-hidden');
		}
	}

	function initDownloadEvent() {
		$('#menu-download-pdf,#DownloadPageBtn').click(function () {
			if (!$(this).hasClass('download-disabled')) {
				switch ($(this).attr('id')) {
					case 'menu-download-pdf':
						$(this).attr('href', 'download.html');
						break;
					case  'DownloadPageBtn':
						$(this).attr('href', 'download.html' + appGlobal.searchFilter.replace(/([?&])reload=(true|false)/g, ''));
						break;
				}
			}
		});
	}

	function initializeEnvironment() {

		urlBuilder();

		initSwaggerApp();

		return $.when(true);
	}

	$(document).ready(function () {

		initializeEnvironment().then(function () {

			checkLogon();

			initSearch();

			initLoginEvent();

			initChangeCompanyEvent();

			resetContainerSize();

			initDownloadEvent();

		});

		$(window).resize(function () {
			resetContainerSize();
		});
	});

})(window.jQuery, window.utility, window.authService, window.SwaggerUIBundle, window.webAPIConfig);