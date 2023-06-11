import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { LocalStorageService } from 'src/app/services/localStorage/local-storage.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;
  let ngZone: NgZone;
  let localStorageService: LocalStorageService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: LocalStorageService,
          useValue: {
            removeItem: jasmine.createSpy('removeItem')
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    ngZone = TestBed.inject(NgZone);
    localStorageService = TestBed.inject(LocalStorageService);
  });

  it('should create the HeaderComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should remove jwt from local storage and navigate to login', () => {
    const navigateSpy = spyOn(router, 'navigate').and.stub();
    ngZone.run(() => component.logout());
    expect(localStorageService.removeItem).toHaveBeenCalledWith('jwt');
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});