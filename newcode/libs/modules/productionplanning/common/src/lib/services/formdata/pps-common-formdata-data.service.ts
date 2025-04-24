import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { IUserFormDataComplete, IUserFormDataEntity } from '@libs/basics/shared';
import {
	CompleteIdentification,
	IEntityIdentification,
	PlatformConfigurationService,
	ServiceLocator
} from '@libs/platform/common';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IDataServiceOptions, IEntitySelection, ServiceRole
} from '@libs/platform/data-access';
import { get, isNil, mergeWith } from 'lodash';
import { Observable } from 'rxjs';
import { BelongingType, IPpsUserFormDataEntity } from '../../model/entities/pps-formdata-entity.interface';
import { IPpsFormdataDataSrvInitOptions } from '../../model/pps-common-formdata-data-srv-init-options.interface';

export class PpsCommonFormdataDataService<PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>
	extends DataServiceFlatLeaf<IPpsUserFormDataEntity, PT, PU> {

	private toDelete: IUserFormDataEntity[] = [];
	private toSave: IUserFormDataEntity[] = [];

	private get parentSelectedItem(): IEntityIdentification | undefined {
		return this.parentService.getSelection() ? this.parentService.getSelection()[0] as IEntityIdentification : undefined;
	}

	private getContextFk() {
		const selectedParent = this.getSelectedParent();
		return isNil(this.svrOptions.contextFk) ? get(selectedParent, 'Id') : get(selectedParent, this.svrOptions.contextFk);
	}
	private getCreateOrReadParam() {
		return {
			rubricId: this.svrOptions.rubric,
			contextFk: this.getContextFk()
		};
	}

	protected readonly http = inject(HttpClient);
	protected readonly configService = inject(PlatformConfigurationService);

	public constructor(private parentService: IEntitySelection<PT>, private svrOptions: IPpsFormdataDataSrvInitOptions<PT>) {
		const options: IDataServiceOptions<IPpsUserFormDataEntity> = {
			apiUrl: svrOptions.apiUrl ?? 'basics/userform/data',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: svrOptions.endPoint ?? 'rubricdatalist',
				usePost: false
			},
			createInfo: {
				endPoint: 'createFormData',
				usePost: true,
				prepareParam: () => {
					return this.getCreateOrReadParam();
				}
			},
			roleInfo: {
				role: ServiceRole.Leaf,
				itemName: 'UserFormData',
				parent: parentService
			} as IDataServiceChildRoleOptions<IPpsUserFormDataEntity, PT, PU>,
			entityActions: {
				createSupported: svrOptions.createSupported ?? true,
				deleteSupported: svrOptions.createSupported ?? true,
			}
		};

		super(options);
	}

	protected override provideLoadPayload(): object {
		return this.getCreateOrReadParam();
	}

	protected override onLoadSucceeded(loaded: IPpsUserFormDataEntity[]): IPpsUserFormDataEntity[] {
		const selectedItem = this.getSelectedParent();
		const selectedItemId = get(selectedItem, 'Id');
		loaded.forEach(item => {
			item.Belonging = item.FormDataIntersection.ContextFk !== selectedItemId ? BelongingType.parentUnit : BelongingType.currentUnit;
		});
		return loaded;
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
				const tmpToSave = this.toSave as IPpsUserFormDataEntity[];
				if (this.toSave && this.toSave.length) {
					this.doMerge(updated.FormDataToSave);
					this.updateEntities(tmpToSave);
					this.entitiesUpdated(tmpToSave);
				}
				this.toSave = this.toDelete = [];
			}
		});
	}

	public override isParentFn(parentKey: IUserFormDataEntity, entity: IUserFormDataEntity) {
		return entity.FormDataIntersection.ContextFk === parentKey.Id;
	}
}