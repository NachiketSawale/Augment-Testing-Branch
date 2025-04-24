(function (angular) {
	'use strict';

	angular.module('basics.workflow').factory('genericWizardContextHelperService', genericWizardContextHelperService);

	genericWizardContextHelperService.$inject = ['_', '$http', '$q', '$injector', '$translate', 'additionalReferenceHeadersConstants'];

	function genericWizardContextHelperService(_, $http, $q, $injector, $translate, additionalReferenceHeadersConstants) {
		var service = {};
		let nonPersoReportDocList = [];

		var getBoqIdListString = function getBoqIdListString() {
			var genWizService = $injector.get('genericWizardService');
			var boqService = genWizService.getDataServiceByName(genWizService.config.serviceInfos.boqServiceName);
			var includedBoqList = _.filter(boqService.getList(), {IsIncluded: true});
			var includedBoqIdList = _.map(includedBoqList, function (boq) {
				return boq.BoqHeader.Id;
			});

			return _.join(includedBoqIdList, ',');
		};

		service.setReportParamValues = function setReportParamValues(reportList) {
			if (_.isArray(reportList)) {
				_.forEach(reportList, function (report) {
					if (report) {
						report.Parameters = [];

						_.forEach(_.concat(report.parameters, report.hiddenParameters), function (param) {
							var shortParameter = {
								Name: param.Name || param.ParameterName,
								ParamValueType: param.DataType
							};

							if (param.IsVisible) {
								shortParameter.ParamValue = _.isNil(param.value) || _.isNaN(param.value) ? null : param.value;
							} else {
								shortParameter.ParamValue = _.isNil(param.defaultValue) || _.isNaN(param.value) ? null : param.defaultValue;
							}

							// set BoQ_ID_List in new RfQ_BOQ_Material_with_BidderID Report
							if (_.toLower(shortParameter.Name) === 'boq_id_list') {
								shortParameter.ParamValue = getBoqIdListString();
							}

							if (!_.isNil(shortParameter.ParamValue)) {
								switch (param.DataType) {
									case 'System.String':
										if (!_.isString(shortParameter.ParamValue)) {
											shortParameter.ParamValue = shortParameter.ParamValue.toString();
										}
										if (_.isString(shortParameter.ParamValue) && !(_.startsWith(shortParameter.ParamValue, '"') && _.endsWith(shortParameter.ParamValue, '"'))) {
											shortParameter.ParamValue = '"' + shortParameter.ParamValue + '"';
										}
										break;
									case 'System.Boolean':
										if (param.actualDataType === 'intInStringAsBool' || param.actualDataType === 'intAsBool') {
											shortParameter.ParamValue = shortParameter.ParamValue ? 1 : 0;
										}
										break;
									case 'System.DateTime':
										shortParameter.ParamValue = angular.toJson(shortParameter.ParamValue);
										break;
								}

								if (!_.isString(shortParameter.ParamValue)) {
									shortParameter.ParamValue = shortParameter.ParamValue.toString();
								}
							}

							report.Parameters.push(shortParameter);
						});
					}
				});
			}
		};

		service.getExcelProperties = function getExcelProperties() {
			var ret = {BoqItem: {}, PrcItem: {}};
			var translate = $injector.get('$translate');

			_.forEach(['Reference', 'BriefInfo', 'BoqLineTypeFk', 'BasItemTypeFk', 'BasItemType2Fk', 'IsFreeQuantity', 'Quantity', 'BasUomFk', 'Price', 'IsUrb', 'Urb1', 'Urb2', 'Urb3', 'Urb4', 'Urb5', 'Urb6', 'CommentClient', 'CommentContractor', 'Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5', 'ExternalCode', 'OrdQuantity', 'PrevQuantity', 'DeliveryDate', 'MdcMaterialFk'], function (prop) {
				ret.BoqItem[prop] = translate.instant('boq.main.' + prop);
			});

			ret.PrcItem.Itemno = translate.instant('procurement.common.prcItemItemNo');               // Itemno:       { location: 'procurement.common', identifier: 'prcItemItemNo' },
			ret.PrcItem.Description1 = translate.instant('procurement.common.prcItemDescription1');   // Description1: { location: 'procurement.common', identifier: 'prcItemDescription1' },
			ret.PrcItem.Quantity = translate.instant('cloud.common.entityQuantity');                  // Quantity:     { location: 'cloud.common',       identifier: 'entityQuantity' },
			ret.PrcItem.BasUomFk = translate.instant('cloud.common.entityUoM');                       // BasUomFk:     { location: 'cloud.common',       identifier: 'entityUoM' },
			ret.PrcItem.Price = translate.instant('cloud.common.entityPrice');                        // Price:        { location: 'cloud.common',       identifier: 'entityPrice' },
			ret.PrcItem.TotalPrice = translate.instant('procurement.common.prcItemTotalPrice');       // TotalPrice:   { location: 'procurement.common', identifier: 'prcItemTotalPrice' },

			return ret;
		};

		service.setBusinessPartnerInReport = function setBusinessPartnerInReport(report, bidderId) {
			if (!_.isArray(report) && report) {
				_.forEach(report.Parameters, function (parameter) {
					const lowerCaseParamName = _.toLower(parameter.Name);
					if (lowerCaseParamName === 'bidderid' || lowerCaseParamName === 'businesspartnerid') {
						parameter.ParamValue = bidderId;
					}
				});
			}

			if (_.isArray(report) && !_.isEmpty(report)) {
				_.forEach(report, function (parameter) {
					const lowerCaseParamName = _.toLower(parameter.Name);
					if (lowerCaseParamName === 'bidderid' || lowerCaseParamName === 'businesspartnerid') {
						parameter.ParamValue = bidderId;
					}
				});
			}
		};

		service.createBidderContext = function createBidderContext(contextObj, bidder, propertyName) {
			const bidderContextObj = _.cloneDeep(contextObj);
			_.forEach(bidderContextObj.ReportList, function (report) {
				service.setBusinessPartnerInReport(report, bidder.BusinessPartnerFk);
			});
			service.setBusinessPartnerInReport(bidderContextObj.SelectedBodyLetterParameters, bidder.BusinessPartnerFk);
			bidderContextObj[propertyName] = bidder;

			// only for rfq bidder wizard atm
			if (bidder.lookup && bidder.lookup.BusinessPartnerName1) {
				bidderContextObj.SidebarNotificationAdditionalDetails = {
					AdditionalReferenceCreated: false,
					Header: $translate.instant(additionalReferenceHeadersConstants.GenericWizardBidderHeader),
					UserDefinedText: bidder.lookup.BusinessPartnerName1
				};
			}

			return bidderContextObj;
		};

		service.recycleContextVariables = function recycleContextVariables(context, contextToRecycle, propertyNameList, propertyNameToFileList) {
			if (context.isAlreadyRecycled) {
				return;
			}
			_.forEach(propertyNameList, function (propertyName) {
				if (contextToRecycle[propertyName] && !context[propertyName]) {
					context[propertyName] = contextToRecycle[propertyName];
					if (propertyName in propertyNameToFileList) {
						context.fileList.push(context[propertyName]);
					}
				}
			});
			context.isAlreadyRecycled = true;
		};

		service.getNonPersoReports = function getNonPersoReports(contextObject) {
			let genWizService = $injector.get('genericWizardService');

			// clear nonPersoReportDocIdList as no report is selected anymore
			let nonPersoReportList = contextObject.NonPersoReportList
			if (_.isEmpty(nonPersoReportList)) {
				service.clearGeneratedReportList();
			}

			const businessPartnerService = genWizService.getDataServiceByName(genWizService.config.serviceInfos.businessPartnerServiceName);
			let includedBidderList = _.filter(businessPartnerService.getList(), {IsIncluded: true});

			const defer = $q.defer();
			try {
				if ((_.isEmpty(nonPersoReportDocList) || !_.isEmpty(_.xor(_.map(nonPersoReportDocList, 'ReportId'), _.map(nonPersoReportList, 'Id')))) && !_.isEmpty(nonPersoReportList)) {
					let reportDataList = [];

					_.forEach(nonPersoReportList, function (report) {
						let customFileName = [contextObject.reportFileNaming, report.TemplateName].join('');

						reportDataList.push({
							ReportId: report.Id,
							Parameters: JSON.stringify(report.Parameters),
							ExportType: 'pdf',
							FilenName: customFileName.replace(/[\/\\?%*:|"<>]/g, '')
						});
					});

					includedBidderList[0].SendStatus = -1;
					$http({
						method: 'POST',
						url: globals.webApiBaseUrl + 'basics/workflow/action/generatereport',
						data: reportDataList
					}).then(function (response) {
						/*if (response?.data) {
							_.forEach(response.data, function (report) {
								nonPersoReportDocList.push(report.DocId);
							});
						}*/
						nonPersoReportDocList = response ? response.data : [];
						contextObject.fileList.push(..._.map(nonPersoReportDocList, 'DocId'));
						defer.resolve(contextObject);
					}, function () {
						includedBidderList[0].SendStatus = 1;
					});
				} else {
					contextObject.fileList.push(..._.map(nonPersoReportDocList, 'DocId'));
					defer.resolve(contextObject);
				}
			} catch (e) {
				includedBidderList[0].SendStatus = 1;
			}

			return defer.promise;
		};

		service.clearGeneratedReportList = function clearGeneratedReportList() {
			nonPersoReportDocList = [];
		};

		return service;
	}
})(angular);
