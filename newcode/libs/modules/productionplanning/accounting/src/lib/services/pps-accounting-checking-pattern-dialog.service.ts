import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import {
	FieldType,
	IAdditionalLookupOptions, IEditorDialogResult,
	IFormConfig,
	StandardDialogButtonId,
	UiCommonFormDialogService
} from '@libs/ui/common';
import { IRuleEntity } from '../model/entities/rule-entity.interface';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { PpsAccountingRuleDataService } from './pps-accounting-rule-data.service';
import { first } from 'lodash';
import { ValidationResult } from '@libs/platform/data-access';

@Injectable({
	providedIn: 'root'
})
export class PpsAccountingCheckingPatternDialogService {
	private http = inject(HttpClient);
	private configurationService = inject(PlatformConfigurationService);
	private formDialogService: UiCommonFormDialogService;

	public constructor(private ruleService: PpsAccountingRuleDataService) {
		this.formDialogService = inject(UiCommonFormDialogService);
	}

	public async openCheckingDialog(formEntity: IRuleEntity) {
		await this.formDialogService.showDialog<IRuleEntity>({
			id: 'checkingDialog',
			headerText: { key: 'productionplanning.accounting.rule.testTitle' },
			formConfiguration: this.checkingDialogFormConfig,
			entity: formEntity,
			runtime: undefined,
			customButtons: [
				{
					id: 'test',
					caption: { key: 'productionplanning.accounting.rule.testBtn' },
					isVisible: () => {
						return true;
					},
					isDisabled: (info) => {
						return false;
					},
					fn: (event, info) => {
						const rule = info.dialog.value!;
						this.handleTest(rule);
					}
				},
			],
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

	private RuleTypeConfig = BasicsSharedLookupOverloadProvider.provideEngineeringAccountingRuleTypeReadonlyLookupOverload();
	private ImportFormatConfig = BasicsSharedLookupOverloadProvider.provideEngineeringAccountingRuleImportFormatReadonlyLookupOverload();

	private checkingDialogFormConfig: IFormConfig<IRuleEntity> = {
		formId: 'checking-dialog-form',
		showGrouping: false,
		rows: [{
			id: 'ruleTypeFk',
			label: {
				key: 'productionplanning.accounting.rule.ruleTypeFk', text: '*Rule Type'
			},
			type: FieldType.Lookup,
			model: 'RuleTypeFk',
			readonly: true,
			lookupOptions: (this.RuleTypeConfig as IAdditionalLookupOptions<IRuleEntity>).lookupOptions,
		}, {
			id: 'importFormatFk',
			label: {
				key: 'productionplanning.accounting.rule.importFormatFk', text: '*Import Format'
			},
			type: FieldType.Lookup,
			model: 'ImportFormatFk',
			readonly: true,
			lookupOptions: (this.ImportFormatConfig as IAdditionalLookupOptions<IRuleEntity>).lookupOptions,
		}, {
			id: 'matchPattern',
			label: {
				key: 'productionplanning.accounting.rule.matchPattern',
			},
			type: FieldType.Description,
			model: 'MatchPattern',
		}, {
			id: 'testField',
			label: {
				key: 'productionplanning.accounting.rule.testField',
			},
			type: FieldType.Description,
			model: 'TestField',
		}
		],
	};

	private handleOk(result: IEditorDialogResult<IRuleEntity>) {
		const updatedRule = first(this.ruleService.getSelection());
		if (updatedRule && result.value) {
			updatedRule.MatchPattern = result.value.MatchPattern;
			this.ruleService.updateEntities([updatedRule]);
		}
	}

	private handleCancel(result: IEditorDialogResult<IRuleEntity>) {
	}

	private handleTest(ruleInfo: IRuleEntity) {
		const value = ruleInfo.TestField!;
		//const model = 'TestField';
		this.validateTestField(ruleInfo, value).then((result) => {
			//platformRuntimeDataService.applyValidationResult(result, entity, model);
			window.alert(result.error!);
		});
	}

	private validateTestField(entity: IRuleEntity, value: string | null): Promise<ValidationResult> {
		return new Promise((resolve) => {
			this.http.post(this.configurationService.webApiBaseUrl + 'productionplanning/accounting/rule/testrule', {
					Rule: entity,
					Value: value
				}
			).subscribe((response) => {
				const res: ValidationResult = {
					apply: true,
					valid: response as boolean,
					error: response ? 'Success!' : 'Failed: *Test does not match expression!',
					//error$tr$: 'productionplanning.accounting.rule.testError'
				};
				resolve(res);
			});
		});
	}
}