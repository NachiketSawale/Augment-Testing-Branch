/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IGenericWizardReportEntity } from '../../configuration/rfq-bidder/types/generic-wizard-report-entity.interface';
import { BOQ_EXCEL_ITEM_PROPS, ExcelProperties } from '../../models/types/generic-wizard-excel-properties.type';
import { PlatformTranslateService } from '@libs/platform/common';
import { RfqBidders } from '../../configuration/rfq-bidder/types/rfq-bidders.type';
import { cloneDeep, concat, endsWith, isArray, isNil, isString, startsWith, toLower } from 'lodash';
import { GenericWizardBaseContext, ContractConfirmContext, RfqBidderContext } from '../../configuration/rfq-bidder/types/generic-wizard-bidder-context.type';
import { GenericWizardConfigService } from './generic-wizard-config.service';
import { RfqBidderWizardContainers } from '../../configuration/rfq-bidder/enum/rfq-bidder-containers.enum';
import { ShortParameterType } from '../../configuration/rfq-bidder/types/generic-wizard-short-parameter.type';

@Injectable({
	providedIn: 'root'
})
export class GenericWizardContextService {

	private readonly translateService = inject(PlatformTranslateService);
	private readonly wizardConfigService = inject(GenericWizardConfigService);

	/**
	 * Creates rfq specific bidder context.
	 * @param contextObj 
	 * @param businessPartner 
	 * @returns 
	 */
	public createRfqBidderContext(contextObj: GenericWizardBaseContext, businessPartner: RfqBidders): RfqBidderContext {

		const bidderContextObj = this.setBusinessPartnerAndCloneContext(contextObj, businessPartner) as RfqBidderContext;
		bidderContextObj.Bidder = businessPartner;

		//TODO: After lookup enhancement.
		// only for rfq bidder wizard atm
		// if (businessPartner.lookup && businessPartner.lookup.BusinessPartnerName1) {
		// 	bidderContextObj.SidebarNotificationAdditionalDetails = {
		// 		AdditionalReferenceCreated: false,
		// 		Header: $translate.instant(additionalReferenceHeadersConstants.GenericWizardBidderHeader),
		// 		UserDefinedText: bidder.lookup.BusinessPartnerName1
		// 	};
		// }

		return bidderContextObj;
	}

	/**
	 * Creates contract specific bidder context.
	 * @param contextObj 
	 * @param businessPartner 
	 * @returns 
	 */
	public createContractConfirmBidderContext(contextObj: GenericWizardBaseContext, businessPartner: RfqBidders): ContractConfirmContext {
		const bidderContextObj = this.setBusinessPartnerAndCloneContext(contextObj, businessPartner) as ContractConfirmContext;
		bidderContextObj.BusinessPartner = businessPartner;

		return bidderContextObj;
	}

	private setBusinessPartnerAndCloneContext(contextObj: GenericWizardBaseContext, businessPartner: RfqBidders) {
		const bidderContextObj = cloneDeep(contextObj);
		//Set business partner in report parameters in reports.
		bidderContextObj.ReportList.forEach(report => this.setBusinessPartnerInReportParameter(businessPartner.BusinessPartnerFk, report.Parameters));
		//Set business partner in report parameters in cover letter.
		this.setBusinessPartnerInReportParameter(businessPartner.BusinessPartnerFk, bidderContextObj.SelectedBodyLetterParameters);
		return bidderContextObj;
	}

