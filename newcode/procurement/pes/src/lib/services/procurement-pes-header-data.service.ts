/*
 * Copyright(c) RIB Software GmbH
 */
import { firstValueFrom, Subject } from 'rxjs';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole, ValidationResult } from '@libs/platform/data-access';
import {
	IPrcCommonReadonlyService,
	IExchangeRateChangedEvent,
	ProcurementOverviewSearchlevel,
	ProcurementCommonCascadeDeleteConfirmService,
	ProcurementModelValidateErrorKeyEnum,
	IPaymentTermChangedEvent,
	ProcurementCommonVatPercentageService,
	IModifyExchangeRate,
} from '@libs/procurement/common';

import { IPesHeaderEntity } from '../model/entities';
import { FieldKind, EntityProxy, IContractLookupEntity, ProcurementInternalModule, ProcurementShareContractLookupService } from '@libs/procurement/shared';
import { IExceptionResponse, ISearchResult, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { get } from 'lodash';
import { BasicsSharedCompanyContextService, BasicsSharedNumberGenerationService, BasicsSharedPesStatusLookupService, BasicsSharedProcurementConfigurationLookupService } from '@libs/basics/shared';
import { StandardDialogButtonId, UiCommonGridDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { PesCompleteNew } from '../model/complete-class/pes-complete-new.class';
import { ProcurementPesHeaderReadonlyProcessor } from './processors/procurement-pes-header-readonly-processor.class';
import { IBasicsCustomizePesStatusEntity } from '@libs/basics/interfaces';

export const PROCUREMENT_PES_DATA_TOKEN = new InjectionToken<ProcurementPesHeaderDataService>('procurementPesDataToken');

/**
 * pes data service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPesHeaderDataService extends DataServiceFlatRoot<IPesHeaderEntity, PesCompleteNew> implements IPrcCommonReadonlyService<IPesHeaderEntity>, IModifyExchangeRate<IPesHeaderEntity> {
	public readonly entityProxy = new EntityProxy(this, [['ControllingUnitFk', FieldKind.MdcControllingUnitFk]]);
	public readonly paymentTermChanged$ = new Subject<IPaymentTermChangedEvent>();
	public readonly exchangeRateChanged$ = new Subject<IExchangeRateChangedEvent>();
	public readonly readonlyChanged$ = new Subject<boolean>();
	private readonly http = inject(PlatformHttpService);

	public readonly readonlyProcessor: ProcurementPesHeaderReadonlyProcessor;
	protected readonly companyContext = inject(BasicsSharedCompanyContextService);

	protected readonly numberGenerationService = inject(BasicsSharedNumberGenerationService);
	private readonly configurationLookupService = inject(BasicsSharedProcurementConfigurationLookupService);
	private readonly contractLookupService = inject(ProcurementShareContractLookupService);

	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);

	public readonly gridDialogService = inject(UiCommonGridDialogService);
	private readonly cascadeDeleteHelperService = inject(ProcurementCommonCascadeDeleteConfirmService);

	private readonly statusLookupSvc = inject(BasicsSharedPesStatusLookupService);
	private readonly vatPercentService = inject(ProcurementCommonVatPercentageService);

	/**
	 * The constructor
	 */
	public constructor() {
		const options: IDataServiceOptions<IPesHeaderEntity> = {
			apiUrl: 'procurement/pes/header',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listpes',
				usePost: true,
			},
			createInfo: {
				endPoint: 'createblank',
				usePost: true,
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'updatepes',
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'deletepeses',
			},
			roleInfo: <IDataServiceRoleOptions<IPesHeaderEntity>>{
				role: ServiceRole.Root,
				itemName: 'Header',
			},
		};

		super(options);

		this.readonlyProcessor = this.createReadonlyProcessor();
		this.processor.addProcessor(this.readonlyProcessor);
	}

	protected createReadonlyProcessor() {
		return new ProcurementPesHeaderReadonlyProcessor(this);
	}

	protected override onCreateSucceeded(created: object): IPesHeaderEntity {
		const pesEntity = created as IPesHeaderEntity;
		//pesEntity.Code = this.getNumberDefaultText(pesEntity);
		return pesEntity;
	}

	/**
	 * Provide the load payload here
	 * @protected
	 */
	protected override provideLoadPayload(): object {
		return {};
	}

	/**
	 * Provide the creation payload here
	 * @protected
	 */
	protected override provideCreatePayload(): object {
		//todo: pel,set project id from pin project
		// var projectVal = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
		// response.data.ProjectFk = projectVal ? projectVal.id : null;
		//retturn {projectId: ProjectFk}
		return {};
	}

	/**
	 * Convert http response of searching to standard search result
	 * @param loaded
	 * @protected
	 */
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IPesHeaderEntity> {
		// todo - use the general FilterResult interface?
		const fr = get(loaded, 'FilterResult')! as {
			ExecutionInfo: string;
			RecordsFound: number;
			RecordsRetrieved: number;
			ResultIds: number[];
		};

		const dtos = get(loaded, 'dtos')! as IPesHeaderEntity[];
		return {
			FilterResult: {
				ExecutionInfo: fr.ExecutionInfo,
				RecordsFound: fr.RecordsFound,
				RecordsRetrieved: fr.RecordsRetrieved,
				ResultIds: fr.ResultIds,
			},
			dtos: dtos,
		};
	}

	public override getModificationsFromUpdate(complete: PesCompleteNew): IPesHeaderEntity[] {
		if (complete.Headers) {
			return complete.Headers;
		}
		if (complete.Header) {
			return [complete.Header];
		}
		return [];
	}

	public override createUpdateEntity(modified: IPesHeaderEntity | null): PesCompleteNew {
		const complete = new PesCompleteNew();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Header = modified;
		}

		return complete;
	}

	public override canDelete(): boolean {
		const selectedEntity = this.getSelectedEntity();
		if (!super.canDelete() || !selectedEntity) {
			return false;
		}
		if (selectedEntity.Version === 0) {
			return true;
		}
		return !this.isEntityReadonly(selectedEntity);
	}

	/**
	 * equal to updateDone
	 * @param updated
	 */
	public override takeOverUpdatedChildEntities(updated: PesCompleteNew): void {
		super.takeOverUpdatedChildEntities(updated);
		//todo: lvy, set the cost group according the pes BoqItem
		//if (response.PesBoqToSave && response.PesBoqToSave.length > 0)..

		if (updated.StocktransactionSaveError) {
			this.messageBoxService.showErrorDialog({
				key: 'procurement.common.stocktransactionSaveErrorMessage',
			});
		}
		// Handle model validation errors
		if (updated.ModelValidateError && updated.Header) {
			updated.ModelValidateError.forEach((error) => {
				const validationResult: ValidationResult = {
					apply: true,
					valid: false,
					error: this.getValidationErrorMessage(error),
				};
				this.addInvalid(updated.Header!, { field: error, result: validationResult });
			});
		}

		if (updated.NotEqualWarn) {
			this.messageBoxService.showErrorDialog({
				key: 'procurement.common.notEqualWarnMessage',
			});
		}
	}

	/**
	 * Handle on exchange rate changed
	 * @param entity
	 * @param exchangeRate
	 * @param isUpdateByCurrency
	 * @param isRemainHomeCurrency
	 */
	public onExchangeRateChanged(entity: IPesHeaderEntity, exchangeRate: number, isUpdateByCurrency: boolean, isRemainHomeCurrency: boolean = false): void {
		if (isUpdateByCurrency) {
			this.readonlyProcessor.process(entity);
		}
	}

	private getValidationErrorMessage(fieldName: string): string {
		switch (fieldName) {
			case ProcurementModelValidateErrorKeyEnum.Description:
				return this.translateService.instant('procurement.pes.uniqueErrorDescritionMessage', { fieldName: 'Description' }).text;
			case ProcurementModelValidateErrorKeyEnum.Code:
				return this.translateService.instant('cloud.common.uniqueValueErrorMessage', { fieldName: 'Description' }).text;
			default:
				return '';
		}
	}

	public override async delete(entities: IPesHeaderEntity[] | IPesHeaderEntity) {
		const selectedItem = this.getSelectedEntity();
		if (!selectedItem) {
			throw new Error('Please select a record first');
		}
		if (selectedItem.Version === 0) {
			super.delete(entities);
		} else {
			const result = await this.cascadeDeleteHelperService.openDialog({
				filter: '',
				mainItemId: selectedItem.Id,
				moduleIdentifier: ProcurementInternalModule.Pes,
				searchLevel: ProcurementOverviewSearchlevel.RootContainer,
			});
			if (result && result.closingButtonId === StandardDialogButtonId.Yes) {
				try {
					super.delete(entities);
				} catch (e) {
					await this.messageBoxService.showErrorDialog(e as IExceptionResponse);
				}
			}
		}
	}

	public getStatusOfPes(entity: IPesHeaderEntity): IBasicsCustomizePesStatusEntity | undefined | null {
		return this.statusLookupSvc.cache.getItem({ id: entity.PesStatusFk });
	}

	public async isMaterialConfiguration(entity: IPesHeaderEntity) {
		const prcConfig = await firstValueFrom(
			this.configurationLookupService.getItemByKey({
				id: entity.PrcConfigurationFk,
			}),
		);
		return prcConfig?.IsMaterial ?? false;
	}

	public updateHeaderConHeader(conHeaderId: number) {
		const currentItem = this.getSelectedEntity();
		if (currentItem && currentItem.ConHeaderFk !== conHeaderId) {
			currentItem.ConHeaderFk = conHeaderId;
			//validation.validateConHeader(currentItem, conHeaderId);
			this.setModified(currentItem);
		}
	}

	public async updatePrcStructureByHeaderId(conHeaderId: number) {
		const currentItem = this.getSelectedEntity();
		if (currentItem) {
			const structureFk = await this.http.post<number>('procurement/pes/header/getstructureId', { conHeaderId: conHeaderId });
			//it will return -1 if not found in backend
			if (structureFk !== -1 && currentItem.PrcStructureFk !== structureFk) {
				currentItem.PrcStructureFk = structureFk;
				this.setModified(currentItem);
			}
		}
	}

	public getConfigurationFk(): number | undefined {
		const currentItem = this.getSelectedEntity();
		if (currentItem) {
			return currentItem.PrcConfigurationFk;
		}
		return undefined;
	}

	public getNumberDefaultText(pesEntity: IPesHeaderEntity): string {
		const config = this.configurationLookupService.cache.getItem({ id: pesEntity.PrcConfigurationFk });
		if (config) {
			return this.numberGenerationService.provideNumberDefaultText(config.RubricCategoryFk);
		}
		return '';
	}

	public isEntityReadonly(entity?: IPesHeaderEntity): boolean {
		const selectedEntity = entity ?? this.getSelectedEntity();

		if (selectedEntity) {
			const pesStatus = this.getStatusOfPes(selectedEntity);
			if (!pesStatus) {
				return true;
			}
			return pesStatus.IsReadOnly || pesStatus.Isinvoiced;
		}

		return true;
	}

	public getVatPercentWithTaxCodeMatrix(taxCodeFk: number, vatGroupFk?: number): number {
		const selectedPes = this.getSelectedEntity();
		vatGroupFk = !vatGroupFk && selectedPes ? selectedPes.BpdVatGroupFk ?? undefined : vatGroupFk;
		return this.vatPercentService.getVatPercent(taxCodeFk, vatGroupFk);
	}

	public async getIsFreeItemsAllowed(): Promise<boolean> {
		let isFreeItemsAllowed = true;
		const selectedPes = this.getSelectedEntity();
		if (selectedPes && selectedPes.ConHeaderFk) {
			const conHeader = (await firstValueFrom(this.contractLookupService.getItemByKey({ id: selectedPes.ConHeaderFk }))) as IContractLookupEntity;
			if (conHeader) {
				isFreeItemsAllowed = conHeader.IsFreeItemsAllowed;
			}
		}
		return isFreeItemsAllowed;
	}

	public wizardIsActivate(): boolean {
		const selectedEntity = this.getSelectedEntity();
		if (!selectedEntity) {
			return false;
		}

		const pesStatus = this.statusLookupSvc.cache.getItem({ id: selectedEntity.PesStatusFk });
		if (!pesStatus) {
			return false;
		}
		const isActivate = !pesStatus.IsReadOnly;
		if (!isActivate) {
			this.messageBoxService.showMsgBox(this.translateService.instant('procurement.pes.wizard.isActiveMessage').text, this.translateService.instant('procurement.pes.wizard.isActivateCaption').text, 'ico-question');
		}
		return isActivate;
	}

	public getIsProtected(): boolean {
		const selectedEntity = this.getSelectedEntity();
		if (!selectedEntity) {
			return false;
		}

		const pesStatus = this.statusLookupSvc.cache.getItem({ id: selectedEntity.PesStatusFk });
		if (!pesStatus) {
			return false;
		}
		return pesStatus.Isprotected;
	}

	public calculateTotalGrossAndOc(pesEntity: IPesHeaderEntity) {
		pesEntity.TotalGross = pesEntity.PesValue + pesEntity.PesVat;
		pesEntity.TotalGrossOc = pesEntity.PesValueOc + pesEntity.PesVatOc;
	}

	public setCallOffMainContractCodeAndDes(pesEntity: IPesHeaderEntity) {
		if (!pesEntity.ConHeaderFk) {
			return;
		}
		this.contractLookupService.getItemByKey({ id: pesEntity.ConHeaderFk }).subscribe((data) => {
			const conHeader = data as IContractLookupEntity;
			if (conHeader && conHeader.ConHeaderFk !== null && conHeader.ProjectChangeFk === null) {
				this.contractLookupService.getItemByKey({ id: conHeader.ConHeaderFk }).subscribe((resp) => {
					if (resp) {
						const mainContract = resp as IContractLookupEntity;
						pesEntity.CallOffMainContractFk = mainContract.Id;
						pesEntity.CallOffMainContract = mainContract.Code;
						pesEntity.CallOffMainContractDes = mainContract.Description;
					}
				});
			}
		});
	}
}
