/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import {
	BasicsSharedCustomizeLookupOverloadProvider,
	BasicsSharedLookupOverloadProvider
} from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IPpsPhaseRequirementEntity } from '../../../model/process-configuration/pps-phase-requirement-entity.interface';
import { DATESHIFT_MODES_TOKEN } from '../../../constants/DateShiftModes';

/**
 * PPS PhaseRequirement layout service
 */
@Injectable({
	providedIn: 'root',
})
export class PpsPhaseRequirementLayoutService {
	private dateShiftModes = inject(DATESHIFT_MODES_TOKEN);

	/**
	 * Generate layout config
	 */
	public generateLayout(): ILayoutConfiguration<IPpsPhaseRequirementEntity> {
		return {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['PpsPhaseReqStatusFk', 'PpsUpstreamGoodsTypeFk', 'RequirementGoods', 'Quantity', 'BasUomFk', 'CommentText', 'ActualQuantity', 'CorrectionQuantity']
				},
				{
					gid: 'result',
					attributes: ['PpsUpstreamTypeFk', 'RequirementResult', 'RequirementResultStatus']
				},
				{
					gid: 'userDefTextGroup',
					attributes: ['Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5']
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					baseGroup: { key: 'entityProperties', text: '*Basic Data' },
					PpsPhaseReqStatusFk: { key: 'entityStatus', text: '*Status' },
					Quantity: { key: 'entityQuantity', text: '*Quantity' },
					BasUomFk: { key: 'entityUoM', text: '*UoM' },
					CommentText: { key: 'entityComment', text: 'Comment' },
					Description: { key: 'entityDescription', text: '*Description' },
					userDefTextGroup: { key: 'UserdefTexts' },
					Userdefined1: { key: 'entityUserDefined', params: { 'p_0': '1' } },
					Userdefined2: { key: 'entityUserDefined', params: { 'p_0': '2' } },
					Userdefined3: { key: 'entityUserDefined', params: { 'p_0': '3' } },
					Userdefined4: { key: 'entityUserDefined', params: { 'p_0': '4' } },
					Userdefined5: { key: 'entityUserDefined', params: { 'p_0': '5' } }
				}),

				...prefixAllTranslationKeys('productionplanning.common.', {
					ActualQuantity: { key: 'actualQuantity', text: '*Actual Quantity' },

				}),
				...prefixAllTranslationKeys('productionplanning.processconfiguration.', {
					PpsUpstreamGoodsTypeFk: { key: 'phasereqtemplate.upstreamGoodsType', text: '*Requirement Goods Type' },
					RequirementGoods: { key: 'phasereqtemplate.upstreamGoods', text: '*Requirement Good' },
					CorrectionQuantity: { key: 'phasereq.correctionQuantity', text: '*Correction Quantity' },
					result: { key: 'result', text: '*Result' },
					PpsUpstreamTypeFk: { key: 'phasereqtemplate.resultType', text: '*Requirement Result Type' },
					RequirementResultStatus: { key: 'phasereqtemplate.resultstatus', text: '*Requirement Result Status' },
				}),
				...prefixAllTranslationKeys('productionplanning.formwork.', {
					PpsFormworkFk: { key: 'entityFormwork', text: '*Formwork' },
				}),
			},
			overloads: {
				PpsPhaseReqStatusFk: BasicsSharedCustomizeLookupOverloadProvider.providePpsPhaseRequirementStatusLookupOverload(false),
				PpsUpstreamGoodsTypeFk: BasicsSharedCustomizeLookupOverloadProvider.providePpsUpstreamGoodsTypeLookupOverload(false),
				PpsUpstreamTypeFk: BasicsSharedCustomizeLookupOverloadProvider.providePpsUpstreamTypeLookupOverload(false),
				BasUomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				Quantity: {
					// disallowNegative: true
				},
				ActualQuantity: {
					// disallowNegative: true
				},

				// todo(dynamic columns) 
				//RequirementGoods
				//RequirementResult
				// RequirementResultStatus
			}
		};
	}
}
