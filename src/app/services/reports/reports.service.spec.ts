import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReportService } from './reports.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Report } from 'src/app/models/report';

describe('ReportService', () => {
  let service: ReportService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReportService]
    });
    service = TestBed.inject(ReportService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getUserId should return the correct user ID', () => {
    const mockJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDgxMjFjYTMzZTQwNjcyMGYyMjUwYmYiLCJpYXQiOjE2ODYxODQ4NDEsImV4cCI6MTY4NjI3MTI0MX0.8ldSH1QfnXwsz046rVib2PU1QCY_ttI6JZD6XVZj08M';
    spyOn(localStorage, 'getItem').and.returnValue(mockJwtToken);
  
    const userId = service.getUserId();
  
    expect(userId).toEqual('648121ca33e406720f2250bf');
  });

  it('getUserId should return undefined when no token is present', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    const userId = service.getUserId();

    expect(userId).toBeUndefined();
  });

  it('should send GET request to get reports', () => {
    const mockJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDgxMjFjYTMzZTQwNjcyMGYyMjUwYmYiLCJpYXQiOjE2ODYxODQ4NDEsImV4cCI6MTY4NjI3MTI0MX0.8ldSH1QfnXwsz046rVib2PU1QCY_ttI6JZD6XVZj08M';
    spyOn(localStorage, 'getItem').and.returnValue(mockJwtToken);

    const mockReports: Report[] = [
      {
        _id: '1',
        user: 'testUser',
        project: 'testProject',
        weekNumber: 10,
        hours: 8,
        year: 2023
      }
    ];

    service.getReports('1').subscribe(reports => {
      expect(reports).toEqual(mockReports);
    });

    const req = httpTestingController.expectOne(`${service['API_URL']}?userId=1`);

    expect(req.request.method).toEqual('GET');

    req.flush({reports: mockReports});
  });

  it('should send POST request to report hours', () => {
    const mockResponse = { message: 'Success' };

    const mockJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDgxMjFjYTMzZTQwNjcyMGYyMjUwYmYiLCJpYXQiOjE2ODYxODQ4NDEsImV4cCI6MTY4NjI3MTI0MX0.8ldSH1QfnXwsz046rVib2PU1QCY_ttI6JZD6XVZj08M'; 
    spyOn(localStorage, 'getItem').and.returnValue(mockJwtToken);
    
    service.reportHours('1', '10').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${service['API_URL']}/create`);

    expect(req.request.method).toEqual('POST');

    req.flush(mockResponse);
  });

  it('should send PUT request to update report', () => {
    const mockReport: Report = {
      _id: '1',
      user: 'testUser',
      project: 'testProject',
      weekNumber: 10,
      hours: 8,
      year: 2023
    };
    const updatedMockReport: Report = {
      _id: '1',
      user: 'testUser',
      project: 'testProject',
      weekNumber: 10,
      hours: 6,
      year: 2023
    };

    service.updateReport(mockReport).subscribe((updatedReport: Report) => {
      expect(updatedReport).toEqual(updatedMockReport);
    });

    const req = httpTestingController.expectOne(`${service['API_URL']}/update`);

    expect(req.request.method).toEqual('PUT');

    req.flush(updatedMockReport);
  });

  it('getDateOfISOWeek should return the correct start date of ISO week', () => {
    const startDate = service.getDateOfISOWeek(1, 2023);
    expect(startDate.getDate()).toEqual(2); // The first week of 2023 starts on 2nd January
  });
  
  it('getEndOfWeek should return the correct end date of the week', () => {
    const startDate = new Date(2023, 0, 2); // Starting date is 2nd January 2023
    const endDate = service.getEndOfWeek(startDate);
    expect(endDate.getDate()).toEqual(8); // The end date should be 8th January 2023
  });
  
  it('formatDate should return the correct formatted date', () => {
    const date = new Date(2023, 0, 2); // The date is 2nd January 2023
    const formattedDate = service.formatDate(date);
    expect(formattedDate).toEqual('02/01/2023'); // The formatted date should be 02/01/2023
  });
  
  it('getWeekString should return the correct week string', () => {
    const weekString = service.getWeekString(1, 2023);
    expect(weekString).toEqual('02/01/2023 - 08/01/2023'); // The week string for the first week of 2023 should be '02/01/2023 - 08/01/2023'
  });  
});