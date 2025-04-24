/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, DataServiceFlatNode } from '@libs/platform/data-access';
import { IDependentDataEntity } from '../model/entities/dependent-data-entity.interface';
import { DependentDataComplete } from '../model/complete-class/dependent-data-complete.class';
import { IUserChartEntity } from '../model/entities/user-chart-entity.interface';
import { BasicsDependentDataDataService } from '../dependent-data/basics-dependent-data-data.service';
import { PlatformHttpService } from '@libs/platform/common';
import { HttpParams } from '@angular/common/http';
import { DEFAULT_COLOR, MainDataDto } from '@libs/basics/shared';
import { UserChartComplete } from '../model/complete-class/user-chart-complete.class';

@Injectable({
	providedIn: 'root'
})

export class BasicsDependentDataChartDataService extends DataServiceFlatNode<IUserChartEntity, UserChartComplete, IDependentDataEntity, DependentDataComplete> {
	private readonly http = inject(PlatformHttpService);
	public readonly scaleType = {
		Linear: 'linear',
		Time: 'time',
		Category: 'category'
	};

	public constructor(private parentService: BasicsDependentDataDataService) {
		const options: IDataServiceOptions<IUserChartEntity> = {
			apiUrl: 'basics/dependentdata/chart',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createEntity',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete',
				usePost: true
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IUserChartEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'UserChartDto',
				parent: parentService
			}
		};

		super(options);
	}

	protected override provideLoadPayload() {
		const parent = this.getSelectedParent();
		if (parent) {
			return {
				mainItemId: parent.Id
			};
		} else {
			throw new Error('There should be a selected parent data to load');
		}
	}

	protected override onLoadSucceeded(loaded: object): IUserChartEntity[] {
		const dto = new MainDataDto<IUserChartEntity>(loaded);
		return dto.Main;
	}

	protected override provideCreatePayload() {
		const selected = this.getSelectedParent();
		if (selected) {
			return {
				mainItemId: (selected.Id ?? 0)
			};
		} else {
			throw new Error('There should be a selected parent scope to create the data');
		}
	}

	protected override onCreateSucceeded(created: IUserChartEntity) {
		created.Config = JSON.stringify({
			version: 1.0,
			title: {show: true, position: 'left', color: DEFAULT_COLOR},
			legend: {show: true, position: 'left', color: DEFAULT_COLOR},
			group: {enable: false},
			scale: {
				x: {
					type: this.scaleType.Linear,
					time: {dataFormat: 'MM/DD/YYYY', unit: 'day'},
					customCategory: false,
					categorys: []
				}, y: {type: this.scaleType.Linear}
			}
		});
		return created;
	}

	public override isParentFn(parentKey: IDependentDataEntity, entity: IUserChartEntity): boolean {
		return entity.DependentdataFk === parentKey.Id;
	}

	public async loadData(dependentDataId: number) {
		const param = new HttpParams().set('dependentDataId', dependentDataId);
		const userCharts = await this.http.get<IUserChartEntity[]>('basics/dependentdata/chartslist', {params: param});
		const columns = await this.http.get<IUserChartEntity[]>('basics/dependentdata/columnslist', {params: param});
		return userCharts.concat(columns);
	}
}