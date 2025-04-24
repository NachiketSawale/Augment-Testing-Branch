
import { BehaviorSubject } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import {
	BasicsCharacteristicHeader,
	BasicsSharedCharacteristicCodeLookupService,
	BasicsSharedCostCodeLookupService,
	BasicsSharedLookupOverloadProvider, BasicsSharedMaterialLookupService, IMaterialSearchEntity
} from '@libs/basics/shared';
import { ICostCodeEntity } from '@libs/basics/interfaces';
import { ConcreteFieldOverload, createLookup, FieldType, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { PlatformTranslateService, prefixAllTranslationKeys } from '@libs/platform/common';

import { IResultEntity } from '../model/entities/result-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class PpsAccountingResultLayoutService {

	private translateService: PlatformTranslateService = inject(PlatformTranslateService);

	private readonly resultOverloadSubject = new BehaviorSubject<ConcreteFieldOverload<IResultEntity>>({
		type: FieldType.Description
	});

	private readonly propertyOverloadSubject = new BehaviorSubject<ConcreteFieldOverload<IResultEntity>>({
		type: FieldType.Description
	});

	private updateResultOverload(entity?: IResultEntity) {
		let value = {};
		if (entity && entity.ComponentTypeFk) {
			switch (entity?.ComponentTypeFk) {
				case 1: //Material
					value = {
						type: FieldType.Lookup,
						lookupOptions: createLookup<IResultEntity, IMaterialSearchEntity>({
							dataServiceToken: BasicsSharedMaterialLookupService,
							showClearButton: true
						})
					};
					break;
				case 2: //CostCode
					value = {
						type: FieldType.Lookup,
						lookupOptions: createLookup<IResultEntity, ICostCodeEntity>({
							dataServiceToken: BasicsSharedCostCodeLookupService,
							showClearButton: true
						})
					};
					break;
				default:
					value = {};
			}
		this.resultOverloadSubject.next(value);
		}
	}

	private updatePropertyOverload(entity?: IResultEntity){
		let value = {};
		if(entity && entity.PpsEntityFk){
			switch (entity.PpsEntityFk){
				case 1: //productTemplateCharacteristic
				case 2: //productTemplateCharacteristic2
					value = {
						type: FieldType.Lookup,
						lookupOptions:
							createLookup(
								{
									dataServiceToken: BasicsSharedCharacteristicCodeLookupService,
									showDescription: true,
									descriptionMember: 'DescriptionInfo.Description',
									serverSideFilter:
										{
											key: '',
											execute(context: ILookupContext<BasicsCharacteristicHeader, IResultEntity>) {
												return {
													sectionId: Number('6' + entity.PpsEntityFk),
												};
											}
										}
								},
							),
					};
					break;
				case 14: //productTemplate
					value = {
						type: FieldType.Select,
						itemsSource: {
							items: [
								{id: '', displayName: 'undefined'},
								{id: 1, displayName: this.translateService.instant('productionplanning.common.product.length').text},
								{id: 2, displayName: this.translateService.instant('productionplanning.common.product.width').text},
								{id: 3, displayName: this.translateService.instant('productionplanning.common.product.height').text},
								{id: 4, displayName: this.translateService.instant('productionplanning.common.product.weight').text},
								{id: 5, displayName: this.translateService.instant('productionplanning.common.product.area').text},
								{id: 6, displayName: this.translateService.instant('productionplanning.common.product.weight2').text},
								{id: 7, displayName: this.translateService.instant('productionplanning.common.product.area2').text},
								{id: 8, displayName: this.translateService.instant('productionplanning.common.product.weight3').text},
								{id: 9, displayName: this.translateService.instant('productionplanning.common.product.area3').text},
								{id: 10, displayName: this.translateService.instant('cloud.common.entityQuantity').text},
								{id: 11, displayName: this.translateService.instant('productionplanning.common.product.billQuantity').text}
							]
						}
					};
					break;
				default:
					value = {};
			}
			this.propertyOverloadSubject.next(value);
		}
	}

	public getResultLayout(): ILayoutConfiguration<IResultEntity> {
		return {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['Description', 'ComponentTypeFk', 'Result', 'MaterialGroupFk', 'Sorting', 'IsLive']
				},
				{
					gid: 'Formulas',
					attributes: ['QuantityFormula', 'UomFk', 'QuantityFormula2', 'Uom2Fk', 'QuantityFormula3', 'Uom3Fk']
				},
				{
					gid: 'updatePropertyGroup',
					attributes: ['UpdActive', 'PpsEntityFk', 'Property', 'OverrideUom']
				},
				{
					gid: 'upstreamItemGroup',
					attributes: ['UpstreamItemTarget', 'UpstreamItemTemplateFk']
				},
			],
			overloads: {
				UpstreamItemTarget: {}, UpstreamItemTemplateFk: {},
				PpsEntityFk: {
					type: FieldType.Select,
					itemsSource: {
						items: [
							{id: '', displayName: 'undefined'},
							{id: 1, displayName: this.translateService.instant('productionplanning.accounting.result.productTemplateCharacteristic').text},
							{id: 2, displayName: this.translateService.instant('productionplanning.accounting.result.productTemplateCharacteristic2').text},
							{id: 14, displayName: this.translateService.instant('productionplanning.accounting.result.productTemplate').text}
						]
					}
				},
				ComponentTypeFk: BasicsSharedLookupOverloadProvider.provideEngineeringDrawingComponentTypeLookupOverload(true),
				UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				Uom2Fk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				Uom3Fk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				Result: {
					type: FieldType.Dynamic,
					overload: ctx => {
						this.updateResultOverload(ctx.entity);
						return this.resultOverloadSubject;
					},
				},
				Property: {
					type: FieldType.Dynamic,
					overload: ctx => {
						this.updatePropertyOverload(ctx.entity);
						return this.propertyOverloadSubject;
					},
				}
			},
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Description: { key: 'entityDescription', text: '*Description' },
				}),
				...prefixAllTranslationKeys('basics.material.', {
					MaterialGroupFk: { key: 'record.materialGroup', text: '*Material Group' },
				}),
				...prefixAllTranslationKeys('productionplanning.accounting.', {
					Result: { key: 'result.result', text: '*Result' },
					ComponentTypeFk: { key: 'result.componentTypeFk', text: '*Component Type' },
					UomFk: { key: 'result.uom', text: '*Uom' },
					Uom2Fk: { key: 'result.uom2', text: '*Uom2' },
					Uom3Fk: { key: 'result.uom3', text: '*Uom3' },
					QuantityFormula: { key: 'result.quantityFormula', text: '*Quantity Formula' },
					QuantityFormula2: { key: 'result.quantityFormula2', text: '*Quantity Formula2' },
					QuantityFormula3: { key: 'result.quantityFormula3', text: '*Quantity Formula3' },
					UpdActive: { key: 'result.updActive', text: '*UPD Active' },
					PpsEntityFk: { key: 'result.ppsEntityFk', text: '*Pps Entity' },
					Property: { key: 'result.property', text: '*Property' },
					OverrideUom: { key: 'result.overrideUom', text: '*Override Uom' },
					Formulas: { key: 'result.formulas', text: '*Formulas' },
					updatePropertyGroup: { key: 'result.updatePropertyGroup', text: '*Update Property' },
					upstreamItemGroup: { key: 'result.upstreamItemGroup', text: '*Upstream Requirement' },
					UpstreamItemTarget: { key: 'result.upstreamItemTarget', text: '*Upstream Requirement Target' },
					UpstreamItemTemplateFk: { key: 'result.upstreamItemTemplateFk', text: '*Upstream Requirement Template' },
				}),
			}
		};
	}
}