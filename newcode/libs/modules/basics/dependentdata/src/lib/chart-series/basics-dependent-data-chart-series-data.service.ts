/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, DataServiceFlatLeaf } from '@libs/platform/data-access';
import { IUserChartEntity } from '../model/entities/user-chart-entity.interface';
import { UserChartComplete } from '../model/complete-class/user-chart-complete.class';
import { IUserChartSeriesEntity } from '../model/entities/user-chart-series-entity.interface';
import { BasicsDependentDataChartDataService } from '../chart/basics-dependent-data-chart-data.service';

@Injectable({
	providedIn: 'root'
})

export class BasicsDependentDataChartSeriesDataService extends DataServiceFlatLeaf<IUserChartSeriesEntity, IUserChartEntity, UserChartComplete> {

	public constructor(private parentService: BasicsDependentDataChartDataService) {
		const options: IDataServiceOptions<IUserChartSeriesEntity> = {
			apiUrl: 'basics/dependentdata/chartSeries',
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
			roleInfo: <IDataServiceRoleOptions<IUserChartSeriesEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'UserChartSeriesDto',
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

	protected override onLoadSucceeded(loaded: object) {
		return loaded as IUserChartSeriesEntity[];
	}

	protected override provideCreatePayload() {
		const selected = this.getSelectedParent();
		if (selected){
			return {
				mainItemId: selected.Id,
				ChartTypeFk: selected.ChartTypeFk,
				DependentdatacolumnXFk: selected.DependentdatacolumnXFk,
				DependentdatacolumnYFk: selected.DependentdatacolumnYFk
			};
		} else {
			throw new Error('There should be a selected parent scope to create the data');
		}
	}

	public override isParentFn(parentKey: IUserChartEntity, entity: IUserChartSeriesEntity): boolean {
		return entity.UserChartFk === parentKey.Id;
	}
}