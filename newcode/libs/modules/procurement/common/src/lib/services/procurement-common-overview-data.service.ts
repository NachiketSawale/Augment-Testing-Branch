/*
 * Copyright(c) RIB Software GmbH
 */
import {
	CompleteIdentification,
	IEntityIdentification, PlatformTranslateService
} from '@libs/platform/common';
import {
    DataServiceHierarchicalNode,
    IDataServiceChildRoleOptions,
    IDataServiceOptions,
    ServiceRole
} from '@libs/platform/data-access';
import {IReadonlyParentService} from '@libs/procurement/shared';
import { MainDataDto } from '@libs/basics/shared';
import { IProcurementCommonOverviewEntity } from '../model/entities/procurement-common-overview-entity.interface';
import { inject, Injectable } from '@angular/core';
import { OverviewInfo } from '../model/entities';

@Injectable({
	providedIn: 'root'
})
export abstract class ProcurementCommonOverviewDataService<T extends IProcurementCommonOverviewEntity,U extends CompleteIdentification<T>, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>extends DataServiceHierarchicalNode<T,U, PT, PU> {
private readonly translateService = inject(PlatformTranslateService);
	protected constructor(protected parentService: IReadonlyParentService<PT, PU>,protected config:{
		moduleName:string,
		entityInfo: {
			id:number;
			Uuid: string;
			ParentUuid?: string;
			Container?: string|undefined;
			Title:string;
			Level?: number|null|undefined;
		}[],
		searchLevel:number
    }) {

        const options: IDataServiceOptions<T> = {
            apiUrl: 'procurement/common/module/overview',
            readInfo: {
                endPoint: 'data',
                usePost: true
            },
            roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
                role: ServiceRole.Node,
                itemName: 'PrcOverview',
                parent: parentService
            },
        };
        super(options);
    }

    protected override provideLoadPayload(): object {
		const parentItem = this.parentService.getSelectedEntity();
        return {
	        filter: '',
	        mainItemId:parentItem?.Id,
	        moduleIdentifier: this.config.moduleName,
	        searchLevel:this.config.searchLevel
        };
    }

    protected override onLoadSucceeded(loaded: object): T[] {
        const dataDto = new MainDataDto<T>(loaded);
	    const data = dataDto.dto as T[];
	    const newData =this.assignChildToEntities(data);
		 return newData as T[];
    }

	public override parentOf(element: T): T | null {
		if (element.ParentUuid == null) {
			return null;
		}

		const parentId = element.ParentUuid;
		const parent = this.flatList().find(candidate => candidate.ParentUuid === parentId);
		return parent === undefined ? null : parent;
	}

	public override childrenOf(element: T): T[] {
		return  element.ChildItem as T[] ?? [];
	}

	public assignChildToEntities(data: T[]) {
		const parentId = data.find(e => !e.ParentUuid)?.Uuid;
		if (parentId) {
			const overviewEntities: IProcurementCommonOverviewEntity[] = this.config.entityInfo
				.map(e => {
					const overviewInfo = new OverviewInfo();
					overviewInfo.Id = e.id;
					overviewInfo.Count = data.find(x => x.Uuid === e.Uuid)?.Count;
					overviewInfo.Title = this.translateService.instant(e.Title).text;
					overviewInfo.Uuid = e.Uuid;
					return overviewInfo as unknown as IProcurementCommonOverviewEntity;
				})
				.filter(Boolean);
			return overviewEntities;
		}
		return [];
	}
}