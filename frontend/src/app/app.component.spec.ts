import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AppComponent } from './app.component';
import { BackendService } from './backend.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let backendService: jasmine.SpyObj<BackendService>;

  beforeEach(async () => {
    const backendServiceSpy = jasmine.createSpyObj('BackendService', ['getLiveness']);

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [{ provide: BackendService, useValue: backendServiceSpy }]
    }).compileComponents();

    backendService = TestBed.inject(BackendService) as jasmine.SpyObj<BackendService>;
    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'Frontend (Angular CLI scaffold)'`, () => {
    expect(component.title).toEqual('Frontend (Angular CLI scaffold)');
  });

  it('should check liveness on init', () => {
    backendService.getLiveness.and.returnValue(of({ status: 'ok' }));
    component.ngOnInit();
    expect(backendService.getLiveness).toHaveBeenCalled();
    expect(component.status).toBe('{"status":"ok"}');
  });

  it('should handle error when checking liveness', () => {
    backendService.getLiveness.and.returnValue(throwError(() => new Error('test error')));
    component.ngOnInit();
    expect(backendService.getLiveness).toHaveBeenCalled();
    expect(component.status).toBe('unavailable (test error)');
  });
});
