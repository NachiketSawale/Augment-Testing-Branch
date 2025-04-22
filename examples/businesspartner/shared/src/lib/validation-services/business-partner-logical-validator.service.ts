/*
 * Copyright(c) RIB Software GmbH
 */

import { ILookupSearchRequest } from '@libs/ui/common';
import { Inject, inject, Injectable } from '@angular/core';
import { BasicsSharedDataValidationService, MainDataDto } from '@libs/basics/shared';
import { isFunction, orderBy, set } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { ISupplierLookupEntity } from '../model/entities/supplier-entity.interface';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { ISupplierCompanyEntity } from '@libs/businesspartner/interfaces';
import { BusinessPartnerContactResponse } from '../business-partner/model/business-partner-contact-response';
import { BusinesspartnerSharedSupplierLookupService } from '../lookup-services/supplier-lookup.service';
import { BusinesspartnerSharedContactLookupService } from '../lookup-services/businesspartner-contact-lookup.service';
import { BusinesspartnerSharedCustomerLookupService } from '../lookup-services/customer-lookup.service';
import { BusinesspartnerSharedSubsidiaryLookupService } from '../lookup-services/subsidiary-lookup.service';
import { BusinesspartnerSharedBankLookupService } from '../lookup-services/businesspartner-bank-lookup.service';
import {
	BUSINESS_PARTNER_VALIDATOR_OPTIONS,
	IAdditionalParameters,
	IBusinessPartner2ValidationContext,
	IBusinessPartner2ValidatorOptions as IValidatorOptions,
	IBusinessPartnerValidatorService,
	ILookupBPSearchRequest
} from '@libs/businesspartner/interfaces';
import { FieldConstants } from '../model/business-partner-logical-field-constant';
import { ValidationResult } from '@libs/platform/data-access';

@Injectable({
	providedIn: 'root'
})


export class BusinessPartnerLogicalValidatorService<T extends object> implements IBusinessPartnerValidatorService<T> {
	protected options!: IValidatorOptions<T>;
	protected currentOptions!: Required<IValidatorOptions<T>>;

