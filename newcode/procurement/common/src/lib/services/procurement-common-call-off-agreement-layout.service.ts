/*
 * Copyright(c) RIB Software GmbH
 */

import { ILayoutConfiguration } from '@libs/ui/common';
import { Injectable, ProviderToken } from '@angular/core';
import { CompleteIdentification, IEntityIdentification, prefixAllTranslationKeys } from '@libs/platform/common';
import { IPrcCallOffAgreementEntity } from '../model/entities/prc-call-off-agreement-entity.interface';
import { ProcurementCommonCallOffAgreementDataService } from './procurement-common-call-off-agreement-data.service';


/**
 * Common procurement account assignment layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonCallOffAgreementLayoutService {
	public async generateLayout<T extends IPrcCallOffAgreementEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
		dataServiceToken: ProviderToken<ProcurementCommonCallOffAgreementDataService<T, PT, PU>>;
	}): Promise<ILayoutConfiguration<T>> {
		return {
			groups: [
				{
					gid: 'baseGroup',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: [
						'CallOffAgreement',
						'ContractPenalty',
						'ExecutionDuration',
						'EarliestStart',
						'LatestStart',
						'LeadTime'
					],
				},
			],
			labels: {
				...prefixAllTranslationKeys('procurement.common.', {
					CallOffAgreement: {key: 'entityCallOffAgreement'},
					ContractPenalty: {key: 'entityContractPenalty'},
					ExecutionDuration: {key: 'entityExecutionDuration'},
					EarliestStart: {key: 'entityEarliestStart'},
					LatestStart: {key: 'entityLatestStart'},
					LeadTime: {key: 'entityLeadTime'},
				}),
			}
		};
	}
}
