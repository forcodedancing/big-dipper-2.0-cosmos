import { Categories } from '../types';

class MsgStoreRawDataRequest {
  public category: Categories;
  public type: string;
  public json: any;
  public sender: string;

  constructor(payload: any) {
    this.category = 'data';
    this.json = payload.json;
    this.type = payload.type;
    this.sender = payload.sender;
  }

  static fromJson(json: any) {
    return new MsgStoreRawDataRequest({
      json,
      type: json['@type'],
      sender: json.sender,
    });
  }
}

export default MsgStoreRawDataRequest;