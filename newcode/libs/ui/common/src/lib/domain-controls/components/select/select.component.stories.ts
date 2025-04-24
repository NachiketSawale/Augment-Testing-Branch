import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SelectComponent } from './select.component';
import { ISelectControlContext } from '../../model/select-control-context.interface';
import { ControlContextInjectionToken } from '../../model/control-context.interface';
import { FormsModule } from '@angular/forms';
import { PlatformConfigurationService, PlatformTranslateService, TranslatePipe } from '@libs/platform/common';
import { HttpClientModule } from '@angular/common/http';

// Mock data for itemsSource
const mockItemsSource = {
  items: [
    { id: 1, displayName: 'User', isSelected: false },
    { id: 2, displayName: 'System', isSelected: true },
    { id: 3, displayName: 'Local', isSelected: false },
  ],
};

// Mock control context
const mockControlContext: ISelectControlContext = {
  value: 'Display',
  fieldId: 'example-field-id',
  readonly: false,
  validationResults: [],
  entityContext: { totalCount: 2 },
  itemsSource: mockItemsSource,
};

export default {
  title: 'SelectComponent',
  component: SelectComponent,
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
} as Meta<SelectComponent>;

// Default Story
const Template: Story<SelectComponent> = (args) => ({
  props: args,
});

// Default example with predefined mock data
export const Default = Template.bind({});
Default.args = {
  controlContext: {
    value: mockItemsSource.items[0].id,
    fieldId: 'example-field-id',
    readonly: false,
    validationResults: [],
    entityContext: { totalCount: 2 },
    itemsSource: mockItemsSource,
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
    itemsSource:mockItemsSource 
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
    itemsSource: mockItemsSource
  },
};
ReadOnly.parameters = {
  controls: { expanded: true },
};
