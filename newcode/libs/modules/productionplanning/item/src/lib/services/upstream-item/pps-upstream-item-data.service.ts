import { inject } from '@angular/core';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, IEntityRuntimeDataRegistry, IEntitySelection, ServiceRole } from '@libs/platform/data-access';
import { IPpsUpstreamItemEntity } from '../../model/entities/pps-upstream-item-entity.interface';
import { PpsUpstreamItemComplete } from '../../model/entities/pps-upstream-item-complete.class';
import { HttpClient } from '@angular/common/http';
import { CompleteIdentification, IEntityIdentification, PlatformConfigurationService } from '@libs/platform/common';
import {get, isNil, set} from 'lodash';
import { IPpsUpstreamItemDataSrvInitOptions } from '../../model/pps-upstream-item-data-srv-init-options.interface';
import { IPPSItemEntity } from '../../model/entities/pps-item-entity.interface';

export interface IPpsUpstreamItemDataService
	extends IEntitySelection<IPpsUpstreamItemEntity>, IEntityRuntimeDataRegistry<IPpsUpstreamItemEntity> {
	hasSelection(): boolean;
	copy(): void;
	getPpsItem(): string;
	onlyShowCurrentUpstreams: boolean;
	listGuid: string;
	showListByFilter(): void;
}

export class PpsUpstreamItemDataService<PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>
	extends DataServiceFlatNode<IPpsUpstreamItemEntity, PpsUpstreamItemComplete, PT, PU>
	implements IPpsUpstreamItemDataService {

	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);

	private readonly parentService;
	private readonly ppsHeaderFkColumnName: string;
	private readonly ppsItemFkColumnName: string;
	private readonly mainItemColumnName: string;

	public onlyShowCurrentUpstreams: boolean = false;
	public listGuid: string = '';

	public constructor(initOptions: IPpsUpstreamItemDataSrvInitOptions<PT>) {
		super({
			apiUrl: 'productionplanning/item/upstreamitem',
			roleInfo: <IDataServiceChildRoleOptions<IPpsUpstreamItemEntity, PT, PU>>{
				role: ServiceRole.Node,
				itemName: 'PpsUpstreamItem',
				parent: initOptions.parentService,
			},
			createInfo: {
				endPoint: 'create'
			},
			readInfo: {
				endPoint: initOptions.endPoint ?? 'list',
			},
			entityActions: {
				deleteSupported: initOptions.deleteSupported ?? false,
				createSupported: initOptions.createSupported ?? false,
			}
		});

		this.parentService = initOptions.parentService;
		this.ppsHeaderFkColumnName = initOptions.ppsHeaderColumn ?? 'PPSHeaderFk';
		this.ppsItemFkColumnName = initOptions.ppsItemColumn ?? 'Id';
		this.mainItemColumnName = initOptions.mainItemColumn ?? 'Id';
	}

	public copy() {
		const selection = this.getSelectedEntity();
		const parentSelection = this.parentService.getSelectedEntity();
		if (!selection || !parentSelection) {
			return;
		}

		this.http.post(this.configService.webApiBaseUrl + 'productionplanning/item/upstreamitem/create', {})
			.subscribe(response => {
				const newItem = response as IPpsUpstreamItemEntity;
				newItem.PpsHeaderFk = get(parentSelection, this.ppsHeaderFkColumnName) ?? selection.PpsHeaderFk;
				newItem.PpsItemFk = get(parentSelection, this.ppsItemFkColumnName) ?? null;
				newItem.PpsUpstreamGoodsTypeFk = selection.PpsUpstreamGoodsTypeFk;
				newItem.PpsUpstreamTypeFk = selection.PpsUpstreamTypeFk;
				newItem.UpstreamGoods = selection.UpstreamGoods;
				newItem.UomFk = selection.UomFk;

				// todo process
				this.append(newItem);
				this.select(newItem);
				this.setModified(newItem);
			});
	}

	public showListByFilter() {
		throw new Error('todo call the setFilterExtension in slick.rib.dataview.js');
		// if(_.isNil(service.listGuid)){  // if need to filter, pass the guid
		// 	return;
		// }
		// var parentSelected = parentService.getSelected();
		// if(_.isNil(parentSelected)){
		// 	return;
		// }
		// var ppsItemId = parentSelected[ppsItemColumn];  // in pps Header container, not need to filter
		// if(!_.isNil(ppsItemId)){
		// 	if(service.onlyShowCurrentUpstreams === true){
		// 		platformGridAPI.filters.extendFilterFunction(service.listGuid, function (item) {
		// 			return item.PpsItemFk === ppsItemId;
		// 		});
		// 	} else {
		// 		platformGridAPI.filters.extendFilterFunction(service.listGuid, function (item) {
		// 			return true;
		// 		});
		// 	}
		// }
	}

	public getPpsItem() {
		const parentSelected = this.parentService.getSelectedEntity();
		if (isNil(parentSelected)) {
			return undefined;
		}
		return get(parentSelected, this.ppsItemFkColumnName);
	}

	public override getModificationsFromUpdate(complete: PpsUpstreamItemComplete): IPpsUpstreamItemEntity[] {
		if (complete.PpsUpstreamItem === null) {
			return [];
		}
		return [complete.PpsUpstreamItem];
	}

	protected override provideLoadPayload() {
		const parentSelection = this.getSelectedParent();
		if (!parentSelection) {
			return { mainItemId: -1, ppsHeaderFk: -1 };
		}
		return {
			mainItemId: get(parentSelection, this.mainItemColumnName),
			ppsHeaderFk: get(parentSelection, this.ppsHeaderFkColumnName),
		};
	}

	protected override onLoadSucceeded(loaded: object): IPpsUpstreamItemEntity[] {
		if (loaded) {
			return get(loaded, 'Main', []);
		}
		return [];
	}

	public override isParentFn(parent: IPPSItemEntity, entity: IPpsUpstreamItemEntity): boolean {
		return entity.PpsItemFk === parent.Id;
	}

	public override createUpdateEntity(modified: IPpsUpstreamItemEntity | null): PpsUpstreamItemComplete {
		const complete = new PpsUpstreamItemComplete();
		if (modified != null) {
			complete.MainItemId = modified.Id;
			complete.PpsUpstreamItem = modified;
		}
		return complete;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override getSavedEntitiesFromUpdate(complete: PU): IPpsUpstreamItemEntity[] {
		const ppsUpstreamItemToSave = get(complete, 'PpsUpstreamItemToSave') as PpsUpstreamItemComplete[];
		if (Array.isArray(ppsUpstreamItemToSave)) {
			return ppsUpstreamItemToSave.map(i => i.PpsUpstreamItem);
		}
		return [];
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: PU, modified: PpsUpstreamItemComplete[], deleted: IPpsUpstreamItemEntity[]): void {
		if (modified && modified.some(() => true)) {
			set(parentUpdate, 'PpsUpstreamItemToSave', modified);
		}
		if (deleted && deleted.some(() => true)) {
			set(parentUpdate, 'PpsUpstreamItemToDelete', deleted);
		}
	}
}
