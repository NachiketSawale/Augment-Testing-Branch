import * as _ from 'lodash';
import { Injectable, inject } from '@angular/core';
import { CollectionHelper } from '@libs/platform/common';
import { FieldType, IGridDialogOptions, LookupSimpleEntity, UiCommonGridDialogService, UiCommonLookupDataFactoryService, UiCommonMessageBoxService, createLookup } from '@libs/ui/common';
import { BoqItemDataService, BoqItemDataServiceBase } from '../boq-main-boq-item-data.service';
import { BoqLineType, CrbBoqPositionTypes } from '../../model/boq-main-boq-constants';
import { PlatformHttpService } from '@libs/platform/common';
import { ICrbBoqItemEntity } from '../../model/entities/crb-boq-item-entity.interface';

@Injectable({providedIn: 'root'})
export class CrbDataService {
	private http = inject(PlatformHttpService);
	private lookupFactory = inject(UiCommonLookupDataFactoryService);
	private readonly msgBoxService = inject(UiCommonMessageBoxService);
	private readonly gridDialogService = inject(UiCommonGridDialogService);
	private readonly crbBaseRoute = 'boq/main/crb/';

	/** Builds ItemInfo. */
	public buildItemInfo(boqItem: ICrbBoqItemEntity): string {
		const crbLabels = [];

		if (boqItem.PositionType        === CrbBoqPositionTypes.Open) {
			crbLabels.push('O');
		} else if (boqItem.PositionType === CrbBoqPositionTypes.Repeat) {
			crbLabels.push('W');
		} else if (boqItem.PositionType === CrbBoqPositionTypes.Individual) {
			crbLabels.push('R');
		}

		if (boqItem.IsPreliminary) {
			crbLabels.push('VB');
		}

		if (boqItem.DrawingId) {
			crbLabels.push('D');
		}

		if (boqItem.PrdProductFk) {
			crbLabels.push('P');
		}
		// TODO-BOQ
		/*
		else if (boqItem.PrdMark) {
			crbLabels.push(boqItem.PrdMark);
		}
		*/

		if (boqItem.RevisionInfoMark) {
			crbLabels.push(boqItem.RevisionInfoMark);
		}

		if (boqItem.EcoDevisMark) {
			crbLabels.push(boqItem.EcoDevisMark);
		}

		return crbLabels.join();
	}

	/** Shows important information to a crb chapter. */
	public showImportantInformation(boqItemDataService: BoqItemDataServiceBase, showErrorBox: boolean): void {
		const boqList = CollectionHelper.Flatten(boqItemDataService.rootEntities(), boqItemDataService.childrenOf); // TODO-BOQ: 'Flatten' doas NOT return the complete list
		const boqChapter = _.find(boqList, bi=>bi.BoqLineTypeFk===BoqLineType.DivisionLevelFirst);
		if (boqChapter) {
			this.http.get$(this.crbBaseRoute + 'importantinformation' + '?chapterReference='+boqChapter.Reference + '&version='+boqChapter.Reference2).subscribe(response => {
				if (response) {
					this.msgBoxService.showInfoBox('boq.main.crbImportantInformationDownloaded', 'info', false)?.then(() => {
						const file = response as { Name: string, Uri: string };
						const dlink = document.createElement('a');
						document.body.appendChild(dlink);
						dlink.setAttribute('display', 'none');
						dlink.href = file.Uri;
						dlink.download = file.Name;
						dlink.type = 'application/octet-stream';
						dlink.click();
					});
				} else if (showErrorBox) {
					this.msgBoxService.showInfoBox('boq.main.crbImportantInformationUnavailable', 'info', false);
				}
			});
		}
	}

	/** Provides the special behaviour for Abschnitt000 that its BOQ item children are hidden until they are explecitely loaded. */
	public attachAbschnitt000s(boqItemDataService: BoqItemDataServiceBase): void {
		//TODO-BOQ: 'boqItemDataService' will be used once following
		// todo's will solved that's why it is not used.
		this.msgBoxService.showInfoBox('TODO', 'info', false);
		// TODO-BOQ: BoqItemDataService.setSelectedBoqHeaderId needs additional parameters
		//	boqItemDataService.setSelectedBoqHeaderId(boqItemDataService.getSelectedBoqHeaderId(), true/*, null, null, null, null, true*/).then(function() {
		//		this.messageBoxService.showInfoBox('boq.main.crbBoqItem000sAttached', 'info', false);
		//	});
	}

