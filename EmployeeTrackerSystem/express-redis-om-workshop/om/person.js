import { Entity, Schema } from "redis-om";
import client from "./client.js";

class Person extends Entity {}
class Admin extends Entity {}

const personSchema = new Schema(Person, {
  firstName: { type: "string" },
  lastName: { type: "string" },
  age: { type: "number" },
  verified: { type: "boolean" },
  location: { type: "point" },
  locationUpdated: { type: "date" },
  skills: { type: "string[]" },
  personalStatement: { type: "text" },
});

const adminSchema = new Schema(Admin, {
  firstName: {type: "string"},
  lastName: {type: "string"},
  username: {type: "string"},
  password: {type: "string"}
})

/* use the client to create a Repository just for Persons */
export const personRepository = client.fetchRepository(personSchema)
export const adminRepository = client.fetchRepository(adminSchema)
/* create the index for Person */
await personRepository.createIndex()
await adminRepository.createIndex()

