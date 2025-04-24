import * as _ from 'lodash';
import { Injectable, inject } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { PlatformTranslateService } from '@libs/platform/common';
import { TextDisplayType, UiCommonLongTextDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { BoqItemTreeHelper, BoqLineType } from '../../model/boq-main-boq-constants';
import { ICrbBoqItemEntity } from '../../model/entities/crb-boq-item-entity.interface';
import { BoqItemDataServiceBase } from '../boq-main-boq-item-data.service';

@Injectable({providedIn: 'root'})
export class CrbRevisionInfoService {
	private http = inject(PlatformHttpService);
	private readonly translate = inject(PlatformTranslateService);
	private readonly msgBoxService = inject(UiCommonMessageBoxService);
	private readonly longTextDialogService = inject(UiCommonLongTextDialogService);
	private readonly baseRoute = 'boq/main/crb/revisioninfo/';

	public setRevisionInfoMarks(boqItemDataService: BoqItemDataServiceBase): void {
		this.http.get$(this.baseRoute+'contextdatapositionsforchapter' + CrbRevisionInfoService.getQueryPart(boqItemDataService,true)).subscribe(response => {
			const rootBoqItem = boqItemDataService.getRootBoqItem() as ICrbBoqItemEntity;
			const hasRevisionInfo = _.some(response as []);
			if (hasRevisionInfo && rootBoqItem) {
				rootBoqItem.RevisionInfoMark = '!';
				// TODO-FWK-DEV-7053: Waiting for function boqItemDataService.gridRefresh
			}

			this.msgBoxService.showInfoBox('boq.main.' + (hasRevisionInfo ? 'crbRevisioninfoMarksUpdated' : 'crbRevisioninfoMarksUnavailable'), 'info', false);
		});
	}

	public showRevisionDetails(boqItemDataService: BoqItemDataServiceBase): void {
		this.http.get$(this.baseRoute+'revisiondetailsforposition' + CrbRevisionInfoService.getQueryPart(boqItemDataService,true)).subscribe(response => {
			const revisionDetails = response as [{ npkVariable:string, shortDescription:string, type:string, mark:string, note:string, ecoText:string, referencPart:string }];
			if (revisionDetails) {
				let detailText = '';
				_.forEach(revisionDetails, detail => {
					detailText += CrbRevisionInfoService.getBoqChapter(boqItemDataService).Reference + detail.referencPart   + '\n\n';
					detailText += this.translate.instant('boq.main.crbRevisionError').text + ':\n' + detail.shortDescription + '\n\n';
					if (!_.isEmpty(detail.note)) {
						detailText += this.translate.instant('boq.main.crbRevisionReplacement').text + ':\n' + detail.note;
					}
					detailText += '\n\n\n\n';
				});
				this.longTextDialogService.show({headerText:'boq.main.crbRevisioninfo', text:detailText, type:TextDisplayType.Plain});
			} else {
				this.msgBoxService.showInfoBox('boq.main.crbRevisioninfoMarksUnavailable', 'info', false);
			}
		});
	}

	public showRevisioninfoFiles(boqItemDataService: BoqItemDataServiceBase): void {
		this.http.get$(this.baseRoute+'contextfilemetadataforposition' + CrbRevisionInfoService.getQueryPart(boqItemDataService,false)).subscribe(response => {
			const files = response as [{ Name: string, Uri: string }];
			if (_.some(files)) {
				_.forEach(files, file => {
					const link = document.createElement('a');
					document.body.appendChild(link);
					link.setAttribute('display', 'none');
					link.href     = file.Uri;
					link.download = file.Name;
					link.type     = 'application/octet-stream';
					link.click();
				});
			} else {
				this.msgBoxService.showInfoBox('boq.main.crbRevisioninfoFilesUnavailable', 'info', false);
			}
		});
	}

	public showRevisioninfoLinks(boqItemDataService: BoqItemDataServiceBase): void {
		this.http.get$(this.baseRoute+'contextdatalinksforposition' + CrbRevisionInfoService.getQueryPart(boqItemDataService,false)).subscribe(response => {
			const links = response as [{ description:string, link:string }];
			if (_.some(links)) {
				_.forEach(links, link => {
					window.open(link.link);
				});
			} else {
				this.msgBoxService.showInfoBox('boq.main.crbRevisioninfoLinksUnavailable', 'info', false);
			}
		});
	}

	private static getBoqChapter(boqItemDataService:BoqItemDataServiceBase): ICrbBoqItemEntity {
		const boqitemList = BoqItemTreeHelper.flatten(boqItemDataService.rootEntities());
		return  _.find(boqitemList, bi=>bi.BoqLineTypeFk===BoqLineType.DivisionLevelFirst) as ICrbBoqItemEntity;
	}

	private static getQueryPart(boqItemDataService:BoqItemDataServiceBase, isForChapter:boolean): string {
		const boqItem = boqItemDataService.getSelectedEntity() as ICrbBoqItemEntity;
		const boqChapter = CrbRevisionInfoService.getBoqChapter(boqItemDataService);
		return (isForChapter ? '?chapterReference='+boqChapter.Reference : '?boqItemReference='+boqItem.Reference) + '&version='+boqChapter.Reference2 + '&stand='+boqChapter.Stand;
	}
}

