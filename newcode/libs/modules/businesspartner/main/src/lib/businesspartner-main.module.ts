import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { BusinesspartnerMainModuleInfo } from './model/businesspartner-main-module-info.class';
import { BusinessModuleRoute } from '@libs/ui/business-base';
import {FormsModule} from '@angular/forms';
import {BasicsSharedModule} from '@libs/basics/shared';
import {
	BusinesspartnerMainProcurementStructureSelectionDialogComponent
} from './components/procurement-structure-selection-dialog/procurement-structure-selection-dialog.component';
import {PlatformCommonModule } from '@libs/platform/common';
import {MatIconModule} from '@angular/material/icon';
import {GridComponent, UiCommonModule} from '@libs/ui/common';
import { BusinesspartnerMainSynchroniseContactsToExchangeServerComponent } from './components/synchronise-contacts-to-exchange-server/synchronise-contacts-to-exchange-server.component';
import {BusinesspartnerMainBeserveAddDialogComponent} from './components/beserve/beserve-add-dialog.component';
import {
	BusinesspartnerMainConvertAddressToGeoCoordinateComponent
} from './components/convert-address-to-geo-coordinate/convert-address-to-geo-coordinate.component';
import { UiMapModule } from '@libs/ui/map';
import { BusinesspartnerMainCustomerSatisfactionComponent } from './components/customer-satisfaction/customer-satisfaction.component';
import { ContactsToExchangeComponent } from './components/contacts-to-exchange/contacts-to-exchange.component';
import {
	BusinessPartnerRelationChartDirective
} from './directives/business-partner-relation-chart/business-partner-relation-chart.directive';
import {
	RelationChartContainerComponent
} from './components/relation-chart-container/relation-chart-container.component';
import {UiExternalModule} from '@libs/ui/external';
import { BusinesspartnerMainDiscardDuplicateDialogComponent } from './components/discard-duplicate-dialog/discard-duplicate-dialog.component';
import {MatchCodeConverterDirective} from './directives/match-code-converter/match-code-converter.directive';
import {BusinesspartnerMainMatchCodeTextComponent} from './components/match-code-text/match-code-text.component';

const routes: Routes = [new BusinessModuleRoute(BusinesspartnerMainModuleInfo.instance)];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, FormsModule, BasicsSharedModule, MatIconModule, GridComponent, PlatformCommonModule, UiMapModule, UiExternalModule],
	declarations: [
		BusinesspartnerMainProcurementStructureSelectionDialogComponent,
		BusinesspartnerMainSynchroniseContactsToExchangeServerComponent,
		ContactsToExchangeComponent,
		BusinesspartnerMainBeserveAddDialogComponent,
		BusinesspartnerMainConvertAddressToGeoCoordinateComponent,
		BusinesspartnerMainCustomerSatisfactionComponent,
		BusinessPartnerRelationChartDirective,
		RelationChartContainerComponent,
		BusinesspartnerMainDiscardDuplicateDialogComponent,
		MatchCodeConverterDirective,
		BusinesspartnerMainMatchCodeTextComponent,
	],
})
export class BusinessPartnerMainModule {}