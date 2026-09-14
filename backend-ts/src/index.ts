import app from "./app.ts"
import { AppDataSource } from "./data-source.ts";

const port = 8000;

AppDataSource.initialize()
    .then(() => {
        console.log("PostgreSQL Connected successfully via TypeORM!");

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error("Database connection failed during startup!", error);
        process.exit(1);
    });
