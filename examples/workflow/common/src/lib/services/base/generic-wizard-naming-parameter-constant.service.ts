/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { GenericWizardNamingParameterTypeEnum } from '../../models/enum/generic-wizard-naming-parameter-type.enum';
import { GenericWizardConfigService } from './generic-wizard-config.service';
import { GenericWizardUseCaseUuid } from '../../models/enum/generic-wizard-use-case-uuid.enum';
import { find, isArray, isEmpty, isNil } from 'lodash';
import { PrcInfoForGenericWizard } from '../../models/types/prc-info-for-generic-wizard.type';
import { GenericWizardNamingParameterConstant } from '../../models/constants/generic-wizard-naming-parameter.constant';
import { GenericWizardNamingParameterInfo } from '../../models/types/generic-wizard-naming-parameter-info.type';
import { RfqBidderWizardConfig } from '../../configuration/rfq-bidder/types/rfq-bidder-wizard-config.type';


/**
 * Used to prepare naming information from the loaded wizard configuration.
 */
@Injectable({
	providedIn: 'root'
})
export class GenericWizardNamingParameterConstantService {
	private info = <GenericWizardNamingParameterInfo>{
		namingParameterInfo: {},
		allowedNamingParameterTypes: [GenericWizardNamingParameterTypeEnum.exportFile, GenericWizardNamingParameterTypeEnum.exportReport, GenericWizardNamingParameterTypeEnum.mailSubject]
	};

	private readonly wizardConfigService = inject(GenericWizardConfigService);

	/**
	 * Sets the required information details used to prepare naming objects in the generic wizard.
	 */
	public setInfoObject() {
		const wizardInstanceUuid = this.wizardConfigService.getWizardInstanceUuid();
		if(wizardInstanceUuid === GenericWizardUseCaseUuid.RfqBidder || wizardInstanceUuid === GenericWizardUseCaseUuid.ContractConfirm) {
			const wizardConfig = this.wizardConfigService.getWizardConfig() as RfqBidderWizardConfig;
			const prcInfo = wizardConfig.prcInfo;
	
			if(!prcInfo){
				throw new Error('config providers are not yet loaded!');
			}
	
			const projectDescription = wizardConfig.project.ProjectName;
			const projectCode = wizardConfig.project.ProjectNo;
	
			const packages = prcInfo.Package;
			const packageDescriptions = packages.map(function (item) {
				return {
					key: item.Id,
					value: item.Description ?? ''
				};
			});
			const packageCodes = packages.map(function (item) {
				return {
					key: item.Id,
					value: item.Code ?? ''
				};
			});
	
			this.info.namingParameterInfo.projectDescription = projectDescription;
			this.info.namingParameterInfo.projectCode = projectCode;
			this.info.namingParameterInfo.packageDescription = packageDescriptions;
			this.info.namingParameterInfo.packageCode = packageCodes;
	
			switch (wizardInstanceUuid) {
				case GenericWizardUseCaseUuid.RfqBidder: this.prepareNamingParameterInfoForRfq(prcInfo);
					break;
				case GenericWizardUseCaseUuid.ContractConfirm: this.prepareNamingParameterInfoForContract(prcInfo);
					break;
			}
		}
	}

	/**
	 * Formats the input string based on the current available info object.
	 * @param inputString The input string to be formatted.
	 * @param object Object used in addition to the info object.
	 * @returns A formatted string.
	 */
	public resolveName(inputString: string | null, object?: object): string {
		if(isEmpty(this.info) || inputString === null) {
			return '';
		}

		let formatted: string = '';
		const allowedNamingParameterKeys = Object.keys(this.info.namingParameterInfo);
		const allowedNamingParameters = GenericWizardNamingParameterConstant.filter(item => allowedNamingParameterKeys.includes(item.name));

		allowedNamingParameters.forEach((parameter)=>{
			//Setting default value for formatted.
			formatted = formatted || inputString;
			let code = '';

			if(!isNil(parameter)) {
				code = this.info.namingParameterInfo[parameter.name as keyof object];
			}

			if(isArray(code)){
				const id = object ? object[parameter.name.split(/(?=[A-Z])/)[0] + 'Id' as keyof object] : null;
				if(id) {
					const foundCode = find(code, {key: id});
					code = foundCode ? foundCode.value : '';
				} else {
					code = code[0] ? code[0].value : '';
				}
			}

			if(isNil(code)) {
				code = '';
			}

			// if(!isString(code)) {
			// 	code = code.toString();
			// }

			const pattern = new RegExp(parameter.pattern, 'gi');
			const matches = formatted.match(pattern);

			if(matches && matches.length > 0) {
				matches.forEach((match)=>{
					const codeSubString = code.substring(0, Math.min(code.length, match.length -2));
					formatted = formatted.replace(new RegExp(parameter.pattern, 'i'), codeSubString);
				});
			}

		});

		return formatted.slice(0, 252);
	}

	private prepareNamingParameterInfoForRfq(prcInfo: PrcInfoForGenericWizard) {

		//Preparing requisition specific items
		const requisitonDescriptions = prcInfo.Requisition.map(function(req){
			return {
				key: req.Id,
				value: req.Description ?? ''
			};
		});
		const requisitionCodes = prcInfo.Requisition.map(function(req){
			return {
				key: req.Id,
				value: req.Code ?? ''
			};
		});

		const rfqDescription = prcInfo.Rfq[0].Description;
		const rfqCode = prcInfo.Rfq[0].Code;

		// Assigning requisition specific items to naming parameter info.
		this.info.namingParameterInfo.requisitionDescription = requisitonDescriptions;
		this.info.namingParameterInfo.requisitionCode = requisitionCodes;
		this.info.namingParameterInfo.rfqDescription = rfqDescription;
		this.info.namingParameterInfo.rfqCode = rfqCode;
	}

	private prepareNamingParameterInfoForContract(prcInfo: PrcInfoForGenericWizard) {
		// Preparing contract specific items
		const quoteCodes = prcInfo.Quote.map(function(quote){
			return {
				key: quote.Id,
				value: quote.Code
			};
		});
		const quoteExternalCodes = prcInfo.Quote.map(function(quote){
			return {
				key: quote.Id,
				value: quote.ExternalCode ?? ''
			};
		});

		// Assigning contract specific itms to naming parameter info.
		this.info.namingParameterInfo.contractDescription = prcInfo.Contract[0].Description ?? '';
		this.info.namingParameterInfo.contractCode = prcInfo.Contract[0].Code;
		this.info.namingParameterInfo.quoteCode = quoteCodes;
		this.info.namingParameterInfo.quoteExternalCode = quoteExternalCodes;
	}
}