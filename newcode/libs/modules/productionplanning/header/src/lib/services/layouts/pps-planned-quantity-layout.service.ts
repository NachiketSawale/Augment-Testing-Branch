/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import {
	BasicsSharedLookupOverloadProvider,
	BasicsSharedMaterialLookupService,
	BasicsSharedCostCodeLookupService,
	IMaterialSearchEntity,
	createFormDialogLookupProvider,
} from '@libs/basics/shared';
import { ICostCodeEntity } from '@libs/basics/interfaces';

import { ProjectSharedLookupOverloadProvider } from '@libs/project/shared';
import { IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration, ConcreteFieldOverload, createLookup, FieldType } from '@libs/ui/common';
import { IPpsPlannedQuantityEntity } from '@libs/productionplanning/formulaconfiguration';

import { BehaviorSubject } from 'rxjs';
import { PpsPlannedQuantityTypes } from '../../model/constants/pps-planned-quantity-types';
import { PpsPlannedQuantityResourceTypes } from '../../model/constants/pps-planned-quantity-resource-types';

import { IPpsPlannedQuantityPropertyEntity } from '../../model/entities/pps-planned-quantity-property-entity.interface';
import { PpsPlannedQuantityPropertyLookupService } from '../pps-planned-quantity-property-lookup.service';

// import { PpsPlannedQuantityResourceQuantityTypeLookupHelperService } from '../pps-planned-quantity-res-qty-lookup-helper.service';
import { ISelectItem } from '@libs/ui/common';

import { PpsEstResourceDialogLookupComponent } from '../../components/pps-est-resource-dialog-lookup/pps-est-resource-dialog-lookup.component';

/**
 * PPS Planned Quantity layout service
 */
