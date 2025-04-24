/*
 * Copyright(c) RIB Software GmbH
 */

import { Dictionary, IInitializationContext } from '@libs/platform/common';
import { ChangeBusinessPartnerStatusService } from '../../services/wizards/change-businesspartner-status.service';
import { ChangeSubsidiaryStatusService } from '../../services/wizards/change-subsidiary-status.service';
//import { ChangeBusinessPartnerCodeService } from '../../services/wizards/change-businesspartner-code.service';
import { CheckVatNoService } from '../../services/wizards/check-vat-no.service';
import { ImportBusinessPartnerContactsService } from '../../services/wizards/import-businesspartner-contacts.service';
import { UpdatePrcStructureFromQtnContractService } from '../../services/wizards/update-prc-structure-from-qtn-contract.service';
import { CreateRequestsService } from '../../services/wizards/create-requests.service';
import { ConvertAddressToGeoCoordinateService } from '../../services/wizards/convert-address-to-geo-coordinate.service';
import { BusinesspartnerMainBeserveService } from '../../services/wizards/beserve.service';
import { ChangeBusinessPartnerStatus2Service } from '../../services/wizards/change-businesspartner-status2.service';
import { ChangeSupplierStatusService } from '../../services/wizards/change-supplier-status.service';
import { ChangeCustomerStatusService } from '../../services/wizards/change-customer-status.service';
import { ChangeBankStatusService } from '../../services/wizards/change-bank-status.service';
import { ChangeEvaluationStatusService } from '../../services/wizards/change-evaluation-status.service';
import { ContactsToExchangeService } from '../../services/wizards/contacts-to-exchange.service';
import { BasicsSharedChangeCodeDialogService, BasicsSharedCharacteristicBulkEditorService, ICharacteristicBulkEditorOptions } from '@libs/basics/shared';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BusinesspartnerMainHeaderDataService } from '../../services/businesspartner-data.service';
import { BusinesspartnerMainCustomerDataService } from '../../services/customer-data.service';
import { CustomerValidationService } from '../../services/validations/customer-validation.service';
import { SupplierValidationService } from '../../services/validations/supplier-validation.service';
import { SupplierDataService } from '../../services/suppiler-data.service';
import { IBusinessPartnerEntity, ICustomerEntity, ISupplierEntity } from '@libs/businesspartner/interfaces';
import { BusinesspartnerMainHeaderValidationService } from '../../services/validations/businesspartner-validation.service';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { ImportBusinesspartnerService } from '../../services/wizards/import-businesspartner.service';
import { BpMainInvitePortalBiddersViaMailWizardService } from '../../services/wizards/bp-main-invite-portal-bidders-via-mail-wizard.service';

export class BusinesspartnerMainWizard {
	public changeBusinessPartnerStatus(context: IInitializationContext) {
		const service = context.injector.get(ChangeBusinessPartnerStatusService);
		service.onStartChangeStatusWizard();
	}

	public changeSubsidiaryStatus(context: IInitializationContext) {
		const service = context.injector.get(ChangeSubsidiaryStatusService);
		service.onStartChangeStatusWizard();
	}

	public async changeBpCode(context: IInitializationContext) {
		//context.injector.get(ChangeBusinessPartnerCodeService).changeBpCode();
		const changeCodeDialogService = context.injector.get(BasicsSharedChangeCodeDialogService<IBusinessPartnerEntity>);

		const bpDataSvc = context.injector.get(BusinesspartnerMainHeaderDataService);
		const messageBoxService = context.injector.get(UiCommonMessageBoxService);
		const options = changeCodeDialogService
			.createDefaultOptions(
				bpDataSvc,
				context.injector.get(BusinesspartnerMainHeaderValidationService),
				bpDataSvc,
				'businesspartner.main.changeBpCode.Title');

		options.preShowDialogFn = () => {
			let result = true;
			if (!bpDataSvc.getSelectedEntity()) {
				result = false;
				messageBoxService.showMsgBox('Business Partner record must be selected first!', 'businesspartner.main.changeBpCode.title', 'ico-warning');

			} else {
				if (!bpDataSvc.getSelectedEntity()?.RubricCategoryFk) {
					result = false;
					messageBoxService.showMsgBox('businesspartner.main.changeBpCode.noRubricCategory', 'businesspartner.main.changeBpCode.title', 'ico-warning');
				}
			}

			return result;
		};

		await changeCodeDialogService.show(options);
	}

	public checkVatNo(context: IInitializationContext) {
		context.injector.get(CheckVatNoService).checkVatNo();
	}

