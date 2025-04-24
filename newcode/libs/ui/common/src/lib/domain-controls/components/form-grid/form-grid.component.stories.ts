/*
 * Copyright(c) RIB Software GmbH
 */

import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { FormGridComponent } from './form-grid.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService, TranslatePipe } from '@libs/platform/common';
import { ControlContextInjectionToken } from '../../model/control-context.interface';
import { IGridControlContext } from '../../model/grid-control-context.interface';

const mockItemsSource = {
  items: [
    { id: 1, displayName: 'User', isSelected: false },
    { id: 2, displayName: 'System', isSelected: true },
    { id: 3, displayName: 'Local', isSelected: false },
  ],
};

// Mock control context
const mockControlContext: IGridControlContext = {
  value: [],
  fieldId: 'example-field-id',
  readonly: false,
  validationResults: [],
  entityContext: { totalCount: 2 },
  configuration: mockItemsSource,
};

export default {
  title: 'FormGridComponent',
  component: FormGridComponent,
  decorators: [
    moduleMetadata({
      imports: [FormsModule,HttpClientModule],
      declarations: [TranslatePipe],
      providers: [
        PlatformTranslateService,
        PlatformConfigurationService,
        {
          provide: ControlContextInjectionToken,
          useValue: mockControlContext,
        },
      ],
    }),
  ],
} as Meta<FormGridComponent>;

// Default Story
const Template: Story<FormGridComponent> = (args) => ({
  props: args,
});

// Default example with predefined mock data
export const Default = Template.bind({});
Default.args = {
  controlContext: {
    fieldId: 'example-field-id',
    readonly: false,
    validationResults: [],
    entityContext: { totalCount: 2 },
    configuration: mockItemsSource,
  }
  
};
Default.parameters = {
  controls: { expanded: true },
};

// Story with updated mock data to verify dropdown behavior
export const WithData = Template.bind({});
WithData.args = {
  controlContext: {
    ...mockControlContext,
    configuration:mockItemsSource 
  },
};
WithData.parameters = {
  controls: { expanded: true },
};

// Story to verify readonly mode
export const ReadOnly = Template.bind({});
ReadOnly.args = {
  controlContext: {
    ...mockControlContext,
    readonly: true,
    configuration: mockItemsSource
  },
};
ReadOnly.parameters = {
  controls: { expanded: true },
};