	public getExcelProperties(): ExcelProperties {

		const excelProperties = <ExcelProperties>{ BoqItem: {}, PrcItem: {} };
		BOQ_EXCEL_ITEM_PROPS.forEach(prop => {
			excelProperties.BoqItem[prop] = this.translateService.instant('boq.main.' + prop).text;
		});

		excelProperties.PrcItem.Itemno = this.translateService.instant('procurement.common.prcItemItemNo').text;               // Itemno:       { location: 'procurement.common', identifier: 'prcItemItemNo' },
		excelProperties.PrcItem.Description1 = this.translateService.instant('procurement.common.prcItemDescription1').text;   // Description1: { location: 'procurement.common', identifier: 'prcItemDescription1' },
		excelProperties.PrcItem.Quantity = this.translateService.instant('cloud.common.entityQuantity').text;                  // Quantity:     { location: 'cloud.common',       identifier: 'entityQuantity' },
		excelProperties.PrcItem.BasUomFk = this.translateService.instant('cloud.common.entityUoM').text;                       // BasUomFk:     { location: 'cloud.common',       identifier: 'entityUoM' },
		excelProperties.PrcItem.Price = this.translateService.instant('cloud.common.entityPrice').text;                        // Price:        { location: 'cloud.common',       identifier: 'entityPrice' },
		excelProperties.PrcItem.TotalPrice = this.translateService.instant('procurement.common.prcItemTotalPrice').text;       // TotalPrice:   { location: 'procurement.common', identifier: 'prcItemTotalPrice' },

		return excelProperties;
	}

	/**
	 * Sets values for all report parameters for the passed report list based on it's current value/default value.
	 */
	public setReportParamValues(reportList: IGenericWizardReportEntity[]) {
		if (isArray(reportList)) {
			reportList.forEach((report) => {
				if (report) {
					report.Parameters = [];
					const params = concat(report.parameters ?? [], report.hiddenParameters ?? []);
					params.forEach((param) => {
						//TODO: Move to separate type
						const shortParameter: ShortParameterType = {
							Name: param.name || param.parameterName,
							ParamValueType: param.dataType,
							ParamValue: null
						};

						if (param.isVisible) {
							shortParameter.ParamValue = isNil(param.value) || isNaN(param.value as number) ? null : param.value;
						} else {
							shortParameter.ParamValue = isNil(param.defaultValue) ? null : param.defaultValue;
						}

						// set BoQ_ID_List in new RfQ_BOQ_Material_with_BidderID Report
						if (toLower(shortParameter.Name) === 'boq_id_list') {
							shortParameter.ParamValue = this.getBoqIdListString();
						}

						if (!isNil(shortParameter.ParamValue)) {
							switch (param.dataType) {
								case 'System.String':
									if (!isString(shortParameter.ParamValue)) {
										shortParameter.ParamValue = shortParameter.ParamValue.toString();
									}
									if (isString(shortParameter.ParamValue) && !(startsWith(shortParameter.ParamValue, '"') && endsWith(shortParameter.ParamValue, '"'))) {
										shortParameter.ParamValue = '"' + shortParameter.ParamValue + '"';
									}
									break;
								case 'System.Boolean':
									if (param.actualDataType === 'intInStringAsBool' || param.actualDataType === 'intAsBool') {
										shortParameter.ParamValue = shortParameter.ParamValue ? 1 : 0;
									}
									break;
								case 'System.DateTime':
									shortParameter.ParamValue = JSON.stringify(shortParameter.ParamValue);
									break;
							}

							if (!isString(shortParameter.ParamValue)) {
								shortParameter.ParamValue = (shortParameter.ParamValue as number).toString();
							}
						}

						if (report.Parameters) {
							report.Parameters.push(shortParameter);
						}
					});
				}
			});
		}
	}

	private getBoqIdListString(): string {
		const boqService = this.wizardConfigService.getService(RfqBidderWizardContainers.RFQ_BIDDER_BOQ_SELECT);
		const includedBoqList = boqService.getList().filter(item => item.isIncluded);
		const includedBoqIdList = includedBoqList.map(boq => boq.BoqHeader.Id);
		return includedBoqIdList.join(',');
	}

	private setBusinessPartnerInReportParameter(bidderId: number, reportParameters?: ShortParameterType[] | null) {
		if (isArray(reportParameters)) {
			reportParameters.forEach((param) => {
				const lowerCaseParamName = toLower(param.Name);
				if (lowerCaseParamName === 'bidderid' || lowerCaseParamName === 'businesspartnerid') {
					param.ParamValue = bidderId;
				}
			});
		}
	}
}