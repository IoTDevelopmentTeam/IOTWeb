import { DeviceModel } from './device-model';

describe('DeviceModel', () => {
  it('should create an instance', () => {
    expect(new DeviceModel(1,"abc","test","28/12/1988",1)).toBeTruthy();
  });
});
