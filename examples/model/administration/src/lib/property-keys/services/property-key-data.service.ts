/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { IPropertyKeyEntity } from '../model/entities/entities';
import { IModelAdministrationCompleteEntity, IModelAdministrationRootEntity, ModelAdministrationRootDataService } from '../../root-info.model';
import { ModelAdministrationPropertyKeyTagCategoryDataService } from './property-key-tag-category-data.service';
import { ModelAdministrationPropertyKeyTagDataService } from './property-key-tag-data.service';

/**
 * The data service for the property key (attribute) entity.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationPropertyKeyDataService
	extends DataServiceFlatLeaf<IPropertyKeyEntity, IModelAdministrationRootEntity, IModelAdministrationCompleteEntity> {

	private readonly httpSvc = inject(PlatformHttpService);

	private readonly msgBoxSvc = inject(UiCommonMessageBoxService);

	private readonly tlsSvc = inject(PlatformTranslateService);

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		const propKeyTagCatSvc = inject(ModelAdministrationPropertyKeyTagCategoryDataService);
		const propKeyTagSvc = inject(ModelAdministrationPropertyKeyTagDataService);

		super({
			apiUrl: 'model/administration/propertykey',
			entityActions: {
				createSupported: true,
				deleteSupported: true
			},
			readInfo: {
				endPoint: 'list',
				prepareParam: () => {
					const prms: {
						[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
					} = {};

					const selTagCat = propKeyTagCatSvc.getSelectedEntity();
					const selTags = propKeyTagSvc.getSelection();

					if (selTagCat) {
						if (selTagCat.Id <= 0) {
							prms['includeUntagged'] = true;
						} else {
							if (selTags.length > 0) {
								prms['tagIds'] = selTags.map(t => t.Id).join(':');
							} else {
								prms['categoryId'] = selTagCat.Id;
							}
						}
					} else {
						prms['categoryId'] = 0;
					}

					return prms;
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IPropertyKeyEntity, IModelAdministrationRootEntity, IModelAdministrationCompleteEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'PropertyKeys',
				parent: inject(ModelAdministrationRootDataService)
			}
		});

		this.reloadDelayed.pipe(debounceTime(300)).subscribe(() => {
			this.load({id: 0});
		});

		propKeyTagCatSvc.selectionChanged$.subscribe(() => this.reloadDelayed.next(null));
		propKeyTagSvc.selectionChanged$.subscribe(() => this.reloadDelayed.next(null));
	}

	private readonly reloadDelayed = new Subject();

	/**
	 * Removes property keys based on their IDs and asks the user for confirmation.
	 * @param pkIds The property key IDs to remove.
	 */
	public async removePropertyKeys(pkIds: number[]) {
		const deletability = await this.httpSvc.get<{
			CanDelete: boolean,
			Message: string,
			ConfirmDeleteAssignedPropertyValues: boolean,
			ConfirmDeleteDataTreeLevels: boolean
		}>('model/administration/propertykey/checkdeletability', {
			params: {
				pkIds: pkIds.join(':')
			}
		});

		if (deletability.CanDelete) {
			const msgText = deletability.Message + ' ' + this.tlsSvc.instant('model.administration.propertyKeys.confirmDeletion');
			const dlgResult = await this.msgBoxSvc.showYesNoDialog(msgText, 'model.administration.propertyKeys.deletionTitle');

			if (dlgResult && ((await dlgResult).closingButtonId === StandardDialogButtonId.Yes)) {
				try {
					await this.httpSvc.post('model/administration/propertykey/deletepk', {
						PropertyKeyIds: pkIds,
						// TODO: check whether it makes sense to send the following two values along
						DeleteFromModels: deletability.ConfirmDeleteAssignedPropertyValues,
						DeleteFromDataTrees: deletability.ConfirmDeleteDataTreeLevels
					});

					// TODO: remove already loaded items from data service
				} catch (error) {
					console.error(error);
					if (typeof error === 'string' || typeof error === 'object') {
						await this.msgBoxSvc.showErrorDialog(error ?? '');
					}
				}
			}
		}
	}
}
