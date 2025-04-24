/*
 * Copyright(c) RIB Software GmbH
 */

import { get, mergeWith } from 'lodash';
import { Observable } from 'rxjs';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IUserFormDataEntity } from './entities/user-form-data-entity.interface';
import { CompleteIdentification, IEntityIdentification, PlatformConfigurationService, ServiceLocator } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { IUserFormDataComplete } from './entities/user-form-data-complete.interface';
import { IUserFormDataServiceInitializeOptions } from './interfaces/user-form-data-entity-info-options.interface';
import { BasicsSharedUserFormDataStatusLookupService } from '../services/lookup-services/user-form-data-status-lookup.service';

/**
 * User form data service.
 */
export class BasicsSharedUserFormDataService<PT extends object, PU extends CompleteIdentification<PT>> extends DataServiceFlatLeaf<IUserFormDataEntity, PT, PU> {

	private toDelete: IUserFormDataEntity [] = [];
	private toSave: IUserFormDataEntity[] = [];

	private get selectedItem(): IUserFormDataEntity | undefined {
		return this.hasSelection() ? this.getSelection()[0] : undefined;
	}

	private get parentSelectedItem(): IEntityIdentification | undefined {
		return this.svrOptions.parentService.getSelection() ? this.svrOptions.parentService.getSelection()[0] as IEntityIdentification : undefined;
	}

	/**
	 *
	 * @param svrOptions
	 */
	public constructor(private svrOptions: IUserFormDataServiceInitializeOptions<PT>) {
		super({
			apiUrl: 'basics/userform/data',
			readInfo: {
				endPoint: 'rubricdatalist',
				usePost: false,
				prepareParam: (identity) => {
					return {
						rubricId: svrOptions.rubric,
						contextFk: identity.pKey1 as number
					};
				}
			},
			createInfo: {
				endPoint: 'createFormData',
				usePost: true,
				prepareParam: (identity) => {
					return {
						rubricFk: svrOptions.rubric,
						contextFk: identity.pKey1 as number
					};
				}
			},
			roleInfo: {
				role: ServiceRole.Leaf,
				itemName: 'UserFormData',
				parent: svrOptions.parentService
			} as IDataServiceChildRoleOptions<IUserFormDataEntity, PT, PU>,
			entityActions: {
				createSupported: true,
				deleteSupported: true
			}
		});
	}

	private doUpdate(): Observable<IUserFormDataComplete> {
		if (!this.parentSelectedItem) {
			throw new Error('Can not found the selected parent item.');
		}

		const update: IUserFormDataComplete = {
			EntitiesCount: 1,
			FormDataToSave: this.toSave,
			FormDataToDelete: this.toDelete,
			MainItemId: this.parentSelectedItem.Id
		};

		const http = ServiceLocator.injector.get(HttpClient);
		const configService = ServiceLocator.injector.get(PlatformConfigurationService);
		return http.post<IUserFormDataComplete>(configService.webApiBaseUrl + 'basics/userform/data/update', update);
	}

	private doMerge(updated: IUserFormDataEntity[]) {
		const update = this.getList();
		if (update && updated && update.length && updated.length) {
			updated.forEach(item => {
				const tobeMerged = update.find(target => target.Id === item.Id);
				if (tobeMerged) {
					mergeWith(tobeMerged, item);
				}
			});
		}
	}

	private isParentReadonly() {
		return !!(this.svrOptions.isParentReadonly && this.svrOptions.isParentReadonly(this.svrOptions.parentService));
	}

	public isParentAndSelectedReadonly() {
		const readonly = this.isParentReadonly();

		if (!readonly) {
			if (this.selectedItem) {
				if (this.selectedItem.IsReadonly) {
					return true;
				}
				const statusService = ServiceLocator.injector.get(BasicsSharedUserFormDataStatusLookupService);
				const statusList = statusService.syncService?.getListSync();
				if (statusList && statusList.length) {
					const status = statusList.find(s => s.Id === this.selectedItem?.FormDataStatusFk);
					if (status && status.IsReadOnly) {
						return true;
					}
				}
			}
		}

		return readonly;
	}

	public override canCreate(): boolean {
		return super.canCreate() && !this.isParentReadonly();
	}

	public override canDelete(): boolean {
		return super.canDelete() && !this.isParentAndSelectedReadonly();
	}

	/**
	 *
	 * @param parentUpdate
	 * @param parent
	 */
	public override collectModificationsForParentUpdate(parentUpdate: PU, parent: PT) {
		super.collectModificationsForParentUpdate(parentUpdate, parent);

		const toDelete = get(parentUpdate, 'UserFormDataToDelete') as IUserFormDataEntity[];
		const toSave = get(parentUpdate, 'UserFormDataToSave') as IUserFormDataEntity[];

		if (toDelete && toDelete.length) {
			this.toDelete = [...toDelete];
		}

		if (toSave && toSave.length) {
			this.toSave = [...toSave];
		}
	}

	/**
	 *
	 * @param updated
	 */
	public override takeOverUpdated(updated: PU) {
		this.doUpdate().subscribe({
			next: updated => {
				if (this.toSave && this.toSave.length) {
					this.doMerge(updated.FormDataToSave);
					this.updateEntities(this.toSave);
					this.entitiesUpdated(this.toSave);
				}
				this.toSave = this.toDelete = [];
			}
		});
	}

	public override isParentFn(parentKey: IUserFormDataEntity, entity: IUserFormDataEntity) {
		return entity.FormDataIntersection.ContextFk === parentKey.Id;
	}
}