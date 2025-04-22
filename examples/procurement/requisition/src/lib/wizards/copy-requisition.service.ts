import { inject, Injectable } from '@angular/core';
import { ProcurementRequisitionHeaderDataService } from '../services/requisition-header-data.service';
import { isNull, isUndefined } from 'lodash';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { PlatformHttpService } from '@libs/platform/common';
import { UiCommonMessageBoxService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root',
})
export class CopyRequisitionService {
	private readonly headerDataService = inject(ProcurementRequisitionHeaderDataService);
	private readonly http = inject(PlatformHttpService);
	private readonly msgBoxService = inject(UiCommonMessageBoxService);

	public async copyRequisition() {
		const header = this.headerDataService.getSelectedEntity();
		if (isNull(header) || isUndefined(header)) {
			return;
		}
		const data = await this.copyRequisitionById(header.Id, header.PrcHeaderFk);
		if (data) {
			//TODO: cloudDesktopSidebarService.filterSearchFromPKeys([data.Id]);
		} else {
			this.msgBoxService.showMsgBox('procurement.requisition.copyRequisition.saveFail', 'cloud.common.informationDialogHeader', 'ico-info');
		}
	}

	public async copyRequisitionById(id: number, prcHeaderId: number) {
		return await this.http.get<IReqHeaderEntity>('requisition/requisition/wizard/copyrequisition?reqHeaderId=' + id + '&prcHeaderId=' + prcHeaderId);
	}
}
