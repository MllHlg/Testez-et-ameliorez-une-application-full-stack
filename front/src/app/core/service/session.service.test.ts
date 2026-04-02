import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SessionService } from './session.service';
import { SessionInformation } from '../models/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;
  let httpMock: HttpTestingController;
  let userMock: SessionInformation;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SessionService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    userMock = {token: "token", type: "bearer", id: 1, username: "username", firstName: "firstName", lastName: "lastName", admin: false};
    service = TestBed.inject(SessionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login the user', (done) => {
    service.logIn(userMock);
    expect(service.sessionInformation).toEqual(userMock);
    expect(service.isLogged).toBe(true);
    service.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(true);
      done();
    });
  });

  it('should logout the user', (done) => {
    service.logOut();
    expect(service.sessionInformation).toEqual(undefined);
    expect(service.isLogged).toBe(false);
    service.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(false);
      done();
    });
  });

  afterEach(() => {
    httpMock.verify(); 
  });
});