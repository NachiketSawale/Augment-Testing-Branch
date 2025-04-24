(function (angular) {
	'use strict';

	/**
	 *
	 * @param $
	 * @param $q
	 * @param _
	 * @param $http
	 * @param platformGridAPI
	 * @param platformGridDomainService
	 * @param globals
	 * @returns {{}}
	 * @constructor
	 */
	function ReportingPrintService($, $q, _, $http, platformGridAPI, platformGridDomainService, globals) {
		var service = {};

		/**
		 * @constructor
		 */
		function RowMetadata() {
			this.IsGroup = false;
			this.IsRoot = false;
			this.Colspan = 1;
			this.Level = 0;
			this.HasChildren = false;
			this.Values = [];
		}

		/**
		 * @param domain
		 * @param value
		 * @param isHtmlFormatted
		 * @constructor
		 */
		function ValueMetadata(domain, value, isHtmlFormatted) {
			this.Domain = domain;
			this.Value = value;
			this.IsHtmlFormatted = isHtmlFormatted;
		}

		/**
		 * @param data
		 * @param isForm
		 */
		function sendPrintData(data, isForm) {
			const url = globals.webApiBaseUrl + 'basics/printing/' + (isForm ? 'printform' : 'printgrid');

			$http.post(url, data)
				.then(function (response) {
					const strWindowFeatures = 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes';
					const templateEndpoint = 'reporting.platform/templates/print_template.html';
					const newWindow = window.open(templateEndpoint, 'print_window', strWindowFeatures);
					if (!newWindow) {
						console.error('can\'t load html from:', templateEndpoint);
					} else {
						angular.element(newWindow).ready(function () {
							setTimeout(function () {
								newWindow.document.body.innerHTML = response.data;
							}, 500);
						});
					}
				});
		}

		/**
		 * @param gridId
		 */
		service.printGrid = function printGrid(gridId) {
			if (!gridId) {
				throw new Error('Grid id was not passed as an parameter.');
			}
			var data = platformGridAPI.rows.getRows(gridId);
			var columns = _.filter(platformGridAPI.columns.getColumns(gridId), function (col) {
				return col.id !== 'indicator' && col.id !== 'group';
			});
			var options = platformGridAPI.grids.getOptions(gridId);

			var dto = {
				Headers: [],
				Rows: [],
				IsTreegrid: options.tree,
				ContainerName: ''
			};

			var i, j, item, domain;


			for (i = 0; i < columns.length; i++) {
				if (_.get(columns[i], 'printable', true)) {
					var label = columns[i].userLabelName || columns[i].name;
					dto.Headers.push(label);
				}
			}
			let promises = [];
			let addToPromisesIfNecessary  = function (possiblePromise) {
				if(_.isObject(possiblePromise) && _.isFunction(possiblePromise.then)){
					promises.push(possiblePromise);
				}
			};
			//load all none cached data
			for (i = 0; i < data.length; i++) {
				if (data[i].__group && data[i].collapsed) {
					for (var k = 0; k < data[i].rows.length; k++) {
						let r = data[i].rows[k];
						for (j = 0; j < columns.length; j++) {
							addToPromisesIfNecessary(columns[j].formatter(0, 0, null, columns[j], r, true, undefined, { promise: true }));
						}
					}
				}
				else if(options.tree){
					for (j = 0; j < columns.length; j++) {
						if(columns[j].formatter){
							if(columns[j].formatter$name === 'dynamic'){
								var propertyValue = platformGridAPI.cells.getDataitemForCell(gridId, data[i], columns[j]);
								var formatter = columns[j].domain(propertyValue, columns[j], false);
								addToPromisesIfNecessary((_.isString(formatter) ? platformGridDomainService.formatter(formatter) : formatter)(0, 0, propertyValue, columns[j], data[i], undefined, undefined, { promise: true }));
							}
							else{
								addToPromisesIfNecessary(columns[j].formatter(0, 0, _.get(data[i], columns[j].field), columns[j], data[i], true, undefined, { promise: true }));
							}
						}
					}
				}
				else{
					for (j = 0; j < columns.length; j++) {
						if(columns[j].formatter){
							addToPromisesIfNecessary(columns[j].formatter(0, 0, _.get(data[i], columns[j].field), columns[j], data[i], true, undefined, { promise: true }));
						}
					}
				}
			}
			$q.all(promises).then(function () {
				for (i = 0; i < data.length; i++) {
					var row = new RowMetadata();
					var d = data[i];
					if (data[i].__group) {
						row.IsGroup = true;
						row.Level = data[i].level;
						row.Values.push(new ValueMetadata('group', d.printTitle));
						row.Colspan = columns.length;
						dto.Rows.push(row);
						if (d.collapsed) {
							for (var k = 0; k < d.rows.length; k++) {
								var r = d.rows[k];
								var gRow = new RowMetadata();
								gRow.Colspan = 1;
								for (j = 0; j < columns.length; j++) {
									domain = columns[j].domain || '';
									if (columns[j].formatter) { // jshint ignore:line
										item = columns[j].formatter(0, 0, null, columns[j], r, true);
										if (item && item.$$state) {
											item = '';
										}
										gRow.Values.push(new ValueMetadata(domain, item || '', columns[j].isHtmlFormatted));
									} else { // jshint ignore:line
										gRow.Values.push(new ValueMetadata(domain, r[columns[j].field] || '', columns[j].isHtmlFormatted));
									}
								}
								dto.Rows.push(gRow);
							}
						}
					} else if (options.tree) {
						row.HasChildren = d[options.childProp] && d[options.childProp].length;
						if (options.parentProp) {
							row.IsRoot = d[options.parentProp] === null || d[options.parentProp].length === 0;
						}
						row.Level = d.nodeInfo ? d.nodeInfo.level : 0;
						row.Colspan = 1;
						// row.Values.push(new ValueMetadata('structure', ''));
						for (j = 0; j < columns.length; j++) {
							if (!_.get(columns[j], 'printable', true)) {
								continue;
							}
							domain = columns[j].domain || columns[j].editor$name || columns[j].formatter$name || '';
							if (columns[j].formatter) {
								if (columns[j].formatter$name === 'dynamic') {
									var propertyValue = platformGridAPI.cells.getDataitemForCell(gridId, data[i], columns[j]);
									var formatter = columns[j].domain(propertyValue, columns[j], false);

									item = (_.isString(formatter) ? platformGridDomainService.formatter(formatter) : formatter)(0, 0, propertyValue, columns[j], data[i]);
								} else {
									item = columns[j].formatter(0, 0, _.get(data[i], columns[j].field), columns[j], data[i], true);
								}
								if (item && item.$$state) {
									item = '';
								}
								row.Values.push(new ValueMetadata(domain, item || '', columns[j].isHtmlFormatted));
							} else {
								row.Values.push(new ValueMetadata(domain, data[i][columns[j].field] || '', columns[j].isHtmlFormatted));
							}
						}
						dto.Rows.push(row);
					} else {
						row.HasChildren = false;
						row.IsRoot = false;
						row.Level = 0;
						row.Colspan = 1;
						for (j = 0; j < columns.length; j++) {
							domain = columns[j].domain || '';
							if (columns[j].formatter) {
								let itemValue = _.get(data[i], columns[j].field);
								item = columns[j].formatter(0, 0, itemValue, columns[j], data[i], true);
								if (item && item.$$state) {
									item = '';
								}
								row.Values.push(new ValueMetadata(domain, item || '', columns[j].isHtmlFormatted));
							} else {
								row.Values.push(new ValueMetadata(domain, data[i][columns[j].field] || '', columns[j].isHtmlFormatted));
							}
						}
						dto.Rows.push(row);
					}
				}
				sendPrintData(dto, false);
			});
		};

		var formContent = null;

		service.printForm = function (uuid) {
			var element = $('.cid_' + uuid);
			formContent = element.find('[data-platform-form-content]').clone();
			formContent.find('.btn-default').remove();
			formContent.find('label img').remove();
			var strWindowFeatures = 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes';
			var newWindow = window.open('reporting.platform/templates/print_template.html', 'print_window', strWindowFeatures);

			angular.element(newWindow).ready(function () {
				setTimeout(function () {
					var body = newWindow.document.querySelector('body');

					$(formContent).find('input').each(function () {
						/*
							set value and checked attributes for input-tags. Otherwise IE dont show the contents
							set readonly true, so that the texts can not be changed.
						*/
						var _input = $('<input />', {
							'type': this.type === 'checkbox' ? 'checkbox' : 'text',
							'readonly': true,
							'class': this.getAttribute('class'),
							'value': _.isString(this.value) ? _.escape(this.value) : this.value
						});

						if (_input.is(':checkbox')) {
							if (this.checked) {
								_input.attr('checked', true);
							}
							// dont allowed to check
							_input.attr('onclick', 'return false;');
						}

						// dont need all the css-classes. Remove all css-classes with beginning with ng-
						_input.removeClass(function (index, css) {
							return (css.match(/\bng-\S+/g) || []).join(' ');
						});

						$(this).replaceWith(_input);
					});

					$(formContent).find('textarea').each(function () {
						const _textarea = $('<textarea>', {
							'readonly': true,
							'class': this.getAttribute('class'),
							'html': _.isString(this.value) ? _.escape(this.value) : this.value
						});

						// dont need all the css-classes. Remove all css-classes with beginning with ng-
						_textarea.removeClass(function (index, css) {
							return (css.match(/\bng-\S+/g) || []).join(' ');
						});

						$(this).replaceWith(_textarea);
					});

					body.innerHTML = formContent.html();
				}, 100);
			});
		};

		service.showProtocol = function showProtocol(options) {
			var strWindowFeatures = 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes';
			var newWindow = window.open(globals.appBaseUrl + 'reporting.platform/templates/print_template.html', options.title || 'Protocol', strWindowFeatures);

			angular.element(newWindow).ready(function () {
				setTimeout(function () {
					newWindow.document.body.innerHTML = options.content;
				}, 500);
			});
		};

		return service;
	}

	/**
	 *
	 * @type {string[]}
	 */
	ReportingPrintService.$inject = ['$', '$q', '_', '$http', 'platformGridAPI', 'platformGridDomainService', 'globals', '$sanitize'];

	/**
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('reporting.platform').factory('reportingPrintService', ReportingPrintService);

})(angular);