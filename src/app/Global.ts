export class Global {
  /** url */
  private localUrl = 'http://192.168.0.104';
  private static   routerUrl = 'http://192.168.1.2';
  private static publicUrl = 'http://180.158.150.133';
  public port = ":11100/";
  /** student url */

  private addStudentUrl = 'students/add';
  private getSelectedUrl = 'studentsSelect';
  /** event url*/
  private getEventUrl = '/event';
  private static port = ":4201/";

  static generateUrl(user: string, service: string ): string {
    if (user == '') {
      return this.routerUrl + this.port + service;
    } else {
      return this.routerUrl + this.port + user + '/' + service;
    }
  }
}
