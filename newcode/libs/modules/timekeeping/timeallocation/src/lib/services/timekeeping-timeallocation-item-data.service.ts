/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatNode, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { ITimeAllocationEntity } from '../model/entities/time-allocation-entity.interface';
import { TimeAllocationItemComplete } from '../model/entities/time-allocation-item-complete.class';
import { ITimeAllocationHeaderEntity } from '../model/entities/time-allocation-header-entity.interface';
import { TimeAllocationHeaderComplete } from '../model/entities/time-allocation-header-complete.class';
import { TimekeepingTimeallocationHeaderDataService } from './timekeeping-timeallocation-header-data.service';
import { PlatformHttpService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root',
})
export class TimekeepingTimeallocationItemDataService extends DataServiceFlatNode<ITimeAllocationEntity, TimeAllocationItemComplete, ITimeAllocationHeaderEntity, TimeAllocationHeaderComplete> {
	private readonly http = inject(PlatformHttpService);
	public constructor() {
		const options: IDataServiceOptions<ITimeAllocationEntity> = {
			apiUrl: 'timekeeping/timeallocation/item',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: ident => {
					return { PKey1: ident.pKey1 };
				}
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<ITimeAllocationEntity, ITimeAllocationHeaderEntity, TimeAllocationHeaderComplete>>{
				role: ServiceRole.Node,
				itemName: 'TimeAllocation',
				parent: inject(TimekeepingTimeallocationHeaderDataService)
			},
		};

		super(options);
	}

	protected override provideCreatePayload(): object {
		const parent = this.getSelectedParent()!;
		return {
			PKey1: parent.Id,
		};
	}

	public override createUpdateEntity(modified: ITimeAllocationEntity | null): TimeAllocationItemComplete {
		return new TimeAllocationItemComplete(modified);
	}

	public override registerByMethod(): boolean {
		return true;
	}
	public override registerNodeModificationsToParentUpdate(complete: TimeAllocationHeaderComplete, modified: TimeAllocationItemComplete[], deleted: ITimeAllocationEntity[]) {
		if (modified && modified.length > 0) {
			complete.TimeAllocationToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.TimeAllocationToDelete = deleted;
		}
	}
	public override getSavedEntitiesFromUpdate(complete: TimeAllocationHeaderComplete): ITimeAllocationEntity[] {
		return (complete && complete.TimeAllocationToSave)
			? complete.TimeAllocationToSave.map(e => e.TimeAllocation!)
			: [];
	}

	public override isParentFn(parentKey: TimeAllocationHeaderComplete, entity: ITimeAllocationEntity): boolean {
		return entity.TimeAllocationHeaderFk === parentKey.Id;
	}

	public takeOverDescription(record: ITimeAllocationEntity, article: ITimeAllocationEntity): void {
		if (article !== null && article !== undefined) {
			record.RecordDescription = article.RecordDescription;
			if (record.RecordType === 1 && record.RecordingFk == null) {
				record.RecordingFk = article.RecordingFk;
			}
		}
	}

	public getArticleInformation(artId: string | number, artType: number, period: number | null | undefined): Promise<ITimeAllocationEntity> {
		return this.http.post<ITimeAllocationEntity>('timekeeping/timeallocation/item/articleinformation', {
			Id: artId,
			PKey2: period,
			PKey3: artType
		}).then((result) => {
			return Promise.resolve(result);
		});
	}

	public async setArticleInformation(item: ITimeAllocationEntity, article: string): Promise<ITimeAllocationEntity> {
		const header = inject(TimekeepingTimeallocationHeaderDataService).getSelectedEntity();
		let period: number | null | undefined = null;
		if (header) {
			period = header.PeriodFk;
		}
		switch (item.RecordType) {
			case 2: {
				const articleId = article || item.EtmPlantFk;
				if (articleId !== undefined && articleId !== null) {
					const result2 = await this.getArticleInformation(articleId, item.RecordType, period);
					this.takeOverDescription(item, result2);
				}
				return item;
			}
			case 1: {
				const articleId = article || item.EmployeeFk;
				if (articleId !== undefined && articleId !== null) {
					const result1 = await this.getArticleInformation(articleId, item.RecordType, period);
					this.takeOverDescription(item, result1);
					this.setModified(item);
				}
				return item;
			}
			default:
				return item;
		}
	}

}
