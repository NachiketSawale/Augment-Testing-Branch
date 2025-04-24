/*
 * Copyright(c) RIB Software GmbH
 */

import { get } from 'lodash';
import { inject, Injectable } from '@angular/core';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { IBasicsBim360ProjectEntity } from '../model/entities/basics-bim360-project-entity.interface';
import { IBasicsBim360ProjectInfoEntity } from '../model/entities/basics-bim360-project-info-entity.interface';
import { IBasicsBim360DocumentEntity } from '../model/entities/basics-bim360-document-entity.interface';
import { IBasicsBim360DocumentViewEntity } from '../lookup/entities/basics-bim360-document-view-entity.interface';
import { IBasicsBim360IssueEntity } from '../model/entities/basics-bim360-issue-entity.interface';
import { IBasicsBim360IssueViewEntity } from '../lookup/entities/basics-bim360-issue-view-entity.interface';
import { IBasicsBim360RFIEntity } from '../model/entities/basics-bim360-rfi-entity.interface';
import { IBasicsBim360RFIViewEntity } from '../lookup/entities/basics-bim360-rfi-view-entity.interface';
import { IBasicsBim360SourceUserEntity } from '../model/entities/basics-bim360-source-user-entity.interface';
import { IBasicsBim360SourceProjectEntity } from '../model/entities/basics-bim360-source-project-entity.interface';
import { IBasicsBim360ParamSelectItem } from '../lookup/entities/basics-bim360-param-select-item.interface';

/**
 * Characteristic Type Helper
 */

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedBim360HelperService {
	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	private tryToJson(str: string): object {
		let result;
		try {
			result = JSON.parse(str);
		} catch (e) {
			result = null;
		}
		return result;
	}

	/**
	 * Get message to show.
	 * @param msg original message.
	 */
	private getShowMessage(msg: string): string {
		let info = msg;
		const json = this.tryToJson(info);
		if (json) {
			const devMsg = get(json, 'developerMessage', '');
			if (devMsg) {
				info = devMsg;
			}
		}
		return info;
	}

	/**
	 * Show message dialog.
	 * @param headerText header text.
	 * @param body body text.
	 * @param iconClass iconClass.
	 */
	public showMsgDialog(body: string, headerText: string, iconClass: string) {
		const bodyText = this.getShowMessage(body);
		this.messageBoxService.showMsgBox(bodyText, headerText, iconClass);
	}

	/**
	 * Show error message dialog.
	 * @param body body text.
	 */
	public showErrorMsgDialog(body: string) {
		const bodyText = this.getShowMessage(body);
		this.messageBoxService.showErrorDialog(bodyText);
	}

	/**
	 * Convert a project object for request
	 * @param project IBasicsBim360ProjectEntity type project.
	 * @returns IBasicsBim360ProjectInfoEntity type project.
	 */
	public toProject(project: IBasicsBim360ProjectEntity | null): IBasicsBim360ProjectInfoEntity | null {
		if (project) {
			return {
				prjKey: project.PrjKey,
				prjId: project.PrjId,
				companyId: project.CompanyId,
				projectNo: project.ProjectNo,
				projectName: project.ProjectName,
				currency: project.Currency,
			};
		}
		return null;
	}

	/**
	 * Convert a document object for display
	 * @param folder source object.
	 * @param id id for display.
	 * @returns converted object.
	 */
	public toDocumentViewEntity(folder: IBasicsBim360DocumentEntity, id: number): IBasicsBim360DocumentViewEntity {
		return {
			Id: id, // string type id is not supported by lookup base.
			DocumentId: folder.Id,
			FullName: folder.FullName,
			srcEntity: folder,
		};
	}

	/**
	 * Convert an issue object for display
	 * @param source source object.
	 * @param id id for display.
	 * @returns converted object.
	 */
	public toIssueViewEntity(source: IBasicsBim360IssueEntity, id: number): IBasicsBim360IssueViewEntity {
		return {
			Id: id, // string type id is not supported by lookup base.
			srcEntity: source,
		};
	}

	/**
	 * Convert an RFI object for display
	 * @param source source object.
	 * @param id id for display.
	 * @returns converted object.
	 */
	public toRFIViewEntity(source: IBasicsBim360RFIEntity, id: number): IBasicsBim360RFIViewEntity {
		return {
			Id: id, // string type id is not supported by lookup base.
			srcEntity: source,
		};
	}

	/**
	 * Convert a bim360 user to select item.
	 * @param source source object.
	 * @returns converted object.
	 */
	public toUserSelectItem(source: IBasicsBim360SourceUserEntity): IBasicsBim360ParamSelectItem {
		return {
			id: source.id,
			displayName: source.name ?? '',
		};
	}

	/**
	 * Convert a bim360 project to select item.
	 * @param source source object.
	 * @returns converted object.
	 */
	public toProjectSelectItem(source: IBasicsBim360SourceProjectEntity): IBasicsBim360ParamSelectItem {
		return {
			id: source.id,
			displayName: source.name ?? '',
		};
	}

	/**
	 * get a compare function to compare item.
	 */
	public getCompareItemFn() {
		return (a: IBasicsBim360ParamSelectItem, b: IBasicsBim360ParamSelectItem) => {
			if (a.Id === undefined && b.Id === undefined) {
				return 0;
			} else if (a.Id === undefined) {
				return 1;
			} else if (b.Id === undefined) {
				return -1;
			} else {
				return a.Id - b.Id; // 正常的数字比较
			}
		};
	}
}
