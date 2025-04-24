import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import {
	FieldType,
	IEditorDialogResult,
	IFormConfig,
	StandardDialogButtonId,
	UiCommonFormDialogService
} from '@libs/ui/common';
import { PpsAccountingResultDataService } from './pps-accounting-result-data.service';
import { first } from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class PpsAccountingCheckingFormulaDialogService {
	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);
	private formDialogService: UiCommonFormDialogService;

	public constructor(private resultService: PpsAccountingResultDataService) {
		this.formDialogService = inject(UiCommonFormDialogService);
	}

	public async openDialog(formula: string) {
		await this.formDialogService.showDialog<IFormulaCheckEntity>({
			id: 'checkingDialog',
			headerText: { key: 'productionplanning.accounting.rule.testTitle' },
			formConfiguration: this.dialogFormConfig,
			entity: this.initEntity(formula),
			runtime: undefined,
			customButtons: [{
				id: 'execute',
				caption: { key: 'productionplanning.accounting.result.executeBtn' },
				isVisible: () => {
					return true;
				},
				isDisabled: (info) => {
					return false;
				},
				fn: (event, info) => {
					const entity = info.dialog.value!;
					entity.Output = this.executeFormula(entity);
				}
			},],
			topDescription: '',
			width: '800px',
			maxHeight: '600px'
		})?.then(result => {
			if (result?.closingButtonId === StandardDialogButtonId.Ok) {
				this.handleOk(result);
			} else {
				this.handleCancel(result);
			}
		});
	}

	private dialogFormConfig: IFormConfig<IFormulaCheckEntity> = {
		formId: 'checking-dialog-form',
		showGrouping: false,
		rows: [{
			id: 'formula',
			label: {
				key: 'productionplanning.accounting.result.quantityFormula',
			},
			type: FieldType.Description,
			//type: FieldType.Test,
			model: 'Formula',
		}, {
			id: 'value',
			label: {
				key: 'productionplanning.accounting.result.inputValue',
			},
			type: FieldType.Description,
			model: 'Value',
		}, {
			id: 'output',
			label: {
				key: 'productionplanning.accounting.result.output',
			},
			type: FieldType.Description,
			model: 'Output',
			readonly: true,
		}],
	};

	private initEntity(formula: string) {
		return {
			Formula: formula,
			Value: '',
			Output: ''
		};
	}

	private handleOk(result: IEditorDialogResult<IFormulaCheckEntity>) {
		const updatedResult = first(this.resultService.getSelection());
		if (updatedResult && result.value) {
			updatedResult.QuantityFormula = result.value.Formula;
			this.resultService.updateEntities([updatedResult]);
		}
	}

	private handleCancel(result: IEditorDialogResult<IFormulaCheckEntity>) {

	}

	private executeFormula(entity: IFormulaCheckEntity) {
		const script = this.generateScript(entity.Formula, entity.Value);
			return eval(script);
	}

	private generateScript(formula: string, value: string): string {
		let script = '';
		script += 'let value = ' + value + ';\n';
		script += formula;
		return  '(function(){\n' + script + '\n})();';
	}
}


export interface IFormulaCheckEntity {
	Formula: string;
	Value: string;
	Output: string;
}