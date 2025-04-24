/**
 * Created by wed on 2022.02.11
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.clerk';

	angular.module(moduleName).factory('basicsClerkFormatService', [
		'$injector',
		'platformObjectHelper',
		'$',
		'_',
		'platformTranslateService',
		'platformModuleNavigationService',
		'platformModuleInfoService',
		function (
			$injector,
			platformObjectHelper,
			$,
			_,
			platformTranslateService,
			naviService,
			infoService) {

			let service = {};

			service.formatClerk = function (row, cell, value, columnDef, dataContext, plainText, uniqueId, options) { // jshint ignore:line
				let result = '';
				let promise;
				if (columnDef.formatterOptions) {
					let service = $injector.get('basicsLookupdataLookupDescriptorService');
					let item = null;
					let formatterOptions = [columnDef.formatterOptions];
					let targetData = service.getData(columnDef.formatterOptions.lookupType);

					value = platformObjectHelper.getValue(dataContext, columnDef.field);
					if (!_.isEmpty(targetData)) {
						item = targetData[value];

						if (!_.isEmpty(item)) {
							result = platformObjectHelper.getValue(item, columnDef.formatterOptions.displayMember);
						}
					}
					// subItem dto in main Dto, get data from there
					if (_.isObject(value)) {
						result = platformObjectHelper.getValue(value, columnDef.formatterOptions.displayMember);
					}

					// load Items async when they are not already in the client cache
					if (_.isEmpty(result) && platformObjectHelper.isSet(value) && !platformObjectHelper.isSet(item)) {
						service = $injector.get('basicsLookupdataLookupDescriptorService');
						item = service.getItemByIdSync(value, columnDef.formatterOptions);

						if (item) {
							result = platformObjectHelper.getValue(item, columnDef.formatterOptions.displayMember) || '';
						} else {
							promise = service.getItemByKey(columnDef.formatterOptions.lookupType, value, columnDef.formatterOptions, null).then(function (item) {
								if (item && platformObjectHelper.isSet(item.Id)) {
									// save current and restore old formatterOptions (can be already changed when using dynamic domain type
									formatterOptions.unshift(columnDef.formatterOptions);
									columnDef.formatterOptions = formatterOptions.pop();

									service.updateData(columnDef.formatterOptions.lookupType, [item]);
									result = platformObjectHelper.getValue(item, columnDef.formatterOptions.displayMember) || '';
									result = plainText ? result : formatLookup(dataContext, columnDef, result, item);
									applyAsyncFormatterMarkup(uniqueId, result);

									// restore current
									columnDef.formatterOptions = formatterOptions.pop();
								}

								return result;
							});

							if (options && options.promise) {
								return promise;
							}
						}
					}
					return plainText ? result : formatLookup(dataContext, columnDef, result, item);
				}

				return result;
			};

			function formatLookup(dataContext, columnDef, result, lookupItem) {
				result = formatErrorsOrRequired(dataContext, columnDef, result, lookupItem);

				// add action button markup, one entity can have several actionbuttons

				if (dataContext && (columnDef.field && dataContext[columnDef.field] && (!_.isEmpty(dataContext[columnDef.field].actionList) || !_.isEmpty(dataContext.actionList) || !_.isEmpty(columnDef.actionList)) || columnDef.forceActionButtonRender)) {
					result = getActionButtons(dataContext, columnDef);
				}

				// add image markup
				if (lookupItem && columnDef.formatterOptions && columnDef.formatterOptions.imageSelector) {
					let imageUrl = '';
					let imageSelector = columnDef.formatterOptions.imageSelector;

					if (angular.isString(imageSelector)) {
						imageSelector = $injector.get(imageSelector);
					}
					if (angular.isObject(imageSelector)) {
						imageUrl = imageSelector.select(lookupItem, dataContext);
					}
					if (imageUrl) {
						let isCss = imageSelector.isCss && imageSelector.isCss();
						let iconWrapper = isCss ? '<i class="block-image ' + imageUrl + '"></i>' : '<img src="' + imageUrl + '">';

						result = iconWrapper + '<span class="pane-r">' + result + '</span>';
					}
				}

				if (lookupItem && columnDef.formatterOptions && columnDef.formatterOptions.filter && columnDef.formatterOptions.filter.field && columnDef.formatterOptions.filter.field.toLowerCase() === 'color') {
					result = $injector.get('basicsLookupDataColorItemFormatter').formatter(dataContext[columnDef.field], lookupItem, lookupItem[columnDef.formatterOptions.displayMember], columnDef.formatterOptions);
				}

				if (_.isObject(result) && _.isArray(result.actionList)) {
					return '';
				} else {
					return _.isNil(result) ? '' : result;
				}
			}

			function formatErrorsOrRequired(dataContext, columnDef, formatterMarkup) {

				// add navigator markup
				if (columnDef && columnDef.navigator && !naviService.isCurrentState(columnDef.navigator.moduleName)) {
					formatterMarkup = formatterMarkup + getNavigator(columnDef, dataContext);
				}

				try {
					let error = dataContext.__rt$data.errors && dataContext.__rt$data.errors[columnDef.field];

					if (error) {
						if (error.error$tr$) {
							platformTranslateService.translateObject(error, 'error');
						}

						return '<div class="invalid-cell" title="' + error.error + '">' + formatterMarkup + '</div>';
					} else if (columnDef.required && (_.isNull(formatterMarkup) || _.isUndefined(formatterMarkup) || (_.isString(formatterMarkup) && !formatterMarkup.length))) {
						return '<div class="required-cell">' + formatterMarkup + '</div>';
					}
				} catch (e) {
					_.noop(e);
				}

				return formatterMarkup;
			}

			function getNavigator(options, entity) {
				let btn = null;
				let moduleName = options.navigator.moduleName;
				let value = _.isObject(entity) ? platformObjectHelper.getValue(entity, options.field) : entity;

				let hide = false;
				if (entity && naviService.getNavigator(moduleName) && _.isFunction(naviService.getNavigator(moduleName).hide)) {
					hide = naviService.getNavigator(moduleName).hide(entity);
				}

				if (!platformObjectHelper.isSet(value) || hide) {
					btn = '';
				}
				if (_.isNil(btn)) {
					let iconClass = 'ico-goto';
					let naviConf = naviService.getNavigator(moduleName);
					if (naviConf && naviConf.externalEntityParam) {
						iconClass = 'ico-goto2';
					}
					let classId = _.uniqueId('navigator_');
					btn = $('<div>').append($('<button>').attr('class', 'navigator-button tlb-icons ' + classId + ' ' + iconClass)
						.attr('title', infoService.getNavigatorTitle(moduleName))
					).html();
					addClickHandler(classId, options, entity);
				}
				return btn;
			}

			function getActionButtons(entity, columnDef) {

				let field = null;
				let list = entity.actionList;
				if (columnDef) {
					field = columnDef.field;
					list = list || columnDef.actionList;
				}

				if (field && entity[field] && entity[field].actionList) {
					list = entity[field].actionList;
				}

				let button = null;
				let container = $('<div>');

				_.each(list, function (action) {
					let classId = _.uniqueId('actionButton_');
					let toolTip;
					if (_.isFunction(action.toolTip)) {
						toolTip = action.toolTip(entity, field);
					} else {
						toolTip = action.toolTip + ' ' + (entity.Name ? entity.Name : '');
					}

					let readonly = _.get(action, 'readonly');
					let icon2Show = action.icon;

					if (_.isFunction(readonly)) {
						readonly = readonly();
					}
					// check the conditions for valueIcon
					if (action.valueIcon && platformObjectHelper.isSet(entity[field])) {
						icon2Show = action.valueIcon;
					}

					button = $('<button>')
						.attr('class', icon2Show + ' gridcell-ico ' + classId)
						.attr('title', toolTip);

					if (readonly) {
						button.attr('disabled', 'disabled');
					}

					container.append(button);

					if (!readonly) {
						addClickHandler(classId, columnDef, entity, action.callbackFn, field);
					}
				});

				// display field content beside the button(s)
				if (columnDef && columnDef.formatterOptions && columnDef.formatterOptions.appendContent) {

					// container.append('<span>' + entity[field] + '</span>');  --> must concern displayMember!
					let displayMember = columnDef.formatterOptions.displayMember ? columnDef.formatterOptions.displayMember : field;
					let displayValue = platformObjectHelper.getValue(entity, displayMember) || '';
					container.append('<span>' + displayValue + '</span>');

				}

				return container.html();
			}

			function applyAsyncFormatterMarkup(uniqueId, markup) {
				let node = $('#' + uniqueId);

				if (!node.hasClass('editable')) {
					node.html(markup);
				}
			}

			function addClickHandler(classId, options, entity, callBack, field, lookupItem) {
				// append event handler on the next cycle
				let timeoutId = setTimeout(function () {
					$('.' + classId).click(function (event) {
						let type = classId.split('_')[0];
						switch (type) {
							case'navigator':
								if (options && options.navigator) {
									// prevent to leave grid editor in opened state
									event.stopPropagation();
									// custom navFunc, where u can impl your own logic
									if (_.isFunction(options.navigator.navFunc)) {
										options.navigator.navFunc(options, entity);
									} else {
										openModule(options, entity);
									}
								}
								break;

							case 'actionButton': {
								let list = entity.actionList || options.actionList;
								if (field && entity[field] && entity[field].actionList) {
									list = entity[field].actionList;
								}
								if (!_.isEmpty(list)) {
									if (_.isFunction(callBack)) {
										callBack(entity, field, options);
									}
								}
								break;
							}
						}
					});
					clearTimeout(timeoutId);
				}, 0);
			}

			function openModule(options, entity) {
				naviService.navigate(options.navigator, entity, options.field);
			}

			return service;
		}]);
})(angular);
