import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IMtgHeaderEntity } from '@libs/basics/interfaces';
import { BasicsMeetingComplete } from '../model/basics-meeting-complete.class';
import { BlobsEntity } from '@libs/basics/shared';
import { BasicsMeetingDataService } from './basics-meeting-data.service';
import { IIdentificationData, PlatformHttpService } from '@libs/platform/common';
import { inject, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
@Injectable({
	providedIn: 'root',
})
export class BasicsMeetingSpecificationDataService extends DataServiceFlatLeaf<BlobsEntity, IMtgHeaderEntity, BasicsMeetingComplete> {
	private readonly http = inject(PlatformHttpService);
	protected currentMinutesChanged$ = new ReplaySubject<BlobsEntity | null>(1);
	public constructor(private parentService: BasicsMeetingDataService) {
		const options: IDataServiceOptions<BlobsEntity> = {
			apiUrl: '',
			roleInfo: <IDataServiceChildRoleOptions<BlobsEntity, IMtgHeaderEntity, BasicsMeetingComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'BlobSpecification',
				parent: parentService,
			},
		};
		super(options);
	}

	/**
	 * load specification once specificationId is provided
	 * @param identificationData
	 */
	public override load(identificationData: IIdentificationData): Promise<BlobsEntity[]> {
		if (identificationData.pKey1) {
			const selectedEntity = this.parentService.getSelectedEntity();
			if (selectedEntity?.BasBlobsSpecificationFk) {
				this.loadSpecificationById(selectedEntity.BasBlobsSpecificationFk);
			}
		}
		return new Promise((resolve) => {
			resolve([]);
		});
	}

	public get currentMinutesChanged() {
		return this.currentMinutesChanged$;
	}

	/**
	 * check item is editable or not
	 */
	public isItemEditAble() {
		return !this.parentService.isItemReadOnly();
	}

	private async loadSpecificationById(specificationId: number) {
		const blobEntity = await this.http.get<BlobsEntity>('cloud/common/blob/getblobstring', {
			params: {
				id: specificationId,
			},
		});

		if (blobEntity) {
			const selectedEntity = this.parentService.getSelectedEntity();
			if (selectedEntity && !!selectedEntity.BasBlobsSpecificationFk && !!blobEntity.Id && selectedEntity.BasBlobsSpecificationFk === blobEntity.Id) {
				this.currentMinutesChanged.next(blobEntity);
				return blobEntity;
			}
		} else {
			this.currentMinutesChanged.next(null);
		}
		return null;
	}

	public async getCurrentSpecification() {
		const selectedEntity = this.parentService.getSelectedEntity();
		if (selectedEntity && !!selectedEntity.BasBlobsSpecificationFk) {
			return await this.loadSpecificationById(selectedEntity.BasBlobsSpecificationFk);
		}
		return null;
	}

	/**
	 * this should subscribe the minute content updated
	 * @param entity
	 * @param parentComplete
	 */
	public setMinutesModified(entity: BlobsEntity) {
		this.setModified(entity);
	}
}
/// todo: update function.
