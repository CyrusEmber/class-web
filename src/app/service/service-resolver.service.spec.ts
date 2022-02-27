import { TestBed } from '@angular/core/testing';

import { ServiceResolverService } from './service-resolver.service';

describe('ServiceResolverService', () => {
  let service: ServiceResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
