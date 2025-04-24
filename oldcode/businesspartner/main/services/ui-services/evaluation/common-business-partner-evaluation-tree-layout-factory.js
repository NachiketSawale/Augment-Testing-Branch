/**
 * Created by wed on 12/26/2018.
 */

(function (angular) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,$ */

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('commonBusinessPartnerEvaluationTreeLayoutFactory', [
		'$translate',
		'platformGridDomainService',
		'basicsCommonChangeStatusService',
		'commonBusinessPartnerEvaluationServiceCache',
		'commonBusinessPartnerBusinessPartnerEvaluationDetailLayout',
		'platformRuntimeDataService',
		'_',
		function ($translate,
			platformGridDomainService,
			basicsCommonChangeStatusService,
			serviceCache,
			commonBusinessPartnerBusinessPartnerEvaluationDetailLayout,
			platformRuntimeDataService,
			_) {

			function changeEvaluationStatusButton(column, evaluationTreeService, mainService) {
				var options = {
					moduleName: $translate.instant('businesspartner.main.evaluationStatusTitle'),
					field: column.field,
					actionList: [{
						toolTip: 'Editor',
						icon: 'navigator-button tlb-icons ico-preview-data tlb-icons ico-preview-data',
						callbackFn: getChangeEvaluationStatusHandler(evaluationTreeService, mainService)
					}]
				};
				var navBtnHtml = platformGridDomainService.getActionButton(options, column);
				var navDom = $(navBtnHtml).removeClass('gridcell-ico').css('padding', '0px').attr('title', options.moduleName);
				return $('<div></div>').append(navDom).html();
			}

			function getChangeEvaluationStatusHandler(dataService, mainService) {

				var handlerInfo = basicsCommonChangeStatusService.provideStatusChangeInstance(
					{
						projectField: 'ProjectFk',
						statusName: 'evaluation',// 'EvaluationStatus',
						mainService: mainService,
						dataService: dataService,
						statusField: 'EvalStatusFk',
						title: 'businesspartner.main.evaluationStatusTitle',
						updateUrl: 'businesspartner/main/businesspartnermain/changeevaluationstatus',
						id: 18
					}
				);
				return handlerInfo.fn;
			}

			function createLayout(serviceDescriptor, options) {

				if (serviceCache.hasService(serviceCache.serviceTypes.EVALUATION_LAYOUT, serviceDescriptor)) {
					return serviceCache.getService(serviceCache.serviceTypes.EVALUATION_LAYOUT, serviceDescriptor);
				}
				var createOptions = angular.extend({
						getDataService: function () {

						},
						getMainService: function () {

						}
					}, options),
					detailLayout = angular.copy(commonBusinessPartnerBusinessPartnerEvaluationDetailLayout);
				angular.extend(detailLayout.overloads, {
					'evalstatusfk': {
						'grid': {
							'editor': null,
							'formatter': function (row, cell, value, columnDef, dataContext, plainText) {
								var result = '';
								var gridFormatter = platformGridDomainService.formatter('lookup');
								if (gridFormatter) {
									result = gridFormatter(row, cell, value, columnDef, dataContext, plainText);
								}
								if (result === null) {
									result = '';
								}
								if (value) {
									result += changeEvaluationStatusButton(columnDef, createOptions.getDataService(), createOptions.getMainService());
								}
								return plainText ? value : result;
							},
							'formatterOptions': {
								lookupType: 'evaluationstatus',
								displayMember: 'DescriptionInfo.Description',
								imageSelector: 'platformStatusIconService'
							}
						}
					},
					'checked': {
						'grid': {
							// if container only has read permission, the check box still can be used to show chart. So override the formatter to show check box.
							'formatter': function (row, cell, value, columnDef, dataContext, plainText) {
								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								let template = '';

								if (!plainText) {
									if (!_.get(dataContext, '__rt$data.locked', false) && !_.get(_.find(platformRuntimeDataService.readonly(dataContext), {field: columnDef.field}), 'readonly', false))
									{
										template = '<div class="text-center" ><input type="checkbox"' + (value ? ' checked="checked"' : '') + '></div>';
									} else {
										if (platformRuntimeDataService.isHideReadonly(dataContext, columnDef.field) || columnDef.formatterOptions && columnDef.formatterOptions.hideReadonly) {
											template = '';
										} else {
											template = '<div class="text-center" ><input type="checkbox" disabled="disabled"' + (value ? ' checked="checked"' : '') + '></div>';
										}
									}
								}

								return template;
							}
						}
					}
				}
				);

				serviceCache.setService(serviceCache.serviceTypes.EVALUATION_LAYOUT, serviceDescriptor, detailLayout);

				return detailLayout;

			}

			return {
				createLayout: createLayout
			};
		}
	]);
})(angular);