@Injectable({
	providedIn: 'root',
})
export class PpsPlannedQuantityLayoutService {
	/**
	 * Generate layout config
	 */
	public generateLayout(ctx: IInitializationContext): ILayoutConfiguration<IPpsPlannedQuantityEntity> {
		function getResourceType(){
			const resourceTypes: ISelectItem<number>[] = [];
			resourceTypes.push(
				{id: 1, displayName: 'BoQ Item'},
				{id: 2, displayName: 'Estimate Line Item'},
				{id: 3, displayName: 'Estimate Resource'},
			);
			return resourceTypes;
			// return ctx.injector.get(PpsPlannedQuantityResourceQuantityTypeLookupHelperService).resourceTypes; // The root data service must be asynchronously loaded before main entity access is required.Please double-check whether your EntityInfo instance is correctly cached, so already loaded reosurces are retained.
		}
		return {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['Description', 'Quantity', 'BasUomFk', 'ResourceTypeFk', 'BoQEstItemResFk', 'BoqHeaderFk', 'PpsPlannedQuantityTypeFk',
						'PropertyMaterialCostcodeFk', 'CommentText', 'MdcProductDescriptionFk', 'PrjLocationFk', 'DueDate',
						'SourceCode1', 'SourceCode2', 'SourceCode3', 'InternalPrice', 'ExternalPrice']
				},
				{
					gid: 'userDefTextGroup',
					attributes: ['Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5']
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Description: { key: 'entityDescription' },
					Quantity: { key: 'entityQuantity' },
					BasUomFk: { key: 'entityUoM' },
					userDefTextGroup: { key: 'UserdefTexts' },
					Userdefined1: { key: 'entityUserDefined', params: { 'p_0': '1' } },
					Userdefined2: { key: 'entityUserDefined', params: { 'p_0': '2' } },
					Userdefined3: { key: 'entityUserDefined', params: { 'p_0': '3' } },
					Userdefined4: { key: 'entityUserDefined', params: { 'p_0': '4' } },
					Userdefined5: { key: 'entityUserDefined', params: { 'p_0': '5' } }
				}),
				...prefixAllTranslationKeys('basics.common.', {
					DueDate: { key: 'entityDueDate' },
				}),
				...prefixAllTranslationKeys('productionplanning.common.', {
					PrjLocationFk: { key: 'prjLocationFk' },
				}),
				...prefixAllTranslationKeys('productionplanning.formulaconfiguration.', {
					CommentText: { key: 'CommentText' },
					ResourceTypeFk: { key: 'plannedQuantity.sourceType' },
					BoQEstItemResFk: { key: 'plannedQuantity.source' },
					BoqHeaderFk: { key: 'plannedQuantity.boqHeader' },
					PpsPlannedQuantityTypeFk: { key: 'plannedQuantity.PpsPlannedQuantityTypeFk' },
					PropertyMaterialCostcodeFk: { key: 'plannedQuantity.target' },
					MdcProductDescriptionFk: { key: 'plannedQuantity.mdcProductDescriptionFk' },
					SourceCode1: { key: 'plannedQuantity.sourceCode1' },
					SourceCode2: { key: 'plannedQuantity.sourceCode2' },
					SourceCode3: { key: 'plannedQuantity.sourceCode3' },
					InternalPrice: { key: 'plannedQuantity.internalPrice' },
					ExternalPrice: { key: 'plannedQuantity.externalPrice' },
				}),

			},
			overloads: {
				PropertyMaterialCostcodeFk: {
					type: FieldType.Dynamic,
					overload: ctx => {
						this.updatePropertyMaterialCostcodeFkOverload(ctx.entity);
						return this.propertyMaterialCostcodeFkOverloadSubject;
					}
				},
				BoQEstItemResFk: {
					type: FieldType.Dynamic,
					overload: ctx => {
						this.updateBoQEstItemResFkOverload(ctx.entity);
						return this.boQEstItemResFkOverloadSubject;
					}
				},
				BasUomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				BoqHeaderFk: {
					readonly: true
				},
				ResourceTypeFk: {
					type: FieldType.Select,
					itemsSource: {
						items: getResourceType()
					}
				},
				PpsPlannedQuantityTypeFk: BasicsSharedLookupOverloadProvider.providePpsPlannedQuantityTypeLookupOverload(true),
				MdcProductDescriptionFk: {}, // TODO
				PrjLocationFk: ProjectSharedLookupOverloadProvider.provideProjectLocationLookupOverload(true),
			}
		};
	}


	private readonly propertyMaterialCostcodeFkOverloadSubject = new BehaviorSubject<ConcreteFieldOverload<IPpsPlannedQuantityEntity>>({
		type: FieldType.Description,
	});

	private updatePropertyMaterialCostcodeFkOverload(entity?: IPpsPlannedQuantityEntity) {
		let value = {};
		if (entity && entity.PpsPlannedQuantityTypeFk) {
			switch (entity?.PpsPlannedQuantityTypeFk) {
				case PpsPlannedQuantityTypes.Material: // 2
					value = {
						type: FieldType.Lookup,
						lookupOptions: createLookup<IPpsPlannedQuantityEntity, IMaterialSearchEntity>({
							dataServiceToken: BasicsSharedMaterialLookupService,
							showClearButton: true
						})
					};
					break;
				case PpsPlannedQuantityTypes.CostCode: // 3
					value = {
						type: FieldType.Lookup,
						lookupOptions: createLookup<IPpsPlannedQuantityEntity, ICostCodeEntity>({
							dataServiceToken: BasicsSharedCostCodeLookupService,
							showClearButton: true
						})
					};
					break;

				case PpsPlannedQuantityTypes.Property: // 4
					value = {
						type: FieldType.Lookup,
						lookupOptions: createLookup<IPpsPlannedQuantityEntity, IPpsPlannedQuantityPropertyEntity>({
							dataServiceToken: PpsPlannedQuantityPropertyLookupService,
							showClearButton: true
						})
					};
					break;

				// todo in the future...
				// case PpsPlannedQuantityTypes.Characteristic: // 5
				// 	value = {
				// 		type: FieldType.Lookup,
				// 		lookupOptions:  // todo...
				// 	break;

				default:
					value = {};
			}
			this.propertyMaterialCostcodeFkOverloadSubject.next(value);
		}
	}


	private readonly boQEstItemResFkOverloadSubject = new BehaviorSubject<ConcreteFieldOverload<IPpsPlannedQuantityEntity>>({
		type: FieldType.Description,
	});

	private updateBoQEstItemResFkOverload(entity?: IPpsPlannedQuantityEntity) {
		let value = {};
		if (entity && entity.ResourceTypeFk) {
			switch (entity?.ResourceTypeFk) {
				// todo in the future...
				// case PpsPlannedQuantityResourceTypes.BoQItem: // 1
				// 	value = {
				// 		type: FieldType.Lookup,
				// 		lookupOptions:  // todo...
				// 	break;

				// todo...
				// case PpsPlannedQuantityResourceTypes.EstLineItem: // 2
				// 	value = {
				// 		type: FieldType.CustomComponent,
				// 		lookupOptions:  // todo...
				// 	break;

				case PpsPlannedQuantityResourceTypes.EstResource: // 3
					value = {
						type: FieldType.CustomComponent,
						componentType: PpsEstResourceDialogLookupComponent,
						providers: createFormDialogLookupProvider({
							displayMember: 'Code',
							objectKey: 'estresource4itemassignment',
							showSearchButton: true,
						}),
					};
					break;

				default:
					value = {};
			}
			this.boQEstItemResFkOverloadSubject.next(value);
		}
	}
}