	/** Assigns cost group catalogs to the current BoQ according to the CRB rules.. */
	public assignCostGrpCats(boqItemDataService: BoqItemDataService): void {
		//TODO-BOQ: 'boqItemDataService' will be used once following
		// todo's will solved that's why it is not used.
		// TODO-BOQ: from js
		// var rootService = boqMainService;
		// while (_.isObject(rootService.parentService())) {
		//	   rootService = rootService.parentService();
		// }
		// rootService.update().then(function (response) {

		// TODO-BOQ: '?boqHeaderId='+boqItemDataService.getSelectedBoqHeaderId() + '&projectId='+boqItemDataService.getSelectedProjectId()
		this.http.get$(this.crbBaseRoute+'costgroupcat/getassignsext' + '?boqHeaderId='+1040104 + '&projectId='+1014757).subscribe(response => {
			if (response) {
				const responseData = response as { CrbCostgrpCatAssigns: ICrbCostgrpCatAssign[], PrjCostgrpCatAssigns: IPrjCostgrpCatAssign[] };

				let i: number = 0;
				responseData.CrbCostgrpCatAssigns.forEach(crbAssign => {
					crbAssign.Id = i++;
				});
				responseData.CrbCostgrpCatAssigns[0].PrjCostgrpcatAssignFk = 1045996; // TODO-BOQ: just to see a working connection between lookup and cell

				const costgroupLookupItems: LookupSimpleEntity[] = [];
				_.forEach(responseData.PrjCostgrpCatAssigns, prjCostgrpCatAssignItem => {
					costgroupLookupItems.push({ id: prjCostgrpCatAssignItem.Id, desc: prjCostgrpCatAssignItem.Description });
				});

				const gridDialogData: IGridDialogOptions<ICrbCostgrpCatAssign> = {
					width: '30%',
					headerText: 'boq.main.crbCostgrpCatAssign',
					windowClass: 'grid-dialog',
					gridConfig: {
						uuid: 'a44c9a0a5fd5496b8f559a2ac6b5f05e',
						columns: [
							{
								type: FieldType.Description,
								id:    'Name',
								model: 'Name',
								label: { key: 'boq.main.crbCostgrpCatStructure' },
								width: 200,
								visible: true,
								sortable: false,
							},
							{
								type: FieldType.Lookup,
								id:    'PrjCostgrpcatAssignFk',
								model: 'PrjCostgrpcatAssignFk',
								label: { key: 'cloud.common.entityCode' },
								width: 100,
								visible: true,
								sortable: false,
								lookupOptions: createLookup({
									dataService: this.lookupFactory.fromSimpleItemClass(costgroupLookupItems, { uuid: 'be45974377bd4abe868ecf94b7e192d0' }) // TODO-BOQ: read only, do not know why
								})
							},
							{
								type: FieldType.Description,
								id:    'PrjCostgrpcatAssignDescription',
								model: 'PrjCostgrpcatAssignDescription',
								label: { key: 'cloud.common.entityDescription' },
								width: 150,
								visible: true,
								sortable: false,
							},
							{
								type: FieldType.Description,
								id:    'Sorting',
								model: 'Sorting',
								label: { key: 'cloud.common.entitySorting' },
								width: 70,
								visible: true,
								sortable: false,
							},
						],
					},
					items: _.orderBy(responseData.CrbCostgrpCatAssigns, 'Code'),
					selectedItems: [],
					resizeable: true
				};

				this.gridDialogService.show(gridDialogData);
			}
		});
	}
}

export interface ICrbCostgrpCatAssign {
	Id: number;
	Name: string;
	Code: string;
	PrjCostgrpcatAssignFk: number;
	PrjCostgrpcatAssignDescription: string;
	Sorting: string;
}

export interface IPrjCostgrpCatAssign {
	Id: number;
	Code: string;
	Description: string;
	ProjectCostGroupCatalogFk: number;
	ContextCostGroupCatalogFk: number;
}
