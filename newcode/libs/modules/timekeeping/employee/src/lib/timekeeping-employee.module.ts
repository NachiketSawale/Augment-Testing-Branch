import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerModuleRoute } from '@libs/ui/container-system';
import { UiCommonModule } from '@libs/ui/common';
import { RouterModule, Routes } from '@angular/router';
import { TimekeepingEmployeeModuleInfo } from './model/timekeeping-employee-module-info.class';
import { TimekeepingEmployeeMapComponent } from './components/timekeeping-employee-map.component';
import { UiMapModule } from '@libs/ui/map';



/**
 * Adds a default route to render containers to timekeeping employee module
 */
const routes: Routes = [
	new ContainerModuleRoute(TimekeepingEmployeeModuleInfo.instance)
];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, UiMapModule],
	declarations: [TimekeepingEmployeeMapComponent],
})
export class TimekeepingEmployeeModule { }

