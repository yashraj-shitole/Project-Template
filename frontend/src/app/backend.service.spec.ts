import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BackendService } from './backend.service';

describe('BackendService', () => {
  let service: BackendService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BackendService]
    });
    service = TestBed.inject(BackendService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get health status', () => {
    const dummyStatus = { status: 'ok' };

    service.getHealth().subscribe(status => {
      expect(status).toEqual(dummyStatus);
    });

    const req = httpMock.expectOne('/health');
    expect(req.request.method).toBe('GET');
    req.flush(dummyStatus);
  });
});
