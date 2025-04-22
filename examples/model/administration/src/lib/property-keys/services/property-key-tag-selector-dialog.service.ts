/*
 * Copyright(c) RIB Software GmbH
 */

import {
	inject,
	Injectable
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { PlatformConfigurationService } from '@libs/platform/common';
import {
	ColumnDef,
	FieldType,
	IListSelectionDialogOptions,
	StandardDialogButtonId,
	UiCommonListSelectionDialogService
} from '@libs/ui/common';
import { ITagSelectorDialogSettings } from '../model/tag-selector-dialog-settings.interface';
import { ICategorizedTagNodeEntity } from '../model/entities/categorized-tag-node-entity.interface';

/**
 * This service provides the selector dialog for property key tags.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationPropertyKeyTagSelectorDialogService {

	private readonly listSelDlgSvc = inject(UiCommonListSelectionDialogService);

	private readonly httpClient = inject(HttpClient);

	private readonly configSvc = inject(PlatformConfigurationService);

	public async showDialog(config: ITagSelectorDialogSettings): Promise<number[] | false> {
		const actualConfig: ITagSelectorDialogSettings = {
			selectedTags: [],
			acceptEmptySelection: true,
			...config
		};

		const allItems = await this.retrieveAvailableItems();

		const nodeColumnsDef: ColumnDef<ICategorizedTagNodeEntity>[] = [{
			id: 'description',
			type: FieldType.Description,
			label: {key: 'cloud.common.entityDescription'},
			model: 'Description',
			sortable: true,
			width: 200
		}];

		const dlgConfig: IListSelectionDialogOptions<ICategorizedTagNodeEntity> = {
			headerText: {key: 'model.administration.propertyKeys.selectTags'},
			allItems: allItems,
			value: actualConfig.selectedTags ? this.findItems(allItems, actualConfig.selectedTags) : undefined,
			buttons: [{
				id: StandardDialogButtonId.Ok,
				isDisabled: info => actualConfig.acceptEmptySelection || ((info.dialog.value?.length ?? 0) > 0)
			}, {
				id: StandardDialogButtonId.Cancel
			}],
			isSelectable: (item, dialog) => item.IsTag,
			idProperty: 'Id',
			availableGridConfig: {
				columns: nodeColumnsDef,
				treeConfiguration: {
					parent: item => item.parent ?? null,
					children: item => item.children ?? []
				}
			},
			selectedGridConfig: {
				columns: nodeColumnsDef
			},
			//parentProp: 'ParentId' // TODO: remove this once DEV-15555 has been completed
		};

		const dlgResult = await this.listSelDlgSvc.show(dlgConfig);

		if (dlgResult?.closingButtonId === StandardDialogButtonId.Ok) {
			return (dlgResult.value ?? []).map(selItem => typeof selItem.Id === 'number' ? selItem.Id : parseInt(selItem.Id));
		} else {
			return false;
		}
	}

	private findItems(rootItems: ICategorizedTagNodeEntity[], ids: number[]): ICategorizedTagNodeEntity[] {
		const result: ICategorizedTagNodeEntity[] = [];

		const searchedIds = new Map<number, boolean>();
		for (const id of ids) {
			searchedIds.set(id, true);
		}

		const nextItems = [...rootItems];
		while (nextItems.length > 0) {
			const item = nextItems.pop();
			if (item) {
				if (typeof item.Id === 'number' && searchedIds.get(item.Id)) {
					result.push(item);
				}
				if (item.children) {
					nextItems.push(...item.children);
				}
			}
		}

		return result;
	}

	private async retrieveAvailableItems(): Promise<ICategorizedTagNodeEntity[]> {
		const items = await lastValueFrom(this.httpClient.get<ICategorizedTagNodeEntity[]>(`${this.configSvc.webApiBaseUrl}model/administration/propkeytag/tree`));

		const rootItems: ICategorizedTagNodeEntity[] = [];
		const itemById = new Map<number | string, ICategorizedTagNodeEntity>();

		for (const item of items) {
			if (item.IsTag) {
				item.image = 'control-icons ico-ctrl-label';
			} else {
				item.Id = `c${item.Id}`;
				item.children = [];
			}
			if (item.ParentId) {
				item.ParentId = `c${item.ParentId}`;
			}

			itemById.set(item.Id, item);
		}

		for (const item of items) {
			if (item.ParentId) {
				const parent = itemById.get(item.ParentId);
				if (parent?.children) {
					parent.children.push(item);
					continue;
				}
			}
			rootItems.push(item);
		}

		return rootItems;
	}
}
