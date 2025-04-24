/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration, ConcreteFieldOverload, createLookup, FieldType } from '@libs/ui/common';
import { PhaseRequirementTemplateEntity } from '../../model/phase-requirement-template-entity.class';

import { prefixAllTranslationKeys } from '@libs/platform/common';
import {
	BasicsSharedLookupOverloadProvider,
	BasicsSharedCostCodeLookupService,
	BasicsSharedMaterialLookupService, IMaterialSearchEntity
} from '@libs/basics/shared';
import { ICostCodeEntity } from '@libs/basics/interfaces';

import { BehaviorSubject } from 'rxjs';

import {
	ProductionplanningSharedProcessTemplateLookupService,
	IPpsProcessTemplateSimpleLookupEntity,
} from '@libs/productionplanning/shared';



/**
 * PPS Phase Requirement Template layout service
 */
@Injectable({
	providedIn: 'root',
})
export class PpsPhaseRequirementTemplateLayoutService {
	/**
	 * Generate layout config
	 */
	public generateLayout(): ILayoutConfiguration<PhaseRequirementTemplateEntity> {
		return {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['UpstreamGoodsTypeFk', 'UpstreamGoods', 'Quantity', 'BasUomFk', 'CommentText']
				},
				{
					gid: 'userDefTextGroup',
					attributes: ['Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5']
				}
			],
			overloads: {
				BasUomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				UpstreamGoodsTypeFk: BasicsSharedLookupOverloadProvider.providePpsUpstreamGoodsTypeLookupOverload(true),
				UpstreamGoods: {
					type: FieldType.Dynamic,
					overload: ctx => {
						this.updateUpstreamGoodsOverload(ctx.entity);
						return this.upstreamGoodsOverloadSubject;
					}
				}
			},
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					baseGroup: { key: 'entityProperties', text: '*Basic Data' },
					Quantity: { key: 'entityQuantity', text: '*Quantity' },
					BasUomFk: { key: 'entityUoM', text: '*Uom' },
					CommentText: { key: 'entityCommentText', text: '*Comment' },
					userDefTextGroup: { key: 'UserdefTexts' },
					Userdefined1: { key: 'entityUserDefined', params: { 'p_0': '1' } },
					Userdefined2: { key: 'entityUserDefined', params: { 'p_0': '2' } },
					Userdefined3: { key: 'entityUserDefined', params: { 'p_0': '3' } },
					Userdefined4: { key: 'entityUserDefined', params: { 'p_0': '4' } },
					Userdefined5: { key: 'entityUserDefined', params: { 'p_0': '5' } }
				}),

				...prefixAllTranslationKeys('productionplanning.processconfiguration.', {
					UpstreamGoodsTypeFk: { key: 'phasereqtemplate.upstreamGoodsType' },
					UpstreamGoods: { key: 'phasereqtemplate.upstreamGoods' },
				}),

			},
		};
	}

	private readonly upstreamGoodsOverloadSubject = new BehaviorSubject<ConcreteFieldOverload<PhaseRequirementTemplateEntity>>({
		type: FieldType.Description,
	});

	private updateUpstreamGoodsOverload(entity?: PhaseRequirementTemplateEntity) {
		let value = {};
		if (entity && entity.UpstreamGoodsTypeFk) {
			switch (entity?.UpstreamGoodsTypeFk) {
				case 1: //Material
					value = {
						type: FieldType.Lookup,
						lookupOptions: createLookup<PhaseRequirementTemplateEntity, IMaterialSearchEntity>({
							dataServiceToken: BasicsSharedMaterialLookupService,
							showClearButton: true
						})
					};
					break;
				case 2: // Resource
					value = {
						type: FieldType.Lookup,
						lookupOptions: createLookup<PhaseRequirementTemplateEntity, ICostCodeEntity>({
							dataServiceToken: BasicsSharedCostCodeLookupService,
							showClearButton: true
						})
					};
					break;

				case 3: // EtmPlant
					value = {
						type: FieldType.Lookup,
						lookupOptions: createLookup<PhaseRequirementTemplateEntity, ICostCodeEntity>({
							dataServiceToken: BasicsSharedCostCodeLookupService,
							showClearButton: true
						})
					};
					break;
				/* TODO: required product lookup
								case 4: // Product
									break;
				*/
				/* TODO: required formwork type lookup
								case 6: // FormworkType
								break;
				*/
				case 7: // ProcessTemplate
					value = {
						type: FieldType.Lookup,
						lookupOptions: createLookup<PhaseRequirementTemplateEntity, IPpsProcessTemplateSimpleLookupEntity>({
							dataServiceToken: ProductionplanningSharedProcessTemplateLookupService,
							showClearButton: true
						})
					};
					break;
				case 8: // CostCode
					value = {
						type: FieldType.Lookup,
						lookupOptions: createLookup<PhaseRequirementTemplateEntity, ICostCodeEntity>({
							dataServiceToken: BasicsSharedCostCodeLookupService,
							showClearButton: true
						})
					};
					break;
				case 9: // MdcCostCode
					value = {
						type: FieldType.Lookup,
						lookupOptions: createLookup<PhaseRequirementTemplateEntity, ICostCodeEntity>({
							dataServiceToken: BasicsSharedCostCodeLookupService,
							showClearButton: true
						})
					};
					break;
				default:
					value = {};
			}
			this.upstreamGoodsOverloadSubject.next(value);
		}
	}
}
