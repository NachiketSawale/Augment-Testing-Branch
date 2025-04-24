import { IApplicationModuleInfo } from '@libs/platform/common';
import { ExampleContainerLayoutDemoModuleInfo } from './lib/model/example-container-layout-demo-module-info.class';

export * from './lib/example-container-layout-demo.module';


export function getModuleInfo(): IApplicationModuleInfo {
    return ExampleContainerLayoutDemoModuleInfo.instance;
}