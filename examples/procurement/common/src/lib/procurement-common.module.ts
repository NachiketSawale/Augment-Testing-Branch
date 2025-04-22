import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent, UiCommonModule } from '@libs/ui/common';
import { FormsModule } from '@angular/forms';
import { PlatformCommonModule } from '@libs/platform/common';
import { UpdateItemPriceScopeOptionComponent } from './components/update-item-price/update-item-price-scope-option/update-item-price-scope-option.component';
import { UpdateItemPriceUpdateConditionComponent } from './components/update-item-price/update-item-price-update-condition/update-item-price-update-condition.component';
import { PROCUREMENT_COMMON_PAYMENT_SCHEDULE_LAYOUT_TOKEN, ProcurementCommonPaymentScheduleLayoutService } from './services';
import { ProcurementCommonPaymentScheduleHeaderComponent } from './components/payment-schedule-header/payment-schedule-header.component';
import { ReplaceNeutralMaterialBasicOptionComponent } from './components/replace-neutral-material/replace-neutral-material-basic-option/replace-neutral-material-basic-option.component';
import { ReplaceNeutralMaterialReplaceItemComponent } from './components/replace-neutral-material/replace-neutral-material-replace-item/replace-neutral-material-replace-item.component';
import { ProcurementCommonPaymentScheduleCreateTargetComponent } from './components/payment-schedule-create-target/payment-schedule-create-target.component';
import { ProcurementCommonPaymentScheduleTotalSourceComponent } from './components/payment-schedule-total-source/payment-schedule-total-source.component';
import { ProcurementCommonMaintainPaymentScheduleVersionComponent } from './components/maintain-payment-schedule-version/maintain-payment-schedule-version.component';
import { ProcurementCommonGeneratePaymentScheduleComponent } from './components/generate-payment-schedule/procurement-common-generate-payment-schedule.component';
import { ProcurementCommonSpecifyCurrencyComponent } from './components/specify-currency/specify-currency.component';
import { ProcurementCommonCreateContractDialogComponent } from './components/create-contract/create-contract-dialog.component';
import { ProcurementPackageCreateContractChangeOrderComponent } from './components/create-contract-change-order/create-contract-change-order.component';

@NgModule({
	imports: [CommonModule, UiCommonModule, FormsModule, PlatformCommonModule, GridComponent],
	declarations: [
		ProcurementCommonCreateContractDialogComponent,
		ProcurementPackageCreateContractChangeOrderComponent,
		UpdateItemPriceScopeOptionComponent,
		UpdateItemPriceUpdateConditionComponent,
		ProcurementCommonPaymentScheduleHeaderComponent,
		ReplaceNeutralMaterialBasicOptionComponent,
		ReplaceNeutralMaterialReplaceItemComponent,
		ProcurementCommonPaymentScheduleCreateTargetComponent,
		ProcurementCommonPaymentScheduleTotalSourceComponent,
		ProcurementCommonMaintainPaymentScheduleVersionComponent,
		ProcurementCommonGeneratePaymentScheduleComponent,
		ProcurementCommonSpecifyCurrencyComponent,
	],
	providers: [{ provide: PROCUREMENT_COMMON_PAYMENT_SCHEDULE_LAYOUT_TOKEN, useExisting: ProcurementCommonPaymentScheduleLayoutService }],
})
export class ProcurementCommonModule {}
