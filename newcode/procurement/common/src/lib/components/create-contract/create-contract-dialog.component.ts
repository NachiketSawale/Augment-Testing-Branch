import { Component, inject } from '@angular/core';
import { IFormConfig } from '@libs/ui/common';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { IPackageCreateContractRequest } from '../../model/interfaces/requests/package-create-contract-request.interface';
import { ProcurementCommonCreateContractWizardHelperService } from '../../services/wizards/create-contract/procurement-common-create-contract-wizard-helper.service';
import { IConHeaderEntity, IReqCreateContractFormReqRequest } from '@libs/procurement/interfaces';
import { ICreateContractComponentConfig } from '../../model/entities';
import { ProcurementCreateContractMode } from '../../model/enums';
import { ICreateContractWizardForm } from '../../model/interfaces/wizard/create-contract-wizard-form.interface';
import { CREATE_CONTRACT_WIZARD_OPTIONS_TOKEN } from '../../model/interfaces/wizard/create-contract-wizard-provider.interface';

@Component({
	selector: 'procurement-common-create-contract-dialog',
	templateUrl: './create-contract-dialog.component.html',
	styleUrls: ['./create-contract-dialog.component.scss'],
})
export class ProcurementCommonCreateContractDialogComponent {
	private readonly initCreateContractData = inject(CREATE_CONTRACT_WIZARD_OPTIONS_TOKEN);
	private readonly http = inject(PlatformHttpService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly createContractWizardHelperService = inject(ProcurementCommonCreateContractWizardHelperService);
	public readonly contractorTitle = this.translateService.instant('procurement.common.contractorTitle').text;
	public componentConfig: ICreateContractComponentConfig = {
		oKButtonDisable: true,
		cancelButtonDisable: false,
		isLoading: false,
		mode: this.initCreateContractData.mode,
	};

	public createContractWizardForm: ICreateContractWizardForm = {
		bpFK: 0,
		subsidiaryFk: null,
		supplierFk: null,
		contactFk: null,
	};
	public configuration: IFormConfig<ICreateContractWizardForm> = this.createContractWizardHelperService.createFromConfiguration(this.createContractWizardForm, true, this.componentConfig);

	public async isNext(): Promise<void> {
		switch (this.initCreateContractData.mode) {
			case ProcurementCreateContractMode.Package: {
				await this.createContractByPackage();
				break;
			}
			case ProcurementCreateContractMode.Req: {
				await this.createContractByReq();
				break;
			}
		}
	}

	private async createContractByPackage() {
		this.createContractWizardHelperService.loadingControl(this.componentConfig, true);
		const packageCreateContractRequests: IPackageCreateContractRequest = {
			SubPackageId: this.initCreateContractData.subPackage?.Id ?? 0,
			BpFK: this.createContractWizardForm.bpFK,
			SubsidiaryFk: this.createContractWizardForm.subsidiaryFk,
			SupplierFk: this.createContractWizardForm.supplierFk,
			ContactFk: this.createContractWizardForm.contactFk,
		};
		const response = await this.http.post<number[]>('procurement/package/wizard/createcontract', packageCreateContractRequests);
		if (response && response.length > 0) {
			this.componentConfig.isLoading = false;
			const dataContract = await this.http.get<IConHeaderEntity>('procurement/contract/header/getitembyId?id=' + response[0]);
			if (dataContract) {
				await this.createContractWizardHelperService.showCreateSuccessfully(dataContract);
			} else {
				this.createContractWizardHelperService.loadingControl(this.componentConfig, false);
				await this.createContractWizardHelperService.showError();
			}
		} else {
			this.createContractWizardHelperService.loadingControl(this.componentConfig, false);
			await this.createContractWizardHelperService.showError();
		}
	}

	private async createContractByReq() {
		this.createContractWizardHelperService.loadingControl(this.componentConfig, true);
		const reqCreateContractFromReqRequest: IReqCreateContractFormReqRequest = {
			reqHeaderFk: this.initCreateContractData.reqHeader.Id,
			businessPartnerFk: this.createContractWizardForm.bpFK,
			subsidiaryFk: this.createContractWizardForm.subsidiaryFk,
			supplierFk: this.createContractWizardForm.supplierFk,
			contactFk: this.createContractWizardForm.contactFk,
			isFromVariants: false,
			//todo Variants
			// isFromVariants: !_.isNil(options.isFromVariants) ? options.isFromVariants : false,
			// variants: !_.isNil(options.variants) ? options.variants : null,
		};
		const dataContract = await this.http.post<IConHeaderEntity[]>('procurement/contract/wizard/createcontractfromreq', reqCreateContractFromReqRequest);
		if (dataContract && dataContract.length > 0) {
			await this.createContractWizardHelperService.showCreateSuccessfully(dataContract[0]);
		} else {
			this.createContractWizardHelperService.loadingControl(this.componentConfig, false);
			await this.createContractWizardHelperService.showError();
		}
	}

}
