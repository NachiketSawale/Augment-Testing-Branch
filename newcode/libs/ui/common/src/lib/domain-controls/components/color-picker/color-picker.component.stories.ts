import { moduleMetadata, Meta, Story } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { ColorPickerComponent } from './color-picker.component';
import { IColorControlContext } from '../../model/color-control-context.interfacets';
import { ColorFormat, PlatformConfigurationService, RgbColor } from '@libs/platform/common';
import { HttpClientModule } from '@angular/common/http';
import { ControlContextInjectionToken } from '../../model/control-context.interface';

// Mock control context
const mockControlContext: IColorControlContext = {
    readonly: false,
    value: RgbColor.fromRgba(0x408896), 
    format: ColorFormat.RgbColor,
    showClearButton: true,
    infoText: 'Select a color',
    fieldId: 'colorPicker1',
    validationResults: [],
    entityContext: {
        totalCount: 0,
    },
  };

  export default {
    title: 'Color Picker',
    component: ColorPickerComponent,
    decorators: [
      moduleMetadata({
        providers: [
          PlatformConfigurationService,
          { provide: ControlContextInjectionToken, useValue: mockControlContext }
        ],
        imports: [FormsModule,HttpClientModule],
      }),
    ],
  } as Meta<ColorPickerComponent>;
  
const Template: Story<ColorPickerComponent> = (args: ColorPickerComponent) => ({
  component: ColorPickerComponent,
  props: args,
});

export const DefaultColorPicker = Template.bind({});
DefaultColorPicker.args = {
  controlContext: { ...mockControlContext },
};

export const ReadOnlyColorPicker = Template.bind({});
ReadOnlyColorPicker.args = {
  controlContext: { ...mockControlContext, readonly: true },
};

export const WithoutClearButton = Template.bind({});
WithoutClearButton.args = {
  controlContext: { ...mockControlContext, showClearButton: false },
};