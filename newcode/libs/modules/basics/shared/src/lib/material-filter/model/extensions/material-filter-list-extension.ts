/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityFilterSource, IEntityFilterDefinition, IEntityFilterListExtension, IEntityFilterListItem } from '../../../entity-filter';
import { MaterialFilterId, MaterialFilterPredefinedId } from '../enums';
import { IMaterialFilterCatalogTypeItem } from '../interfaces';

/**
 * Material filter list extension
 */
export class MaterialFilterListExtension implements IEntityFilterListExtension {
	/**
	 * Maps http data to an IEntityFilterListItem array.
	 *
	 * @param filterDef - The filter definition.
	 * @param data - The data to be mapped.
	 */
	public mapData(filterDef: IEntityFilterDefinition, data: unknown): IEntityFilterListItem[] {
		if (filterDef.Source === EntityFilterSource.Attribute) {
			return (data as string[]).map((item) => {
				return {
					Id: item,
					Description: item,
				};
			});
		}

		return data as IEntityFilterListItem[];
	}

	/**
	 * Sets a predefined item in the list.
	 *
	 * @param filterDef - The filter definition.
	 * @param predefinedItem - The predefined item to be set.
	 */
	public setPredefine(filterDef: IEntityFilterDefinition, predefinedItem: IEntityFilterListItem): void {
		if (!filterDef.List) {
			return;
		}

		if (filterDef.Id === MaterialFilterId.CatalogType) {
			filterDef.List.filter((e) => (e as IMaterialFilterCatalogTypeItem).IsFramework === (MaterialFilterPredefinedId.FrameworkContract === predefinedItem.Id)).forEach((e) => {
				e.IsSelected = predefinedItem.IsSelected;
			});
		}
	}

	/**
	 * Resets a predefined item in the list.
	 *
	 * @param filterDef - The filter definition.
	 * @param item - The item to be reset.
	 */
	public resetPredefine(filterDef: IEntityFilterDefinition, item: IEntityFilterListItem): void {
		if (!filterDef.PredefinedList) {
			return;
		}

		if (filterDef.Id === MaterialFilterId.CatalogType) {
			if (!item.IsSelected) {
				const predefineItem = filterDef.PredefinedList.find((e) => e.Id === ((item as IMaterialFilterCatalogTypeItem).IsFramework ? MaterialFilterPredefinedId.FrameworkContract : MaterialFilterPredefinedId.NonFrameworkContract));
				predefineItem!.IsSelected = false;
			}
		}
	}
}
