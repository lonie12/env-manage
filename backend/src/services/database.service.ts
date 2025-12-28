import { promises as fs } from "fs";
import path from "path";
import type {
  Migration,
  DatabaseStatusResponse,
  MigrationsListResponse,
  DatabaseActionResponse,
  DatabaseAction,
} from "../types/database.types.js";
import { SAFE_DIRECTORIES } from "../utils/safe-file.js";
import { safeExec } from "../utils/safe-exec.js";

export class DatabaseService {
  /**
   * Get database information for an application
   */
  static async getDatabaseStatus(
    appName: string
  ): Promise<DatabaseStatusResponse> {
    try {
      const appPath = path.join(SAFE_DIRECTORIES.apps, appName);
      const packageJsonPath = path.join(appPath, "package.json");
      const packageJson = await fs
        .readFile(packageJsonPath, "utf-8")
        .catch(() => null);

      if (!packageJson) {
        return {
          success: true,
          database: {
            hasDatabase: false,
            dbType: null,
            connected: false,
            hasDrizzle: false,
          },
        };
      }

      const pkg = JSON.parse(packageJson);
      const hasDrizzle = !!(
        pkg.dependencies?.["drizzle-orm"] ||
        pkg.devDependencies?.["drizzle-kit"]
      );

      if (!hasDrizzle) {
        return {
          success: true,
          database: {
            hasDatabase: false,
            dbType: null,
            connected: false,
            hasDrizzle: false,
          },
        };
      }

      // Check for drizzle config
      const configFiles = [
        "drizzle.config.ts",
        "drizzle.config.js",
        "drizzle.config.mjs",
      ];
      let configPath: string | undefined;

      for (const configFile of configFiles) {
        const fullPath = path.join(appPath, configFile);
        try {
          await fs.access(fullPath);
          configPath = configFile;
          break;
        } catch {
          continue;
        }
      }

      // Read .env to get DATABASE_URL
      const envPath = path.join(appPath, ".env");
      const envContent = await fs.readFile(envPath, "utf-8").catch(() => null);
      let databaseUrl: string | undefined;
      let dbType: "postgresql" | "mysql" | "sqlite" | null = null;

      if (envContent) {
        const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);
        if (dbUrlMatch) {
          databaseUrl = dbUrlMatch[1].trim().replace(/['"]/g, "");

          // Detect DB type from connection string
          if (
            databaseUrl.startsWith("postgres://") ||
            databaseUrl.startsWith("postgresql://")
          ) {
            dbType = "postgresql";
          } else if (databaseUrl.startsWith("mysql://")) {
            dbType = "mysql";
          } else if (
            databaseUrl.includes(".db") ||
            databaseUrl.includes(".sqlite")
          ) {
            dbType = "sqlite";
          }
        }
      }

      // Test connection (simple check)
      const connected = !!databaseUrl && databaseUrl.length > 10;

      return {
        success: true,
        database: {
          hasDatabase: true,
          dbType,
          connected,
          databaseUrl: databaseUrl
            ? this.maskDatabaseUrl(databaseUrl)
            : undefined,
          hasDrizzle: true,
          configPath,
        },
      };
    } catch (error) {
      throw new Error(
        `Failed to get database status: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * List all migrations
   */
  static async listMigrations(
    appName: string
  ): Promise<MigrationsListResponse> {
    try {
      const appPath = path.join(SAFE_DIRECTORIES.apps, appName);
      const migrationsDir = path.join(appPath, "migrations");

      try {
        await fs.access(migrationsDir);
      } catch {
        return {
          success: true,
          migrations: [],
        };
      }

      const files = await fs.readdir(migrationsDir);
      const sqlFiles = files.filter((f) => f.endsWith(".sql"));

      const migrations: Migration[] = await Promise.all(
        sqlFiles.map(async (file) => {
          const filePath = path.join(migrationsDir, file);
          const stats = await fs.stat(filePath);

          return {
            id: file.replace(".sql", ""),
            name: file,
            filePath: `migrations/${file}`,
            createdAt: stats.birthtime.toISOString(),
          };
        })
      );

      // Sort by creation date
      migrations.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      return {
        success: true,
        migrations,
      };
    } catch (error) {
      throw new Error(
        `Failed to list migrations: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Execute database action (push, generate, migrate)
   */
  static async executeDatabaseAction(
    appName: string,
    action: DatabaseAction
  ): Promise<DatabaseActionResponse> {
    try {
      const appPath = path.join(SAFE_DIRECTORIES.apps, appName);
      let command: string;
      let successMessage: string;

      switch (action) {
        case "push":
          command = "npm run db:push";
          successMessage = "Database schema synchronized successfully";
          break;
        case "generate":
          command = "npx drizzle-kit generate";
          successMessage = "Migration generated successfully";
          break;
        case "migrate":
          command = "npx drizzle-kit migrate";
          successMessage = "Migrations applied successfully";
          break;
        default:
          throw new Error(`Unknown database action: ${action}`);
      }

      const result = await safeExec(`cd ${appPath} && ${command}`);

      if (!result.success) {
        throw new Error(result.error || "Command failed");
      }

      return {
        success: true,
        message: successMessage,
        output: result.stdout || result.stderr,
      };
    } catch (error) {
      throw new Error(
        `Failed to execute ${action}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Mask sensitive parts of database URL
   */
  private static maskDatabaseUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      if (urlObj.password) {
        urlObj.password = "***";
      }
      return urlObj.toString();
    } catch {
      // If not a valid URL, just mask the middle part
      if (url.length > 20) {
        return url.substring(0, 10) + "..." + url.substring(url.length - 10);
      }
      return "***";
    }
  }
}
