/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { BoqLineType } from '../../model/boq-main-boq-constants';
import { PlatformHttpService } from '@libs/platform/common';
import { IBoqItemEntity, IOenGraphicEntity } from '@libs/boq/interfaces';
import { BoqItemDataService } from '../boq-main-boq-item-data.service';
import { FieldType, IListSelectionDialogOptions, UiCommonListSelectionDialogService, UiCommonMessageBoxService } from '@libs/ui/common';


interface IListSelectionEntity {
	isTag: boolean;
	Id: number | string;
	Description?: string;
	parent?: number | string;
	image?: string;
}

@Injectable({providedIn: 'root'})
export class BoqMainOenPictureDataService extends DataServiceFlatLeaf<IOenGraphicEntity, IBoqItemEntity, IBoqItemEntity>{
	private readonly http = inject(PlatformHttpService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly listSelectionDialogService = inject(UiCommonListSelectionDialogService);
	// TODO-BOQ: eslint any (deactivated) private graphics : any = [];
	private selectedGraphics = [];
	private apiUrl = 'boq/main/oen/picture/';
	public constructor(private boqItemDataService: BoqItemDataService) {
		const options: IDataServiceOptions<IOenGraphicEntity> = {
			apiUrl: 'boq/main/oen/picture',
			roleInfo: <IDataServiceChildRoleOptions<IOenGraphicEntity, IBoqItemEntity, IBoqItemEntity>> {
				role: ServiceRole.Leaf,
				itemName: 'OenGraphic',
				parent: boqItemDataService
			},
			readInfo: <IDataServiceEndPointOptions> {
				endPoint: 'graphics',
				usePost: false,
				prepareParam: ident => {
					const selectItem = boqItemDataService.getSelectedEntity();
					return {
						 boqHeaderId : selectItem?.BoqHeaderFk , boqItemId: selectItem?.Id
					};
				}
			},
			createInfo: {
				endPoint: 'create',
				usePost: true
			}
		};
		super(options);
	}

	protected override provideCreatePayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				Id: parentSelection.BoqHeaderFk
			};
		}
		return {
			Id: -1
		};
	}

	protected override onCreateSucceeded(created: object): IOenGraphicEntity {
		return created as unknown as IOenGraphicEntity;
	}

	public createItemExtended() {
		const selectedBoqItem = this.boqItemDataService.getSelectedEntity();
		if (selectedBoqItem?.BoqLineTypeFk !== BoqLineType.Root) {
			this.getGraphics();
		} else {
			//TODO-FW: createItemOrigin() will be migrated.
			this.boqItemDataService.setModified(selectedBoqItem);
		}
	}

	public getGraphics() {
		// TODO-BOQ: eslint any (deactivated)
		/*
		const selectedBoqItem = this.boqItemDataService.getSelectedEntity();
		this.graphics = [];
		this.http.get$(this.apiUrl+ 'getgraphics?boqHeaderId=' + selectedBoqItem?.BoqHeaderFk + '&boqItemId=' + selectedBoqItem?.Id).subscribe( (response:any)=> {
			for (let k = 0; k < response.length; k++) {
				this.graphics.push(response[k]);
			}
			this.openListSelectionDialog().then(() => {});
		});
		*/
	}

	public async openListSelectionDialog(){
		const options: IListSelectionDialogOptions<IListSelectionEntity> = {
			width: '60%',
			headerText: 'Select Attribute Tag',
			availableGridConfig: {
				columns: [
					{
						id: 'description',
						model: 'Description',
						sortable: false,
						label: 'cloud.common.entityDescription',
						type: FieldType.Description,
						width: 200
					},
				],
			},
			selectedGridConfig: {
				columns: [
					{
						id: 'description',
						model: 'Description',
						sortable: false,
						label: 'cloud.common.entityDescription',
						type: FieldType.Description,
						width: 200
					},
					{
						id: 'Format',
						model: 'Format',
						sortable: false,
						label: 'boq.main.oenpicture.format',
						type: FieldType.Description,
						width: 200
					},
				],
			},
			allItems: [], // TODO-BOQ: eslint any (deactivated) allItems: this.graphics,
			value: this.selectedGraphics,
			idProperty: 'Id',
		};
		const data = await this.listSelectionDialogService.show(options);
		console.log(data);
	}

	public deleteItemExtended() {
		const currentItem = this.getSelectedEntity();
		console.log('currentItem', currentItem);
		const selectedBoqItem = this.boqItemDataService.getSelectedEntity();
		if( selectedBoqItem?.BoqLineTypeFk === BoqLineType.Root ) {
			console.log('selectedBoqItem', selectedBoqItem);
			if (currentItem) {
				this.http.get$(this.apiUrl + 'candeletegraphic?oenGraphicFk=' + currentItem.Id).subscribe(response => {
					if (response === false) {
						this.messageBoxService.showInfoBox('Can not delete the graphic as it is already in use.', 'info', true);
					} else if (response === true) {
						this.boqItemDataService.setModified(selectedBoqItem);
						//TODO-BOQ: Function "markEntitiesAsModified" will be added soon.
					}
				});
			}
		} else if (selectedBoqItem?.BoqLineTypeFk !== BoqLineType.Root) {
			if(selectedBoqItem) {
				this.boqItemDataService.setModified(selectedBoqItem);
			}
		}
	}

}