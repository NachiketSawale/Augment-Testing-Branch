(function (angular) {

	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonCommunicationFormatter',
		['globals', '$injector', 'basicsCommonComplexFormatter', '$sanitize', 'platformDomainService', 'platformTranslateService', '_',
			function (globals, $injector, complexFormatter, $sanitize, platformDomainService, platformTranslateService, _) {
				function getDisplayText(columnDef, value) {
					let ret = '';
					if (!columnDef.formatterOptions)
						return ret;

					if (columnDef.formatterOptions.getItemText) {
						ret = columnDef.formatterOptions.getItemText(value);
					} else {
						let dataService = undefined;
						if (columnDef.formatterOptions.dataServiceName) {
							dataService = $injector.get(columnDef.formatterOptions.dataServiceName);
						} else if (columnDef.formatterOptions.getDataService) {
							dataService = columnDef.formatterOptions.getDataService();
						}

						if (dataService && dataService.getFieldDisplayText)
							ret = dataService.getFieldDisplayText(columnDef.field, value, columnDef.displayMember);
					}

					return ret;
				}

				function isEmailValid(value) {
					const regex1 = /^[\s\S]{1,64}@[\s\S]{1,253}$/;
					const regex2 = /@[\s\S]*@/;
					return _.isNil(value) || _.isEmpty(value) || regex1.test(value) && !regex2.test(value);
				}

				function isShowEmailButton(itemText) {
					return !!(itemText && itemText.length > 0 && isEmailValid(itemText));
				}

				return function communicationFormatter(row, cell, value, columnDef, dataContext, plainText) {
					if (value === undefined) {
						value = '';
					}

					const domainInfo = platformDomainService.loadDomain('email');

					if (columnDef.formatterOptions.lookupDisplayColumn) {
						value = getDisplayText(columnDef, value);
						if(plainText) {
							return value;
						}
						if (columnDef.formatterOptions.domainType === 'email') {
							if (value && value.length && isShowEmailButton(value)) {
								value = '<a href="mailto:' + value + '"><i class="block-image ' + domainInfo.image + '" title="mailto:' + value + '"></i></a><span class="pane-r">' + value + '</span>';
							}
						} else if (columnDef.formatterOptions.domainType === 'phone') {
							if (value && value.length && globals.telephoneScheme && globals.telephoneScheme.id) {
								value = '<a href="' + globals.telephoneScheme.scheme + ':' + value + '"><i class="block-image control-icons ' + globals.telephoneScheme.css + '" title="' + globals.telephoneScheme.scheme + ':' + value + '"></i></a><span class="pane-r">' + value + '</span>';
							}
						}

						value = value ? $sanitize(value) : '';
					} else if (columnDef.formatterOptions.domainType === 'lookup') {
						value = complexFormatter(row, cell, value, columnDef, dataContext, plainText);
						if (value.indexOf('invalid-cell') === -1) {
							if(plainText) {
								return value;
							}
							if (columnDef.formatterOptions.communicationType === 'phone') {
								if (value && value.length && globals.telephoneScheme && globals.telephoneScheme.id) {
									value = '<a href="' + globals.telephoneScheme.scheme + ':' + value + '"><i class="block-image control-icons ' + globals.telephoneScheme.css + '" title="' + globals.telephoneScheme.scheme + ':' + value + '"></i></a><span class="pane-r">' + value + '</span>';
								}
							} else if (columnDef.formatterOptions.communicationType === 'email') {
								if (value && value.length && isShowEmailButton(value)) {
									value = '<a href="mailto:' + value + '"><i class="block-image ' + domainInfo.image + '" title="mailto:' + value + '"></i></a><span class="pane-r">' + value + '</span>';
								}
							}

							value = value ? $sanitize(value) : '';
						}
					} else if (columnDef.formatterOptions.domainType === 'email') {
						value = complexFormatter(row, cell, value, columnDef, dataContext, plainText);
						if(plainText) {
							return value;
						}
						if (!isShowEmailButton(value)) {
							const error = dataContext.__rt$data && dataContext.__rt$data.errors && dataContext.__rt$data.errors[columnDef.field];
							if (error) {
								if (error.error$tr$) {
									platformTranslateService.translateObject(error, 'error');
								}

								// value = '<div class="invalid-cell" title="' + error.error + '"><span class="pane-r">' + value + '</span></div>';
							}
						}
					} else {
						value = complexFormatter(row, cell, value, columnDef, dataContext, plainText);
					}

					return value;
				};
			}]);

})(angular);