import { Injectable } from '@angular/core';
import { FieldType, ILookupConfig, ILookupSearchRequest, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IEntityContext } from '@libs/platform/common';
import { ControllingUnitTreeEntityInterface } from '../model/entities/controlling-unit-tree-entity.interface';

@Injectable({
	providedIn: 'root'
})

export class ControllingUnitLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<ControllingUnitTreeEntityInterface, TEntity> {
	public constructor() {

		const endpoint =
			{
				httpRead:
					{
						route: 'basics/lookupdata/masternew/',
						endPointRead: 'getsearchlist?lookup=controllingunit',
						usePostForRead: true,
					},
				filterParam: true
			};

		const gridConfig: ILookupConfig<ControllingUnitTreeEntityInterface, TEntity> = {
			uuid: '3d196b795497432c875c5b76255eb96a',
			idProperty: 'Id',
			readonly: false,
			valueMember: 'Id',
			displayMember: 'Code',

			gridConfig: {
				uuid: '3d196b795497432c875c5b76255eb96a',
				columns: [
					{id: 'Status', model: 'Code', type: FieldType.Description, label: {text: 'Code'}, sortable: true, visible: true, readonly: true},
					{id: 'Status', model: 'DescriptionInfo.Description', type: FieldType.Description, label: {text: 'Description'}, sortable: true, visible: true, readonly: true}
				],
			},
			dialogOptions: {
				headerText: 'Controlling unit',
				alerts: []
			},
			// showGrid: true,
			showDialog: true,

		};

		super(endpoint, gridConfig);
	}

	protected override prepareListFilter(context?: IEntityContext<TEntity>): string | object | undefined {
		return {'SearchFields':['Code','DescriptionInfo.Translated'],'SearchText':'','FilterKey':'basics.masterdata.controllingunit.filterkey','AdditionalParameters':{'ProjectFk':1016388},'TreeState':{'StartId':null,'Depth':null},'RequirePaging':true,'PageState':{'PageNumber':0,'PageSize':10}};
	}

	protected override prepareSearchFilter(request: ILookupSearchRequest, context?: IEntityContext<TEntity>): string | object | undefined {
		return {'SearchFields':['Code','DescriptionInfo.Translated'],'SearchText':'','FilterKey':'basics.masterdata.controllingunit.filterkey','AdditionalParameters':{'ProjectFk':1016388},'TreeState':{'StartId':null,'Depth':null},'RequirePaging':true,'PageState':{'PageNumber':0,'PageSize':10}};
	}

}