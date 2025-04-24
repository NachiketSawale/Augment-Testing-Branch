/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
	createLookup,
	FieldType,
	IGridConfiguration, ILookupSearchRequest,
	UiCommonLookupEndpointDataService
} from '@libs/ui/common';
import { BasicsSharedUomLookupService } from './basics-uom-lookup.service';
import { ICostGroupEntity } from '../../../src/lib/costgroups/model/entities/cost-group-entity.interface';
import { IBasicsUomEntity } from '@libs/basics/interfaces';
import { IEntityContext} from '@libs/platform/common';
import { get } from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class BasicsCostGroupLookupService <TEntity extends object> extends UiCommonLookupEndpointDataService<ICostGroupEntity,TEntity>{

	/**
	 * The constructor
	 */
	public configuration!: IGridConfiguration<ICostGroupEntity>;

	public constructor() {
		super(
			{
				httpRead:
					{
						route: 'basics/lookupdata/masternew/',
						endPointRead: 'getsearchlist?lookup=costgroup',
						usePostForRead: true,
					},
				filterParam: true
			},
			{
			valueMember: 'Id',
			displayMember: 'Code',
			uuid: 'bbe20e06f1649e0a93cec6cfd1d2d7e2',
			gridConfig: {
				treeConfiguration: {
					parent: (entity) => {
						if (entity.CostGroupFk) {
							return this.configuration?.items?.find((item) => item.Id === entity.CostGroupFk) || null;
						}
						return null;
					},
					children: (entity) => entity.CostGroupChildren ?? [],
					collapsed: true
				},
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: {
							text: 'Code',
							key: 'cloud.common.entityCode'
						},
						visible: true,
						sortable: false,
						width: 180,
						readonly: true
					},
					{
						id: 'Description',
						model: 'DescriptionInfo.Description',
						type: FieldType.Description,
						label: {
							text: 'Description',
							key: 'cloud.common.entityDescription'
						},
						visible: true,
						sortable: false,
						width: 300,
						readonly: true
					},
					{
						id: 'Quantity',
						model: 'Quantity',
						type: FieldType.Quantity,
						label: {
							text: 'Quantity',
							key: 'cloud.common.entityQuantity'
						},
						visible: true,
						sortable: false,
						width: 120,
						readonly: true
					},
					{
						id: 'UomFk',
						model: 'UomFk',
						type: FieldType.Lookup,
						label: {
							text: 'Uom',
							key: 'cloud.common.entityUom'
						},
						lookupOptions: createLookup<ICostGroupEntity, IBasicsUomEntity>({
							dataServiceToken: BasicsSharedUomLookupService,
							showClearButton: true
						}),
						visible: true,
						sortable: false,
						width: 50,
						readonly: true
					}
				]
			},
				dialogOptions: {
					headerText: {
						text: 'Cost Group',
					}
				},
				showDialog: true

		});
	}

	protected override prepareSearchFilter(request: ILookupSearchRequest, context?: IEntityContext<TEntity>): string | object | undefined {
		const costGroupType = get(request.additionalParameters, 'costGroupType');
		const catalogIds = get(request.additionalParameters, 'catalogIds');
		let additionalParameters = {};

		if(costGroupType === 1){
			const	projectId = get(request.additionalParameters, 'projectId');
			additionalParameters = {'catalogIds':catalogIds,'costGroupType':costGroupType,'projectId':projectId};
		}else {
			additionalParameters = {'catalogIds':catalogIds,'costGroupType':costGroupType};
		}
		return {'SearchFields':['Code','DescriptionInfo.Translated','Quantity','UomFk'],'SearchText':'','AdditionalParameters':additionalParameters,'TreeState':{'StartId':null,'Depth':null}};
	}
	protected override convertList(list: object){
		const Entitys = list as ICostGroupLoadDataEntity;
		if(Entitys){
			return Entitys.SearchList;
		}
		return [];
	}
}
interface ICostGroupLoadDataEntity{
	 RecordsFound:number ;
	 RecordsRetrieved:number ;
	 SearchList:ICostGroupEntity[];
}