	public importBusinesspartner(context: IInitializationContext) {
		context.injector.get(ImportBusinesspartnerService).importBusinessPartner();
	}

	public importBusinessPartnerContacts(context: IInitializationContext) {
		context.injector.get(ImportBusinessPartnerContactsService).importBusinessPartnerContacts();
	}

	public updatePrcStructureFromQtnContractService(context: IInitializationContext) {
		const srv = context.injector.get(UpdatePrcStructureFromQtnContractService);
		srv.onUpdatePrcStructureFromQtnAndContract();
	}

	public createRequests(context: IInitializationContext) {
		context.injector.get(CreateRequestsService).createRequests();
	}

	public beserveCreateBusinessPartner(context: IInitializationContext) {
		context.injector.get(BusinesspartnerMainBeserveService).showAddDialog();
	}

	public convertAddressToGeoCoordinate(context: IInitializationContext) {
		context.injector.get(ConvertAddressToGeoCoordinateService).onConvertAddressToGeoCoordinate();
	}

	public contactsToExchange(context: IInitializationContext) {
		context.injector.get(ContactsToExchangeService).onContactsToExchange();
	}

	public changeCustomerStatus(context: IInitializationContext) {
		context.injector.get(ChangeCustomerStatusService).onStartChangeStatusWizard();
	}

	public changeBpdBankStatus(context: IInitializationContext) {
		context.injector.get(ChangeBankStatusService).onStartChangeStatusWizard();
	}

	public beserveUpdateSingleSelectionBP(context: IInitializationContext) {
		context.injector.get(BusinesspartnerMainBeserveService).showUpdateSingleSelectionDialog();
	}

	public beserveUpdateAllBP(context: IInitializationContext) {
		context.injector.get(BusinesspartnerMainBeserveService).showUpdateAllDialog();
	}

	public changeSupplierStatus(context: IInitializationContext) {
		context.injector.get(ChangeSupplierStatusService).onStartChangeStatusWizard();
	}

	public changeBusinessPartnerStatus2(context: IInitializationContext) {
		const service = context.injector.get(ChangeBusinessPartnerStatus2Service);
		service.onStartChangeStatusWizard();
	}

	public changeEvaluationStatus(context: IInitializationContext) {
		context.injector.get(ChangeEvaluationStatusService).onStartChangeStatusWizard();
	}

	public inviteSelectedBidder(context: IInitializationContext, wizardParameters?: Dictionary<string, unknown>) {
		context.injector.get(BpMainInvitePortalBiddersViaMailWizardService).bPMainInviteSelectedPortalBidders(wizardParameters);
	}

	public characteristicBulkEditor(context: IInitializationContext) {
		const options: ICharacteristicBulkEditorOptions = {
			initContext: context,
			moduleName: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName,
			sectionId: BasicsCharacteristicSection.BusinessPartnerCharacteristic,
			afterCharacteristicsApplied: () => {
				const dataService = context.injector.get(BusinesspartnerMainHeaderDataService);
				dataService.refreshSelected().then();
			},
		};
		context.injector.get(BasicsSharedCharacteristicBulkEditorService).showEditor(options).then();
	}

	public async changeCustomerCodeService(context: IInitializationContext) {

		const changeCodeDialogService = context.injector.get(BasicsSharedChangeCodeDialogService<ICustomerEntity>);

		const options = changeCodeDialogService
			.createDefaultOptions(
				context.injector.get(BusinesspartnerMainCustomerDataService),
				context.injector.get(CustomerValidationService),
				context.injector.get(BusinesspartnerMainHeaderDataService),
				'businesspartner.main.changeCode.customerTitle',
				'businesspartner.main.changeCode.selectAtLeastOneCustomer',
				'businesspartner.main.entityDebtorCode');

		await changeCodeDialogService.show(options);
	}

	public async changeSupplierCodeService(context: IInitializationContext) {

		const changeCodeDialogService = context.injector.get(BasicsSharedChangeCodeDialogService<ISupplierEntity>);

		const options = changeCodeDialogService
			.createDefaultOptions(
				context.injector.get(SupplierDataService),
				context.injector.get(SupplierValidationService),
				context.injector.get(BusinesspartnerMainHeaderDataService),
				'businesspartner.main.changeCode.supplierTitle',
				'businesspartner.main.changeCode.selectAtLeastOneSupplier',
				'businesspartner.main.entityCreditorCode');

		await changeCodeDialogService.show(options);
	}
}