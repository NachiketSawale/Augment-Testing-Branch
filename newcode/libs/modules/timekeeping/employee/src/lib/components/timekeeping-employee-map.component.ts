import { Component, inject, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, } from '@angular/core';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { IAddressEntity, MapComponent } from '@libs/ui/map';
import { PlatformHttpService } from '@libs/platform/common';
import { TimekeepingEmployeeDataService } from '../services';
import { IEmployeeEntity } from '@libs/timekeeping/interfaces';

@Component({
	selector: 'itwo40-timekeeping-employee-map',
	templateUrl: 'timekeeping-employee-map.component.html',
})
export class TimekeepingEmployeeMapComponent
	extends ContainerBaseComponent
	implements OnInit, AfterViewInit {
	@ViewChild('mapComponent', {static: false})
	public mapComponent!: MapComponent;

	public entity!: IAddressEntity[];
	public editMap = true;
	public showRoutes = false;
	public calculateDist = false;

	private viewReady = false;

	private readonly timekeepingEmployeeDataService = inject(TimekeepingEmployeeDataService);
	private readonly http = inject(PlatformHttpService);
	private readonly cdRef = inject(ChangeDetectorRef);

	public constructor() {
		super();
	}

	public ngOnInit(): void {
		this.timekeepingEmployeeDataService.listChanged$.subscribe((employees: IEmployeeEntity[]) => {
			this.selectEditMap(employees);
		});
	}

	public ngAfterViewInit(): void {
		this.viewReady = true;
	}

	public async selectEditMap(employees: IEmployeeEntity[]): Promise<void> {
		const addressIds = employees
			.filter(emp => emp.AddressFk !== null && emp.AddressFk !== undefined)
			.map(emp => emp.AddressFk);

		const response = await this.http.post<IAddressEntity[]>(
			'basics/common/address/getaddressesbyid',
			addressIds
		);
		this.entity = response.map(addr => {
			const newObj: Partial<IAddressEntity> = {};
			Object.keys(addr).forEach(key => {
				const capitalKey = key.charAt(0).toUpperCase() + key.slice(1);
				(newObj as Record<string, unknown>)[capitalKey] = (addr as unknown as Record<string, unknown>)[key];
			});
			return newObj as IAddressEntity;
		});
		this.cdRef.detectChanges(); // Optional: force view update if needed
		if (this.viewReady) {
			this.refreshMap();
		}
	}


	private refreshMap(): void {
		if (this.mapComponent && this.entity) {
			// Assign values directly to the map component
			this.mapComponent.entity = this.entity;
			this.mapComponent.showRoutes = this.showRoutes;
			this.mapComponent.canCalculateDist = this.calculateDist;
			// Call onApiLoaded with no arguments (as per your definition)
			this.mapComponent.onApiLoaded();
		}
	}
}