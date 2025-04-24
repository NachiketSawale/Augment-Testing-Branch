(function () {
	'use strict';

	/* HTML5 implementation of editable dropdown control
	 http://stackoverflow.com/questions/264640/how-can-i-create-an-editable-dropdownlist-in-html
	 <input type="text" name="product" list="productName"/>
	 <datalist id="productName">
	 <option value="Pen">Pen</option>
	 <option value="Pencil">Pencil</option>
	 <option value="Paper">Paper</option>
	 </datalist>
	 */

	angular.module('platform').directive('dropdownSelect2', control);

	control.$inject = ['$compile', '$timeout', '_'];

	function control($compile, $timeout, _) {
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
					retArr.push({id: i[key], text: i[text], origin: i, title: i[text]});
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
					selectedItems = selectedItems || ''; // unselect if nothing there in model
					// console.log('setSelection', selectedItems, 'M:', multipleMode);
					theControl.val(selectedItems).trigger('change');
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
					// dataSource = scope.$eval(attrs.options);
					// console.log('dropdownBySelect2 items update request', dataSource || ' datasource missing', attrs.options);
					prepareDataSource(dataSourceSelect2, dataSource);
					selectedItems = scope.$eval(attrs.model) || null;

					if (theControl) {
						// selected items list, selection is done with key i.e. [1, 343]
						// execute it in next digest cycle, this prevents $digest already running
						$timeout(function () { // rei: don't know if we need that code
							// because select2 V2.4rc2 does not clear old options list we have to do it by ourselfes
							theControl.find('Option').remove();
							theControl.find('optgroup').remove();
							// theControl.select2({data: dataSourceSelect2}); // make sure item will be updated to list
							theControl.select2(select2Options); // make sure item will be updated to list

							if (attrs.cssclass || attrs.cssclass === 'selectbox') {

								theControl.parent().find('b[role="presentation"]').addClass('hide');

								theControl.parent().find('.select2-selection__arrow').css({
									'width': '26px',
									'height': '26px',
									'top': '0',
									'right': '0'
								});

								theControl.parent().find('.select2-selection__arrow').append('<div class="input-group-btn"><button type="button" class="btn btn-default" style="height: 26px;"><span class="caret"></span></button></div>');
							}

							setSelection();
						}, 0);
					}
				}

				/**
				 * @param newValue
				 * @param oldValue
				 */
				function modelWatcher(newValue, oldValue) { // jshint ignore:line
					// //// Info //////////
					// from  C:\05-iTWOCloud\wsfull\Cloud\Development\Lookup\Lookup.Client.Web (Angular)\Cloud.Lookup\directives\base\lookup-controller-base.js: 117
					// ////////////////////
					selectedItems = scope.$eval(attrs.model) || null;
					if (!angular.equals(newValue, oldValue)) {  // jshint ignore:line
						// selectedValues = theControl.val();
						// console.log('dropdown: modelWatcher single', newValue, oldValue, selectedItems, selectedValues);
						safeSetSelection();
					}
				}

				var template = '<select @@attributes@@ class="@@cssclass@@" style="width: 100%;"></select>';
				var dataSource, dataSourceSelect2 = [];
				var select2Options, selectedItems;
				var deepWatch = attrs.useDeepWatch || false;

				var matchfunction = attrs.matchfunction ?
					(attrs.matchfunction.toLowerCase() === 'default') ?
						defaultMatcherFct : isFunctionElseUndefined(scope, attrs.matchfunction)
					: undefined;

				var templateResult = isFunctionElseUndefined(scope, attrs.templateResult);
				var templateSelection = isFunctionElseUndefined(scope, attrs.templateSelection);

				// attach datasource to select2
				if (attrs.options) {
					dataSourceSelect2.length = 0;
					dataSource = scope.$eval(attrs.options);

					// ///////////////////////////////////////////////////////////////////////////////////////
					// i t e m s    W A T C H E R   watch for changes of item list datasource
					// ///////////////////////////////////////////////////////////////////////////////////////
					if (deepWatch) {
						scope.$watch(attrs.options + '.items', dataSourceItemsWatcher, 1);
					} else {
						scope.$watchCollection(attrs.options + '.items',
							dataSourceItemsWatcher);
					}

					if (dataSource.items) {
						if (dataSource.items.length > 0) {
							prepareDataSource(dataSourceSelect2, dataSource);
						}

					}

					// ///////////////////////////////////////////////////////////////////////////////////////
					// n g m o d e l    W A T C H E R
					// watch for changes of item list datasource
					// watch model in case of change of model without having item in list
					// ///////////////////////////////////////////////////////////////////////////////////////
					scope.$watch(attrs.model, modelWatcher);
				}

				// definition of the select2 control options
				select2Options = {
					allowClear: _.isString(attrs.allowclear),
					minimumResultsForSearch: !_.isUndefined(attrs.nosearch) ? Infinity : undefined,
					matcher: matchfunction,
					tags: _.isString(attrs.useTags),
					tokenSeparators: attrs.tokenSeparators,
					maximumSelectionLength: attrs.maximumSelectionLength,
					templateSelection: templateSelection, // || formatSelection; // jshint ignore:line
					templateResult: templateResult, // || formatSelection; // jshint ignore:line

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
					'data-ng-model="' + attrs.model + '"',
					!attrs.ngModelOptions ? '' : ' data-ng-model-options="' + attrs.ngModelOptions + '"',
					!attrs.cssclass ? ' data-platform-control-validation' : '',
					// !domainData.regex ? '' : ' data-ng-pattern-restrict="' + domainData.regex + '"',
					// !domainData.mandatory ? '' : ' required',
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
				}, 0);

				// un-register on destroy
				scope.$on('$destroy', function () {
					if (theControl.data('select2')) {
						theControl.select2('close');
					}
				});
			}
		};
	}
})();