	private readonly basicsValidation = inject(BasicsSharedDataValidationService);
	private readonly supplierLookupService = inject(BusinesspartnerSharedSupplierLookupService);
	private readonly contactLookupService = inject(BusinesspartnerSharedContactLookupService);
	private readonly customerLookupService = inject(BusinesspartnerSharedCustomerLookupService);
	private readonly subsidiaryLookupService = inject(BusinesspartnerSharedSubsidiaryLookupService);
	private readonly bankLookupService = inject(BusinesspartnerSharedBankLookupService);
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);


	public constructor(@Inject(BUSINESS_PARTNER_VALIDATOR_OPTIONS) options: IValidatorOptions<T>) {
		if (!options.dataService) {
			throw new Error('data service is undefined');
		}
		this.initializeOptions(options);
	}


	public async businessPartnerValidator(context: IBusinessPartner2ValidationContext<T>): Promise<ValidationResult> {
		const result = this.basicsValidation.createSuccessObject();
		if (!context.value) {
			this.updateFields(context.entity, {
				[this.currentOptions.supplierField]: null,
				[this.currentOptions.businessPartnerField]: null,
				[this.currentOptions.supplierField]: null,
				[this.currentOptions.customerField]: null,
				[this.currentOptions.contactField]: null
			});

			if (this.currentOptions.dataService.updateReadOnly) {
				this.currentOptions.dataService.updateReadOnly(context.entity, this.currentOptions.subsidiaryField, context.value, this.currentOptions.businessPartnerField);
			}
			this.refresh();
			return result;
		}

		if (context.pointedSupplierFk) {
			this.updateFields(context.entity, {
				[this.currentOptions.subsidiaryField]: context.pointedSubsidiaryFk,
				[this.currentOptions.supplierField]: context.pointedSupplierFk
			});
		} else {
			if (context.entity[this.currentOptions.businessPartnerField] !== context.value && this.currentOptions.subsidiaryFromBpDialog) {
				this.updateFields(context.entity, {[this.currentOptions.contactField]: null});
				await this.loadDefaultSubsidiary(context.entity, context.value as number, context.notNeedLoadDefaultSubsidiary as boolean);
				if (this.currentOptions.needLoadDefaultSupplier) {
					const currentSupplier = await firstValueFrom(this.supplierLookupService.getItemByKey({id: context.entity[this.currentOptions.supplierField] as number}));
					if (!currentSupplier || currentSupplier.BusinessPartnerFk !== context.value) {
						await this.loadDefaultSupplier(context.entity, context.value as number, context.entity[this.currentOptions.subsidiaryField] as number);
					}
				}
				const currentContact = await firstValueFrom(this.contactLookupService.getItemByKey({id: context.entity[this.currentOptions.contactField] as number}));
				if (!currentContact) {
					await this.setDefaultContactByBranch(context.entity, context.value, context.entity[this.currentOptions.subsidiaryField] as number);
				}

				if (this.currentOptions.needLoadDefaultCustomer) {
					this.updateFields(context.entity, {[this.currentOptions.customerField]: null});
					await this.loadDefaultCustomer(context.entity, context.value, context.entity[this.currentOptions.subsidiaryField] as number);
				}

				if (this.currentOptions.dataService.updateReadOnly) {
					this.currentOptions.dataService.updateReadOnly(context.entity, this.currentOptions.subsidiaryField, context.value, this.currentOptions.businessPartnerField);
				}
				if (context.needAttach) {
					// if supplier selected before businessPartner, we should attach  it will show in UI.
					this.attachBusinessPartner(context.value);

				} else {
					this.refresh();
				}
			}
		}
		if (this.currentOptions.subsidiaryFromBpDialog) {
			if (this.currentOptions.dataService.updateReadOnly) {
				this.currentOptions.dataService.updateReadOnly(context.entity, this.currentOptions.subsidiaryField, context.value, this.currentOptions.businessPartnerField);
			}
			this.currentOptions.subsidiaryFromBpDialog = false;
		}


		return result;
	}

	public async subsidiaryValidator(entity: T, value: number): Promise<ValidationResult> {
		const result = this.basicsValidation.createSuccessObject();
		if (!value) {
			this.updateFields(entity, {
				[this.currentOptions.subsidiaryField]: null,
				[this.currentOptions.supplierField]: null,
				[this.currentOptions.contactField]: null
			});
			this.refresh();
			return result;
		}
		if (entity[this.currentOptions.subsidiaryField] !== value) {
			await this.loadDefaultSupplier(entity, entity[this.currentOptions.businessPartnerField] as number, value);
			await this.setDefaultContactByBranch(entity, entity[this.currentOptions.businessPartnerField] as number, value);
			this.refresh();
		}

		return result;
	}

	//supplierValidator and asyncSupplierValidator =>Merge into(supplierValidator)
	public async supplierValidator(entity: T, value: number, dontSetPaymentTerm?: boolean | undefined): Promise<ValidationResult> {
		const result = this.basicsValidation.createSuccessObject();
		if (entity[this.currentOptions.supplierField] !== value) {
			if (value) {
				await this.ValidateSupplier(entity, value);
				await this.resetVatGroupAndPaymentTermBySupplier(entity, value, null, dontSetPaymentTerm);
			} else {
				this.updateFields(entity, {[this.currentOptions.supplierField]: null});
				this.refresh();

			}
		}
		return result;
	}

	public resetArgumentsToValidate(options?: IValidatorOptions<T>): void {
		this.currentOptions.businessPartnerField = options?.businessPartnerField || FieldConstants.businessPartnerField as keyof T;
		this.currentOptions.subsidiaryField = options?.subsidiaryField || FieldConstants.subsidiaryField as keyof T;
		this.currentOptions.supplierField = options?.supplierField || FieldConstants.supplierField as keyof T;
		this.currentOptions.contactField = options?.contactField || FieldConstants.contactField as keyof T;
	}

	public async GetDefaultSupplier(entity: T, value: number): Promise<void> {
		const subsidiaryValue = entity[this.currentOptions.subsidiaryField];
		if (subsidiaryValue) {
			await this.loadDefaultSubsidiary(entity, value);
			await this.loadDefaultSupplier(entity, value);
		} else {
			await this.loadDefaultSupplier(entity, value);
		}
	}

	public async resetRelatedFieldsBySupplier(entity: T, supplierFk: number, dontSetPaymentTerm: boolean | undefined): Promise<void> {
		await this.resetVatGroupAndPaymentTermBySupplier(entity, supplierFk, null, dontSetPaymentTerm);
	}

	public async loadDefaultCustomer(entity: T, businessPartnerFk: number, subsidiaryFk: number): Promise<void> {
		const searchRequest: ILookupBPSearchRequest<T> = {
			searchFields: [], searchText: '',
			additionalParameters: {
				BusinessPartnerFk: () => businessPartnerFk,
				SubsidiaryFk: () => subsidiaryFk
			}
		};
		if (this.options.customerSearchRequest) {
			const customerSearchRequest = this.options.customerSearchRequest;
			if (customerSearchRequest.filterKey) {
				searchRequest.filterKey = customerSearchRequest.filterKey;
			}
			if (customerSearchRequest.additionalParameters) {
				const additionalParameters = customerSearchRequest.additionalParameters as IAdditionalParameters<T>;
				for (const key in additionalParameters) {
					if (Object.hasOwnProperty.call(customerSearchRequest.additionalParameters, key)
						&& isFunction(additionalParameters[key])) {
						searchRequest.additionalParameters[key] = () => additionalParameters[key](entity);
					}
				}
			}
		}

		const customer = await firstValueFrom(this.customerLookupService.getSearchList(searchRequest));
		if (customer?.items?.[0]) {
			this.updateFields(entity, {[this.currentOptions.customerField]: customer.items[0].Id});
		}
	}

	public async setDefaultContactByBranch(entity: T, businessPartnerFk?: number, branchFk?: number): Promise<void> {
		if (!businessPartnerFk) {
			this.updateFields(entity, {[this.currentOptions.contactField]: null});
			return;
		}
		const response = await firstValueFrom<BusinessPartnerContactResponse>(this.http.post(this.configService.webApiBaseUrl + 'businesspartner/contact/listbybusinesspartnerid',
			{Value: businessPartnerFk, filter: ''}));

		const filterData = response?.Main;
		if (!filterData) {
			this.updateFields(entity, {[this.currentOptions.contactField]: null});
			return;
		}
		const branchContacts = branchFk ? filterData.filter(e => e.SubsidiaryFk === branchFk || e.SubsidiaryFk === null) : filterData;
		let firstContact = filterData[0];
		if (branchContacts.length > 0) {
			firstContact = branchContacts[0];
		}
		this.updateFields(entity, {[this.currentOptions.contactField]: firstContact?.Id ?? null});
		return;
	}

	public async setDefaultContact(entity: T, businessPartnerFk: number, modelFk: string) {
		if (businessPartnerFk) {
			const responseId = await firstValueFrom(this.http.get(this.configService.webApiBaseUrl + 'businesspartner/contact/getdefault', {
				params: {
					businessPartnerFk: businessPartnerFk
				}
			})) as number;
			this.updateFields(entity, {[modelFk]: responseId || null});
		}
	}

	private initializeOptions(options: IValidatorOptions<T>) {
		const defaultOptions: Required<IValidatorOptions<T>> = {
			businessPartnerField: FieldConstants.businessPartnerField as keyof T,
			customerField: FieldConstants.customerField as keyof T,
			supplierField: FieldConstants.supplierField as keyof T,
			subsidiaryField: FieldConstants.subsidiaryField as keyof T,
			contactField: FieldConstants.contactField as keyof T,
			paymentTermFiField: FieldConstants.paymentTermFiField as keyof T,
			paymentTermPaField: FieldConstants.paymentTermPaField as keyof T,
			paymentMethodField: FieldConstants.paymentMethodField as keyof T,
			vatGroupField: FieldConstants.vatGroupField as keyof T,
			businessPostingGroupField: FieldConstants.businessPostingGroupField as keyof T,
			bankField: FieldConstants.bankField as keyof T,
			originVatGroupField: FieldConstants.originVatGroupField as keyof T,
			bankTypeField: FieldConstants.bankTypeField as keyof T,
			needLoadDefaultSupplier: true,
			needLoadDefaultCustomer: false,
			subsidiaryFromBpDialog: false,
			customerSearchRequest: null,
			dataService: options.dataService!,
			validationService: options.validationService || null,
		};
		this.currentOptions = {...defaultOptions, ...options};
	}

	private async loadDefaultSubsidiary(entity: T, businessPartnerFk: number, notNeedLoadDefaultSubsidiary?: boolean) {
		if (notNeedLoadDefaultSubsidiary) {
			return;
		}

		const searchRequest: ILookupSearchRequest = {
			searchFields: [], searchText: '',
			additionalParameters: {
				BusinessPartnerFk: businessPartnerFk,
				IsMainAddress: true,
			},
			filterKey: 'businesspartner-main-subsidiary-common-filter',
			treeState: {}
		};
		const subsidiary = await firstValueFrom(this.subsidiaryLookupService.getSearchList(searchRequest));
		if (subsidiary?.items?.length > 0) {
			const firstItem = subsidiary.items[0];
			this.updateFields(entity, {[this.currentOptions.subsidiaryField]: firstItem.Id});
			this.refresh();
			//basicsLookupdataLookupDescriptorService.attachData({'subsidiary': response.items});
		}
	}

	//loadDefaultSupplier and DefaultSupplier =>Merge into(loadDefaultSupplier)
	private async loadDefaultSupplier(entity: T, businessPartnerFk: number, subsidiaryFk?: number) {
		subsidiaryFk = subsidiaryFk || entity[this.currentOptions.subsidiaryField] as number;
		const searchRequest: ILookupSearchRequest = {
			searchFields: ['Code', 'Description', 'BusinessPartnerName1'], searchText: '',
			additionalParameters: {
				SubsidiaryFk: subsidiaryFk,
				BusinessPartnerFk: businessPartnerFk
			},
			filterKey: 'businesspartner-main-supplier-common-filter',
			treeState: {}
		};

		const supplier = await firstValueFrom(this.supplierLookupService.getSearchList(searchRequest));
		const sortedSupplierList = supplier?.items?.sort((supplier1, supplier2) => supplier1.Code!.localeCompare(supplier2.Code!)) || [];
		const supplierFk = sortedSupplierList.find(e => e.Id === entity[this.currentOptions.supplierField])?.Id ||
			sortedSupplierList.find(e => e.SubsidiaryFk === subsidiaryFk)?.Id;
		this.updateFields(entity, {[this.currentOptions.supplierField]: supplierFk || null});
		await this.resetVatGroupAndPaymentTermBySupplier(entity, supplierFk, sortedSupplierList[0]);
		//basicsLookupdataLookupDescriptorService.attachData({'supplier': dataList});
	}

	private attachBusinessPartner(id: number) {
		// lookupDataService.getItemByKey('BusinessPartner', id).then(function (response) {
		//     if (!angular.isObject(response)) {
		//         return;
		//     }
		//     basicsLookupdataLookupDescriptorService.updateData('BusinessPartner', [response]);
		//
		//     refresh();
		// });
	}

	//asyncValidateSupplier rename=> ValidateSupplier
	private async ValidateSupplier(entity: T, value: number) {
		const supplier = await firstValueFrom(this.supplierLookupService.getItemByKey({id: value}));
		if (supplier) {
			const businessPartnerFk = supplier.BusinessPartnerFk;
			const businessPartnerVR = await this.businessPartnerValidator({entity, value: businessPartnerFk, needAttach: true, notNeedLoadDefaultSubsidiary: true});
			this.updateFields(entity, {[this.currentOptions.businessPartnerField]: businessPartnerFk});
			this.basicsValidation.applyValidationResult(this.currentOptions.dataService, {
				entity: entity,
				field: this.currentOptions.businessPartnerField as string,
				result: businessPartnerVR
			});

			if (this.currentOptions.dataService.updateReadOnly) {
				this.currentOptions.dataService.updateReadOnly(entity, this.currentOptions.subsidiaryField, businessPartnerFk, this.currentOptions.businessPartnerField);
			}
			if (supplier.SubsidiaryFk) {
				this.updateFields(entity, {[this.currentOptions.subsidiaryField]: supplier.SubsidiaryFk});
				this.basicsValidation.applyValidationResult(this.currentOptions.dataService, {
					entity: entity,
					field: this.currentOptions.subsidiaryField as string,
					result: businessPartnerVR
				});
			}

			if (!entity[this.currentOptions.subsidiaryField]) {
				await this.loadDefaultSubsidiary(entity, businessPartnerFk);
				this.basicsValidation.applyValidationResult(this.currentOptions.dataService, {
					entity: entity,
					field: this.currentOptions.subsidiaryField as string,
					result: this.basicsValidation.createSuccessObject()
				});
			}
			this.refresh();
		}
	}

	private async resetVatGroupAndPaymentTermBySupplier(entity: T, supplierFk?: number, supplierItem?: ISupplierLookupEntity | null, dontSetPaymentTerm?: boolean) {
		if (supplierFk) {
			const selSupplier = supplierItem ? supplierItem : await firstValueFrom(this.supplierLookupService.getItemByKey({id: supplierFk}));
			if (selSupplier) {
				this.updateFields(entity, {[this.currentOptions.originVatGroupField]: entity[this.currentOptions.vatGroupField] as number});
				const response = await firstValueFrom(this.http.get(this.configService.webApiBaseUrl + 'businesspartner/main/suppliercompany/list', {
					params: {
						mainItemId: supplierFk
					}
				}));
				const supplierCompanyEntity = new MainDataDto<ISupplierCompanyEntity>(response).dto as ISupplierCompanyEntity[];

				if(!supplierCompanyEntity) {
					return;
				}

				const companyId = this.configService.clientId;
				const supplierCompany = orderBy(supplierCompanyEntity.filter(e => e.BasCompanyFk === companyId), ['Id'], ['desc']);
				const supplierCompanyFirst = supplierCompany?.[0];

				let termPaFk: number | undefined;
				let termFiFk: number | undefined;

				if (supplierCompanyFirst && supplierCompanyFirst.BasPaymentTermPaFk) {
					termPaFk = supplierCompanyFirst && supplierCompanyFirst.BasPaymentTermPaFk;
				} else if (selSupplier.PaymentTermPaFk) {
					termPaFk = selSupplier.PaymentTermPaFk;
				}
				if (supplierCompanyFirst && supplierCompanyFirst.BasPaymentTermFiFk) {
					termFiFk = supplierCompanyFirst && supplierCompanyFirst.BasPaymentTermFiFk;
				} else if (selSupplier.PaymentTermFiFk) {
					termFiFk = selSupplier.PaymentTermFiFk;
				}
				if (Object.hasOwnProperty.call(entity, this.currentOptions.vatGroupField)) {
					if (supplierCompanyFirst && supplierCompanyFirst.VatGroupFk) {
						this.updateFields(entity, {[this.currentOptions.vatGroupField]: supplierCompanyFirst.VatGroupFk});
					} else if (selSupplier.BpdVatGroupFk) {
						this.updateFields(entity, {[this.currentOptions.vatGroupField]: selSupplier.BpdVatGroupFk});
					}

					if (entity[this.currentOptions.originVatGroupField] !== entity[this.currentOptions.vatGroupField]) {
						if (this.currentOptions.dataService.cellChange) {
							this.currentOptions.dataService.cellChange(entity, this.currentOptions.vatGroupField);
						}
					}
				}
				if (Object.hasOwnProperty.call(entity, this.currentOptions.bankField)) {
					if (supplierCompanyFirst && supplierCompanyFirst.BankFk) {
						this.updateFields(entity, {[this.currentOptions.bankField]: supplierCompanyFirst.BankFk});
						await this.setBankTypeFkAfterBankChange(entity, supplierCompanyFirst.BankFk);
					} else if (selSupplier.BankFk) {
						this.updateFields(entity, {[this.currentOptions.bankField]: selSupplier.BankFk});
						await this.setBankTypeFkAfterBankChange(entity, selSupplier.BankFk);
					}
				}
				if (Object.hasOwnProperty.call(entity, this.currentOptions.businessPostingGroupField)) {
					const supplierCompanyList = supplierCompany?.filter(e => e.BusinessPostingGroupFk !== null);
					if (supplierCompanyList) {
						this.updateFields(entity, {[this.currentOptions.businessPostingGroupField]: supplierCompanyList[0].BusinessPostingGroupFk});
					} else {
						this.updateFields(entity, {[this.currentOptions.businessPostingGroupField]: selSupplier.BusinessPostingGroupFk});
					}
				}
				if (!dontSetPaymentTerm) {
					if (Object.hasOwnProperty.call(entity, this.currentOptions.paymentTermPaField)) {
						if (supplierCompanyFirst && supplierCompanyFirst.BasPaymentTermPaFk) {
							this.updateFields(entity, {[this.currentOptions.paymentTermPaField]: supplierCompanyFirst.BasPaymentTermPaFk});
						} else if (selSupplier.PaymentTermPaFk) {
							this.updateFields(entity, {[this.currentOptions.paymentTermPaField]: selSupplier.PaymentTermPaFk});
						}
					}
					if (Object.hasOwnProperty.call(entity, this.currentOptions.paymentTermFiField)) {
						if (supplierCompanyFirst && supplierCompanyFirst.BasPaymentTermFiFk) {
							this.updateFields(entity, {[this.currentOptions.paymentTermFiField]: supplierCompanyFirst.BasPaymentTermFiFk});
						} else if (selSupplier.PaymentTermFiFk) {
							this.updateFields(entity, {[this.currentOptions.paymentTermFiField]: selSupplier.PaymentTermFiFk});
						}
					}
					if (Object.hasOwnProperty.call(entity, this.currentOptions.paymentMethodField)) {
						if (supplierCompanyFirst && supplierCompanyFirst.BasPaymentMethodFk) {
							this.updateFields(entity, {[this.currentOptions.paymentMethodField]: supplierCompanyFirst.BasPaymentMethodFk});
						} else if (selSupplier.BasPaymentMethodFk) {
							this.updateFields(entity, {[this.currentOptions.paymentMethodField]: selSupplier.BasPaymentMethodFk});
						}
					}
				}

				const asyncFireItemModified = await this.setPaymentTerm(termPaFk, termFiFk);
				if (!asyncFireItemModified) {
					//dataService.fireItemModified(entity);
				}
			}
		}
		return;
	}

	private async setBankTypeFkAfterBankChange(entity: T, bankFk: number) {
		if (Object.hasOwnProperty.call(entity, this.currentOptions.bankTypeField)) {
			if (bankFk) {
				const bank = await firstValueFrom(this.bankLookupService.getItemByKey({id: bankFk}));
				if (bank && bank.BankTypeFk) {
					this.updateFields(entity, {[this.currentOptions.bankTypeField]: bank.BankTypeFk});
					this.refresh();
				}
			}
			this.updateFields(entity, {[this.currentOptions.bankTypeField]: null});
		}
	}

	//It needs to be rewritten in the invoice
	private async setPaymentTerm(termPaFk: number | undefined, termFiFk: number | undefined): Promise<boolean> {
		// set PaymentTerm for invoice module
		// if (Object.hasOwnProperty.call(entity, 'PaymentTermFk')) {
		//     var invTypes = basicsLookupdataLookupDescriptorService.getData('invtype');
		//     var invTypeItem = _.find(invTypes, {Id: entity.InvTypeFk});
		//     if (!_.isNil(invTypeItem)) {
		//         var paymentTermFk = invTypeItem.IsProgress ? termPaFk : termFiFk;
		//         if (!_.isNil(paymentTermFk)) {
		//             entity.PaymentTermFk = paymentTermFk;
		//             if (validationService.asyncValidatePaymentTermFk && _.isFunction(validationService.asyncValidatePaymentTermFk) && Object.hasOwnProperty.call(entity, 'DateReceived')) {
		//                 asyncFireItemModified = true;
		//                 validationService.asyncValidatePaymentTermFk(entity, entity.PaymentTermFk);
		//             }
		//         }
		//     }
		// }
		return false;
	}

	private refresh() {
		//todo refresh grid
		// if (dataService && dataService.gridRefresh) {
		//     $timeout(function () {
		//         dataService.gridRefresh();
		//     });
		// }
	}

	private updateFields = (entity: T, fieldValues: Record<string, string | number | undefined | null>): void => {
		for (const [fieldName, fieldValue] of Object.entries(fieldValues)) {
			set(entity, fieldName as keyof T, fieldValue);
		}
	};

}