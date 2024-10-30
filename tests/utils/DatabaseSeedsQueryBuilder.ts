import { datasource } from "@shared/infra/typeorm/dataSource";

export class DatabaseSeedsQueryBuilder {
  public insertQuery = (tableName: string, params: string[]) => {
    const interrogationString = params.map(() => "?").join(", ");
    return `INSERT INTO ${tableName} (${params}) VALUES (${interrogationString})`;
  };

  public deleteQuery = (tableName: string) => {
    return `DELETE FROM ${tableName}`;
  };

  public insertData = async (tableName: string, data: any[]) => {
    for (const item of data) {
      const query = this.insertQuery(tableName, Object.keys(item));
      await datasource.query(query, Object.values(item));
    }
  };
}
