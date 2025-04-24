/**
 * Created by anl on 9/1/2021.
 * Compared to 'dropdownSelect2Tags', Fixed update issue on line 144
 */

(function () {
	'use strict';

	angular.module('platform')
		.directive('dropdownSelect3Tags', ['$compile', '$timeout', '$parse', '_',
			function ($compile, $timeout, $parse, _) {

				/**
				 * @param outArray
				 * @param dataSource
				 */
				function prepareDataSource(outArray, dataSource, itemList) {
					/**
					 * !!!Attention: actualy V2.4 does not support prototyped classes,
					 * !!!therefore this will not work for copying the data array
					 * convert incomming datasource item into an array consumable by select2
					 * @param list
					 * @param key
					 * @param text
					 * @returns {Array}
					 */
					function select2DataArray(inArraylist, key, text, outArray) {
						var retArr = outArray || [];
						retArr.length = 0;
						_.forEach(inArraylist, function (i) {
							retArr.push({id: i[key], text: i[text], origin: i});
						});
						return retArr;
					}

					select2DataArray(itemList || dataSource.items, dataSource.valueMember, dataSource.displayMember, outArray);
				}

				/**
				 *
				 * @param attributeName
				 * @returns {*}
				 */
				function isFunctionElseUndefined(scope, attributeName) {
					if (attributeName) {
						var fct = scope.$eval(attributeName);
						return _.isFunction(fct) ? fct : undefined;
					}
					return undefined;
				}

				// //////////////////////////////////////////////////////////////////////////////////
				// d  i r e c t i v e   r e t u r n
				// //////////////////////////////////////////////////////////////////////////////////
				return {
					restrict: 'A',
					scope: false,
					link: function (scope, elem, attrs, ctrl) { // jshint ignore:line

						/**
						 * This matcher function matches all data item with beginning with input.term
						 *
						 * returning the item will display it in the selection list,
						 * returing null will supress it from seletion list
						 * @param term    input data i.q. 'a'
						 * @param data    the item
						 * @returns {*}
						 */
						function defaultMatcherFct(input, data) { // jshint ignore:line
							if (_.isUndefined(input.term)) {
								return data;
							}
							if (data && _.isString(data.text)) {
								if (data.text.toUpperCase().indexOf(input.term.toUpperCase()) === 0) {
									return data;
								}
							}
							return null;
						}

						/**
						 * @function  setSeletion
						 */
						function setSelection() {
							// selectedItems = selectedItems || (multipleMode ? [] : ''); // unselect if nothing there in model
							// var selectedValues = theControl.val();
							// console.log('dropdown: setSelection multiple >', selectedItems);
							if (_.isUndefined(selectedItems) || selectedItems === null) {
								theControl.val(null).trigger('change');
							} else {
								theControl.val(selectedItems).trigger('change');
							}
						}

						function safeSetSelection() {
							$timeout(function () { // do update in next digest cycle
								setSelection();
							}, 0);
						}

						/**
						 *
						 * @param newVal
						 * @param oldVal
						 */
						function dataSourceItemsWatcher(newVal, oldVal) {
							if (_.isUndefined(newVal) && _.isUndefined(oldVal)) {
								return;
							}
							// console.log('dropdownBySelect2 items update request', dataSource || ' datasource missing', attrs.options);
							prepareDataSource(dataSourceSelect2, dataSource);
							selectedItems = scope.$eval(attrs.model) || '';
							if (theControl) {
								// selected items list, selection is done with key i.e. [1, 343]
								// execute it in next digest cycle, this prevents $digest already running
								$timeout(function () { // rei: don't know if we need that code
									// because select2 V2.4rc2 does not clear old options list we have to do it by ourselfes
									theControl.find('Option').remove();
									theControl.find('optgroup').remove();
									// theControl.select2({data: dataSourceSelect2}); // make sure item will be updated to list
									theControl.select2(select2Options); // make sure item will be updated to list
									setSelection();
								}, 0);
							}
						}

						/**
						 *
						 */
						function getSelectItem() {
							var t = scope.$eval(attrs.model);
							return _.isUndefined(t) ? null : t;
						}

						/**
						 * @param newValue
						 * @param oldValue
						 */
						function modelWatcher(newValue, oldValue) { // jshint ignore:line
							// //// Info //////////
							// from  C:\05-iTWOCloud\wsfull\Cloud\Development\Lookup\Lookup.Client.Web (Angular)\Cloud.Lookup\directives\base\lookup-controller-base.js: 117
							// ////////////////////
							selectedItems = getSelectItem();
							if (!angular.equals(selectedItems, oldValue)) {  // jshint ignore:line
								// selectedValues = theControl.val();
								// console.log('dropdown: modelWatcher single', newValue, oldValue, selectedItems, selectedValues);
								safeSetSelection();
							}
						}

						var template = '<select @@attributes@@ class="@@cssclass@@" style="width: 100%;"></select>';
						var watchCollUnregister, watchModel;
						var dataSource, dataSourceSelect2 = [];
						var select2Options, selectedItems;
						var multipleMode = true; // we always use this mode _.isString(attrs.multiple); // if defined we get un empty string
						var dataSourcedeferred = false;
						var templateResult = isFunctionElseUndefined(scope, attrs.templateResult);
						var templateSelection = isFunctionElseUndefined(scope, attrs.templateSelection);
						var onChangedFct = isFunctionElseUndefined(scope, attrs.onChanged);

						// attach datasource to select2
						if (attrs.options) {
							dataSourceSelect2.length = 0;
							dataSource = scope.$eval(attrs.options);

							if (dataSource.items) {
								dataSourcedeferred = false;
								if (dataSource.items.length > 0) {
									prepareDataSource(dataSourceSelect2, dataSource);
								}

								// ///////////////////////////////////////////////////////////////////////////////////////
								// i t e m s    W A T C H E R   watch for changes of item list datasource
								// ///////////////////////////////////////////////////////////////////////////////////////
								watchCollUnregister = scope.$watchCollection(function () {
									return dataSource.items;
								}, dataSourceItemsWatcher);
							}

							// ///////////////////////////////////////////////////////////////////////////////////////
							// n g m o d e l    W A T C H E R
							// watch for changes of item list datasource
							// watch model in case of change of model without having item in list
							// ///////////////////////////////////////////////////////////////////////////////////////
							watchModel = scope.$watch(attrs.model, modelWatcher);
						}

						// definition of the select2 control options
						select2Options = {
							allowClear: _.isString(attrs.allowclear),
							minimumResultsForSearch: !_.isUndefined(attrs.nosearch) ? Infinity : undefined,
							multiple: multipleMode,
							// here not used matcher: matchfunction,
							tags: _.isString(attrs.useTags),
							tokenSeparators: attrs.tokenSeparators,
							maximumSelectionLength: attrs.maximumSelectionLength,
							templateSelection: templateSelection, // || formatSelection; // jshint ignore:line
							templateResult: templateResult, // || formatSelection; // jshint ignore:line
							disabled: attrs.ngReadonly && scope.$eval(attrs.ngReadonly),

							data: dataSourceSelect2,
							/* not workng yet, may come with V2.4 rc
						 data: function () {
						 return {text: dataSource.displayMember, results: dataSourceSelect2};
						 }, */

							// theme: 'classic', tokenSeparators: [',', ' '], allowClear: true
							justTheEnd: undefined
						};

						// standard attributes
						var attrList = [
							!attrs.ngModelOptions ? '' : ' data-ng-model-options="' + attrs.ngModelOptions + '"',
							!attrs.readonly ? '' : ' data-ng-readonly="' + attrs.readonly + '"',
							!attrs.change ? '' : ' data-ng-change="' + attrs.change + '"',
							!attrs.enterstop ? '' : ' data-enterstop="' + attrs.enterstop + '"',
							!attrs.tabstop ? '' : ' data-tabstop="' + attrs.tabstop + '"',
							!attrs.placeholder ? '' : ' placeholder="' + attrs.placeholder + '"'
						];
						template = template
							.replace('@@attributes@@', attrList.join(''))
							.replace('@@cssclass@@', (!attrs.domain ? '' : 'domain-type-' + attrs.domain + ' ') + (attrs.cssclass || 'form-control'));

						// we keep the resulting control in theControl var, later used for setting select2 properties
						var theControl = $compile(template)(scope);
						elem.replaceWith(theControl);

						// remark: register control as select2 must be done outside, otherwise select2 will not be initialized well
						$timeout(function () { // rei: don't know if we need that code
							theControl.select2(select2Options); // make sure item will be updated to list
							setSelection();

							/**
							 * any change will be propagated to origin model
							 */
							theControl.on('change', function () {
								function assignValueToModel(newValues) {
									var model = $parse(attrs.model);
									// "model" is now a function which can be invoked to get the expression's value;
									// the following line logs the value of obj.name on scope:
									// el.bind('click', function() {
									// "model.assign" is also a function; it can be invoked to
									// update the expresssion value
									model.assign(scope, newValues);

									if (onChangedFct) {
										onChangedFct(scope, newValues);
									}
								}

								var select2Model = theControl.val();
								// onyl propage if there is a change
								if (!angular.equals(select2Model, getSelectItem())) {
									assignValueToModel(select2Model);
								}
							});
						}, 0);

						// un-register on destroy
						scope.$on('$destroy', function () {
							if (watchModel) {
								watchModel();
							}
							if (watchCollUnregister) {
								watchCollUnregister();
							}
						});
					}
				};
			}]);
})
();