/*
 * Copyright (c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';

import { PlatformLazyInjectorService } from './platform-lazy-injector.service';
import { LazyInjectableInfo, LazyInjectionToken } from '../index';
import { PlatformModuleManagerService } from '../../module-management/services/platform-module-manager.service';

interface IService1 {
  test1(): number;
}

const service1Token = new LazyInjectionToken<IService1>('svc1');

class Service1 implements IService1 {

  public constructor() {
    Service1.instanceCount++;
  }

  public static instanceCount: number = 0;

  public test1(): number {
    return 10;
  }
}

interface IService2A {
  test2(): number;
}

const service2AToken = new LazyInjectionToken<IService2A>('svc2a');

interface IService2B {
  test3(): number;
}

const service2BToken = new LazyInjectionToken<IService2B>('svc2b');

class Service2 implements IService2A, IService2B {

  public constructor() {
    Service2.instanceCount++;
  }

  public static instanceCount: number = 0;

  public test2(): number {
    return 20;
  }

  public test3(): number {
    return 30;
  }
}

describe('PlatformLazyInjectorService', () => {
  let service: PlatformLazyInjectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{
        provide: PlatformModuleManagerService,
        useValue: {
          getLazyInjectables(): LazyInjectableInfo[] {
            return [
              LazyInjectableInfo.create('Service1', service1Token, ctx => new Promise((resolve) => resolve(ctx.doInstantiate ? new Service1() : null))),
              LazyInjectableInfo.create('Service2', service2AToken, ctx => new Promise((resolve) => resolve(ctx.doInstantiate ? new Service2() : null))),
              LazyInjectableInfo.create('Service2', service2BToken, ctx => new Promise((resolve) => resolve(ctx.doInstantiate ? new Service2() : null))),
            ];
          }
        }
      }]
    });
    service = TestBed.inject(PlatformLazyInjectorService);

    Service1.instanceCount = 0;
    Service2.instanceCount = 0;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should instantiate by token', async () => {
    const svc1 = await service.inject(service1Token);
    expect(svc1).toBeTruthy();
    expect(svc1.test1()).toEqual(10);

    const svc2a = await service.inject(service2AToken);
    expect(svc2a).toBeTruthy();
    expect(svc2a.test2()).toEqual(20);

    const svc2b = await service.inject(service2BToken);
    expect(svc2b).toBeTruthy();
    expect(svc2b.test3()).toEqual(30);
  });

  it('should create just one instance', async () => {
    await service.inject(service1Token);
    expect(Service1.instanceCount).toEqual(1);

    await service.inject(service1Token);
    expect(Service1.instanceCount).toEqual(1);
  });

  it('should create just one instance for different tokens', async () => {
    await service.inject(service2AToken);
    expect(Service2.instanceCount).toEqual(1);

    await service.inject(service2BToken);
    expect(Service2.instanceCount).toEqual(1);
  });
});
