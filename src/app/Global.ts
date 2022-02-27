export class Global {
  /** url */
  private localUrl = 'http://192.168.0.104';
  private routerUrl = 'http://192.168.1.2';
  private publicUrl = 'http://180.158.153.156';
  private port = ":8081/";
  /** student url */

  private addStudentUrl = 'students/add';
  private getSelectedUrl = 'studentsSelect';
  /** event url*/
  private getEventUrl = '/event';

  static generateUrl(user: string, service: string ): string {
    return 'http://192.168.0.104' + ":8081/" + user + '/' + service;
  }
}
