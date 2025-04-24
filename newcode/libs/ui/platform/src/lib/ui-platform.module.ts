import { NgModule } from '@angular/core';
import { PlatformCommonModule } from '@libs/platform/common';
import { CommonModule } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';
import { UiCommonModule } from '@libs/ui/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CompanySelectionComponent } from './components/company-selection/company-selection.component';
import { IdentityserverFailedComponent } from './components/identityserver-failed/identityserver-failed.component';
import { AuthProcessComponent } from './components/auth-process/auth-process.component';

@NgModule({
	imports: [CommonModule, PlatformCommonModule, UiCommonModule, MatCardModule, MatProgressSpinnerModule, MatInputModule, MatTreeModule, MatProgressBarModule],
	declarations: [CompanySelectionComponent, IdentityserverFailedComponent, AuthProcessComponent],
	exports: [],
})
export class UiPlatformModule {}
