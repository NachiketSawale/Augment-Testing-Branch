/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { BasicsSharedAssetMasterLookupService, BasicsSharedUomLookupService } from '@libs/basics/shared';
import { EstimateLineItemBaseLayoutService } from '@libs/estimate/shared';
import { createLookup, FieldType, ILayoutConfiguration, ILayoutGroup } from '@libs/ui/common';
import { BasicsSharedMdcWorkCategoryLookupService } from '@libs/basics/shared';
import { ConstructionSystemSharedBoqRootLookupService, ConstructionSystemSharedActivityScheduleLookupService } from '@libs/constructionsystem/shared';
import { ProjectLocationLookupService } from '@libs/project/shared';

interface ICosEstLineItemEntity extends IEstLineItemEntity {
	BoqRootRef?: number | null;
	PsdActivitySchedule?: number | null;
}

/**
 * construction system master line item layouts service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterLineItemLayoutService extends EstimateLineItemBaseLayoutService<ICosEstLineItemEntity> {
	protected override async commonLayout() {
		const layout = (await super.commonLayout()) as ILayoutConfiguration<ICosEstLineItemEntity>;
		layout.groups = this.getLayoutGroup();

		// todo-allen: The following fields are missing in the en.json file of estimate.main module,
		//  and they are also missing on the AngularJS side.
		//  Not sure if these fields need to be added to the en.json file.
		//
		//  estimate.main.quantityFactorDetail1
		//  estimate.main.quantityFactorDetail2
		//  estimate.main.quantityFactor3
		//  estimate.main.productivityFactorDetail
		//  estimate.main.productivityFactor
		//  estimate.main.quantityUnitTarget

		if (layout.overloads) {
			const additionalFields = [
				{
					displayMember: 'DescriptionInfo.Translated',
					label: 'cloud.common.entityDescription',
					column: true,
					singleRow: true,
				},
			];

			layout.overloads.QuantityTotal = { readonly: true };

			layout.overloads.BasUomTargetFk = {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedUomLookupService,
				}),
				additionalFields: additionalFields,
			};

			layout.overloads.MdcWorkCategoryFk = {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedMdcWorkCategoryLookupService,
				}),
				additionalFields: additionalFields,
			};

			layout.overloads.BasUomFk = {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedUomLookupService,
				}),
				additionalFields: additionalFields,
			};

			layout.overloads.MdcAssetMasterFk = {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedAssetMasterLookupService,
				}),
				additionalFields: additionalFields,
			};

			layout.overloads.PrjLocationFk = {
				type: FieldType.Lookup,
				readonly: false,
				lookupOptions: createLookup({
					dataServiceToken: ProjectLocationLookupService,
					showClearButton: true,
				}),
				additionalFields: additionalFields,
			};
		}

		layout.transientFields = [
			{
				id: 'Info',
				model: 'Info',
				readonly: true,
				label: { key: 'estimate.main.info', text: 'Info' },
				type: FieldType.Image,
				formatterOptions: {
					imageSelector: 'estimateMainLineItemImageProcessor',
				},
			},
			{
				id: 'BoqRootRef',
				model: 'BoqRootRef',
				label: { key: 'estimate.main.boqRootRef', text: 'BoQ Root Item Ref. No' },
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ConstructionSystemSharedBoqRootLookupService,
				}),
			},
			{
				id: 'PsdActivitySchedule',
				model: 'PsdActivitySchedule',
				label: { key: 'estimate.main.activitySchedule', text: 'Activity Schedule' },
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ConstructionSystemSharedActivityScheduleLookupService,
				}),
			},
		];
		return layout;
	}

	private getLayoutGroup(): ILayoutGroup<ICosEstLineItemEntity>[] {
		return [
			{
				gid: 'basicData',
				title: {
					key: 'cloud.common.entityProperties',
					text: 'Basic Data',
				},
				attributes: [
					'EstLineItemFk',
					'EstAssemblyFk',
					'Code',
					'DescriptionInfo',
					'QuantityTarget',
					'QuantityTargetDetail',
					'BasUomTargetFk',
					'QuantityDetail',
					'Quantity',
					'BasUomFk',
					'QuantityFactorDetail1',
					'QuantityFactor1',
					'QuantityFactorDetail2',
					'QuantityFactor2',
					'QuantityFactor3',
					'QuantityFactor4',
					'ProductivityFactorDetail',
					'ProductivityFactor',
					'QuantityUnitTarget',
					'QuantityTotal',
					'CostUnit',
					'CostFactorDetail1',
					'CostFactor1',
					'CostFactorDetail2',
					'CostFactor2',
					'CostUnitTarget',
					'CostTotal',
					'HoursUnit',
					'HoursUnitTarget',
					'HoursTotal',
					'MdcControllingUnitFk',
					'EstCostRiskFk',
					'BoqItemFk',
					'PsdActivityFk',
					'MdcWorkCategoryFk',
					'MdcAssetMasterFk',
					'PrjLocationFk',
					'IsLumpsum',
					'IsDisabled',
					'PrcStructureFk',
					'DayWorkRateTotal',
					'DayWorkRateUnit',
					'Info',
					'BoqRootRef',
					'PsdActivitySchedule',
				],
			},
			{
				gid: 'sortCodes',
				title: {
					key: 'estimate.main.sortCodes',
					text: 'Sort Codes',
				},
				attributes: [
					'SortDesc01Fk',
					'SortDesc02Fk',
					'SortDesc03Fk',
					'SortDesc04Fk',
					'SortDesc05Fk',
					'SortDesc06Fk',
					'SortDesc07Fk',
					'SortDesc08Fk',
					'SortDesc09Fk',
					'SortDesc10Fk',
					'SortCode01Fk',
					'SortCode02Fk',
					'SortCode03Fk',
					'SortCode04Fk',
					'SortCode05Fk',
					'SortCode06Fk',
					'SortCode07Fk',
					'SortCode08Fk',
					'SortCode09Fk',
					'SortCode10Fk',
				],
			},
			{
				gid: 'userDefText',
				title: {
					key: 'cloud.common.UserdefTexts',
					text: 'User-Defined Texts',
				},
				attributes: ['UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5', 'CommentText', 'Hint', 'CosMatchText'],
			},
		];
	}
}
