(function () {
	'use strict';
	var modName = 'controlling.common';
	
	angular.module(modName).factory('controllingVersionsListUIStandardService',
		['$', '_', 'basicsLookupdataConfigGenerator', 'controllingStructureTransferDataToBisDataReportService', 'platformUIStandardConfigService', 'controllingStructureTranslationService', 'platformSchemaService',

			function ($, _, basicsLookupdataConfigGenerator, controllingStructureTransferDataToBisDataReportService, platformUIStandardConfigService, translationService, platformSchemaService) {

				let dataService;

				let layout = {
					'fid': 'controlling.structure.history.detail',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [
						{
							'gid': 'baseGroup',
							'attributes': ['historydate', 'ribhistoryid', 'historydescription', 'historyremark', 'ribprjversion', 'ribcompanyid', 'reportlog']
						},
						{'gid': 'entityHistory', isHistory: true}],
					overloads: {
						historydate: {
							'readonly': true,
							'detail': {
								width: 120,
								formatter: 'dateutc'
							},
							'grid': {
								width: 120,
								formatter: 'dateutc'
							}
						},
						ribhistoryid: {
							'readonly': true,
							'detail': {
								formatter: 'integer',
								width: 80
							},
							'grid': {
								formatter: 'integer',
								width: 80
							}
						},
						historydescription: {
							'readonly': true,
							'detail': {
								formatter: 'description',
								maxLength: 9,
								width: 120
							},
							'grid': {
								formatter: 'description',
								maxLength: 9,
								width: 120
							}
						},
						historyremark: {
							'readonly': true,
							'detail': {
								formatter: 'description',
								maxLength: 9,
								width: 120
							},
							'grid': {
								readonly: true,
								formatter: 'description',
								maxLength: 9,
								width: 120
							}

						},
						ribprjversion: {
							'readonly': true,
							'detail': {
								formatter: 'integer',
								width: 80
							},
							'grid': {
								formatter: 'integer',
								width: 80
							}
						},
						ribcompanyid: {
							'readonly': true,
							'detail': {
								formatter: 'description',
								maxLength: 9,
								width: 120
							},
							'grid': {
								formatter: 'description',
								maxLength: 9,
								width: 120
							}
						},
						reportlog: {
							'readonly': true,
							'detail': {
								formatter: 'description',
								width: 250
							},
							'grid': {
								readonly: true,
								formatter: function (row, cell, value, columnDef, entity/* , plainText */) {
									function handleClick(classId, func) {
										var timeoutId = setTimeout(function () {
											$('.' + classId).click(function (e) {
												e.stopPropagation();
												func(e);
											});
											clearTimeout(timeoutId);
										}, 0);
									}

									var hasTransferLog = false;
									if (_.isString(value)) {
										try {
											var data = JSON.parse(value);
											var transferReport = controllingStructureTransferDataToBisDataReportService.processData(data);
											value = _.isString(transferReport.transferLogDetails) ? transferReport.logDetails : '';
											hasTransferLog = true;
										} catch (e) {
											// empty
										}
									} else {
										value = '';
									}

									var outValue = '<div class="ng-pristine ng-untouched ng-valid ng-scope ng-empty">';
									outValue += '<div class="control-directive input-group">';
									outValue += '<input type="text" class="form-control text-left" readonly="readonly" value="' + value + '"></input>';

									if (entity.ReportLog && hasTransferLog) {
										var classId = _.uniqueId('navigator_');
										outValue += '<span class="input-group-btn" >';
										outValue += '<button class="btn btn-default input-sm"><span class="control-icons ico-input-lookup lookup-ico-dialog ' + classId + '">&nbsp;</span></button>';
										handleClick(classId, function (/* e */) {
											if(dataService){
												dataService.setSelected(entity);
												dataService.showControllingVersionLog(entity);
											}else{
												// eslint-disable-next-line no-console
												console.log('Controlling Version List Data Service is missing.');
											}
										});
										outValue += '</button>';
									}

									outValue += '</div></div>';
									return outValue;
								},
								width: 250
							}

						}
					}
				};

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'BisPrjHistoryDto',
					moduleSubModule: 'Controlling.Structure'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				let service = new BaseService(layout, domainSchema, translationService);

				service.setDataService = function setDataService(service){
					dataService = service;
				};

				return service;

			}
		]);
})();
