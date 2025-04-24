import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { getProjectPriceListToken } from '../../services/update-costcodes-price-form-wizard/project-cost-codes-wizard-configuration.service';
import { ProjectCostCodesPriceListForJobComponent } from '../project-costcodes-price-list-for-job/project-costcodes-price-list-for-job.component';
import { ProjectCostcodesPriceListRecordComponent } from '../project-costcodes-price-list-record/project-costcodes-price-list-record.component';
import { StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';
import { ProjectMainDataService } from '@libs/project/shared';
import { IProjectEntity } from '@libs/project/interfaces';
import { PlatformCommonModule } from '@libs/platform/common';
@Component({
    selector: 'project-costcodes-project-price-list-component',
    standalone: true,
    templateUrl: './project-costcodea-price-for-job.component.html',
    imports: [ProjectCostCodesPriceListForJobComponent, ProjectCostcodesPriceListRecordComponent, PlatformCommonModule]
})
export class ProjectPriceListComponentComponent implements OnInit {
	private readonly dialogData = inject(getProjectPriceListToken());
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly projectMainService = inject(ProjectMainDataService);

	@ViewChild('costcodeforjob')
	public costcodeforjob!: ProjectCostCodesPriceListForJobComponent;

	@ViewChild('costcodeforprice')
	public costcodeforprice!: ProjectCostcodesPriceListRecordComponent;

	public ngOnInit() {
		if (this.dialogData[0].id === 'UpdateBaseAll') {
			this.dialogData[0].fn = () => {
				this.updateAllWithBase();
			};
			this.dialogData[1].fn = () => {
				this.ok();
			};
		}

		// TODO basicsLookupdataLookupDescriptorService.updateData('costcodepriceversion', dataService.additionalPriceVersions);
	}	

	private ok() {
		// TODO projectMainUpdatePricesWizardCommonService
		// const selectPrj = projectMainUpdatePricesWizardCommonService.getProject();
		// const usingInSummary = projectMainUpdatePricesWizardCommonService.isUsingInEstimateResourceSummary();
		// this.showSuccess(selectPrj);
		// this.showFailed();
		// this.costcodeforjob.updatePrice().then((result) => {
		// 	if (result === true) {
		// 		if (!usingInSummary) {
		// 			this.showSuccess();
		// 		} else if (usingInSummary) {
		// 			projectMainUpdatePricesWizardCommonService.onResultGridDataSet.fire();
		// 		}
		// 	} else {
		// 		this.showFailed();
		// 	}
		// });
	}

	private showSuccess(selectPrj: IProjectEntity) {
		this.messageBoxService.showMsgBox(this.translateService.instant({ key: 'project.main.updateCostCodesPricesSuccess' }).text, this.translateService.instant({ key: 'estimate.main.warning' }).text, 'ico-info')?.then((response) => {
			if (response.closingButtonId === StandardDialogButtonId.Ok) {
				this.projectMainService.deselect();
				this.projectMainService.setModified(selectPrj);
				// let gridId = '713B7D2A532B43948197621BA89AD67A';
				// platformGridAPI.rows.scrollIntoViewByItem(gridId, selectPrj);
			}
		});
	}

	private showFailed() {
		this.messageBoxService.showMsgBox(this.translateService.instant({ key: 'project.main.updateCostCodesPricesFailed' }).text, this.translateService.instant({ key: 'project.main.updateCostCodesPricesTitle' }).text, 'ico-info');
	}

	private updateAllWithBase() {
		this.costcodeforjob.setAllBaseSelected();
	}
}
