import * as dotenv from "dotenv";
import * as mongodb from "mongodb";
import { Employee } from "../src/employee";

dotenv.config({ path: "./.env" });

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
  console.error("No ATLAS_URI environment variable has been defined in server/.env");
  process.exit(1);
}

const atlasUri = ATLAS_URI;

const seedEmployees: Employee[] = [
  { name: "Ada Lovelace", position: "Backend Engineer", level: "senior" },
  { name: "Grace Hopper", position: "Platform Engineer", level: "senior" },
  { name: "Alan Turing", position: "Software Engineer", level: "mid" },
  { name: "Katherine Johnson", position: "Data Engineer", level: "junior" },
  { name: "Margaret Hamilton", position: "Tech Lead", level: "senior" },
];

async function seedDatabase(): Promise<void> {
  const client = new mongodb.MongoClient(atlasUri, {
    appName: "devrel-github-javascript-mean",
  });

  await client.connect();

  try {
    const db = client.db("meanStackExample");
    const collection = db.collection<Employee>("employees");

    await collection.deleteMany({});
    await collection.insertMany(seedEmployees);

    console.log(`Seeded ${seedEmployees.length} employee records into meanStackExample.employees.`);
  } finally {
    await client.close();
  }
}

seedDatabase().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
