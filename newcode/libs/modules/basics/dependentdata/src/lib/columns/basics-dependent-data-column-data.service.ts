/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, DataServiceFlatLeaf } from '@libs/platform/data-access';
import { IDependentDataEntity } from '../model/entities/dependent-data-entity.interface';
import { DependentDataComplete } from '../model/complete-class/dependent-data-complete.class';
import { IDependentDataColumnEntity } from '../model/entities/dependent-data-column-entity.interface';
import { BasicsDependentDataDataService } from '../dependent-data/basics-dependent-data-data.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { PlatformHttpService } from '@libs/platform/common';


@Injectable({
	providedIn: 'root'
})
export class BasicsDependentColumnDataService extends DataServiceFlatLeaf<IDependentDataColumnEntity, IDependentDataEntity, DependentDataComplete> {
	private readonly http = inject(PlatformHttpService);

	public constructor(private parentService: BasicsDependentDataDataService) {
		const options: IDataServiceOptions<IDependentDataColumnEntity> = {
			apiUrl: 'basics/dependentdata/column',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			createInfo: {
				endPoint: 'createEntity',
				usePost: true,
				prepareParam: () => {
					const selection = parentService.getSelectedEntity();
					return {
						mainItemId: selection?.Id ?? 0
					};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete'
			},
			roleInfo: <IDataServiceRoleOptions<IDependentDataColumnEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'DependentDataColumns',
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

	protected override onLoadSucceeded(loaded: object): IDependentDataColumnEntity[] {
		if (loaded) {
			return loaded as IDependentDataColumnEntity[];
		}
		return [];
	}

	public override isParentFn(parentKey: IDependentDataEntity, entity: IDependentDataColumnEntity): boolean {
		return entity.DependentDataFk === parentKey.Id;
	}

	public async parseView() {
		const parent = this.getSelectedParent();
		if (parent && parent.Id) {
			const headers = new HttpHeaders({'Content-Type': 'application/json'});
			const param = new HttpParams().set('dependentDataId', parent.Id);
			const result = await this.http.post<IDependentDataColumnEntity[]>('basics/dependentdata/parseview', JSON.stringify(parent.SourceObject), {
				headers: headers,
				params: param
			});
			if (result && result.length > 0) {
				this.setList(result);
			}
		}
	}
}