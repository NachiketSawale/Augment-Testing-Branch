import { inject, Injectable } from '@angular/core';
import { isEmpty } from 'lodash';
import {
	ICustomDialogOptions,
	StandardDialogButtonId,
	UiCommonDialogService,
	UiCommonMessageBoxService
} from '@libs/ui/common';
import {
	AssignValuesForAttributesWizardDialogComponent,
} from '../../components/assign-values-for-attributes-wizard-dialog/assign-values-for-attributes-wizard-dialog.component';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import {
	COS_ASSIGN_VALUES_FOR_ATTRUBUTES_OPTION_TOKEN, ICosAssignValuesForAttrubutesOption
} from '../../model/entities/token/cos-assign-values-for-attrubutes-option.interface';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainBulkAssignmentWizardService {
	private readonly dialogService = inject(UiCommonDialogService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected readonly translateService = inject(PlatformTranslateService);
	//todo remove to public folder: private readonly modelMainPropertyService = inject(ModelMainPropertyDataService);
	private readonly http = inject(PlatformHttpService);
	public async runWizard() {
		//todo var selModelId = modelViewerModelSelectionService.getSelectedModelId();
		const selModelId = true;
		if(selModelId) {
			const settings: ICosAssignValuesForAttrubutesOption = {
				Values: [],
				OverwriteValues: true,
				ObjectIds: [],
			};
			const options: ICustomDialogOptions<StandardDialogButtonId,AssignValuesForAttributesWizardDialogComponent> = {
				headerText: {key: 'model.main.propKeysBulkAssignment.title', text: 'Assign Values for Property Keys'},
				width: '60%',
				bodyComponent: AssignValuesForAttributesWizardDialogComponent,
				id: 'constructionSystemMainBulkAssignmentWizard',
				bodyProviders: [
					{
						provide: COS_ASSIGN_VALUES_FOR_ATTRUBUTES_OPTION_TOKEN,
						useValue: settings
					}
				]
			};
			const result = await this.dialogService.show(options);
			if(result?.closingButtonId === StandardDialogButtonId.Ok) {
				settings.Values.forEach((v) => {
					// modelMainPropertyDataService.getAllValueTypes().forEach(function (vt) {
					// 	if (v.valueType !== vt) {
					// 		delete v[modelMainPropertyDataService.valueTypeToPropName(vt)];
					// 	}
					// });
					//
					// delete v.id;
					// delete v.Value;
					// //delete v.valueType;
					// delete v.__rt$data;
				});

				// settings.Values = _.filter(settings.Values, function (v) {
				// 	return _.some(modelMainPropertyDataService.getAllValueTypes(), function (vt) {
				// 		if (v.valueType === vt){
				// 			return true;
				// 		}
				// 	});
				// });
				if (!isEmpty(settings.Values)) {
					this.messageBoxService.showErrorDialog(this.translateService.instant('model.main.propKeysBulkAssignment.noPropsDesc'));
					return false;
				}
				// settings.ObjectIds = settings.ObjectIds.useGlobalModelIds().toCompressedString();
				await this.http.post('model/main/object/assignpropvalues', settings);// return type: bulk-assign-properties-result-entity.interface.ts
				//todo logic need be achieved. model-main-propkeys-bulk-assignment-wizard-service.js in frontend.ngjs
			}
			return false;
		} else {
			this.messageBoxService.showMsgBox(this.translateService.instant('model.main.noModelSelected').text, this.translateService.instant('model.main.propKeysBulkAssignment.cannotAssign').text, 'ico-info');
			return false;
		}

	}
}