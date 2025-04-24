import { inject, Injectable } from '@angular/core';
import { EstimateBaseConfigDialogService, EstimateMainDialogUiService } from '@libs/estimate/shared';
import { IEstimateMainConfigComplete } from '@libs/estimate/interfaces';

/**
 * ConstructionSystemMainConfigService use for construction system estimate config dialog
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainEstimateConfigService extends EstimateBaseConfigDialogService {
	private readonly estimateMainDialogUiService = inject(EstimateMainDialogUiService);
	private entity: IEstimateMainConfigComplete | null = null;

	public async showDialog() {
		let headerItem = this.estimateMainContextService.getSelectedEstHeaderItem();
		if (!headerItem) {
			headerItem = await this.loadHeaderData();
		}
		await this.loadCurrentItem(headerItem);
		this.entity = {} as IEstimateMainConfigComplete;
		const dialogConfig = this.estimateMainDialogUiService.getFormConfig(); ///todo should remove additional row
		await this.showConfigDialog<IEstimateMainConfigComplete>({
			id: 'estConfigDialog',
			headerText: {
				key: 'constructionsystem.main.column.title',
			},
			formConfiguration: dialogConfig,
			entity: this.entity,
			width: '950',
			height: '750px',
		});
		// in original logic,update function is not working ???
		// if (result && result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
		// 	this.provideUpdateData(this.completeData!);
		// 	this.update(this.completeData!);
		// }
	}
}
