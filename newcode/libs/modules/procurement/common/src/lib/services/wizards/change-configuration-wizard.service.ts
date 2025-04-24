/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IEntityIdentification, IIdentificationData } from '@libs/platform/common';
import { createLookup, FieldType, IFormDialogConfig, ILookupContext, StandardDialogButtonId } from '@libs/ui/common';
import { BasicsSharedProcurementConfigurationLookupService, BasicsShareProcurementConfigurationToBillingSchemaLookupService } from '@libs/basics/shared';
import { firstValueFrom } from 'rxjs';
import { ProcurementCommonWizardBaseService } from './procurement-common-wizard-base.service';
import { inject } from '@angular/core';
import { IChangeConfigureOptions, IChangeConfigureParams, IProcurementCommonChangeConfigWizardConfig } from '../../model/interfaces/wizard/prc-common-change-config-wizard.interface';
import { IProcurementConfigurationToBillingSchemaLookupEntity } from '@libs/basics/interfaces';

export class ProcurementCommonChangeConfigurationWizardService<T extends IEntityIdentification, U extends CompleteIdentification<T>> extends ProcurementCommonWizardBaseService<T, U, IChangeConfigureOptions> {
	private readonly configLookupService = inject(BasicsSharedProcurementConfigurationLookupService);
	private headerText: string | undefined;

	public constructor(protected override readonly config: IProcurementCommonChangeConfigWizardConfig<T, U>) {
		super(config);
	}

	protected override async getFormDialogConfig(): Promise<IFormDialogConfig<IChangeConfigureOptions>> {
		const selEntity = this.config.rootDataService.getSelectedEntity();
		if (selEntity) {
			return {
				id: 'change-configuration-dialog',
				headerText: {
					text: this.getHeaderText(),
				},
				entity: {
					PrcConfigurationFk: this.config.getConfigurationFK(selEntity),
					BillingSchemaFk: this.config.getBillingSchemaFk ? this.config.getBillingSchemaFk(selEntity) : undefined,
				},
				formConfiguration: {
					formId: 'change-configuration-dialog',
					showGrouping: false,
					rows: [
						{
							id: 'prcConfigurationFk',
							model: 'PrcConfigurationFk',
							type: FieldType.Lookup,
							required: true,
							lookupOptions: createLookup({
								dataService: this.configLookupService,
								serverSideFilter: {
									key: 'dialog-prc-common-configuration-filter',
									execute: () => {
										return 'RubricFk=' + this.config.rubricFk;
									},
								},
							}),
							label: {
								key: 'procurement.common.wizard.change.configuration.name',
							},
							change: (e) => {
								if (this.config.showBillingSchema) {
									this.http.get$<IEntityIdentification[]>(`procurement/common/configuration/defaultbillingschemas?configurationFk=${e.newValue}`).subscribe((defaultBillingSchemas) => {
										if (defaultBillingSchemas && defaultBillingSchemas.length > 0) {
											if (!defaultBillingSchemas.find((bs) => bs.Id === e.entity.BillingSchemaFk)) {
												e.entity.BillingSchemaFk = defaultBillingSchemas[0].Id;
											}
										} else {
											e.entity.BillingSchemaFk = undefined;
										}
									});
								}
							},
						},
						{
							id: 'billingSchemaFk',
							model: 'BillingSchemaFk',
							type: FieldType.Lookup,
							required: true,
							lookupOptions: createLookup({
								dataServiceToken: BasicsShareProcurementConfigurationToBillingSchemaLookupService,
								serverSideFilter: {
									key: 'dialog-prc-common-billing-schema-filter',
									execute: async (context: ILookupContext<IProcurementConfigurationToBillingSchemaLookupEntity, IChangeConfigureOptions>) => {
										const config = await firstValueFrom(this.configLookupService.getItemByKey(<IIdentificationData>{ id: context?.entity?.PrcConfigurationFk }));
										return 'PrcConfigHeaderFk=' + config.PrcConfigHeaderFk;
									},
								},
							}),
							visible: this.config.showBillingSchema,
							label: {
								key: 'cloud.common.entityBillingSchema',
							},
						},
					],
				},
				customButtons: [],
				//TODO: config the Ok button after DEV-8960 is done.
				//TODO: currently it is not possible for form dialog to disable\enable the OK button.
				// Need to disable OK button if there is nothing changed for configuration.
			};
		}
		throw new Error('Should have selected entity');
	}

	protected override async doExecuteWizard(opt: IChangeConfigureOptions) {
		if (this.config.isUpdateHeaderTexts) {
			const questionResult = await this.messageBoxService.showYesNoDialog(this.translateService.instant('procurement.common.overrideHeaderNItemTextQuestion').text, this.getHeaderText());

			if (questionResult?.closingButtonId === StandardDialogButtonId.Yes) {
				return this.ChangeConfiguration(opt.PrcConfigurationFk, opt.BillingSchemaFk);
			}
		} else {
			return this.ChangeConfiguration(opt.PrcConfigurationFk, opt.BillingSchemaFk);
		}

		return false;
	}

	private async ChangeConfiguration(configurationFk?: number, billingSchemaFk?: number) {
		if (!configurationFk) {
			throw new Error('configurationFk should have value');
		}
		const selEntity = this.config.rootDataService.getSelectedEntity() as T;
		if (selEntity) {
			await this.config.rootDataService.update(selEntity);
			const params: IChangeConfigureParams = {
				MainItemId: selEntity.Id,
				PrcConfigurationFk: configurationFk,
				BillingSchemaFk: billingSchemaFk,
				Qualifier: this.config.moduleInternalName,
			};

			this.wizardUtilService.showLoadingDialog(this.getHeaderText());
			const resp = await this.http.post<{ IsSuccess: boolean }>('procurement/common/configuration/change', params);
			this.wizardUtilService.closeLoadingDialog();
			return resp.IsSuccess;
		}

		return false;
	}

	private getHeaderText() {
		if (!this.headerText) {
			this.headerText = this.translateService.instant('procurement.common.wizard.change.configuration.headerText', { code: this.translateService.instant(this.config.moduleNameTranslationKey).text }).text;
		}
		return this.headerText;
	}
}
