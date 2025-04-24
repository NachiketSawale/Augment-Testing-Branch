/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TotalConfigTitleComponent } from './total-config-title.component';
import { EstimateMainTotalDataService, EstimateMainTotalDataServiceToken } from '../../../containers/total/estimate-main-total-data.service';
import { Subject } from 'rxjs';

describe('TotalConfigTitleComponent', () => {
	let dataService : EstimateMainTotalDataService;
  let component: TotalConfigTitleComponent;
  let fixture: ComponentFixture<TotalConfigTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalConfigTitleComponent],
	    providers:[{
			provide: EstimateMainTotalDataServiceToken,
		    useValue: {}
	    }]
    }).compileComponents();

	  dataService = TestBed.inject(EstimateMainTotalDataServiceToken);
	  dataService.totalKeyChanged$ = new Subject<string | null>();
    fixture = TestBed.createComponent(TotalConfigTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
