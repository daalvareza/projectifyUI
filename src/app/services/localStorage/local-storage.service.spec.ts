import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    service = new LocalStorageService();
  });

  it('should call localStorage.setItem with correct arguments', () => {
    spyOn(localStorage, 'setItem');
    service.setItem('testKey', 'testValue');
    expect(localStorage.setItem).toHaveBeenCalledWith('testKey', 'testValue');
  });

  it('should call localStorage.getItem with correct arguments', () => {
    spyOn(localStorage, 'getItem');
    service.getItem('testKey');
    expect(localStorage.getItem).toHaveBeenCalledWith('testKey');
  });

  it('should call localStorage.removeItem with correct arguments', () => {
    spyOn(localStorage, 'removeItem');
    service.removeItem('testKey');
    expect(localStorage.removeItem).toHaveBeenCalledWith('testKey');
  });
});