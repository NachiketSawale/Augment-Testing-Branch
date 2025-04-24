/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IReadOnlyField, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { RfqBidderSettings } from '../types/rfq-bidder-settings.type';
import { GenericWizardConfigService } from '../../../services/base/generic-wizard-config.service';
import { RfqBidderWizardContainers } from '../enum/rfq-bidder-containers.enum';
import { Translatable } from '@libs/platform/common';
import { GenericWizardValidationService } from '../../../services/base/generic-wizard-validation.service';
import { IRules, ISettingRules } from '../../../models/interface/generic-wizard-setting-rules.interface';
import { RfqBidderWizardConfig } from '../types/rfq-bidder-wizard-config.type';

@Injectable({
	providedIn: 'root'
})
export class RfqBidderSettingsValidationService extends BaseValidationService<RfqBidderSettings> {
	private readonly configService = inject(GenericWizardConfigService);
	private readonly validationService = inject(GenericWizardValidationService);

	private readonly containerUuid = RfqBidderWizardContainers.RFQ_BIDDER_SETTINGS;

	private readonly rules: ISettingRules = {
		DisableDataFormatExport: {
			ToDisable: ['DisableZipping', 'LinkAndAttachment', 'GenerateSafeLink', 'FileNameFromDescription', 'UseAccessTokenForSafeLink']
		},
		DisableZipping: {
			ToDisable: ['GenerateSafeLink', 'LinkAndAttachment']
		},
		LinkAndAttachment: {
			ToDisable: ['DisableZipping'], ToEnable: ['GenerateSafeLink']
		},
		GenerateSafeLink: {
			ToDisable: ['DisableZipping'], SetReadonlyWhenFalse: ['SafeLinkLifetime']
		},
		UseAccessTokenForSafeLink: {
			ToEnable: ['GenerateSafeLink']
		}
	};

	protected override generateValidationFunctions(): IValidationFunctions<RfqBidderSettings> {
		return {
			SendWithOwnMailAddress: [this.validateSendWithOwnMailAddress],
			DisableDataFormatExport: this.validateSettings,
			DisableZipping: this.validateSettings,
			LinkAndAttachment: this.validateSettings,
			GenerateSafeLink: this.validateSettings,
			UseAccessTokenForSafeLink: this.validateSettings
		};
	}

	protected override getEntityRuntimeData(): IEntityRuntimeDataRegistry<RfqBidderSettings> {
		return this.configService.getService(RfqBidderWizardContainers.RFQ_BIDDER_SETTINGS);
	}

	private validateSendWithOwnMailAddress(info: ValidationInfo<RfqBidderSettings>): ValidationResult {
		const wizardConfig = this.configService.getWizardConfig() as RfqBidderWizardConfig;
		const startingClerk = wizardConfig.startingClerk;

		const errors: Translatable[] = [];

		const validationResult: ValidationResult = {
			valid: true
		};

		if (startingClerk && !startingClerk.Email && info.value) {
			validationResult.valid = false;
			errors.push({key: 'procurement.rfq.rfqBidderWizard.noClerkEmailErrorText'});
		}

		//Used to show values above container in the generic wizard
		this.validationService.updateOrAdd(this.containerUuid, 'SendWithOwnMailAddress', errors);
		return validationResult;
	}

	private validateSettings(info: ValidationInfo<RfqBidderSettings>) {
		const validationResult: ValidationResult = {
			valid: true
		};

		this.changeSettings(info, this.rules[info.field as keyof ISettingRules]);

		return validationResult;
	}

	private changeSettings(info: ValidationInfo<RfqBidderSettings>, fieldRules: IRules) {
		const readOnlyFields: IReadOnlyField<RfqBidderSettings>[] = [];

		if (fieldRules.ToEnable){
			fieldRules.ToEnable.forEach(rule => {
				info.entity[rule] = info.value as boolean;
			});
			readOnlyFields.push(...this.addReadOnlyFields(fieldRules.ToEnable, info.value as boolean));
		}

		if (fieldRules.ToDisable) {
			readOnlyFields.push(...this.addReadOnlyFields(fieldRules.ToDisable, info.value as boolean));
		}

		if(fieldRules.SetReadonlyWhenFalse){
			readOnlyFields.push(...this.addReadOnlyFields(fieldRules.SetReadonlyWhenFalse, !info.value as boolean));
		}

		this.getEntityRuntimeData().setEntityReadOnlyFields(info.entity, readOnlyFields);
	}

	private addReadOnlyFields(fields: string[], value: boolean): IReadOnlyField<RfqBidderSettings>[]{
		const readOnlyFields: IReadOnlyField<RfqBidderSettings>[] = [];
		fields.forEach(item => {
			readOnlyFields.push({
				field: item,
				readOnly: value
			});
		});
		return readOnlyFields;
	}
}