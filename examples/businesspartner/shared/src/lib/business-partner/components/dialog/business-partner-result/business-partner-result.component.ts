/*
 * Copyright(c) RIB Software GmbH
 */
import { AfterViewInit, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { BusinessPartnerScope } from '../../../model/business-partner-scope';
import { IGridConfig, ISizeConfig } from '../../../model/interface/business-partner-search-generic.interface';
import { IMenuItemsList } from '@libs/ui/common';
import { BusinessPartnerSearchSubsidiaryService } from '../../../services/business-partner-search-subsidiary.service';
import { BusinessPartnerSearchContactService } from '../../../services/business-partner-search-contact.service';
import { BusinessPartnerSearchGuarantorService } from '../../../services/business-partner-search-guarantor.service';
import { IBusinessPartnerSearchContactEntity, IBusinessPartnerSearchMainEntity, IBusinessPartnerSearchSubsidiaryEntity, IGuarantorEntity } from '@libs/businesspartner/interfaces';
import { Subscription } from 'rxjs';


/**
 * result of business partner dialogF
 */
@Component({
	selector: 'businesspartner-shared-business-partner-result',
	templateUrl: './business-partner-result.component.html',
	styleUrls: ['./business-partner-result.component.scss']
})
export class BusinessPartnerResultComponent implements OnInit, AfterViewInit, OnDestroy {

	/**
	 * Search scope
	 */
	@Input()
	public scope!: BusinessPartnerScope;

	public menu!: IMenuItemsList;

	public mainConfig!: IGridConfig<IBusinessPartnerSearchMainEntity>;
	public subsidiaryConfig!: IGridConfig<IBusinessPartnerSearchSubsidiaryEntity>;
	public contactConfig!: IGridConfig<IBusinessPartnerSearchContactEntity>;
	public guarantorConfig!: IGridConfig<IGuarantorEntity>;

	/**
	 * Holds the column configuration to the grid
	 */
	private readonly subsidiaryService = inject(BusinessPartnerSearchSubsidiaryService);
	private readonly contactService = inject(BusinessPartnerSearchContactService);
	private readonly guarantorService = inject(BusinessPartnerSearchGuarantorService);

	private readonly resultsTitle: string = 'cloud.common.searchResults';
	private readonly subsidiaryGridTitle: string = 'businesspartner.main.subsidiaryAddress';
	private readonly contactGridTitle: string = 'businesspartner.main.tabContacts';
	private readonly guarantorGridTitle: string = 'businesspartner.main.entityGuarantor';
	private subscription = new Subscription();
	private needSetDefaultContact: boolean = true;

	/**
	 * Initialization of static grid configuration
	 */
	public constructor() {
		this.initializeConfigs();
	}

	/**
	 * Initialization of dynamic grid configuration
	 */
	public async ngOnInit(): Promise<void> {
		await this.loadDynamicConfig();
		if (this.afterInitCallback) {
			this.afterInitCallback();
		}
	}

	public ngAfterViewInit(): void {
		this.afterInitCallback = () => {
			this.setupDataSubscription();
		};
	}

	public ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	public onMainSelectionChanged = async (selectedRows: IBusinessPartnerSearchMainEntity[]): Promise<void> => {
		if (selectedRows.length > 0) {
			await this.refreshRelatedSubgridData(selectedRows[0]);
			//test data
			//this.scope.mainGridService.pushEntity(selectedRows[0]);
		}
	};

	public onSubsidiarySelectionChanged = async (selectedRows: IBusinessPartnerSearchSubsidiaryEntity[]): Promise<void> => {
		if (selectedRows.length > 0) {
			await this.onContactTriggered(selectedRows[0]);
		}
	};

	private afterInitCallback: () => void = () => {
	};

	private initializeConfigs(): void {
		const commonConfig = {
			showContainer: false,
			size: 0,
			onSelectionChanged: async (): Promise<void> => {
			},
			gridConfig: {
				enableColumnReorder: false,
				enableCopyPasteExcel: true,
				globalEditorLock: false
			}
		};
		this.mainConfig = {
			...commonConfig,
			title: this.resultsTitle,
			size: 100,
			showContainer: true,
			onSelectionChanged: this.onMainSelectionChanged,
			gridConfig: {
				uuid: 'a3cac64f52af43beb1b7a32d127531bd',
				globalEditorLock: false
			}
		};
		this.subsidiaryConfig = {
			...commonConfig,
			title: this.subsidiaryGridTitle,
			onSelectionChanged: this.onSubsidiarySelectionChanged,
			gridConfig: {
				uuid: 'f3b7569b3ba344768005d7b4a24f62c1',
				globalEditorLock: false
			}
		};
		this.contactConfig = {
			...commonConfig,
			title: this.contactGridTitle,
			gridConfig: {
				uuid: '015039777d6f4a1ca0bf9eec6e9d244e',
				globalEditorLock: false
			}
		};
		this.guarantorConfig = {
			...commonConfig,
			title: this.guarantorGridTitle,
			gridConfig: {
				uuid: '95717603aed74a1da6bf51b510ddca09',
				globalEditorLock: false
			}
		};
	}

	private async loadDynamicConfig(): Promise<void> {
		if (this.scope.initialOptions$.showCopyBidder) {
			this.scope.setting.showCopyBidder = true;
			this.scope.setting.CheckBidderCopy = true;
		}
		this.needSetDefaultContact = await this.scope.searchService.checkSetDefaultContactInPBLookup();

		const sizeConfig = this.calculateSize();

		this.mainConfig = {
			...this.mainConfig,
			size: sizeConfig.mainSize,
			gridConfig: {
				...this.mainConfig.gridConfig,
				columns: await this.scope.mainGridService.generateGridConfig(this.scope.initialOptions$.showMultiple),

			}
		};

		if (this.scope.initialOptions$.showBranch) {
			this.subsidiaryConfig = {
				...this.subsidiaryConfig,
				showContainer: true,
				size: sizeConfig.branchSize,
				gridConfig: {
					...this.subsidiaryConfig.gridConfig,
					columns: await this.scope.subsidiaryGridService.generateGridConfig()
				}
			};
			if (this.scope.initialOptions$.showContacts) {
				this.contactConfig = {
					...this.contactConfig,
					showContainer: true,
					size: sizeConfig.contractsSize,
					gridConfig: {
						...this.contactConfig.gridConfig,
						columns: await this.scope.contactGridService.generateGridConfig()
					}
				};
			}
		}

		if (this.scope.initialOptions$.showGuarantor) {
			this.guarantorConfig = {
				...this.guarantorConfig,
				showContainer: true,
				size: sizeConfig.guarantorSize,
				gridConfig: {
					...this.guarantorConfig.gridConfig,
					columns: await this.scope.guarantorGridService.generateGridConfig()
				}
			};
		}

	}

	private calculateSize(): ISizeConfig {
		if (this.scope.initialOptions$.showContacts) {
			return {mainSize: 50, branchSize: 25, contractsSize: 25, guarantorSize: 0};
		}

		if (this.scope.initialOptions$.showBranch) {
			return {mainSize: 60, branchSize: 40, contractsSize: 0, guarantorSize: 0};
		}

		if (this.scope.initialOptions$.showGuarantor) {
			return {mainSize: 60, branchSize: 0, contractsSize: 0, guarantorSize: 40};
		}

		return {mainSize: 100, branchSize: 0, contractsSize: 0, guarantorSize: 0};
	}

	private setupDataSubscription(): void {
		this.subscription.add(
			this.scope.searchService.searchData$.subscribe(data => {
				if (data !== null) {
					this.mainConfig.gridConfig = {
						...this.mainConfig.gridConfig,
						items: data.main
					};
				}
			})
		);

	}

	private async refreshRelatedSubgridData(entity?: IBusinessPartnerSearchMainEntity) {
		const bPName = entity ? '(' + entity?.BusinessPartnerName1 + ')' : '';
		const bPId = entity?.Id;
		this.scope.loading = true;
		this.scope.selectedItem = entity;
		if (this.scope.initialOptions$.showBranch) {
			this.subsidiaryConfig.title = this.scope.translateService.instant(this.subsidiaryGridTitle).text + bPName;

			const selectedSubsidiaryFk = this.scope.subsidiaryGridService.selectedEntityList.find(x => x.BusinessPartnerFk === bPId)?.SubsidiaryFk;
			const subsidiaryItems = bPId ? await this.subsidiaryService.search(this.scope.setting, bPId, selectedSubsidiaryFk) : [];
			if (subsidiaryItems && bPId) {
				const subsidiaryFk = subsidiaryItems.find(item => item.IsChecked)?.Id;
				if (subsidiaryFk) {
					this.scope.subsidiaryGridService.pushEntity({BusinessPartnerFk: bPId, SubsidiaryFk: subsidiaryFk});
				}
			}


			this.subsidiaryConfig.gridConfig = {
				...this.subsidiaryConfig.gridConfig,
				items: subsidiaryItems
			};
			if (this.scope.initialOptions$.showContacts) {
				this.contactConfig.title = this.scope.translateService.instant(this.contactGridTitle).text + bPName;
				if (subsidiaryItems) {
					await this.onContactTriggered(subsidiaryItems[0]);
				}
			}
		}

		if (this.scope.initialOptions$.showGuarantor) {
			this.guarantorConfig.title = this.scope.translateService.instant(this.guarantorGridTitle).text + bPName;
			const guarantorItems = bPId ? await this.guarantorService.search(bPId) : [];
			this.guarantorConfig.gridConfig = {
				...this.guarantorConfig.gridConfig,
				items: guarantorItems
			};
		}

		this.scope.loading = false;
	}

	private async onContactTriggered(entity?: IBusinessPartnerSearchSubsidiaryEntity) {
		if (this.scope.selectedItem) {
			const bPId = this.scope.selectedItem.Id;
			const selectedContactFk = this.scope.contactGridService.selectedEntityList.find(x => x.BusinessPartnerFk === bPId && x.SubsidiaryFk === entity?.Id)?.ContactFk;
			const contactItems = await this.contactService.search(bPId, entity?.Id, selectedContactFk, this.needSetDefaultContact);

			if (contactItems) {
				const contactFk = contactItems.find(item => item.bpContactCheck)?.Id;
				if (contactFk) {
					this.scope.contactGridService.pushEntity({BusinessPartnerFk: bPId, SubsidiaryFk: entity?.Id, ContactFk: contactFk});
				}
			}
			this.contactConfig.gridConfig = {
				...this.contactConfig.gridConfig,
				items: contactItems
			};
		} else {
			this.contactConfig.gridConfig = {
				...this.contactConfig.gridConfig,
				items: []
			};
		}
	}

}
