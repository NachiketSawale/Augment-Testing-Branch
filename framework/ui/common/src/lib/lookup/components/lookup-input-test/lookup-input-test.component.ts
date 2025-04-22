import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import {IEntityContext, IIdentificationData} from '@libs/platform/common';

import {ILookupOptions, LookupInputModelType} from '../../model/interfaces/lookup-options.interface';
import {ILookupReadonlyDataService} from '../../model/interfaces/lookup-readonly-data-service.interface';
import {UiCommonLookupInputTestService} from './lookup-input-test.service';
import {UiCommonLookupBankService} from './lookup-bank.service';
import {UiCommonLookupPrcStructureService} from './prc-structure.service';
import {UiCommonLookupDataFactoryService} from '../../services/lookup-data-factory.service';
import {UiCommonLookupItemsDataService} from '../../services/lookup-items-data.service';
import {LookupSimpleEntity} from '../../model/lookup-simple-entity';
import {UiCommonLookupBtn} from '../../model/lookup-btn';
import { ILookupContext, ILookupEntity } from '../../model/interfaces/lookup-context.interface';
import {UiCommonCountryLookupService} from '../../data-services/country-lookup.service';
import {UiCommonStateLookupService} from '../../data-services/state-lookup.service';
import {UiCommonSupplierLookupService} from '../../data-services/supplier-lookup.service';
import {UiCommonMasterDataContextLookupService} from '../../data-services/master-data-context-lookup.service';
import {
	ProjectAddressEntity,
	UiCommonProjectAddressLookupService
} from '../../data-services/project-address-lookup.service';
import {
	ProjectAddressDescEntity,
	UiCommonProjectAddressDescLookupService
} from '../../data-services/project-address-desc-lookup.service';
import { UiCommonLookupViewService } from '../../services/lookup-view.service';

@Component({
	selector: 'ui-common-lookup-input-test',
	templateUrl: './lookup-input-test.component.html',
	styleUrls: ['./lookup-input-test.component.scss'],
	providers: [UiCommonLookupInputTestService, UiCommonLookupBankService, UiCommonLookupPrcStructureService]
})
export class UiCommonLookupInputTestComponent implements OnInit {
	@Input()
	public value?: number | null;

	public compositeValue: IIdentificationData | null = {id: 998};

	@Output()
	public valueChange = new EventEmitter<number | null>();

	@Input()
	public dataService: ILookupReadonlyDataService<LookupSimpleEntity, object>;

	@Input()
	public entity?: unknown;

	@Input()
	public options?: ILookupOptions<LookupSimpleEntity, object>;

	@Input()
	public readonly?: boolean;

	@Input()
	public text!: string | null;

	public values: number[] | null = [1, 2, 3];

	public compositeOptions = {
		inputType: LookupInputModelType.IdentificationData,
		dataServiceToken: UiCommonLookupPrcStructureService
	};

	public lookupCompositeOptions:ILookupOptions<LookupSimpleEntity, object> = {
		showDescription: true,
		descriptionMember: 'desc'
	};

	public customInputOptions: ILookupOptions<LookupSimpleEntity, object> = {
		showCustomInputContent: true,
		formatter: {
			format(dataItem: LookupSimpleEntity, context: ILookupContext<LookupSimpleEntity, object>): string {
				if (!dataItem || !context.lookupConfig.displayMember) {
					return '';
				}

				const item = dataItem as object as ILookupEntity;
				return `<i class="block-image status-icons ico-status02"></i><span class='"pane-r'>${item[context.lookupConfig.displayMember]}</span><script>alert('attack')</script>`;
			}
		}
	};

	public customButtonOptions: ILookupOptions<LookupSimpleEntity, object> = {
		buttons: [new UiCommonLookupBtn('add', 'add', () => {
			const service = this.dataService as UiCommonLookupItemsDataService<LookupSimpleEntity, object>;
			const items = service.getItems();

			let id = 1;

			if (items.length > 0) {
				id = items[items.length - 1].id + 1;
			}

			items.push({
				id: id,
				desc: 'item' + id
			});
		}), new UiCommonLookupBtn('clear', 'clear', () => {
			const service = this.dataService as UiCommonLookupItemsDataService<LookupSimpleEntity, object>;
			service.setItems([]);
		})],
	};

	public fastInputOptions: ILookupOptions<LookupSimpleEntity, object> = {
		searchSync: true
	};

	public testService = inject(UiCommonLookupInputTestService);
	public bankService = inject(UiCommonLookupBankService);
	public prcStructureService = inject(UiCommonLookupPrcStructureService);
	public countryLookupS = inject(UiCommonCountryLookupService);
	public stateLookupS = inject(UiCommonStateLookupService);
	public lookupServiceFactory = inject(UiCommonLookupDataFactoryService);
	public supplierService = inject(UiCommonSupplierLookupService);
	public masterDataContextService = inject(UiCommonMasterDataContextLookupService);
	public projectAddressService = inject(UiCommonProjectAddressLookupService);
	public projectAddressDescService = inject(UiCommonProjectAddressDescLookupService);
	public lookupViewService = inject(UiCommonLookupViewService);

	public showLookupDialog() {
		this.lookupViewService.showDialog(this.supplierService)?.then(e => {

		});
	}

	@ViewChild('owner')
	public owner!: ElementRef;

	public showLookupPopup() {
		this.lookupViewService.togglePopup(this.owner, this.testService);
	}

	public projectAddressConfig: ILookupOptions<ProjectAddressEntity, object> = {
		serverSideFilter: {
			key: '',
			execute(entity: IEntityContext<object>): string | object {
				return {
					filterValue: 573
				};
			}
		}
	};

	public projectAddressDescConfig: ILookupOptions<ProjectAddressDescEntity, object> = {
		serverSideFilter: {
			key: '',
			execute(entity: IEntityContext<object>): string | object {
				return {
					filterValue: 573
				};
			}
		}
	};

	public constructor() {
		// this.dataService = testService;

		this.dataService = this.lookupServiceFactory.fromSimpleItems([
			[1, 'a1'],
			[2, 'b2'],
			[3, 'c3'],
			[4, 'd4'],
			[5, 'e5'],
			[6, 'f6']
		], {
			showClearButton: true
		});
	}

	public ngOnInit(): void {

	}
}
