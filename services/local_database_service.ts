import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

class DatabaseService {
  private static db: SQLite.SQLiteDatabase;

  public static async getInstance(): Promise<SQLite.SQLiteDatabase> {
    if (!DatabaseService.db) {
      DatabaseService.db = await DatabaseService.openDatabase();
    }
    return DatabaseService.db;
  }

  private static async openDatabase(): Promise<SQLite.SQLiteDatabase> {
    const localFolder = FileSystem.documentDirectory + "SQLite";
    const dbName = "vocabulary.db";
    const localURI = localFolder + "/" + dbName;

    // Ensure the local folder exists
    if (!(await FileSystem.getInfoAsync(localFolder)).exists) {
      await FileSystem.makeDirectoryAsync(localFolder);
    }

    // Check if the database file already exists
    // const fileInfo = await FileSystem.getInfoAsync(localURI);
    if (true) {
      // If the file does not exist, proceed with the copying logic
      let asset = Asset.fromModule(require("@/assets/vocabulary.db"));

      if (!asset.downloaded) {
        await asset.downloadAsync().then((value) => {
          asset = value;
          // console.log("asset downloadAsync - finished");
        });

        let remoteURI = asset.localUri;

        await FileSystem.copyAsync({
          from: remoteURI,
          to: localURI,
        }).catch((error) => {
          console.log("asset copyDatabase - finished with error: " + error);
        });
      } else {
        // For iOS - Asset is downloaded on call Asset.fromModule(), just copy from cache to local file
        if (
          asset.localUri ||
          asset.uri.startsWith("asset") ||
          asset.uri.startsWith("file")
        ) {
          let remoteURI = asset.localUri || asset.uri;

          await FileSystem.copyAsync({
            from: remoteURI,
            to: localURI,
          }).catch((error) => {
            console.log("local copyDatabase - finished with error: " + error);
          });
        } else if (
          asset.uri.startsWith("http") ||
          asset.uri.startsWith("https")
        ) {
          let remoteURI = asset.uri;

          await FileSystem.downloadAsync(remoteURI, localURI).catch((error) => {
            console.log("local downloadAsync - finished with error: " + error);
          });
        }
      }
    } else {
      console.log("Database file already exists, skipping copy.");
    }

    // Open the database
    return SQLite.openDatabaseAsync(dbName);
  }

  public static async getWordID(word: string): Promise<number> {
    const db = await DatabaseService.getInstance();
    try {
      const result = (await db.getAllAsync(
        "SELECT id FROM words WHERE word = ?",
        [word]
      )) as { id: number }[];
      // console.log("Fetched word ID:", result[0].id);
      return result[0].id;
    } catch (error) {
      console.error("Error fetching word ID:", error);
      throw error;
    }
  }

  public static async getWord(id: number): Promise<string> {
    const db = await DatabaseService.getInstance();
    try {
      const result = (await db.getAllAsync(
        "SELECT word FROM words WHERE id = ?",
        [id]
      )) as { word: string }[];
      return result[0].word;
    } catch (error) {
      console.error("Error fetching word:", error);
      throw error;
    }
  }
}

export default DatabaseService;
