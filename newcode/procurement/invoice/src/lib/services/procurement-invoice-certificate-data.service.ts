/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ProcurementCommonCertificateDataService } from '@libs/procurement/common';
import { IPrcCertificateEntity } from '@libs/procurement/interfaces';
import { IInvHeaderEntity } from '../model/entities';
import { InvComplete } from '../model';
import { firstValueFrom } from 'rxjs';
import { BusinesspartnerSharedCertificateTypeLookupService } from '@libs/businesspartner/shared';
import { PlatformTranslateService } from '@libs/platform/common';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';
import { IContractLookupEntity } from '@libs/procurement/shared';

@Injectable({
	providedIn: 'root',
})

/**
 * Certificate data service
 */
export class ProcurementInvoiceCertificateDataService extends ProcurementCommonCertificateDataService<IPrcCertificateEntity, IInvHeaderEntity, InvComplete> {
	private readonly certificateTypeLookupService = inject(BusinesspartnerSharedCertificateTypeLookupService);
	private readonly translateService = inject(PlatformTranslateService);

	public constructor(protected dataService: ProcurementInvoiceHeaderDataService) {
		super(dataService, {
			apiUrl: 'procurement/invoice/certificate',
			itemName: 'InvCertificate',
		});
	}

	public override isParentFn(parentKey: IInvHeaderEntity, entity: IPrcCertificateEntity): boolean {
		return entity.InvHeaderFk === parentKey.Id;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: InvComplete, modified: IPrcCertificateEntity[], deleted: IPrcCertificateEntity[]) {
		if (modified && modified.length > 0) {
			parentUpdate.InvCertificateToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			parentUpdate.InvCertificateToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: InvComplete): IPrcCertificateEntity[] {
		if (parentUpdate && parentUpdate.InvCertificateToSave) {
			return parentUpdate.InvCertificateToSave;
		}
		return [];
	}

	public refresh() {
		const invHeaderEntity = this.dataService.getSelectedEntity()!;
		const certificatesList = this.getList();
		const requestData: IRequestData = {
			invHeader: invHeaderEntity,
			invCertificates: certificatesList,
		};
		//todo:jie,The old system obtains the contract and pes data and assigns them to conHeaderFromItems and conHeaderDataFromPes
		//service.getConHeaderDataFromItems.fire();
		//service.getConHeaderDataFromPes.fire();
		requestData.conHeaderFromItems = []; //get contract header list
		this.doRefresh(requestData);
	}

	public async copyAndUpdateCertificates(invConHeaderResponse: IContractLookupEntity, conHeaderId: number) {
		const parentItem = this.dataService.getSelectedEntity()!;
		if (!parentItem) {
			return;
		}
		parentItem.ProjectFk = invConHeaderResponse.ProjectFk;
		parentItem.ControllingUnitFk = invConHeaderResponse.ControllingUnitFk;
		parentItem.PrcStructureFk = invConHeaderResponse.PrcStructureFk;
		parentItem.ClerkPrcFk = invConHeaderResponse.ClerkPrcFk;
		parentItem.ClerkReqFk = invConHeaderResponse.ClerkReqFk;

		const requestData = {
			prcHeaderId: invConHeaderResponse.PrcHeaderId,
			parentItem: parentItem,
			conHeaderId: conHeaderId,
			businessPartnerId: invConHeaderResponse.BusinessPartnerFk,
		};
		const responseData = await firstValueFrom(this.http.post<{ CopiedCertificates: IPrcCertificateEntity[] }>(this.configurationService.webApiBaseUrl + 'procurement/invoice/certificate/copycertificates', requestData));
		if (responseData) {
			const copyData = responseData.CopiedCertificates;
			this.deleteAll();
			this.setList(copyData);
			this.setModified(copyData);
			await this.createReconciliations();
			//service.gridRefresh();
		}
	}

	protected override provideLoadPayload(): object {
		if (this.getSelectedParent()) {
			const invHeaderFk = this.getSelectedParent()?.Id;
			return { mainItemId: invHeaderFk };
		}
		throw new Error('Should have selected parent entity');
	}

	protected async doRefresh(param: IRequestData) {
		const responseData = await firstValueFrom(this.http.post(this.configurationService.webApiBaseUrl + 'procurement/invoice/certificate/refresh', param));
		if (responseData) {
			const data = responseData as IPrcCertificateEntity[];
			this.setList([]);
			this.setList(data);
			await this.createReconciliations();
		}
	}

	private deleteAll = () => {
		this.delete(this.getList());
	};

	private async createReconciliations() {
		const entities = this.getList();
		const certificates = await firstValueFrom(this.certificateTypeLookupService.getList());
		entities.forEach((e) => {
			//let remark = '';
			const certificateType = e.BpdCertificateTypeFk ? certificates.find((x) => x.id === e.BpdCertificateTypeFk) : null;
			if (e.BpdCertificateTypeFk === null && certificateType) {
				//remark = this.translateService.instant('procurement.invoice.reconciliationWarning');
				//todo:jie,The old system calls the verification method of the header here, which doesn't seem reasonable
				//validationDataService.checkValidation(remark, reconciliationReference.certificate, messageFormat, certificateType.Description);
			} else {
				//certificateType = certificates.find(x=>x.id === e.BpdCertificateTypeFk);
				//todo:jie,The old system calls the verification method of the header here, which doesn't seem reasonable
			}
		});
	}

	//todo:jie,The old system calls the verification method of the header here, which doesn't seem reasonable
	//validationDataService.createValidations();
}

interface IRequestData {
	invHeader: IInvHeaderEntity;
	invCertificates: IPrcCertificateEntity[];
	conHeaderFromItems?: object;
	conHeaderFromPes?: object;
}
