import { FieldType, ILayoutConfiguration, ILayoutGroup } from '@libs/ui/common';
import { PlatformLazyInjectorService } from '@libs/platform/common';
import { ESTIMATE_MAIN_LINE_ITEM_LAYOUT_TOKEN } from '@libs/estimate/shared';
import { inject, Injectable } from '@angular/core';
import { ICosEstLineItemEntity } from '../../model/entities/cos-est-lineitem-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainLineItemLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	public async generateLayout(): Promise<ILayoutConfiguration<ICosEstLineItemEntity>> {
		const resourceCommonLayoutService = await this.lazyInjector.inject(ESTIMATE_MAIN_LINE_ITEM_LAYOUT_TOKEN);
		const cosMainLineItemLayout = await resourceCommonLayoutService.generateLayout();
		cosMainLineItemLayout.groups = layoutGroups();
		///merge overloads
		const defaultOverloads = cosMainLineItemLayout.overloads;
		const cosOverloads = setAttributeReadonlyOverloads();
		cosMainLineItemLayout.overloads = { ...defaultOverloads, ...cosOverloads, ...customizeOverload() };
		return cosMainLineItemLayout as ILayoutConfiguration<ICosEstLineItemEntity>;

		function layoutGroups(): ILayoutGroup<ICosEstLineItemEntity>[] {
			return [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: [
						'CompareFlag',
						'Info',
						'Code',
						'EstAssemblyFk',
						'DescriptionInfo',
						'EstLineItemFk',
						'QuantityTargetDetail',
						'QuantityTarget',
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
						'EstCostRiskFk',
						'MdcControllingUnitFk',
						'BoqHeaderFk',
						'BoqItemFk',
						'PsdActivityFk',
						'MdcWorkCategoryFk',
						'MdcAssetMasterFk',
						'PrjLocationFk',
						'PrcStructureFk',
						'IsLumpsum',
						'IsDisabled',
						'BoqWicCatFk',
						'WicBoqItemFk',
						'WicBoqHeaderFk',
						'WqQuantityTarget',
						'LgmJobFk',
						'DayWorkRateUnit',
						'DayWorkRateTotal',
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

		/**
		 * make all attributes are readonly
		 */
		function setAttributeReadonlyOverloads() {
			const groups = layoutGroups();
			const attributesObject: { [key: string]: { readonly: boolean } } = {};
			groups.forEach((group) => {
				if (group.attributes && Array.isArray(group.attributes)) {
					group.attributes.forEach((attribute: string) => {
						attributesObject[attribute as keyof ICosEstLineItemEntity] = { readonly: true };
					});
				}
			});
			return attributesObject;
		}

		/**
		 * Customize overload for construction system main lineitem
		 */
		function customizeOverload() {
			return {
				Compareflag: {
					type: FieldType.Image,
					// formatterOptions: { ///todo image type is not finish in framework
					// 	imageSelector: 'constructionsystemMainCompareflagImageProcessor'
					// }
				},
			};
		}
	}
}
