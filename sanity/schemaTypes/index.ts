import { type SchemaTypeDefinition } from "sanity";
import { user } from "./user";
import { property } from "./property";
import { agent } from "./agent";
import { amenity } from "./amenity";
import { lead } from "./lead";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [user, property, agent, amenity, lead],
};
