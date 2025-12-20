import DataBase from '@providers/Database';


class TestModel {
  private db = DataBase.getInstance().kysely;


  public async TEST_ONE_ROW() {
    const test = await this.db
      .selectFrom('main')
      .selectAll()
      .limit(1).execute()
    return test;
  }
}

export default new TestModel();
